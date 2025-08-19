import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../ui/Card';

interface DiagnosticsLoadingProps {
  url?: string;
  className?: string;
  onComplete?: () => void; // Called when all steps are completed
  shouldComplete?: boolean; // Trigger to complete remaining steps quickly
}

interface LoadingStep {
  id: number;
  text: string;
  completed: boolean;
  inProgress: boolean;
  pending: boolean;
  duration: number; // seconds this step should take
}

export const DiagnosticsLoading: React.FC<DiagnosticsLoadingProps> = ({ 
  url, 
  className,
  onComplete,
  shouldComplete = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  // Define steps with realistic timing
  const initialSteps = useMemo<LoadingStep[]>(() => [
    { id: 1, text: 'Connecting to website...', completed: false, inProgress: false, pending: true, duration: 2 },
    { id: 2, text: 'Scanning AI readiness indicators...', completed: false, inProgress: false, pending: true, duration: 4 },
    { id: 3, text: 'Analyzing structured data...', completed: false, inProgress: false, pending: true, duration: 6 },
    { id: 4, text: 'Checking accessibility for AI agents...', completed: false, inProgress: false, pending: true, duration: 5 },
    { id: 5, text: 'Evaluating discoverability features...', completed: false, inProgress: false, pending: true, duration: 4 },
    { id: 6, text: 'Generating comprehensive report...', completed: false, inProgress: false, pending: true, duration: 8 },
  ], []);

  const [loadingSteps, setLoadingSteps] = useState(initialSteps);

  // Progress through steps based on realistic timing
  useEffect(() => {
    if (isCompleting) return; // Don't run normal timing when completing
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleting]);

  // Handle completion trigger from parent
  useEffect(() => {
    if (shouldComplete && !isCompleting) {
      setIsCompleting(true);
      
      // Find remaining steps and complete them quickly
      const currentSteps = [...loadingSteps];
      const incompleteSteps = currentSteps.filter(step => !step.completed);
      
      if (incompleteSteps.length === 0) {
        onComplete?.();
        return;
      }

      // Complete remaining steps with 1 second intervals
      incompleteSteps.forEach((step, index) => {
        setTimeout(() => {
          setLoadingSteps(prev => prev.map(s => 
            s.id === step.id 
              ? { ...s, completed: true, inProgress: false, pending: false }
              : s
          ));
          
          // Call onComplete when all steps are done
          if (index === incompleteSteps.length - 1) {
            setTimeout(() => onComplete?.(), 500);
          }
        }, (index + 1) * 1000);
      });
    }
  }, [shouldComplete, isCompleting, loadingSteps, onComplete]);

  // Normal step progression when not completing
  useEffect(() => {
    if (isCompleting) return;
    
    let cumulativeTime = 0;
    const newSteps = [...initialSteps];
    let newCurrentStepIndex = 0;

    for (let i = 0; i < newSteps.length; i++) {
      cumulativeTime += newSteps[i].duration;

      if (elapsedTime < cumulativeTime - newSteps[i].duration) {
        // This step hasn't started yet
        newSteps[i] = { ...newSteps[i], completed: false, inProgress: false, pending: true };
      } else if (elapsedTime >= cumulativeTime) {
        // This step is completed
        newSteps[i] = { ...newSteps[i], completed: true, inProgress: false, pending: false };
      } else {
        // This step is in progress
        newSteps[i] = { ...newSteps[i], completed: false, inProgress: true, pending: false };
        newCurrentStepIndex = i;
      }
    }

    setLoadingSteps(newSteps);
    setCurrentStepIndex(newCurrentStepIndex);
  }, [elapsedTime, isCompleting, initialSteps]);

  // Calculate estimated time remaining
  const totalExpectedTime = initialSteps.reduce((sum, step) => sum + step.duration, 0);
  const timeRemaining = Math.max(0, totalExpectedTime - elapsedTime);
  
  // Add some randomness to make it feel more realistic (±10 seconds)
  const estimatedTimeRange = isCompleting 
    ? 'Finalizing...'
    : timeRemaining <= 10 
    ? 'Almost done...' 
    : `${Math.max(5, timeRemaining - 10)}-${timeRemaining + 10} seconds remaining`;

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
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-xl font-medium"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Diagnostic Progress
            </h2>
            <span
              className="text-sm font-mono"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              {estimatedTimeRange}
            </span>
          </div>
          
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
                
                {/* Add progress bar for current step */}
                {step.inProgress && !isCompleting && (
                  <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out rounded-full"
                      style={{ 
                        backgroundColor: 'var(--color-beacon-light)',
                        width: `${Math.min(100, (elapsedTime % step.duration / step.duration) * 100)}%`
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-maritime-border)' }}>
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm font-medium"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Overall Progress
              </span>
              <span 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {Math.round((isCompleting ? 95 : (elapsedTime / totalExpectedTime) * 100))}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{ 
                  backgroundColor: 'var(--color-navigation-green)',
                  width: `${Math.min(100, isCompleting ? 95 : (elapsedTime / totalExpectedTime) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <p
          className="text-sm mb-4"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          This usually takes 15-45 seconds. We&apos;re analyzing your website against 
          the latest AI readiness standards.
        </p>
        
        <div
          className="flex justify-center items-center space-x-8 text-xs font-mono uppercase tracking-wider opacity-60"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: currentStepIndex >= 2 ? 'var(--color-navigation-green)' : 'var(--color-maritime-border)' }}
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
              style={{ backgroundColor: currentStepIndex >= 2 ? 'var(--color-navigation-green)' : 'var(--color-maritime-border)' }}
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
              style={{ backgroundColor: currentStepIndex >= 3 ? 'var(--color-navigation-green)' : 'var(--color-maritime-border)' }}
            ></div>
            <span>Agent Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};