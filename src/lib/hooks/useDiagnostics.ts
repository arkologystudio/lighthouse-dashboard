import { useState, useEffect, useCallback, useRef } from 'react';
import { diagnosticsApi, matchResult } from '../api';
import type { DiagnosticReport, DiagnosticPageScore } from '../../types';
import toast from 'react-hot-toast';

interface UseDiagnosticsOptions {
  fetchPageScores?: boolean;
  pollingInterval?: number; // milliseconds
}

interface UseDiagnosticsReturn {
  report: DiagnosticReport | null;
  pageScores: DiagnosticPageScore[] | null;
  isLoading: boolean;
  isRescoring: boolean;
  error: string | null;
  triggerRescore: (force?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useDiagnostics = (
  siteId: string,
  options: UseDiagnosticsOptions = {}
): UseDiagnosticsReturn => {
  const { fetchPageScores = false, pollingInterval } = options;
  
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [pageScores, setPageScores] = useState<DiagnosticPageScore[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRescoring, setIsRescoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
  };
};