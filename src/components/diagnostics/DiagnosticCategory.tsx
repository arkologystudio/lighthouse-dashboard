import React from 'react';
import type { DiagnosticIndicator } from '../../types';
import { DiagnosticIndicatorRow } from './DiagnosticIndicatorRow';
import { Separator } from '../ui/Separator';

interface DiagnosticCategoryProps {
  title: string;
  description: string;
  passingCount: number;
  totalCount: number;
  indicators: DiagnosticIndicator[];
  className?: string;
}

export const DiagnosticCategory: React.FC<DiagnosticCategoryProps> = ({ 
  title,
  description,
  passingCount,
  totalCount,
  indicators,
  className = ''
}) => {
  const getCategoryIcon = (title: string) => {
    switch (title) {
      case 'SEO Optimization':
        return '🔍';
      case 'Standards & Compliance':
        return '📋';
      case 'Structured Data':
        return '📊';
      case 'AI Agent Configuration':
        return '🤖';
      case 'Content & Accessibility':
        return '📝';
      case 'Technical Infrastructure':
        return '⚙️';
      default:
        return '📌';
    }
  };

  const getProgressColor = () => {
    const percentage = (passingCount / totalCount) * 100;
    if (percentage >= 80) return 'var(--color-navigation-green)';
    if (percentage >= 50) return 'var(--color-signal-amber)';
    return 'var(--color-text-error)';
  };

  return (
    <div className={`${className}`}>
      {/* Category Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{getCategoryIcon(title)}</span>
          <h3 
            className="text-xl font-medium"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            {title}
          </h3>
          <span 
            className="text-sm font-medium"
            style={{ color: getProgressColor() }}
          >
            ({passingCount}/{totalCount} passing)
          </span>
        </div>
        <p 
          className="text-sm ml-11"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          {description}
        </p>
      </div>

      {/* Indicators */}
      <div className="space-y-3 ml-11">
        {indicators.map((indicator, index) => (
          <React.Fragment key={indicator.id}>
            <DiagnosticIndicatorRow indicator={indicator} />
            {index < indicators.length - 1 && (
              <Separator className="opacity-30" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};