import React from 'react';
import { Card } from '../ui/Card';

interface DiagnosticsLoadingProps {
  url?: string;
  className?: string;
}

export const DiagnosticsLoading: React.FC<DiagnosticsLoadingProps> = ({ 
  url, 
  className 
}) => {
  const loadingSteps = [
    { id: 1, text: 'Connecting to website...', completed: true },
    { id: 2, text: 'Scanning AI readiness indicators...', completed: true },
    { id: 3, text: 'Analyzing structured data...', inProgress: true },
    { id: 4, text: 'Checking accessibility for AI agents...', pending: true },
    { id: 5, text: 'Evaluating discoverability features...', pending: true },
    { id: 6, text: 'Generating comprehensive report...', pending: true },
  ];

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className || ''}`}>
      <div className="text-center mb-8">
        <h1
          className="text-3xl md:text-4xl font-light mb-4"
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          Analyzing Your Website
        </h1>
        {url && (
          <p
            className="text-lg mb-6"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Running diagnostics for{' '}
            <span style={{ color: 'var(--color-beacon-light)' }}>
              {url}
            </span>
          </p>
        )}
        <div
          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            color: 'var(--color-beacon-light)',
          }}
        >
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Analysis in Progress
        </div>
      </div>

      <Card className="p-8 mb-8">
        <div className="space-y-6">
          <h2
            className="text-xl font-medium mb-6"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Diagnostic Progress
          </h2>
          
          <div className="space-y-4">
            {loadingSteps.map((step) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {step.completed && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-navigation-green)' }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  
                  {step.inProgress && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-beacon-light)' }}
                    >
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {step.pending && (
                    <div
                      className="w-6 h-6 rounded-full border-2"
                      style={{ borderColor: 'var(--color-maritime-border)' }}
                    ></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      step.completed
                        ? 'font-medium'
                        : step.inProgress
                        ? 'font-medium'
                        : 'opacity-60'
                    }`}
                    style={{
                      color: step.completed
                        ? 'var(--color-navigation-green)'
                        : step.inProgress
                        ? 'var(--color-beacon-light)'
                        : 'var(--color-maritime-fog)',
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          This usually takes 30-60 seconds. We&apos;re analyzing your website against 
          the latest AI readiness standards.
        </p>
        
        <div
          className="flex justify-center items-center space-x-8 text-xs font-mono uppercase tracking-wider opacity-60"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: 'var(--color-navigation-green)' }}
            ></div>
            <span>llms.txt Check</span>
          </div>
          <div
            className="w-px h-4"
            style={{ backgroundColor: 'var(--color-maritime-border)' }}
          ></div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: 'var(--color-navigation-green)' }}
            ></div>
            <span>Schema.org Analysis</span>
          </div>
          <div
            className="w-px h-4"
            style={{ backgroundColor: 'var(--color-maritime-border)' }}
          ></div>
          <div className="flex items-center space-x-2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: 'var(--color-navigation-green)' }}
            ></div>
            <span>Agent Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};