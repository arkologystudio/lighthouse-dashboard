import React from 'react';
import type { SpecIndicator, SiteProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion';

// Utility function to extract status and message from evidence
const getIndicatorStatus = (indicator: SpecIndicator): 'pass' | 'warn' | 'fail' | 'not_applicable' => {
  // If indicator is not applicable, it should show as not applicable regardless of evidence
  if (indicator.applicability.status === 'not_applicable') {
    return 'not_applicable';
  }
  
  // Otherwise, use evidence status or fallback to score-based status
  if (indicator.evidence && typeof indicator.evidence.status === 'string') {
    return indicator.evidence.status as 'pass' | 'warn' | 'fail' | 'not_applicable';
  }
  
  // Fallback logic based on score
  if (indicator.score >= 0.8) return 'pass';
  if (indicator.score >= 0.5) return 'warn';
  return 'fail';
};

const getIndicatorMessage = (indicator: SpecIndicator): string => {
  if (indicator.evidence && typeof indicator.evidence.message === 'string') {
    return indicator.evidence.message;
  }
  // Fallback message based on applicability
  if (indicator.applicability.status === 'not_applicable') {
    return indicator.applicability.reason;
  }
  // Generic message based on score
  const score = Math.round(indicator.score * 100);
  return `Indicator scored ${score}%`;
};

// User-friendly descriptions for each indicator
const getIndicatorDescription = (indicatorName: string): string => {
  const descriptions: Record<string, string> = {
    'llms_txt': 'LLMS.txt file provides structured information about your website to help AI agents understand your content and services.',
    'robots_txt': 'Robots.txt file guides AI agents and web crawlers on which parts of your site they can access.',
    'sitemap_xml': 'XML sitemap helps AI agents discover and understand the structure of your website content.',
    'json_ld': 'JSON-LD structured data provides rich context about your content in a format that AI agents can easily understand.',
    'canonical_urls': 'Canonical URLs help AI agents identify the authoritative version of your content pages.',
    'seo_basic': 'Basic SEO elements like title tags and meta descriptions help AI agents understand and categorize your content.',
    'mcp': 'Model Context Protocol (MCP) enables direct AI agent integration with your services and data.',
    'agent_json': 'Agent.json configuration file defines how AI agents should interact with your website and APIs.',
    'agents_json': 'Agents.json configuration file defines how AI agents should interact with your website and APIs.'
  };
  
  return descriptions[indicatorName] || 'This indicator measures an important aspect of AI readiness for your website.';
};

// Adaptive recommendation system for robots.txt indicator
const getRobotsTxtRecommendation = (indicator: SpecIndicator): string => {
  const score = Math.round(indicator.score * 100);
  
  if (score === 0) {
    return `Create a robots.txt file at your site's root directory (${new URL('/', window.location.origin).href}robots.txt). This file helps AI agents and web crawlers understand which parts of your site they can access. Start with a basic file that allows all agents: 
    
User-agent: *
Allow: /

You can then customize it based on your site's needs.`;
  } else if (score === 100) {
    return `Your robots.txt file exists. Depending on your needs, consider adding specific rules to control agent access based on your site's intentions:

• To allow AI agents while blocking certain crawlers: Add specific User-agent directives
• To restrict access to private sections: Use Disallow rules for sensitive directories
• To guide agents to your sitemap: Add "Sitemap: [your-sitemap-url]"
• To set crawl delays: Add "Crawl-delay: [seconds]" for specific agents

Example advanced robots.txt:
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Sitemap: ${new URL('/sitemap.xml', window.location.origin).href}`;
  }
  
  // For other scores (shouldn't happen based on implementation but good fallback)
  return 'Review your robots.txt file to ensure it properly guides AI agents and web crawlers according to your site\'s access intentions.';
};

// Recommendation functions for each indicator type
const getLlmsTxtRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score === 0 || !evidence?.contentFound) {
    return `Create an llms.txt file at your site's root directory to help AI agents understand your content and services.

Create the file at: ${new URL('/llms.txt', window.location.origin).href}

Basic llms.txt template:
# LLMS.txt - AI Agent Instructions

## About
[Brief description of your site and its purpose]

## Content Guidelines
- Primary content type: [blog posts, products, documentation, etc.]
- Target audience: [who your content serves]
- Update frequency: [how often content changes]

## API Access
${evidence?.specificData?.hasApi ? '- API available at: [your-api-endpoint]' : '- No public API available'}

## Contact
- Support: [contact information for AI-related queries]`;
  }
  
  if (evidence?.validationIssues?.length) {
    return `Your llms.txt file has validation issues that need attention:

${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}

${evidence.aiOptimizationOpportunities?.length ? 
  `\nOptimization opportunities:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
  }
  
  return `Your llms.txt file looks good! Consider these enhancements:

• Add more detailed content guidelines for AI agents
• Include API documentation references if applicable
• Specify content update schedules
• Add contact information for AI-related queries
• Include usage terms for AI systems

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nBased on your content:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getSitemapRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score === 0 || !evidence?.contentFound) {
    return `Create an XML sitemap to help AI agents discover and understand your site structure.

