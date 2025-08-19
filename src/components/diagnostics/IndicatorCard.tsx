import React, { useState } from 'react';
import type { DiagnosticIndicator } from '../../types';
import { Card } from '../ui/Card';

interface IndicatorCardProps {
  indicator: DiagnosticIndicator;
  className?: string;
}

export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Truncate why_it_matters to 120 chars if needed
  const whyItMatters = indicator.why_it_matters.length > 120 
    ? indicator.why_it_matters.substring(0, 120) 
    : indicator.why_it_matters;
    
  // Extract enhanced details from v2 API data
  const enhancedDetails = indicator.details as {
    checkedUrl?: string;
    found?: boolean;
    isValid?: boolean;
    scannedAt?: Date;
    category?: string;
    validationErrors?: string[];
    validationWarnings?: string[];
    impactLevel?: 'high' | 'medium' | 'low';
    difficultyLevel?: 'easy' | 'medium' | 'hard';
    estimatedTimeToFix?: string;
    [key: string]: unknown;
  } | undefined;
  
  const getStatusConfig = (status: DiagnosticIndicator['status']) => {
    switch (status) {
      case 'pass':
        return {
          label: 'Pass',
          className: 'bg-green-100 text-green-800',
          icon: '✅'
        };
      case 'warn':
        return {
          label: 'Warning',
          className: 'bg-yellow-100 text-yellow-800',
          icon: '⚠️'
        };
      case 'fail':
        return {
          label: 'Fail',
          className: 'bg-red-100 text-red-800',
          icon: '❌'
        };
      case 'not_applicable':
        return {
          label: 'N/A',
          className: 'bg-gray-100 text-gray-800',
          icon: '➖'
        };
    }
  };
  
  const statusConfig = getStatusConfig(indicator.status);
  
  return (
    <Card className={`p-4 relative ${className || ''}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-medium text-gray-900">{indicator.name}</h3>
              
              {/* Status chip with icon */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                <span>{statusConfig.icon}</span>
                {statusConfig.label}
              </span>
              
              {/* Score */}
              <span className="text-sm text-gray-600">
                {indicator.score}/{indicator.max_score}
              </span>
            </div>
            
            {/* Enhanced metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-2">
              {enhancedDetails?.category && (
                <span className="inline-flex items-center gap-1">
                  <span>📂</span>
                  {enhancedDetails.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              )}
              {enhancedDetails?.checkedUrl && (
                <span className="inline-flex items-center gap-1" title={enhancedDetails.checkedUrl}>
                  <span>🔗</span>
                  {enhancedDetails.checkedUrl.length > 30 ? 
                    `${enhancedDetails.checkedUrl.substring(0, 30)}...` : 
                    enhancedDetails.checkedUrl
                  }
                </span>
              )}
              {enhancedDetails?.scannedAt && (
                <span className="inline-flex items-center gap-1">
                  <span>🕐</span>
                  {typeof enhancedDetails.scannedAt === 'string' ? 
                    enhancedDetails.scannedAt : 
                    new Date(enhancedDetails.scannedAt).toLocaleTimeString()
                  }
                </span>
              )}
            </div>
            
            {/* Impact and difficulty indicators */}
            {(enhancedDetails?.impactLevel || enhancedDetails?.difficultyLevel) && (
              <div className="flex gap-2 mb-2">
                {enhancedDetails.impactLevel && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    enhancedDetails.impactLevel === 'high' ? 'bg-red-50 text-red-700' :
                    enhancedDetails.impactLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    Impact: {enhancedDetails.impactLevel}
                  </span>
                )}
                {enhancedDetails.difficultyLevel && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    enhancedDetails.difficultyLevel === 'hard' ? 'bg-red-50 text-red-700' :
                    enhancedDetails.difficultyLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-green-50 text-green-700'
                  }`}>
                    Difficulty: {enhancedDetails.difficultyLevel}
                  </span>
                )}
                {enhancedDetails.estimatedTimeToFix && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                    ⏱️ {enhancedDetails.estimatedTimeToFix}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Info icon with tooltip */}
          <div className="relative group" title={whyItMatters}>
            <svg
              data-testid="info-icon"
              className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-help"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* Validation errors/warnings section */}
        {(enhancedDetails?.validationErrors?.length || enhancedDetails?.validationWarnings?.length) && (
          <div className="space-y-2">
            {enhancedDetails.validationErrors?.length && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500">❌</span>
                  <span className="font-medium text-red-900 text-sm">Validation Errors</span>
                </div>
                <ul className="text-sm text-red-800 space-y-1">
                  {enhancedDetails.validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {enhancedDetails.validationWarnings?.length && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-500">⚠️</span>
                  <span className="font-medium text-yellow-900 text-sm">Validation Warnings</span>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {enhancedDetails.validationWarnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2">
          {/* Fix recommendation button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse fix recommendation' : 'Expand fix recommendation'}
          >
            <span>Recommendation</span>
            <svg
              data-testid="chevron-icon"
              className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        
        </div>
        
        {/* Expandable sections */}
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md p-4 shadow-lg z-10">
            <div className="font-medium text-gray-900 mb-2">Recommendation:</div>
            <div className="text-gray-700">
              {indicator.fix_recommendation}
            </div>
          </div>
        )}
        
      </div>
    </Card>
  );
};