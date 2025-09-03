'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface DiagnosticsErrorBoundaryProps {
  children: React.ReactNode;
}

interface DiagnosticsErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class DiagnosticsErrorBoundary extends React.Component<
  DiagnosticsErrorBoundaryProps,
  DiagnosticsErrorBoundaryState
> {
  constructor(props: DiagnosticsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DiagnosticsErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Diagnostics error boundary caught an error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h1
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Something went wrong
          </h1>
          <Card className="p-8">
            <div className="mb-6">
              <div 
                className="text-6xl mb-4"
                style={{ color: 'var(--color-signal-red)' }}
              >
                ⚠️
              </div>
              <p
                className="text-lg mb-4"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                An unexpected error occurred while loading the diagnostics tool.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-red-900 mb-2">Error Details:</h3>
                  <pre className="text-sm text-red-800 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.location.reload()}
                className="px-6 py-2"
                style={{
                  backgroundColor: 'var(--color-navigation-blue)',
                  color: 'white',
                }}
              >
                Reload Page
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
                className="px-6 py-2"
                style={{
                  borderColor: 'var(--color-maritime-border)',
                  color: 'var(--color-lighthouse-beam)',
                }}
              >
                Return to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}