Create the file at: ${new URL('/sitemap.xml', window.location.origin).href}

Basic sitemap structure:
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.origin}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Add more URLs here -->
</urlset>

Don't forget to reference it in your robots.txt:
Sitemap: ${new URL('/sitemap.xml', window.location.origin).href}`;
  }
  
  if (evidence?.validationIssues?.length) {
    return `Your sitemap has validation issues:

${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}

Common fixes:
• Ensure all URLs are absolute and valid
• Update lastmod dates to reflect actual content changes
• Remove URLs that return 404 or redirect
• Keep sitemap under 50MB and 50,000 URLs per file`;
  }
  
  return `Your sitemap looks good! Consider these optimizations:

• Update lastmod dates regularly to reflect content changes
• Use appropriate changefreq values (daily/weekly/monthly)
• Set priority values to guide AI agent crawling
• Consider creating sitemap index files for large sites
• Include all important content pages

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nAI-specific optimizations:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getJsonLdRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score === 0 || !evidence?.contentFound) {
    return `Add JSON-LD structured data to help AI agents understand your content better.

Add to your HTML head section:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "[Your Site Name]",
  "url": "${window.location.origin}",
  "description": "[Brief description of your site]"
}
</script>

Consider adding specific schema types:
• Organization schema for business information
• Article schema for blog posts
• Product schema for e-commerce
• FAQ schema for support content`;
  }
  
  if (evidence?.validationIssues?.length) {
    return `Your JSON-LD structured data has validation issues:

${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}

Common fixes:
• Ensure all required properties are included
• Use valid schema.org types and properties
• Properly format dates and URLs
• Validate JSON syntax

${evidence?.missingFields?.length ? 
  `\nMissing recommended fields:\n${evidence.missingFields.map(field => `• ${field}`).join('\n')}` : 
  ''}`;
  }
  
  return `Your JSON-LD looks good! Consider adding more schema types:

• Breadcrumb schema for navigation
• Review schema for user feedback
• Event schema for upcoming activities
• LocalBusiness schema if applicable

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nAI-specific enhancements:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getCanonicalUrlsRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score < 50) {
    return `Add canonical URLs to help AI agents identify the authoritative version of your content.

Add to each page's HTML head:
<link rel="canonical" href="[full-url-to-this-page]" />

Best practices:
• Use absolute URLs (include protocol and domain)
• Ensure canonical URL is accessible and returns 200
• Point to the primary version of duplicate content
• Self-reference for unique pages

${evidence?.validationIssues?.length ? 
  `\nCurrent issues to fix:\n${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}` : 
  ''}`;
  }
  
  return `Your canonical URLs are well implemented! Consider these optimizations:

• Review pages with multiple URL variations
• Ensure canonical URLs are consistent across navigation
• Use canonical URLs in sitemaps
• Monitor for canonical chain issues

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nAI-specific improvements:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getSeoBasicRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score < 50) {
    return `Improve basic SEO elements to help AI agents understand and categorize your content.

Essential elements to add/improve:
• Title tags: Unique, descriptive, 50-60 characters
• Meta descriptions: Compelling summaries, 150-160 characters
• Header structure: Proper H1, H2, H3 hierarchy
• Alt text: Descriptive text for all images

${evidence?.missingFields?.length ? 
  `\nMissing elements detected:\n${evidence.missingFields.map(field => `• ${field}`).join('\n')}` : 
  ''}

${evidence?.validationIssues?.length ? 
  `\nIssues to fix:\n${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}` : 
  ''}`;
  }
  
  return `Your basic SEO elements are strong! Consider these enhancements:

• Optimize title tags for AI understanding
• Enhance meta descriptions with clear action indicators
• Improve header hierarchy for better content structure
• Add descriptive alt text that explains image context

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nAI-specific optimizations:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getMcpRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score === 0 || !evidence?.contentFound) {
    return `Consider implementing Model Context Protocol (MCP) for direct AI agent integration.

MCP enables AI agents to:
• Access your services programmatically
• Retrieve real-time data
• Perform actions on behalf of users
• Understand your API capabilities

Implementation steps:
1. Review MCP specification at https://modelcontextprotocol.io
2. Identify which services to expose
3. Implement MCP server endpoints
4. Add MCP configuration file
5. Test with MCP-compatible AI clients

