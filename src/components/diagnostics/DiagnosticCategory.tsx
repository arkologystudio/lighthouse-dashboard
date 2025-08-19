import React from 'react';
import type { SpecIndicator, SiteProfile } from '../../types';
import { DiagnosticIndicatorRow } from './DiagnosticIndicatorRow';
import { Separator } from '../ui/Separator';

interface DiagnosticCategoryProps {
  categoryKey: string;
  title: string;
  description: string;
  score: number; // 0-1 range from server
  weight: number; // 0-1 range from server
  passingCount: number;
  totalCount: number;
  indicators: SpecIndicator[];
  siteProfile: SiteProfile;
  className?: string;
}

export const DiagnosticCategory: React.FC<DiagnosticCategoryProps> = ({ 
  categoryKey,
  title,
  description,
  score,
  weight,
  passingCount,
  totalCount,
  indicators,
  siteProfile,
  className = ''
}) => {
  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case 'discovery':
        return '🔍';
      case 'understanding':
        return '🧠';
      case 'actions':
        return '⚡';
      case 'trust':
        return '🛡️';
      default:
        return '📊';
    }
  };

  const getCategoryColor = (categoryKey: string) => {
    switch (categoryKey) {
      case 'discovery':
        return 'var(--color-lighthouse-beam)';
      case 'understanding':
        return 'var(--color-lighthouse-beam)';
      case 'actions':
        return 'var(--color-lighthouse-beam)';
      case 'trust':
        return 'var(--color-lighthouse-beam)';
      default:
        return 'var(--color-maritime-fog)';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'var(--color-lighthouse-beam)';
    if (score >= 0.5) return 'var(--color-lighthouse-beam)';
    return 'var(--color-maritime-fog)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Strong';
    if (score >= 0.5) return 'Moderate';
    if (score >= 0.3) return 'Weak';
    return 'Poor';
  };

  const scorePercentage = Math.round(score * 100);
  const weightPercentage = Math.round(weight * 100);
  const contributionPoints = Math.round(score * weight * 100);

  return (
    <div className={`${className}`}>
      {/* Category Header */}
      <div className="mb-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-2xl">{getCategoryIcon(categoryKey)}</span>
          <div className="flex-1">
            <h3 
              className="text-xl font-medium"
              style={{ color: getCategoryColor(categoryKey) }}
            >
              {title}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div 
                className="font-bold text-lg"
                style={{ color: getScoreColor(score) }}
              >
                {scorePercentage}%
              </div>
              <div 
                className="text-xs"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {getScoreLabel(score)}
              </div>
            </div>
            <div className="text-center">
              <div 
                className="font-medium"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {weightPercentage}% weight
              </div>
              <div 
                className="text-xs"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {contributionPoints} pts
              </div>
            </div>
            <div className="text-center">
              <div 
                className="font-medium"
                style={{ color: getScoreColor(score) }}
              >
                {passingCount}/{totalCount}
              </div>
              <div 
                className="text-xs"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                passing
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="ml-11 mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="text-2xl font-bold"
              style={{ color: getCategoryColor(categoryKey) }}
            >
              {Math.round(score * 10)}/10
            </div>
            <div 
              className="text-sm"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Category Score
            </div>
          </div>
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
          <React.Fragment key={indicator.name}>
            <DiagnosticIndicatorRow 
              indicator={indicator} 
              siteProfile={siteProfile}
            />
            {index < indicators.length - 1 && (
              <Separator className="opacity-30" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};