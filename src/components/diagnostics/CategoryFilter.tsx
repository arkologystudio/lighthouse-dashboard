import React from 'react';
import type { IndicatorCategory } from '../../types';

interface CategoryFilterProps {
  selectedCategory: IndicatorCategory | 'all';
  onCategoryChange: (category: IndicatorCategory | 'all') => void;
  categoryStats?: Record<IndicatorCategory, { 
    total: number; 
    passed: number; 
    warned: number; 
    failed: number; 
    notApplicable: number; 
  }>;
  className?: string;
}

const categoryConfig: Record<IndicatorCategory | 'all', { 
  label: string; 
  icon: string; 
  description: string; 
}> = {
  all: {
    label: 'All Categories',
    icon: '📊',
    description: 'View all indicators across all categories'
  },
  standards: {
    label: 'AI Standards',
    icon: '🤖',
    description: 'AI agent instruction files and configurations'
  },
  seo: {
    label: 'SEO',
    icon: '🔍',
    description: 'Search engine optimization indicators'
  },
  structured_data: {
    label: 'Structured Data',
    icon: '📋',
    description: 'JSON-LD and schema.org markup'
  },
  accessibility: {
    label: 'Accessibility',
    icon: '♿',
    description: 'Web accessibility standards'
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  categoryStats,
  className 
}) => {
  const categories = Object.keys(categoryConfig) as (IndicatorCategory | 'all')[];
  
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">Filter by Category</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category) => {
          const config = categoryConfig[category];
          const stats = category === 'all' ? null : categoryStats?.[category as IndicatorCategory];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
              title={config.description}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-lg">{config.icon}</span>
                <div className="flex-1">
                  <div className="font-medium text-sm">{config.label}</div>
                  {stats && (
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.total} indicators
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status indicators */}
              {stats && (
                <div className="flex items-center gap-1">
                  {stats.passed > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {stats.passed}
                    </span>
                  )}
                  {stats.warned > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      {stats.warned}
                    </span>
                  )}
                  {stats.failed > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      {stats.failed}
                    </span>
                  )}
                  {stats.notApplicable > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      {stats.notApplicable}
                    </span>
                  )}
                </div>
              )}
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="ml-3">
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Summary stats for selected category */}
      {selectedCategory !== 'all' && categoryStats && categoryStats[selectedCategory as IndicatorCategory] && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">
            {categoryConfig[selectedCategory].label} Summary
          </div>
          {(() => {
            const stats = categoryStats[selectedCategory as IndicatorCategory];
            const percentage = stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0;
            
            return (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Score:</span>
                  <span className={`font-medium ${
                    percentage >= 80 ? 'text-green-600' :
                    percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {percentage}%
                  </span>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-green-600 font-medium">{stats.passed}</div>
                    <div className="text-gray-500">Pass</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-600 font-medium">{stats.warned}</div>
                    <div className="text-gray-500">Warn</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-medium">{stats.failed}</div>
                    <div className="text-gray-500">Fail</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 font-medium">{stats.notApplicable}</div>
                    <div className="text-gray-500">N/A</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};