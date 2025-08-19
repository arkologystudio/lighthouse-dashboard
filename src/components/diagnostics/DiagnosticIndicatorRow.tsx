import React from 'react';
import type { SpecIndicator, SiteProfile } from '../../types';
import { Badge } from '../ui/Badge';

interface DiagnosticIndicatorRowProps {
  indicator: SpecIndicator;
  siteProfile: SiteProfile;
  className?: string;
}

export const DiagnosticIndicatorRow: React.FC<DiagnosticIndicatorRowProps> = ({ 
  indicator,
  siteProfile,
  className = ''
}) => {
  
  const getStatusConfig = (status: SpecIndicator['status'], applicability: SpecIndicator['applicability']) => {
    // Handle not_applicable with special styling
    if (status === 'not_applicable' || applicability.status === 'not_applicable') {
      return {
        label: 'Not Applicable',
        icon: '➖',
        variant: 'secondary' as const,
        bgColor: 'bg-gray-50/30',
        borderColor: 'border-gray-100',
        textOpacity: 'opacity-60'
      };
    }
    
    switch (status) {
      case 'pass':
        return {
          label: 'Pass',
          icon: '✅',
          variant: 'success' as const,
          bgColor: 'bg-blue-50/30',
          borderColor: 'border-blue-100/50',
          textOpacity: 'opacity-100'
        };
      case 'warn':
        return {
          label: 'Warning',
          icon: '⚠️',
          variant: 'warning' as const,
          bgColor: 'bg-slate-50/50',
          borderColor: 'border-slate-200/50',
          textOpacity: 'opacity-100'
        };
      case 'fail':
        return {
          label: 'Fail',
          icon: '❌',
          variant: 'error' as const,
          bgColor: 'bg-slate-50/50',
          borderColor: 'border-slate-200/50',
          textOpacity: 'opacity-100'
        };
    }
  };
  
  const statusConfig = getStatusConfig(indicator.status, indicator.applicability);
  const isNotApplicable = indicator.status === 'not_applicable' || indicator.applicability.status === 'not_applicable';
  const isIncludedInMath = indicator.applicability.included_in_category_math;
  
  const getApplicabilityBadge = () => {
    switch (indicator.applicability.status) {
      case 'required':
        return { text: 'Required', variant: 'error' as const };
      case 'optional':
        return { text: 'Optional', variant: 'warning' as const };
      case 'not_applicable':
        return { text: 'Not Applicable', variant: 'secondary' as const };
      default:
        return null;
    }
  };

  const applicabilityBadge = getApplicabilityBadge();

  return (
    <div 
      className={`
        rounded-lg border transition-all hover:shadow-sm
        ${statusConfig.bgColor} ${statusConfig.borderColor}
        ${isNotApplicable ? 'cursor-default' : ''}
        ${className}
      `}
    >
      <div className={`p-4 ${statusConfig.textOpacity}`}>
        {/* Main Row */}
        <div className="flex items-start gap-4">
          {/* Status and Score */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <span className="text-xl">{statusConfig.icon}</span>
            <div className="text-sm">
              <Badge variant={statusConfig.variant}>
                {Math.round(indicator.score * 100)}%
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            {/* Title and Message */}
            <div>
              <h4 
                className="font-medium mb-1"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                {indicator.name}
              </h4>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {indicator.message}
              </p>
            </div>

            {/* Applicability Notice for not_applicable indicators */}
            {isNotApplicable && (
              <div className="bg-slate-50/50 border border-slate-100/50 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-500 text-sm">ℹ️</span>
                  <span className="font-medium text-slate-700 text-sm">Not Applicable</span>
                </div>
                <p className="text-sm text-slate-600">
                  This indicator is not applicable for {siteProfile.replace('_', ' ')} sites.
                  {!isIncludedInMath && ' (Excluded from category scoring)'}
                </p>
              </div>
            )}

            {/* Evidence Details for applicable indicators with evidence */}
            {!isNotApplicable && indicator.evidence && Object.keys(indicator.evidence).length > 0 && (
              <div className="bg-blue-50/30 border border-blue-100/50 rounded-md p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-600 text-sm">🔍</span>
                  <span className="font-medium text-slate-700 text-sm">Evidence</span>
                </div>
                <div className="text-sm text-slate-700 space-y-1">
                  {Object.entries(indicator.evidence).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="truncate max-w-xs" title={String(value)}>
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Scoring Badge */}
          <div className="flex flex-col items-end gap-2">
            {!isIncludedInMath && (
              <Badge variant="secondary">
                Not scored
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};