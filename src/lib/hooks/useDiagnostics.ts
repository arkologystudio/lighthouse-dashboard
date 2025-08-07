import { useState, useEffect, useCallback, useRef } from 'react';
import { diagnosticsApi, matchResult } from '../api';
import type { DiagnosticReport, DiagnosticPageScore, IndicatorResult, IndicatorCategory, DiagnosticStatus } from '../../types';
import toast from 'react-hot-toast';

interface UseDiagnosticsOptions {
  fetchPageScores?: boolean;
  pollingInterval?: number; // milliseconds
  // V2 enhancement: filtering options
  filterByCategory?: IndicatorCategory;
  filterByStatus?: DiagnosticStatus;
}

interface UseDiagnosticsReturn {
  report: DiagnosticReport | null;
  pageScores: DiagnosticPageScore[] | null;
  isLoading: boolean;
  isRescoring: boolean;
  error: string | null;
  triggerRescore: (force?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  
  // V2 enhancement: indicator filtering and analysis
  filteredIndicators: IndicatorResult[];
  indicatorsByCategory: Record<IndicatorCategory, IndicatorResult[]>;
  getCategoryStats: () => Record<IndicatorCategory, { total: number; passed: number; warned: number; failed: number; notApplicable: number }>;
}

export const useDiagnostics = (
  siteId: string,
  options: UseDiagnosticsOptions = {}
): UseDiagnosticsReturn => {
  const { fetchPageScores = false, pollingInterval, filterByCategory, filterByStatus } = options;
  
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [pageScores, setPageScores] = useState<DiagnosticPageScore[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRescoring, setIsRescoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // V2 enhancement: indicator analysis state
  const [allIndicators, setAllIndicators] = useState<IndicatorResult[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // V2 enhancement: Extract indicators from report when it changes
  useEffect(() => {
    if (report?.indicators) {
      // Convert legacy indicators to IndicatorResult format for analysis
      const indicators: IndicatorResult[] = report.indicators.map(indicator => {
        const details = indicator.details as Record<string, unknown> | undefined;
        return {
          name: indicator.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          displayName: indicator.name,
          description: indicator.why_it_matters,
          category: (details?.category as IndicatorCategory) || 'standards',
          status: indicator.status,
          score: indicator.score,
          weight: 1,
          maxScore: indicator.max_score,
          message: indicator.fix_recommendation,
          recommendation: indicator.fix_recommendation,
          checkedUrl: details?.checkedUrl,
          found: details?.found ?? true,
          isValid: details?.isValid ?? (indicator.status === 'pass'),
          details: details || {},
          scannedAt: details?.scannedAt ? new Date(details.scannedAt) : new Date(),
        };
      });
      setAllIndicators(indicators);
    }
  }, [report]);
  
  // V2 enhancement: Filtered indicators based on options
  const filteredIndicators = allIndicators.filter(indicator => {
    if (filterByCategory && indicator.category !== filterByCategory) {
      return false;
    }
    if (filterByStatus && indicator.status !== filterByStatus) {
      return false;
    }
    return true;
  });
  
  // V2 enhancement: Group indicators by category
  const indicatorsByCategory = allIndicators.reduce((acc, indicator) => {
    const category = indicator.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(indicator);
    return acc;
  }, {} as Record<IndicatorCategory, IndicatorResult[]>);
  
  // V2 enhancement: Category statistics
  const getCategoryStats = useCallback(() => (
    Object.keys(indicatorsByCategory).reduce((stats, categoryKey) => {
      const category = categoryKey as IndicatorCategory;
      const indicators = indicatorsByCategory[category] || [];
      
      stats[category] = {
        total: indicators.length,
        passed: indicators.filter(i => i.status === 'pass').length,
        warned: indicators.filter(i => i.status === 'warn').length,
        failed: indicators.filter(i => i.status === 'fail').length,
        notApplicable: indicators.filter(i => i.status === 'not_applicable').length,
      };
      
      return stats;
    }, {} as Record<IndicatorCategory, { total: number; passed: number; warned: number; failed: number; notApplicable: number }>)
  ), [indicatorsByCategory]);

  const fetchDiagnostics = useCallback(async () => {
    if (!siteId) return;

    setIsLoading(true);
    setError(null);

    const result = await diagnosticsApi.getSiteScore(siteId);
    
    matchResult(result, {
      success: (data) => {
        setReport(data);
        setError(null);
      },
      error: (err) => {
        setError(err.message);
        toast.error(err.message);
      },
    });

    // Fetch page scores if requested (pro feature)
    if (fetchPageScores) {
      const pagesResult = await diagnosticsApi.getPageScores(siteId);
      
      matchResult(pagesResult, {
        success: (data) => {
          setPageScores(data);
        },
        error: (err) => {
          // Don't set main error for page scores failure
          console.error('Failed to fetch page scores:', err.message);
        },
      });
    }

    setIsLoading(false);
  }, [siteId, fetchPageScores]);

  const triggerRescore = useCallback(async (force?: boolean) => {
    if (!siteId) return;

    setIsRescoring(true);
    
    const result = await diagnosticsApi.triggerRescore(siteId, force);
    
    matchResult(result, {
      success: (data) => {
        toast.success(data.message || 'Diagnostics rescore initiated');
        
        // If we have an estimated completion time, set a timer to refresh
        if (data.estimated_completion_time) {
          setTimeout(() => {
            fetchDiagnostics();
          }, (data.estimated_completion_time + 5) * 1000); // Add 5 seconds buffer
        }
      },
      error: (err) => {
        toast.error(err.message);
      },
    });

    setIsRescoring(false);
  }, [siteId, fetchDiagnostics]);

  const refresh = useCallback(async () => {
    await fetchDiagnostics();
  }, [fetchDiagnostics]);

  // Initial fetch
  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  // Set up polling if enabled
  useEffect(() => {
    if (pollingInterval && pollingInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchDiagnostics();
      }, pollingInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [pollingInterval, fetchDiagnostics]);

  return {
    report,
    pageScores,
    isLoading,
    isRescoring,
    error,
    triggerRescore,
    refresh,
    
    // V2 enhancements
    filteredIndicators,
    indicatorsByCategory,
    getCategoryStats,
  };
};