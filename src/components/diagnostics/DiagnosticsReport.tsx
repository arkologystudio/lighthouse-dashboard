import React from 'react';
import type { LighthouseAIReport } from '../../types';
import { DiagnosticCategory } from './DiagnosticCategory';
import { CategoryRadarChart } from './CategoryRadarChart';

interface DiagnosticsReportProps {
  report: LighthouseAIReport;
  className?: string;
}

const categoryDescriptions: Record<string, string> = {
  discovery: 'How easily AI agents can find and identify your site through search engines and discovery mechanisms.',
  understanding: 'How well AI agents can interpret your site\'s structure, content, and meaning using structured data.',
  actions: 'How easily AI agents can perform useful actions on your site through APIs and interactive elements.',
  trust: 'Signals that establish your site as a credible, up-to-date source for AI agents and users.',
};

const categoryDisplayNames: Record<string, string> = {
  discovery: 'Discovery',
  understanding: 'Understanding', 
  actions: 'Actions',
  trust: 'Trust',
};

export const DiagnosticsReport: React.FC<DiagnosticsReportProps> = ({ 
  report,
  className = '' 
}) => {
  const categoryKeys = ['discovery', 'understanding', 'actions', 'trust'] as const;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Category Radar Chart and Overall Score */}
      <CategoryRadarChart report={report} />
      
      {/* Category Breakdown */}
      <div className="space-y-6">
        {categoryKeys.map((categoryKey) => {
          const category = report.categories[categoryKey];
          const weight = report.weights[categoryKey];
          
          // Count indicators by status, excluding not_applicable from totals
          const applicableIndicators = category.indicators.filter(
            i => i.applicability.included_in_category_math
          );
          const passingCount = applicableIndicators.filter(i => i.status === 'pass').length;
          const totalCount = applicableIndicators.length;
          
          return (
            <DiagnosticCategory
              key={categoryKey}
              categoryKey={categoryKey}
              title={categoryDisplayNames[categoryKey]}
              description={categoryDescriptions[categoryKey]}
              score={category.score}
              weight={weight}
              passingCount={passingCount}
              totalCount={totalCount}
              indicators={category.indicators}
              siteProfile={report.site.category}
            />
          );
        })}
      </div>
    </div>
  );
};