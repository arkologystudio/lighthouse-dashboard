import React from 'react';
import type { LighthouseAIReport, SpecIndicator, SiteProfile } from '../../types';
import { DiagnosticIndicatorRow } from './DiagnosticIndicatorRow';
import { ReportHeading } from './ReportHeading';
import { UpgradeCTABanner } from './UpgradeCTABanner';
import { Card } from '../ui/Card';
import { useAuth } from '../../lib/hooks/useAuth';

interface DiagnosticsReportProps {
  report: LighthouseAIReport;
  className?: string;
}



export const DiagnosticsReport: React.FC<DiagnosticsReportProps> = ({ 
  report,
  className = '' 
}) => {
  const { user } = useAuth();
  const categoryKeys = ['discovery', 'understanding', 'actions', 'trust'] as const;

  // Collect all indicators from the top-level indicators object and separate by applicability
  const requiredIndicators: SpecIndicator[] = [];
  const optionalIndicators: SpecIndicator[] = [];
  const notApplicableIndicators: SpecIndicator[] = [];

  // Get all indicator names from all categories
  const allIndicatorNames = new Set<string>();
  categoryKeys.forEach((categoryKey) => {
    const category = report.categories[categoryKey];
    Object.keys(category.indicator_scores).forEach(indicatorName => {
      allIndicatorNames.add(indicatorName);
    });
  });

  // Process each unique indicator and categorize by applicability
  allIndicatorNames.forEach((indicatorName) => {
    const indicator = report.indicators[indicatorName];
    if (indicator) {
      if (indicator.applicability.status === 'not_applicable') {
        notApplicableIndicators.push(indicator);
      } else if (indicator.applicability.status === 'optional') {
        optionalIndicators.push(indicator);
      } else {
        requiredIndicators.push(indicator);
      }
    }
  });

  // Check if user is unauthorized (free user or not logged in)
  const isUnauthorizedUser = !user || user.subscription_tier !== 'pro';

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Category Radar Chart and Overall Score */}
      <ReportHeading report={report} />
      
      {/* Required/Applicable Indicators */}
      {requiredIndicators.length > 0 && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              📊 Core Indicators
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Essential indicators that directly impact your AI readiness score.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {requiredIndicators.map((indicator, index) => (
                <DiagnosticIndicatorRow 
                  key={`required-${indicator.name}-${index}`}
                  indicator={indicator} 
                  siteProfile={report.site.category as SiteProfile}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Optional Indicators Section */}
      {optionalIndicators.length > 0 && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              ⭐ Optional Enhancements
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Additional features that can further improve AI agent interactions with your site.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {optionalIndicators.map((indicator, index) => (
                <DiagnosticIndicatorRow 
                  key={`optional-${indicator.name}-${index}`}
                  indicator={indicator} 
                  siteProfile={report.site.category as SiteProfile}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Not Applicable Indicators Section - placed after Optional Enhancements */}
      {notApplicableIndicators.length > 0 && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              ➖ Not Applicable
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              These indicators are not applicable to your site type and do not affect your score.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {notApplicableIndicators.map((indicator, index) => (
                <DiagnosticIndicatorRow 
                  key={`not-applicable-${indicator.name}-${index}`}
                  indicator={indicator} 
                  siteProfile={report.site.category as SiteProfile}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CTA Banner for unauthorized users */}
      {isUnauthorizedUser && <UpgradeCTABanner />}
    </div>
  );
};