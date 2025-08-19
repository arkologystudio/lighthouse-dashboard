'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DiagnosticsLoading } from '../../../components/diagnostics/DiagnosticsLoading';
import { DiagnosticsUrlInput } from '../../../components/diagnostics/DiagnosticsUrlInput';
import { DiagnosticsReport } from '../../../components/diagnostics/DiagnosticsReport';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../lib/hooks/useAuth';
import toast from 'react-hot-toast';
import type { LighthouseAIReport } from '../../../types';

// Mock function to simulate server response - in real implementation, this would come from the API
const createMockLighthouseReport = (url: string): LighthouseAIReport => ({
    site: {
      url,
      scan_date: new Date().toISOString().split('T')[0],
      category: 'custom' // This would be detected by the server
    },
    categories: {
      discovery: {
        score: 0.75,
        indicators: [
          {
            name: 'seo_basic',
            score: 0.8,
            status: 'pass',
            message: 'Basic SEO elements are present and properly configured.',
            applicability: {
              status: 'required',
              included_in_category_math: true
            },
            evidence: {
              title_found: true,
              meta_description_found: true,
              headings_structured: true
            }
          },
          {
            name: 'sitemap_xml',
            score: 0.7,
            status: 'warn',
            message: 'XML sitemap found but has some validation issues.',
            applicability: {
              status: 'required',
              included_in_category_math: true
            },
            evidence: {
              sitemap_found: true,
              url_count: 42,
              last_modified: '2024-08-15'
            }
          }
        ]
      },
      understanding: {
        score: 0.6,
        indicators: [
          {
            name: 'json_ld',
            score: 0.5,
            status: 'warn',
            message: 'JSON-LD structured data present but incomplete.',
            applicability: {
              status: 'required',
              included_in_category_math: true
            },
            evidence: {
              schemas_found: ['WebSite', 'Organization'],
              schemas_valid: true,
              coverage_percentage: 50
            }
          },
          {
            name: 'llms_txt',
            score: 0.0,
            status: 'fail',
            message: 'llms.txt file not found.',
            applicability: {
              status: 'optional',
              included_in_category_math: true
            }
          }
        ]
      },
      actions: {
        score: 0.3,
        indicators: [
          {
            name: 'mcp',
            score: 0.0,
            status: 'not_applicable',
            message: 'Model Context Protocol not applicable for this site type.',
            applicability: {
              status: 'not_applicable',
              included_in_category_math: false
            }
          }
        ]
      },
      trust: {
        score: 0.9,
        indicators: [
          {
            name: 'robots_txt',
            score: 1.0,
            status: 'pass',
            message: 'Robots.txt file properly configured for AI agents.',
            applicability: {
              status: 'required',
              included_in_category_math: true
            },
            evidence: {
              robots_found: true,
              allows_crawling: true,
              ai_agent_directives: ['Allow: /']
            }
          }
        ]
      }
    },
    weights: {
      discovery: 0.30,
      understanding: 0.30,
      actions: 0.25,
      trust: 0.15
    },
    overall: {
      raw_0_1: 0.6525,
      score_0_100: 65
    }
  });

const DiagnosticsClient: React.FC = () => {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');
  const { user } = useAuth();
  
  const [targetUrl, setTargetUrl] = useState<string | null>(urlParam);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [reportData, setReportData] = useState<LighthouseAIReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shouldCompleteSteps, setShouldCompleteSteps] = useState(false);

  // Run diagnostics when URL is set
  useEffect(() => {
    if (targetUrl && !reportData) {
      runDiagnostics(targetUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUrl]);

  const runDiagnostics = async (url: string) => {
    try {
      setIsRunningDiagnostics(true);
      setError(null);
      setShouldCompleteSteps(false);
      
      // TODO: Replace with actual API call to the new diagnostics endpoint
      // For now, using mock data to demonstrate the new structure
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Trigger completion of remaining steps
      setShouldCompleteSteps(true);
      
      // Create mock report data
      const mockReport = createMockLighthouseReport(url);
      
      // Set the data after a brief delay to allow steps to complete
      setTimeout(() => {
        setReportData(mockReport);
        setIsRunningDiagnostics(false);
        toast.success('AI Readiness analysis complete!');
      }, 2000);
      
      /* 
      // When real API is ready, replace the above with:
      const scanRequest = { url };
      const result = await diagnosticsApi.scanForAIReadiness(scanRequest);
      
      matchResult(result, {
        success: (aiReport: LighthouseAIReport) => {
          setShouldCompleteSteps(true);
          setTimeout(() => {
            setReportData(aiReport);
            setIsRunningDiagnostics(false);
            toast.success('AI Readiness analysis complete!');
          }, 2000);
        },
        error: (apiError) => {
          // Handle API errors...
          setError(apiError.message);
          setIsRunningDiagnostics(false);
          toast.error('Analysis failed');
        }
      });
      */
      
    } catch (unexpectedError) {
      console.error('Unexpected error in runDiagnostics:', unexpectedError);
      setError('An unexpected error occurred. Please try again.');
      setIsRunningDiagnostics(false);
      toast.error('Unexpected error');
    }
  };

  const handleNewDiagnostic = (url: string) => {
    setTargetUrl(url);
    setReportData(null);
    setError(null);
    setShouldCompleteSteps(false);
  };

  const handleRetryDiagnostic = () => {
    if (targetUrl) {
      setReportData(null);
      setError(null);
      setShouldCompleteSteps(false);
      runDiagnostics(targetUrl);
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