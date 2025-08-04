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
import type { DiagnosticReport } from '../../../types';

const DiagnosticsClient: React.FC = () => {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');
  const { user } = useAuth();
  
  const [targetUrl, setTargetUrl] = useState<string | null>(urlParam);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [mockReport, setMockReport] = useState<DiagnosticReport | null>(null);

  // Mock diagnostics for demonstration (since backend is not integrated yet)
  useEffect(() => {
    if (targetUrl && !mockReport) {
      setIsRunningDiagnostics(true);
      
      // Simulate diagnostics process
      const timer = setTimeout(() => {
        const report: DiagnosticReport = {
          id: `report-${Date.now()}`,
          site_id: 'mock-site',
          overall_score: 72,
          max_possible_score: 100,
          access_intent: 'partial',
          indicators: [
            {
              id: 'llms-txt',
              name: 'llms.txt',
              status: 'pass',
              score: 10,
              max_score: 10,
              why_it_matters: 'Enables AI agents to understand your content boundaries and access permissions',
              fix_recommendation: 'File found and properly configured. Consider adding more detailed agent instructions.',
            },
            {
              id: 'agent-json',
              name: 'agent.json',
              status: 'fail',
              score: 0,
              max_score: 10,
              why_it_matters: 'Provides structured information about available AI services and endpoints',
              fix_recommendation: 'Create an agent.json file in your root directory with service definitions.',
            },
            {
              id: 'structured-data',
              name: 'Structured Data',
              status: 'warn',
              score: 6,
              max_score: 10,
              why_it_matters: 'Helps AI agents understand page content and relationships between data',
              fix_recommendation: 'Add more comprehensive JSON-LD markup for better content understanding.',
            },
            {
              id: 'robots-txt',
              name: 'robots.txt',
              status: 'pass',
              score: 10,
              max_score: 10,
              why_it_matters: 'Controls which parts of your site can be accessed by automated agents',
              fix_recommendation: 'Configuration looks good. Consider adding specific AI agent directives.',
            },
            {
              id: 'meta-description',
              name: 'Meta Descriptions',
              status: 'warn',
              score: 7,
              max_score: 10,
              why_it_matters: 'Provides context for AI agents to understand page purpose and content',
              fix_recommendation: 'Enhance meta descriptions with more semantic keywords and clear purpose statements.',
            },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setMockReport(report);
        setIsRunningDiagnostics(false);
      }, 5000); // 5 second simulation

      return () => clearTimeout(timer);
    }
  }, [targetUrl, mockReport]);

  const handleNewDiagnostic = (url: string) => {
    setTargetUrl(url);
    setMockReport(null);
    setIsRunningDiagnostics(true);
  };

  const handleRetryDiagnostic = () => {
    setMockReport(null);
    setIsRunningDiagnostics(true);
  };

  // Show loading state while running diagnostics
  if (isRunningDiagnostics) {
    return <DiagnosticsLoading url={targetUrl || undefined} />;
  }

  // Show results if we have a report
  if (mockReport && targetUrl) {
    const percentage = Math.round((mockReport.overall_score / mockReport.max_possible_score) * 100);
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
              <Gauge score={mockReport.overall_score} maxScore={mockReport.max_possible_score} size={200} />
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
        <AccessIntentBanner accessIntent={mockReport.access_intent} />

        {/* Indicators Grid */}
        <div>
          <h2
            className="text-2xl font-medium mb-6"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Diagnostic Details
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockReport.indicators.map((indicator) => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </div>

        {/* Pro Features Teaser */}
        {!isPro && (
          <Card className="p-8 text-center border-2 border-blue-500">
            <h3
              className="text-xl font-medium mb-4"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Unlock Advanced Diagnostics
            </h3>
            <p
              className="text-base mb-6"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Get page-level analysis, automated fixes, and continuous monitoring 
              with a Pro subscription.
            </p>
            <Button
              size="lg"
              className="px-8 py-3"
              style={{
                backgroundColor: 'var(--color-navigation-blue)',
                color: 'white',
              }}
            >
              Upgrade to Pro
            </Button>
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