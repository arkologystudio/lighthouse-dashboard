"use client"

import React from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import type { LighthouseAIReport } from '../../types';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CategoryRadarChartProps {
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

export const CategoryRadarChart: React.FC<CategoryRadarChartProps> = ({ 
  report,
  className = '' 
}) => {
  const categoryKeys = ['discovery', 'understanding', 'actions', 'trust'] as const;
  
  // Transform data for radar chart
  const chartData = categoryKeys.map((categoryKey) => ({
    category: categoryDisplayNames[categoryKey],
    score: Math.round(report.categories[categoryKey].score * 10), // Convert to 0-10 scale
    fullMark: 10
  }));

  // Calculate overall score
  const overallScore = categoryKeys.reduce((acc, key) => {
    return acc + (report.categories[key].score * report.weights[key]);
  }, 0);

  const overallScoreOutOf10 = Math.round(overallScore * 10);

  return (
    <div className={`bg-white rounded-lg border border-slate-200/50 p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-semibold mb-2"
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          Lighthouse AI Readiness
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div 
            className="text-4xl font-bold"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            {overallScoreOutOf10}/10
          </div>
          <div 
            className="text-sm"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Overall Score
          </div>
        </div>
      </div>
      
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[300px]"
      >
        <RadarChart data={chartData}>
          <ChartTooltip 
            cursor={false} 
            content={<ChartTooltipContent 
              formatter={(value, name) => [
                `${value}/10`,
                name
              ]}
            />} 
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fontSize: 12, 
              fill: 'var(--color-maritime-fog)' 
            }}
          />
          <PolarGrid 
            stroke="var(--color-maritime-fog)" 
            strokeOpacity={0.2}
          />
          <Radar
            dataKey="score"
            stroke="var(--color-lighthouse-beam)"
            fill="var(--color-lighthouse-beam)"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "var(--color-lighthouse-beam)",
              strokeWidth: 2,
              stroke: "white",
            }}
          />
        </RadarChart>
      </ChartContainer>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        {categoryKeys.map((categoryKey) => {
          const category = report.categories[categoryKey];
          const score = Math.round(category.score * 10);
          const applicableIndicators = category.indicators.filter(
            i => i.applicability.included_in_category_math
          );
          const passingCount = applicableIndicators.filter(i => i.status === 'pass').length;
          const totalCount = applicableIndicators.length;
          
          return (
            <div key={categoryKey} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-100/50">
              <span 
                className="font-medium text-sm"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                {categoryDisplayNames[categoryKey]}
              </span>
              <div className="text-right">
                <div 
                  className="font-bold"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  {score}/10
                </div>
                <div 
                  className="text-xs"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  {passingCount}/{totalCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};