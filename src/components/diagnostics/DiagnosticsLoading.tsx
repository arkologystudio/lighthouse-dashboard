import React, { useState, useEffect, useMemo, useRef } from 'react';
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
}

export const DiagnosticsLoading: React.FC<DiagnosticsLoadingProps> = ({ 
  url, 
  className,
  onComplete,
  shouldComplete = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const speedMultiplierRef = useRef(5); // Start at 5x speed
  const lastProgressUpdateRef = useRef(0);

  // Define the new progress events
  const steps = useMemo<LoadingStep[]>(() => [
    { id: 1, text: 'Connecting to website', completed: false, inProgress: false, pending: true },
    { id: 2, text: 'Scanning AI Readiness indicators', completed: false, inProgress: false, pending: true },
    { id: 3, text: 'Assessing discoverability, understanding & trust', completed: false, inProgress: false, pending: true },
    { id: 4, text: 'Calculating final scores', completed: false, inProgress: false, pending: true },
    { id: 5, text: 'Generating report', completed: false, inProgress: false, pending: true },
  ], []);

  const [loadingSteps, setLoadingSteps] = useState(steps);

  // Progress simulation with decreasing speed
  useEffect(() => {
    if (isCompleting || timedOut) return;
    
    // Set up 60 second timeout
    timeoutRef.current = setTimeout(() => {
      setTimedOut(true);
      onComplete?.();
    }, 60000);
    
    // Progress simulation
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        // Don't exceed 90% until server responds
        if (prev >= 90) return prev;
        
        lastProgressUpdateRef.current = Date.now();
        
        // Calculate increment based on current speed multiplier
        // Higher multiplier = faster progress early on
        const baseIncrement = 0.5; // Base increment per update
        const increment = baseIncrement * speedMultiplierRef.current;
        
        const newProgress = Math.min(90, prev + increment);
        
        // Decrease speed multiplier over time (5x -> 4x -> 3x -> 2x -> 1x)
        if (newProgress > 20 && speedMultiplierRef.current > 4) {
          speedMultiplierRef.current = 4;
        } else if (newProgress > 40 && speedMultiplierRef.current > 3) {
          speedMultiplierRef.current = 3;
        } else if (newProgress > 60 && speedMultiplierRef.current > 2) {
          speedMultiplierRef.current = 2;
        } else if (newProgress > 80 && speedMultiplierRef.current > 1) {
          speedMultiplierRef.current = 1;
        }
        
        return newProgress;
      });
    }, 200); // Update every 200ms for smooth animation
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isCompleting, timedOut, onComplete]);

  // Update steps based on progress
  useEffect(() => {
    if (isCompleting || timedOut) return;
    
    const stepThresholds = [15, 35, 55, 75, 90]; // Progress thresholds for each step
    
    setLoadingSteps(prev => prev.map((step, index) => {
      const threshold = stepThresholds[index];
      
      if (progress >= threshold) {
        setCurrentStepIndex(Math.min(index + 1, steps.length - 1));
        return { ...step, completed: true, inProgress: false, pending: false };
      } else if (progress >= threshold - 15) {
        setCurrentStepIndex(index);
        return { ...step, completed: false, inProgress: true, pending: false };
      } else {
        return { ...step, completed: false, inProgress: false, pending: true };
      }
    }));
  }, [progress, steps.length, isCompleting, timedOut]);

  // Handle completion trigger from parent (server responded)
  useEffect(() => {
    if (shouldComplete && !isCompleting && !timedOut) {
      setIsCompleting(true);
      
      // Clear existing timers
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      // Quickly complete all remaining steps and reach 100%
      const completionSteps = steps.length - currentStepIndex;
      const completionInterval = 300; // 300ms between each step completion
      
      // Complete remaining steps
      for (let i = 0; i < completionSteps; i++) {
        setTimeout(() => {
          const stepIndex = currentStepIndex + i;
          setLoadingSteps(prev => prev.map((step, index) => 
            index <= stepIndex 
              ? { ...step, completed: true, inProgress: false, pending: false }
              : step
          ));
          
          // Update progress to 100% on final step
          if (i === completionSteps - 1) {
            setProgress(100);
            setTimeout(() => onComplete?.(), 500);
          }
        }, i * completionInterval);
      }
    }
  }, [shouldComplete, isCompleting, timedOut, currentStepIndex, steps.length, onComplete]);

  // Activity label based on current state
  const getActivityLabel = () => {
    if (timedOut) return 'Something went wrong';
    if (isCompleting) return 'Wrapping up';
    if (progress < 30) return 'Processing';
    if (progress < 85) return 'Finalising';
    return 'processing';
  };

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
          {getActivityLabel()}
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
                Progress
              </span>
              <span 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-300 ease-out rounded-full"
                style={{ 
                  backgroundColor: 'var(--color-navigation-green)',
                  width: `${Math.min(100, progress)}%`
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
          We&apos;re analyzing your website against the latest AI readiness standards.
        </p>
      </div>
    </div>
  );
};