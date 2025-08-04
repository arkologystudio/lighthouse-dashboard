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
  
  const getStatusConfig = (status: DiagnosticIndicator['status']) => {
    switch (status) {
      case 'pass':
        return {
          label: 'Pass',
          className: 'bg-green-100 text-green-800',
        };
      case 'warn':
        return {
          label: 'Warning',
          className: 'bg-yellow-100 text-yellow-800',
        };
      case 'fail':
        return {
          label: 'Fail',
          className: 'bg-red-100 text-red-800',
        };
    }
  };
  
  const statusConfig = getStatusConfig(indicator.status);
  
  return (
    <Card className={`p-4 ${className || ''}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900">{indicator.name}</h3>
              
              {/* Status chip */}
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
              
              {/* Score */}
              <span className="text-sm text-gray-500">
                {indicator.score}/{indicator.max_score}
              </span>
            </div>
          </div>
          
          {/* Info icon with tooltip */}
          <div className="relative group" title={whyItMatters}>
            <svg
              data-testid="info-icon"
              className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help"
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
        
        {/* Expandable fix recommendation */}
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse fix recommendation' : 'Expand fix recommendation'}
          >
            <span>How to fix</span>
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
          
          {isExpanded && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-md p-3">
              {indicator.fix_recommendation}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};