'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiagnosticsLoading } from '../../../components/diagnostics/DiagnosticsLoading';
import { DiagnosticsUrlInput } from '../../../components/diagnostics/DiagnosticsUrlInput';
import { DiagnosticsReport } from '../../../components/diagnostics/DiagnosticsReport';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../lib/hooks/useAuth';
import { diagnosticsApi } from '../../../lib/api';
import { matchResult } from '../../../lib/api';
import toast from 'react-hot-toast';
import type { LighthouseAIReport, AIReadinessScanRequest, SiteCategory } from '../../../types';


const DiagnosticsClient: React.FC = () => {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');
  const siteCategoryParam = searchParams.get('site_category');
  const { user } = useAuth();
  
  const [targetUrl, setTargetUrl] = useState<string | null>(urlParam);
  const [siteCategory] = useState<string | null>(siteCategoryParam);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [reportData, setReportData] = useState<LighthouseAIReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldCompleteSteps, setShouldCompleteSteps] = useState(false);
  
  // Use ref to track if we've already initiated a scan for the current URL
  const scanInitiatedRef = useRef<string | null>(null);

  // Run diagnostics when URL is set
  useEffect(() => {
    // Only run if we have a URL, no report data, and haven't initiated a scan for this URL
    if (targetUrl && !reportData && scanInitiatedRef.current !== targetUrl) {
      scanInitiatedRef.current = targetUrl;
      runDiagnostics(targetUrl, siteCategory);
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed since we rely on scanInitiatedRef for race condition handling
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl, siteCategory]);

  const runDiagnostics = async (url: string, siteCategoryParam?: string | null) => {
    try {
      console.log('Starting diagnostics scan for:', url);
      setIsRunningDiagnostics(true);
      setError(null);
      setShouldCompleteSteps(false);
      
      // Use actual API call to the diagnostics endpoint
      const scanRequest: AIReadinessScanRequest = { url };
      
      // Add site_category to options if provided
      if (siteCategoryParam) {
        scanRequest.options = {
          site_category: siteCategoryParam as unknown as SiteCategory
        };
      }
      
      const result = await diagnosticsApi.scanForAIReadiness(scanRequest);
      

      
      matchResult(result, {
        success: (aiReport: LighthouseAIReport) => {
          // Only process if this is still the current URL
          if (scanInitiatedRef.current !== url) {
            console.log('Ignoring result for outdated scan:', url);
            return;
          }
          
          console.log('Scan successful, received report:', aiReport);
          
          // Validate the report structure
          if (!aiReport.site || !aiReport.categories || !aiReport.overall) {
            console.error('Invalid report structure:', aiReport);
            setError('Received invalid report structure from server');
            setIsRunningDiagnostics(false);
            toast.error('Invalid response format');
            return;
          }
          
          // Trigger completion of remaining steps
          setShouldCompleteSteps(true);
          
          // Set the data after a brief delay to allow steps to complete
          setTimeout(() => {
            // Double-check we're still processing the correct URL
            if (scanInitiatedRef.current === url) {
              setReportData(aiReport);
              setIsRunningDiagnostics(false);
              toast.success('AI Readiness analysis complete!');
            }
          }, 2000);
        },
        error: (apiError) => {
          // Only process errors if this is still the current URL
          if (scanInitiatedRef.current !== url) {
            console.log('Ignoring error for outdated scan:', url);
            return;
          }
          
          // Handle specific API errors
          console.error('API error in runDiagnostics:', apiError);
          setError(apiError.message);
          setIsRunningDiagnostics(false);
          
          // Show appropriate toast message based on error type
          if (apiError.code === 'RATE_LIMIT_EXCEEDED') {
            toast.error('Daily scan limit reached');
          } else if (apiError.code === 'SITE_NOT_ACCESSIBLE') {
            toast.error('Unable to access the website');
          } else if (apiError.code === 'SCAN_TIMEOUT') {
            toast.error('Scan timed out - please try again');
          } else if (apiError.code === 'INVALID_RESPONSE') {
            toast.error('Server returned invalid data format');
          } else {
            toast.error('Analysis failed');
          }
        }
      });
      
    } catch (unexpectedError) {
      // Only process errors if this is still the current URL
      if (scanInitiatedRef.current !== url) {
        console.log('Ignoring unexpected error for outdated scan:', url);
        return;
      }
      
      console.error('Unexpected error in runDiagnostics:', unexpectedError);
      setError('An unexpected error occurred. Please try again.');
      setIsRunningDiagnostics(false);
      toast.error('Unexpected error');
    }
  };

  const handleRetryDiagnostic = () => {
    if (targetUrl) {
      // Reset the scan initiated ref to allow retry
      scanInitiatedRef.current = null;
      setReportData(null);
      setError(null);
      setShouldCompleteSteps(false);
      // Set the URL again to trigger the effect
      setTargetUrl(targetUrl);
    }
  };

  // Show loading state while running diagnostics
  if (isRunningDiagnostics) {
    return (
      <DiagnosticsLoading 
        url={targetUrl || undefined} 
        shouldComplete={shouldCompleteSteps}
        onComplete={() => {
          // Optional: Handle completion if needed
          // Steps completed
        }}
      />
    );
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
                    <li>• AI-Ready enhancements</li>
                    <li>• Advanced recommendations</li>
                    <li>• Unlimited daily scans</li>
                    <li>• Detailed page-level analysis</li>
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

  // Show results if we have report data
  if (reportData && targetUrl) {
    const isPro = user?.subscription_tier === 'pro';
    
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Diagnostic Report - New Structure with Radar Chart */}
        <DiagnosticsReport report={reportData} />

        {/* Action Buttons */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Next Steps
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Review the recommendations above and take action to improve your AI readiness score.
              </p>
            </div>
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
                {isPro ? 'Get Implementation Guide' : 'Upgrade for Detailed Fixes'}
              </Button>
            </div>
          </div>
        </Card>

        {/* New Diagnostic */}
        <Card className="p-8">
          <h3
            className="text-xl font-medium mb-4"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Analyze Another Website
          </h3>
          <DiagnosticsUrlInput />
        </Card>
      </div>
    );
  }

  // Default state - show URL input (will navigate to add ?url= param)
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
        <DiagnosticsUrlInput />
      </Card>
    </div>
  );
};

export default DiagnosticsClient;