Note: MCP is an advanced feature most suitable for SaaS applications and services.`;
  }
  
  return `Your MCP implementation is detected! Consider these enhancements:

• Expand available tools and resources
• Add comprehensive capability descriptions
• Implement proper authentication and rate limiting
• Add usage examples and documentation
• Monitor agent usage patterns

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nOptimization opportunities:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

const getAgentJsonRecommendation = (indicator: SpecIndicator): string => {
  const evidence = indicator.evidence;
  const score = Math.round(indicator.score * 100);
  
  if (score === 0 || !evidence?.contentFound) {
    return `Create an agent.json configuration file to define how AI agents should interact with your site.

Create the file at: ${new URL('/agent.json', window.location.origin).href}

Basic agent.json template:
{
  "name": "[Your Site Name]",
  "description": "[Brief description for AI agents]",
  "version": "1.0",
  "capabilities": [
    "content_access",
    "search"
  ],
  "access": {
    "allowed": true,
    "restrictions": []
  },
  "endpoints": {
    "search": "/api/search",
    "content": "/api/content"
  }
}`;
  }
  
  if (evidence?.validationIssues?.length) {
    return `Your agent.json file has validation issues:

${evidence.validationIssues.map(issue => `• ${issue}`).join('\n')}

Common fixes:
• Ensure valid JSON syntax
• Include required fields: name, description, capabilities
• Use valid capability values
• Provide accurate endpoint URLs`;
  }
  
  return `Your agent.json configuration looks good! Consider adding:

• More specific capability definitions
• Rate limiting information
• Authentication requirements
• Usage examples and documentation
• Contact information for agent developers

${evidence?.aiOptimizationOpportunities?.length ? 
  `\nEnhancement suggestions:\n${evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
  ''}`;
};

// General recommendation function that handles indicator-specific logic
const getIndicatorRecommendation = (indicator: SpecIndicator): string => {
  // Handle each indicator type with adaptive recommendations
  switch (indicator.name) {
    case 'robots_txt':
      return getRobotsTxtRecommendation(indicator);
    case 'llms_txt':
      return getLlmsTxtRecommendation(indicator);
    case 'sitemap_xml':
      return getSitemapRecommendation(indicator);
    case 'json_ld':
      return getJsonLdRecommendation(indicator);
    case 'canonical_urls':
      return getCanonicalUrlsRecommendation(indicator);
    case 'seo_basic':
      return getSeoBasicRecommendation(indicator);
    case 'mcp':
      return getMcpRecommendation(indicator);
    case 'agent_json':
    case 'agents_json':
      return getAgentJsonRecommendation(indicator);
    default:
      // Fallback for any other indicators
      return `Review this indicator to improve your site's AI readiness. ${indicator.evidence?.aiOptimizationOpportunities?.length ? 
        `\n\nSuggested improvements:\n${indicator.evidence.aiOptimizationOpportunities.map(opp => `• ${opp}`).join('\n')}` : 
        ''}`;
  }
};

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
  
  const getStatusConfig = (status: 'pass' | 'warn' | 'fail' | 'not_applicable') => {
    switch (status) {
      case 'not_applicable':
        return {
          label: 'Not Applicable',
          icon: '➖',
          variant: 'secondary' as const,
          iconBg: 'var(--color-text-muted)',
          scoreColor: 'var(--color-text-muted)',
          titleColor: 'var(--color-text-secondary)',
          messageColor: 'var(--color-text-muted)',
          cardOpacity: 'opacity-70'
        };
      case 'pass':
        return {
          label: 'Pass',
          icon: '✅',
          variant: 'success' as const,
          iconBg: 'var(--color-navigation-green)',
          scoreColor: 'var(--color-navigation-green)',
          titleColor: 'var(--color-lighthouse-beam)',
          messageColor: 'var(--color-maritime-fog)',
          cardOpacity: 'opacity-100'
        };
      case 'warn':
        return {
          label: 'Warning',
          icon: '⚠️',
          variant: 'warning' as const,
          iconBg: 'var(--color-signal-amber)',
          scoreColor: 'var(--color-signal-amber)',
          titleColor: 'var(--color-lighthouse-beam)',
          messageColor: 'var(--color-maritime-fog)',
          cardOpacity: 'opacity-100'
        };
      case 'fail':
        return {
          label: 'Fail',
          icon: '❌',
          variant: 'error' as const,
          iconBg: 'var(--color-text-error)',
          scoreColor: 'var(--color-text-error)',
          titleColor: 'var(--color-lighthouse-beam)',
          messageColor: 'var(--color-maritime-fog)',
          cardOpacity: 'opacity-100'
        };
      default:
        // Default fallback for any unexpected status values
        return {
          label: 'Unknown',
          icon: '❓',
          variant: 'secondary' as const,
          iconBg: 'var(--color-text-muted)',
          scoreColor: 'var(--color-text-muted)',
          titleColor: 'var(--color-lighthouse-beam)',
          messageColor: 'var(--color-maritime-fog)',
          cardOpacity: 'opacity-100'
        };
    }
  };
  
  // Extract status and message from indicator using utility functions
  const indicatorStatus = getIndicatorStatus(indicator);
  const indicatorMessage = getIndicatorMessage(indicator);
  
  const statusConfig = getStatusConfig(indicatorStatus);
  const isNotApplicable = indicator.applicability.status === 'not_applicable';
  const isIncludedInMath = indicator.applicability.included_in_category_math;
  
  // const getApplicabilityBadge = () => {
  //   switch (indicator.applicability.status) {
  //     case 'required':
  //       return { text: 'Required', variant: 'error' as const };
  //     case 'optional':
  //       return { text: 'Optional', variant: 'warning' as const };
  //     case 'not_applicable':
  //       return { text: 'Not Applicable', variant: 'secondary' as const };
  //     default:
  //       return null;
  //   }
  // };

  // const applicabilityBadge = getApplicabilityBadge();

  return (
    <Card className={`${statusConfig.cardOpacity} ${className} hover:shadow-md transition-all duration-200 rounded-xl`} padding="none">
      <div className="p-6 rounded-xl" style={{ backgroundColor: '#ffffff', color: '#1f2937' }}>
        {/* Header with Icon, Title, and Score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Status Icon with Background */}
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
              style={{ backgroundColor: `${statusConfig.iconBg}20`, border: `2px solid ${statusConfig.iconBg}30` }}
            >
              {statusConfig.icon}
            </div>
            
            {/* Title */}
            <div>
              <h4 
                className="text-lg font-semibold mb-1 text-gray-900"
              >
                {indicator.name
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, l => l.toUpperCase())
                  .replace(/\bMcp\b/g, 'MCP')
                  .replace(/\bJson\b/g, 'JSON')
                  .replace(/\bLd\b/g, 'LD')
                }
              </h4>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">ℹ️</span>
                <p>{getIndicatorDescription(indicator.name)}</p>
              </div>
            </div>
          </div>

          {/* Score Display with Status Pill */}
          <div className="text-right flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="text-xs">
              {statusConfig.label}
            </Badge>
            <div 
              className="text-2xl font-bold"
              style={{ color: statusConfig.scoreColor }}
            >
              {Math.round(indicator.score * 100)}%
            </div>
          </div>
        </div>

        {/* Message
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <p className="text-sm leading-relaxed text-gray-800 font-medium">
            {indicatorMessage}
          </p>
        </div> */}

        {/* Applicability Notice for not_applicable indicators */}
        {isNotApplicable && (
          <div 
            className="rounded-lg p-4 mb-4 bg-gray-50 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">ℹ️</span>
              <span className="font-medium text-sm text-gray-700">
                N/A
              </span>
            </div>
            <p className="text-sm text-gray-600">
              This indicator is not applicable for {siteProfile.replace('_', ' ')} sites.
              {!isIncludedInMath && ' (Excluded from category scoring)'}
            </p>
          </div>
        )}

        {/* Evidence Details in Accordion */}
        {!isNotApplicable && indicator.evidence && Object.keys(indicator.evidence).length > 0 && (
          <Accordion type="single" className="mt-4">
            <AccordionItem value="evidence" className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger value="evidence" className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔍</span>
                  <span>Scan Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent value="evidence" className="px-4 pb-4 bg-white">
                <div className="space-y-3">
                  {Object.entries(indicator.evidence).map(([key, value]) => {
                    // Handle complex objects properly
                    let displayValue: string;
                    if (typeof value === 'boolean') {
                      displayValue = value ? 'Yes' : 'No';
                    } else if (typeof value === 'object' && value !== null) {
                      displayValue = JSON.stringify(value, null, 2);
                    } else {
                      displayValue = String(value);
                    }
                    
                    return (
                      <div key={key} className="border-b border-gray-100 pb-2 last:border-b-0">
                        <div className="flex flex-col space-y-1">
                          <span className="font-medium text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                          </span>
                          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded font-mono text-xs break-all">
                            {displayValue}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Recommendations Section */}
        {!isNotApplicable && (
          <Accordion type="single" className="mt-4">
            <AccordionItem value="recommendations" className="border border-gray-200 rounded-lg overflow-hidden">
              <AccordionTrigger value="recommendations" className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span>Recommendations</span>
                </div>
              </AccordionTrigger>
              <AccordionContent value="recommendations" className="px-4 pb-4 bg-white">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {getIndicatorRecommendation(indicator)}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </Card>
  );
};