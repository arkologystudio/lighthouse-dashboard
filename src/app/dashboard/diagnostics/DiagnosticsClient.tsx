'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiagnosticsLoading } from '../../../components/diagnostics/DiagnosticsLoading';
import { DiagnosticsUrlInput } from '../../../components/diagnostics/DiagnosticsUrlInput';
import { Gauge } from '../../../components/diagnostics/Gauge';
import { IndicatorCard } from '../../../components/diagnostics/IndicatorCard';
import { AccessIntentBanner } from '../../../components/diagnostics/AccessIntentBanner';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../lib/hooks/useAuth';
import { diagnosticsApi, matchResult } from '../../../lib/api';
import toast from 'react-hot-toast';
import type { DiagnosticReport, DiagnosticScanResponse, DiagnosticScanRequest, DiagnosticIndicator } from '../../../types';

// Convert backend scan response to frontend DiagnosticReport format
const convertScanResponseToReport = (scanResponse: DiagnosticScanResponse): DiagnosticReport => {
  // Create indicators from the backend data
  const indicators: DiagnosticIndicator[] = [];
  
  // Use audit ID from the result
  const auditId = scanResponse.result.auditId;
  
  // Get overall score from siteScore
  const overallScore = scanResponse.result.siteScore.overall;
  
  // Get category scores
  const categoryScores = scanResponse.result.categoryScores;
  
  // Create indicators from category scores
  categoryScores.forEach((category) => {
    const categoryName = category.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    // Add passed indicators
    if (category.passedCount > 0) {
      indicators.push({
        id: `${category.category}-passed`,
        name: `${categoryName} - Passed`,
        status: 'pass',
        score: Math.round((category.passedCount / category.indicatorCount) * 10),
        max_score: 10,
        why_it_matters: `These ${categoryName.toLowerCase()} standards help AI agents understand and access your content properly`,
        fix_recommendation: `Great! These ${categoryName.toLowerCase()} standards are properly implemented.`
      });
    }
    
    // Add warning indicators
    if (category.warningCount > 0) {
      indicators.push({
        id: `${category.category}-warned`,
        name: `${categoryName} - Warnings`,
        status: 'warn',
        score: Math.round((category.warningCount / category.indicatorCount) * 5),
        max_score: 10,
        why_it_matters: `These ${categoryName.toLowerCase()} standards are partially implemented and could be improved`,
        fix_recommendation: `Improve existing ${categoryName.toLowerCase()} implementation for better AI compatibility`
      });
    }
    
    // Add failed indicators
    if (category.failedCount > 0) {
      indicators.push({
        id: `${category.category}-failed`,
        name: `${categoryName} - Failed`,
        status: 'fail',
        score: 0,
        max_score: 10,
        why_it_matters: `Missing ${categoryName.toLowerCase()} standards prevent AI agents from understanding your content`,
        fix_recommendation: `Review and implement missing ${categoryName.toLowerCase()} standards for AI-readiness`
      });
    }
  });
  
  // Fallback indicators if no category scores provided
  if (indicators.length === 0) {
    const summary = scanResponse.result.summary;
    
    if (summary.passedIndicators > 0) {
      indicators.push({
        id: 'passed-indicators',
        name: 'Passed Standards',
        status: 'pass',
        score: 10,
        max_score: 10,
        why_it_matters: 'These standards help AI agents understand and access your content properly',
        fix_recommendation: 'Great! These standards are properly implemented.'
      });
    }
    
    if (summary.failedIndicators > 0) {
      indicators.push({
        id: 'failed-indicators',
        name: 'Failed Standards',
        status: 'fail',
        score: 0,
        max_score: 10,
        why_it_matters: 'Missing standards prevent AI agents from understanding your content',
        fix_recommendation: summary.topRecommendations?.[0] || 'Review and implement missing AI-readiness standards'
      });
    }
    
    if (summary.warnedIndicators > 0) {
      indicators.push({
        id: 'warned-indicators',
        name: 'Partial Standards',
        status: 'warn',
        score: 5,
        max_score: 10,
        why_it_matters: 'These standards are partially implemented and could be improved',
        fix_recommendation: summary.topRecommendations?.[1] || 'Improve existing implementation for better AI compatibility'
      });
    }
  }

  return {
    id: auditId,
    site_id: 'free-scan', // No site ID for free scans
    overall_score: overallScore,
    max_possible_score: 100,
    access_intent: scanResponse.result.accessIntent,
    indicators,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const DiagnosticsClient: React.FC = () => {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');
  const { user } = useAuth();
  
  const [targetUrl, setTargetUrl] = useState<string | null>(urlParam);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Real diagnostics API integration
  useEffect(() => {
    if (targetUrl && !report) {
      runDiagnostics(targetUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl]);

  const runDiagnostics = async (url: string) => {
    try {
      console.log('🔍 Starting diagnostics scan for:', url);
      setIsRunningDiagnostics(true);
      setError(null);
      
      const scanRequest: DiagnosticScanRequest = {
        url,
      };

      console.log('📡 Scan request payload:', scanRequest);
      console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('📍 Endpoint:', '/api/v1/diagnostics/scan-url');
      console.log('🔗 Full URL will be:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/diagnostics/scan-url`);

      const result = await diagnosticsApi.scan(scanRequest);
      console.log('📥 API response RESULT:', result);
      
      matchResult(result, {
        success: (scanResponse) => {
          try {
            const diagnosticReport = convertScanResponseToReport(scanResponse);
            setReport(diagnosticReport);
            setIsRunningDiagnostics(false);
          } catch (conversionError) {
            console.error('Error converting scan response:', conversionError);
            setError('Failed to process scan results. Please try again.');
            setIsRunningDiagnostics(false);
            toast.error('Failed to process results');
          }
        },
        error: (apiError) => {
          let userFriendlyMessage = apiError.message;
          
          // Handle specific error codes and messages
          if (apiError.code === 'RATE_LIMIT_EXCEEDED' || apiError.message.toLowerCase().includes('rate limit')) {
            userFriendlyMessage = 'You have reached the daily limit of 10 free scans. Please try again tomorrow or upgrade to Pro for unlimited scans.';
            toast.error('Rate limit exceeded');
          } else if (apiError.code === 'SITE_NOT_ACCESSIBLE' || apiError.message.includes('404')) {
            userFriendlyMessage = 'Unable to access this website. Please ensure the URL is correct and publicly accessible.';
            toast.error('Website not accessible');
          } else if (apiError.code === 'INVALID_URL') {
            userFriendlyMessage = 'Please enter a valid website URL (e.g., https://example.com)';
            toast.error('Invalid URL format');
          } else if (apiError.code === 'SCAN_TIMEOUT') {
            userFriendlyMessage = 'The scan took too long to complete. This may happen with very large websites. Please try again.';
            toast.error('Scan timeout');
          } else if (apiError.code === 'NETWORK_ERROR') {
            userFriendlyMessage = 'Network connection error. Please check your internet connection and try again.';
            toast.error('Network error');
          } else {
            // Generic error handling
            userFriendlyMessage = apiError.message || 'An unexpected error occurred while running diagnostics.';
            toast.error('Diagnostics failed');
          }
          
          setError(userFriendlyMessage);
          setIsRunningDiagnostics(false);
        },
      });
    } catch (unexpectedError) {
      console.error('Unexpected error in runDiagnostics:', unexpectedError);
      setError('An unexpected error occurred. Please try again.');
      setIsRunningDiagnostics(false);
      toast.error('Unexpected error');
    }
  };

  const handleNewDiagnostic = (url: string) => {
    setTargetUrl(url);
    setReport(null);
    setError(null);
  };

  const handleRetryDiagnostic = () => {
    if (targetUrl) {
      setReport(null);
      setError(null);
      runDiagnostics(targetUrl);
    }
  };

  // Show loading state while running diagnostics
  if (isRunningDiagnostics) {
    return <DiagnosticsLoading url={targetUrl || undefined} />;
  }

  // Show error state if there's an error
  if (error && !isRunningDiagnostics) {
    const isRateLimited = error.includes('daily limit') || error.includes('rate limit');
    
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1
          className="text-3xl md:text-4xl font-light mb-6"
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          {isRateLimited ? 'Daily Limit Reached' : 'Diagnostics Failed'}
        </h1>
        <Card className="p-8">
          <div className="mb-6">
            {isRateLimited ? (
              <div className="text-center">
                <div 
                  className="text-6xl mb-4"
                  style={{ color: 'var(--color-signal-yellow)' }}
                >
                  ⏰
                </div>
                <p
                  className="text-lg mb-4"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  {error}
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">Upgrade to Pro for:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Unlimited daily scans</li>
                    <li>• Detailed page-level analysis</li>
                    <li>• Advanced recommendations</li>
                    <li>• Automated monitoring</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p
                className="text-lg"
                style={{ color: 'var(--color-signal-red)' }}
              >
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            {!isRateLimited && (
              <Button
                onClick={handleRetryDiagnostic}
                className="px-6 py-2"
                style={{
                  backgroundColor: 'var(--color-navigation-blue)',
                  color: 'white',
                }}
              >
                Try Again
              </Button>
            )}
            {isRateLimited && (
              <Button
                className="px-6 py-2"
                style={{
                  backgroundColor: 'var(--color-navigation-blue)',
                  color: 'white',
                }}
              >
                Upgrade to Pro
              </Button>
            )}
            <Button
              onClick={() => {
                setTargetUrl(null);
                setError(null);
              }}
              variant="outline"
              className="px-6 py-2"
              style={{
                borderColor: 'var(--color-maritime-border)',
                color: 'var(--color-lighthouse-beam)',
              }}
            >
              Analyze Different URL
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show results if we have a report
  if (report && targetUrl) {
    const percentage = Math.round((report.overall_score / report.max_possible_score) * 100);
    const isPro = user?.subscription_tier === 'pro';
    
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            AI Readiness Report
          </h1>
          <p
            className="text-lg mb-2"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Analysis for{' '}
            <span style={{ color: 'var(--color-beacon-light)' }}>
              {targetUrl}
            </span>
          </p>
          <p
            className="text-sm"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Last analyzed {new Date().toLocaleString()}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="p-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
              <Gauge score={report.overall_score} maxScore={report.max_possible_score} size={200} />
            </div>
            <div className="text-left">
              <h2
                className="text-2xl font-medium mb-4"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Overall AI Readiness Score
              </h2>
              <p
                className="text-lg mb-4"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Your website scores <strong>{percentage}%</strong> for AI agent readiness. 
                {percentage >= 80 && ' Excellent! Your site is well-optimized for AI discovery.'}
                {percentage >= 60 && percentage < 80 && ' Good foundation with room for improvement.'}
                {percentage < 60 && ' Significant improvements needed for optimal AI compatibility.'}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleRetryDiagnostic}
                  variant="outline"
                  className="px-6 py-2"
                  style={{
                    borderColor: 'var(--color-maritime-border)',
                    color: 'var(--color-lighthouse-beam)',
                  }}
                >
                  Re-scan Website
                </Button>
                <Button
                  className="px-6 py-2"
                  style={{
                    backgroundColor: 'var(--color-navigation-blue)',
                    color: 'white',
                  }}
                >
                  {isPro ? 'Improve AI-Readiness' : 'Upgrade for Fixes'}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Access Intent Banner */}
        <AccessIntentBanner accessIntent={report.access_intent} />

        {/* Indicators Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-medium"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Diagnostic Details
            </h2>
            {!isPro && (
              <div className="text-sm text-gray-500">
                Free scan • {report.indicators.length} of 24+ indicators shown
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.indicators.map((indicator) => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))}
            
            {/* Pro Locked Indicators Preview */}
            {!isPro && (
              <>
                <Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 relative">
                  <div className="text-center opacity-60">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-medium text-gray-700 mb-2">llms.txt Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Detailed analysis of your AI agent configuration file
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                      Pro Only
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 relative">
                  <div className="text-center opacity-60">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-medium text-gray-700 mb-2">Structured Data</h4>
                    <p className="text-sm text-gray-600">
                      JSON-LD and schema.org markup analysis
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                      Pro Only
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 relative">
                  <div className="text-center opacity-60">
                    <div className="text-2xl mb-2">🔒</div>
                    <h4 className="font-medium text-gray-700 mb-2">SEO Analysis</h4>
                    <p className="text-sm text-gray-600">
                      Title tags, meta descriptions, and semantic markup
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium">
                      Pro Only
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* Pro Features Teaser */}
        {!isPro && (
          <Card className="p-8 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3
                className="text-2xl font-medium mb-4"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Unlock Advanced AI Readiness Analysis
              </h3>
              <p
                className="text-base mb-6 max-w-2xl mx-auto"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                This free scan shows you the basics. Get the complete picture with Pro features designed 
                for serious AI optimization.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-left">
                <h4 className="font-medium text-gray-900 mb-3">🔍 Deep Analysis</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Scan up to 20 pages (vs 5 free)</li>
                  <li>• Detailed category breakdowns</li>
                  <li>• Page-level indicator details</li>
                  <li>• Raw HTML & screenshot storage</li>
                </ul>
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 mb-3">⚡ Advanced Features</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Unlimited daily scans</li>
                  <li>• Priority support</li>
                  <li>• On-demand rescoring</li>
                  <li>• Scheduled audits (coming soon)</li>
                </ul>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="text-sm text-gray-600">
                  <s>$29/month</s>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  $19/month
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Launch Special
                </div>
              </div>
              <Button
                size="lg"
                className="px-8 py-3 mt-4"
                style={{
                  backgroundColor: 'var(--color-navigation-blue)',
                  color: 'white',
                }}
              >
                Start Pro Trial - 7 Days Free
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Cancel anytime • No credit card required for trial
              </p>
            </div>
          </Card>
        )}

        {/* New Diagnostic */}
        <Card className="p-8">
          <h3
            className="text-xl font-medium mb-4"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Analyze Another Website
          </h3>
          <DiagnosticsUrlInput onSubmit={handleNewDiagnostic} />
        </Card>
      </div>
    );
  }

  // Default state - show URL input
  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1
        className="text-3xl md:text-4xl font-light mb-6"
        style={{ color: 'var(--color-lighthouse-beam)' }}
      >
        Website AI Readiness Diagnostics
      </h1>
      <p
        className="text-lg mb-8"
        style={{ color: 'var(--color-maritime-fog)' }}
      >
        Analyze any website&apos;s readiness for AI agents and get actionable insights 
        to improve discoverability.
      </p>
      
      <Card className="p-8">
        <DiagnosticsUrlInput onSubmit={handleNewDiagnostic} />
      </Card>
    </div>
  );
};

export default DiagnosticsClient;