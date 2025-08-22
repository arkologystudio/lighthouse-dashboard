import React from 'react';
import type { SpecIndicator, SiteProfile } from '../../types';
import { DiagnosticIndicatorRow } from './DiagnosticIndicatorRow';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/Accordion';
import { Card } from '../ui/Card';

// Utility function to extract status from evidence
const getIndicatorStatus = (indicator: SpecIndicator): 'pass' | 'warn' | 'fail' | 'not_applicable' => {
  // Check applicability first - if not applicable, always return not_applicable
  if (indicator.applicability.status === 'not_applicable') {
    return 'not_applicable';
  }
  
  // Fallback logic based on score
  if (indicator.score >= 0.8) return 'pass';
  if (indicator.score >= 0.5) return 'warn';
  return 'fail';
};

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
        return 'var(--color-beacon-light)';
      case 'understanding':
        return 'var(--color-navigation-green)';
      case 'actions':
        return 'var(--color-signal-amber)';
      case 'trust':
        return 'var(--color-navigation-blue)';
      default:
        return 'var(--color-lighthouse-beam)';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'var(--color-navigation-green)';
    if (score >= 0.5) return 'var(--color-signal-amber)';
    return 'var(--color-text-error)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Strong';
    if (score >= 0.5) return 'Moderate';
    if (score >= 0.3) return 'Weak';
    return 'Poor';
  };

  const getRecommendations = (categoryKey: string, indicators: SpecIndicator[]) => {
    const failedIndicators = indicators.filter(i => getIndicatorStatus(i) === 'fail' && i.applicability.included_in_category_math);
    const warningIndicators = indicators.filter(i => getIndicatorStatus(i) === 'warn' && i.applicability.included_in_category_math);
    
    const recommendations: string[] = [];
    
    switch (categoryKey) {
      case 'discovery':
        if (failedIndicators.some(i => i.name.includes('seo'))) {
          recommendations.push('Implement basic SEO elements: title tags, meta descriptions, and proper heading structure');
        }
        if (failedIndicators.some(i => i.name.includes('sitemap'))) {
          recommendations.push('Create and submit an XML sitemap to search engines');
        }
        if (failedIndicators.some(i => i.name.includes('robots'))) {
          recommendations.push('Add a robots.txt file to guide search engine crawling');
        }
        if (warningIndicators.length > 0) {
          recommendations.push('Review and optimize existing SEO elements for better performance');
        }
        break;
      
      case 'understanding':
        if (failedIndicators.some(i => i.name.includes('json_ld'))) {
          recommendations.push('Implement JSON-LD structured data for better content understanding');
        }
        if (failedIndicators.some(i => i.name.includes('llms'))) {
          recommendations.push('Create an llms.txt file to provide AI-specific instructions');
        }
        if (failedIndicators.some(i => i.name.includes('schema'))) {
          recommendations.push('Add relevant schema markup to help AI understand your content');
        }
        break;
        
      case 'actions':
        if (failedIndicators.some(i => i.name.includes('mcp'))) {
          recommendations.push('Consider implementing Model Context Protocol for AI agent interactions');
        }
        if (failedIndicators.some(i => i.name.includes('api'))) {
          recommendations.push('Expose relevant APIs for programmatic access to your services');
        }
        if (failedIndicators.some(i => i.name.includes('form'))) {
          recommendations.push('Ensure forms are accessible and can be automated safely');
        }
        break;
        
      case 'trust':
        if (failedIndicators.some(i => i.name.includes('ssl'))) {
          recommendations.push('Implement HTTPS with valid SSL certificates');
        }
        if (failedIndicators.some(i => i.name.includes('security'))) {
          recommendations.push('Review and strengthen security headers and policies');
        }
        if (failedIndicators.some(i => i.name.includes('content'))) {
          recommendations.push('Keep content fresh and updated with current information');
        }
        break;
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great work! This category is performing well. Continue monitoring and maintaining these standards.');
    }
    
    return recommendations;
  };

  const scorePercentage = Math.round(score * 100);
  const weightPercentage = Math.round(weight * 100);
  const contributionPoints = Math.round(score * weight * 100);
  const recommendations = getRecommendations(categoryKey, indicators);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Header Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ 
                backgroundColor: `${getCategoryColor(categoryKey)}20`,
                border: `3px solid ${getCategoryColor(categoryKey)}40`
              }}
            >
              {getCategoryIcon(categoryKey)}
            </div>
            <div>
              <h3 
                className="text-2xl font-bold mb-1"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                {title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                {description}
              </p>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="text-right">
            <div 
              className="text-4xl font-bold mb-1"
              style={{ color: getScoreColor(score) }}
            >
              {scorePercentage}%
            </div>
            <div 
              className="text-sm mb-2"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              {getScoreLabel(score)}
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-center">
            <div 
              className="font-bold text-lg"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              {passingCount}/{totalCount}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Passing
            </div>
          </div>
          <div className="text-center">
            <div 
              className="font-bold text-lg"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              {weightPercentage}%
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Weight
            </div>
          </div>
          <div className="text-center">
            <div 
              className="font-bold text-lg"
              style={{ color: getCategoryColor(categoryKey) }}
            >
              {contributionPoints}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Points
            </div>
          </div>
        </div>
      </Card>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((indicator) => (
          <DiagnosticIndicatorRow 
            key={indicator.name}
            indicator={indicator} 
            siteProfile={siteProfile}
          />
        ))}
      </div>

      {/* Recommendations Accordion */}
      <Card>
        <Accordion type="single">
          <AccordionItem 
            value="recommendations"
            className="border-0"
          >
            <AccordionTrigger 
              value="recommendations"
              className="text-lg font-semibold px-6 py-4 text-white hover:bg-gray-800"
            >
              📋 Recommendations for {title}
            </AccordionTrigger>
            <AccordionContent 
              value="recommendations"
              className="px-6 pb-6"
            >
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ 
                        backgroundColor: getCategoryColor(categoryKey),
                        color: 'white'
                      }}
                    >
                      {index + 1}
                    </div>
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};