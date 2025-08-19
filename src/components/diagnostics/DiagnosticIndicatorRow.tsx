import React from 'react';
import type { DiagnosticIndicator } from '../../types';
import { Badge } from '../ui/Badge';

interface DiagnosticIndicatorRowProps {
  indicator: DiagnosticIndicator;
  className?: string;
}

export const DiagnosticIndicatorRow: React.FC<DiagnosticIndicatorRowProps> = ({ 
  indicator,
  className = ''
}) => {
  
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
          icon: '✅',
          variant: 'success' as const,
          bgColor: 'bg-green-50/50',
          borderColor: 'border-green-200'
        };
      case 'warn':
        return {
          label: 'Warning',
          icon: '⚠️',
          variant: 'warning' as const,
          bgColor: 'bg-yellow-50/50',
          borderColor: 'border-yellow-200'
        };
      case 'fail':
        return {
          label: 'Fail',
          icon: '❌',
          variant: 'error' as const,
          bgColor: 'bg-red-50/50',
          borderColor: 'border-red-200'
        };
      case 'not_applicable':
        return {
          label: 'N/A',
          icon: '➖',
          variant: 'secondary' as const,
          bgColor: 'bg-gray-50/50',
          borderColor: 'border-gray-200'
        };
    }
  };
  
  const statusConfig = getStatusConfig(indicator.status);
  const hasValidationIssues = enhancedDetails?.validationErrors?.length || enhancedDetails?.validationWarnings?.length;

  return (
    <div 
      className={`
        rounded-lg border transition-all hover:shadow-sm
        ${statusConfig.bgColor} ${statusConfig.borderColor}
        ${className}
      `}
    >
      <div className="p-4">
        {/* Main Row */}
        <div className="flex items-start gap-4">
          {/* Status and Score */}
          <div className="flex items-center gap-3 min-w-[140px]">
            <span className="text-xl">{statusConfig.icon}</span>
            <div className="text-sm">
              <Badge variant={statusConfig.variant}>
                {indicator.score}/{indicator.max_score}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            {/* Title and Description */}
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
                {indicator.why_it_matters}
              </p>
            </div>

            {/* Recommendation (inline for non-passing indicators) */}
            {indicator.status !== 'pass' && (
              <div className="flex items-start gap-2">
                <span className="text-sm" style={{ color: 'var(--color-navigation-blue)' }}>→</span>
                <p 
                  className="text-sm"
                  style={{ color: 'var(--color-navigation-blue)' }}
                >
                  {indicator.fix_recommendation}
                </p>
              </div>
            )}

            {/* Validation Issues */}
            {hasValidationIssues && (
              <div className="space-y-2 mt-3">
                {enhancedDetails.validationErrors?.length && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-500 text-sm">❌</span>
                      <span className="font-medium text-red-900 text-sm">Errors</span>
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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm">⚠️</span>
                      <span className="font-medium text-yellow-900 text-sm">Warnings</span>
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
          </div>

          {/* Right Side - Metadata */}
          <div className="flex items-center gap-2">
            {enhancedDetails?.impactLevel && (
              <Badge 
                variant={
                  enhancedDetails.impactLevel === 'high' ? 'error' :
                  enhancedDetails.impactLevel === 'medium' ? 'warning' : 'success'
                }
              >
                Impact: {enhancedDetails.impactLevel}
              </Badge>
            )}
            {enhancedDetails?.difficultyLevel && (
              <Badge 
                variant={
                  enhancedDetails.difficultyLevel === 'hard' ? 'error' :
                  enhancedDetails.difficultyLevel === 'medium' ? 'warning' : 'success'
                }
              >
                Difficulty: {enhancedDetails.difficultyLevel}
              </Badge>
            )}
            {enhancedDetails?.estimatedTimeToFix && (
              <Badge variant="info">
                ⏱️ {enhancedDetails.estimatedTimeToFix}
              </Badge>
            )}
          </div>
        </div>

        {/* Technical Details Accordion – currently not used*/}
        {/* {hasTechnicalDetails && (
          <div className="mt-4">
            <Accordion type="single">
              <AccordionItem value="details" className="border-0">
                <AccordionTrigger 
                  value="details"
                  className="text-sm px-0 py-2 hover:bg-transparent"
                >
                  <span style={{ color: 'var(--color-maritime-fog)' }}>
                    Technical Details
                  </span>
                </AccordionTrigger>
                <AccordionContent value="details" className="px-0">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2 text-sm">
                    {enhancedDetails.checkedUrl && (
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--color-maritime-fog)' }}>Checked URL:</span>
                        <span className="font-mono text-xs truncate max-w-xs" title={enhancedDetails.checkedUrl}>
                          {enhancedDetails.checkedUrl}
                        </span>
                      </div>
                    )}
                    {enhancedDetails.found !== undefined && (
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--color-maritime-fog)' }}>Resource Found:</span>
                        <span className={enhancedDetails.found ? 'text-green-700' : 'text-red-700'}>
                          {enhancedDetails.found ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                    {enhancedDetails.isValid !== undefined && (
                      <div className="flex justify-between">
                        <span style={{ color: 'var(--color-maritime-fog)' }}>Valid:</span>
                        <span className={enhancedDetails.isValid ? 'text-green-700' : 'text-red-700'}>
                          {enhancedDetails.isValid ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                    {Object.entries(enhancedDetails).map(([key, value]) => {
                      // Skip already displayed fields
                      if (['checkedUrl', 'found', 'isValid', 'scannedAt', 'category', 
                           'validationErrors', 'validationWarnings', 'impactLevel', 
                           'difficultyLevel', 'estimatedTimeToFix'].includes(key)) {
                        return null;
                      }
                      if (value && typeof value !== 'object') {
                        return (
                          <div key={key} className="flex justify-between">
                            <span style={{ color: 'var(--color-maritime-fog)' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="truncate max-w-xs" title={String(value)}>
                              {String(value)}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )} */}
      </div>
    </div>
  );
};