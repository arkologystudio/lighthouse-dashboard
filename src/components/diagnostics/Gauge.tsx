import React from 'react';

interface GaugeProps {
  score: number;
  maxScore: number;
  size?: number;
}

export const Gauge: React.FC<GaugeProps> = ({ score, maxScore, size = 160 }) => {
  const percentage = Math.round((score / maxScore) * 100);
  const radius = (size - 16) / 2; // 16 is for stroke width padding
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  // Determine color based on percentage
  const getColorClass = (percent: number): string => {
    if (percent >= 80) return 'stroke-green-500';
    if (percent >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };
  
  const colorClass = getColorClass(percentage);
  
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`AI Readiness Score: ${percentage}%`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="stroke-gray-200"
          data-testid="gauge-background"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-500 ease-out`}
          data-testid="gauge-progress"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
          <div className="text-sm text-gray-500">AI Ready</div>
        </div>
      </div>
    </div>
  );
};