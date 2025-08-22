"use client"

import React from 'react';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import type { LighthouseAIReport } from '../../types';
import { Card } from '../ui/Card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ReportHeadingProps {
  report: LighthouseAIReport;
  className?: string;
}

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--color-lighthouse-beam))",
  },
} satisfies ChartConfig;

const categoryDisplayNames: Record<string, string> = {
  discovery: 'Discovery',
  understanding: 'Understanding', 
  actions: 'Actions',
  trust: 'Trust',
};

const categoryDescriptions: Record<string, string> = {
  discovery: 'How easily AI agents can find and identify your site',
  understanding: 'How well AI agents can interpret your site\'s content',
  actions: 'How easily AI agents can perform useful actions',
  trust: 'Signals that establish your site as credible',
};

export const ReportHeading: React.FC<ReportHeadingProps> = ({ 
  report,
  className = '' 
}) => {
  // Reorder categories for radar chart positioning: Understanding (top), Actions (left), Discovery (bottom), Trust (right)
  const categoryKeys = ['understanding', 'actions', 'discovery', 'trust'] as const;
  
  // Transform data for radar chart
  const chartData = categoryKeys.map((categoryKey) => ({
    category: categoryDisplayNames[categoryKey],
    score: Math.round(report.categories[categoryKey].score * 100), // Convert to 0-100 scale
    fullMark: 100
  }));

  // Calculate overall score
  const overallScore = categoryKeys.reduce((acc, key) => 
    acc + (report.categories[key].score * report.weights[key])
  , 0);

  const overallScoreOutOf100 = Math.round(overallScore * 100);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--color-navigation-green)';
    if (score >= 50) return 'var(--color-signal-amber)';
    return 'var(--color-text-error)';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className={`p-8 ${className}`}>
      <div className="text-center mb-8">
        <h2 
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          AI Readiness Score
        </h2>
        <div className="mb-6">
          <a
            href="https://lighthousestudios.xyz/docs/ai-readiness-index"
            target="_blank"
            rel="noopener noreferrer"
            className="italic text-sm text-gray-300 hover:underline"
            style={{ fontStyle: 'italic' }}
          >
            Spec: Lighthouse AI Readiness Index v1.0
          </a>
        </div>
        
        {/* Site Score Card */}
        <Card className="bg-gray-100 dark:bg-gray-700/60 p-6 mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-center gap-8">
            <div 
              className="text-6xl font-bold"
              style={{ color: getScoreColor(overallScoreOutOf100) }}
            >
              {overallScoreOutOf100}%
            </div>
            <div className="text-left">
              <div 
                className="text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Site Score
              </div>
              <div 
                className="text-lg font-semibold"
                style={{ color: getScoreColor(overallScoreOutOf100) }}
              >
                {getScoreLabel(overallScoreOutOf100)}
              </div>
            </div>
          </div>
          <div 
            className="text-sm mt-4 break-all text-center"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            {report.site.url}
          </div>
        </Card>
      </div>
      
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[400px] w-full max-w-[400px] mb-8"
      >
        <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <ChartTooltip 
            cursor={false} 
            content={<ChartTooltipContent 
              formatter={(value) => [
                `${value}%`
              ]}
            />} 
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fontSize: 14, 
              fill: 'var(--color-lighthouse-beam)',
              fontWeight: 500
            }}
          />
          <PolarGrid 
            stroke="var(--color-border)" 
            strokeOpacity={0.5}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            tickCount={6}
          />
          <Radar
            dataKey="score"
            stroke="var(--color-beacon-light)"
            fill="var(--color-beacon-light)"
            fillOpacity={0.2}
            strokeWidth={3}
            dot={{
              r: 6,
              fill: "var(--color-beacon-light)",
              strokeWidth: 2,
              stroke: "var(--color-lighthouse-beam)",
            }}
          />
        </RadarChart>
      </ChartContainer>
      
      <div className="grid grid-cols-2 gap-4">
        {(['discovery', 'understanding', 'actions', 'trust'] as const).map((categoryKey) => {
          const category = report.categories[categoryKey];
          const scorePercentage = Math.round(category.score * 100);
          
          // Get indicators for this category from the top-level indicators object
          const categoryIndicatorNames = Object.keys(category.indicator_scores);
          const applicableIndicators = categoryIndicatorNames
            .map(name => report.indicators[name])
            .filter(indicator => indicator && indicator.applicability.included_in_category_math);
          
          // Extract status from evidence for counting
          const passingCount = applicableIndicators.filter(indicator => {
            const status = indicator.applicability.status === 'not_applicable' ? 'not_applicable' :
              indicator.score >= 0.8 ? 'pass' :
              indicator.score >= 0.5 ? 'warn' : 'fail';
            return status === 'pass';
          }).length;
          const totalCount = applicableIndicators.length;
          
          return (
            <div 
              key={categoryKey} 
              className="p-4 rounded-lg"
              style={{ 
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div className="mb-3">
                <div 
                  className="font-semibold text-sm mb-1"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  {categoryDisplayNames[categoryKey]}
                </div>
                <div 
                  className="text-xs leading-tight"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  {categoryDescriptions[categoryKey]}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div 
                  className="font-bold text-lg"
                  style={{ color: getScoreColor(scorePercentage) }}
                >
                  {scorePercentage}%
                </div>
                <div 
                  className="text-xs"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  {passingCount}/{totalCount} passing
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};