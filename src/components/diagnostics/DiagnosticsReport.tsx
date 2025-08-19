import React from 'react';
import type { DiagnosticIndicator } from '../../types';
import { DiagnosticCategory } from './DiagnosticCategory';

interface DiagnosticsReportProps {
  indicators: DiagnosticIndicator[];
  className?: string;
}

// Group indicators by category based on their details
const categorizeIndicators = (indicators: DiagnosticIndicator[]): Record<string, DiagnosticIndicator[]> => {
  const categories: Record<string, DiagnosticIndicator[]> = {
    'SEO Optimization': [],
    'Standards & Compliance': [],
    'Structured Data': [],
    'AI Agent Configuration': [],
    'Content & Accessibility': [],
    'Technical Infrastructure': [],
  };

  indicators.forEach(indicator => {
    const details = indicator.details as { category?: string } | undefined;
    const category = details?.category || '';
    
    // Map indicators to categories based on name or category field
    if (indicator.name.toLowerCase().includes('title') || 
        indicator.name.toLowerCase().includes('meta') || 
        indicator.name.toLowerCase().includes('og:') ||
        indicator.name.toLowerCase().includes('canonical') ||
        category.includes('seo')) {
      categories['SEO Optimization'].push(indicator);
    } else if (indicator.name.toLowerCase().includes('robots') || 
               indicator.name.toLowerCase().includes('sitemap') ||
               indicator.name.toLowerCase().includes('rss') ||
               category.includes('standards')) {
      categories['Standards & Compliance'].push(indicator);
    } else if (indicator.name.toLowerCase().includes('json-ld') || 
               indicator.name.toLowerCase().includes('schema') ||
               indicator.name.toLowerCase().includes('structured') ||
               category.includes('structured_data')) {
      categories['Structured Data'].push(indicator);
    } else if (indicator.name.toLowerCase().includes('llms.txt') || 
               indicator.name.toLowerCase().includes('ai-') ||
               category.includes('ai_agent')) {
      categories['AI Agent Configuration'].push(indicator);
    } else if (indicator.name.toLowerCase().includes('heading') || 
               indicator.name.toLowerCase().includes('content') ||
               indicator.name.toLowerCase().includes('alt') ||
               category.includes('content')) {
      categories['Content & Accessibility'].push(indicator);
    } else {
      categories['Technical Infrastructure'].push(indicator);
    }
  });

  // Remove empty categories
  return Object.fromEntries(
    Object.entries(categories).filter(([, indicators]) => indicators.length > 0)
  );
};

const categoryDescriptions: Record<string, string> = {
  'GEO/SEO Optimization': 'Essential metadata that helps AI agents understand and categorize your content effectively.',
  'Standards & Compliance': 'Standards that ensure AI agents can discover and take relevant actions on your site.',
  'Structured Data': 'Machine-readable data formats that provide rich context to AI agents about your content.',
  'AI Agent Configuration': 'Specific configurations that optimize how AI agents interact with your website.',
  'Content & Accessibility': 'Content structure and accessibility features that improve AI comprehension.',
  'Technical Infrastructure': 'Technical foundations that support efficient AI agent processing.',
};

export const DiagnosticsReport: React.FC<DiagnosticsReportProps> = ({ 
  indicators,
  className = '' 
}) => {
  const categorizedIndicators = categorizeIndicators(indicators);

  return (
    <div className={`space-y-8 ${className}`}>
      {Object.entries(categorizedIndicators).map(([category, categoryIndicators]) => {
        const passingCount = categoryIndicators.filter(i => i.status === 'pass').length;
        const totalCount = categoryIndicators.length;
        
        return (
          <DiagnosticCategory
            key={category}
            title={category}
            description={categoryDescriptions[category] || ''}
            passingCount={passingCount}
            totalCount={totalCount}
            indicators={categoryIndicators}
          />
        );
      })}
    </div>
  );
};