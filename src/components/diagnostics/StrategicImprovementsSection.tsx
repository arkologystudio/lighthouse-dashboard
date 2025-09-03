import React from 'react';
import type { RecommendationItem } from '../../types';
import { Card } from '../ui/Card';

interface StrategicImprovementsSectionProps {
  strategicImprovements: RecommendationItem[];
  className?: string;
}

export const StrategicImprovementsSection: React.FC<StrategicImprovementsSectionProps> = ({ 
  strategicImprovements, 
  className 
}) => {
  if (!strategicImprovements || strategicImprovements.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🎯</div>
        <div>
          <h2 className="text-xl font-medium text-gray-900">Strategic Improvements</h2>
          <p className="text-sm text-gray-600">Long-term optimizations for maximum AI readiness</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {strategicImprovements.map((item, index) => (
          <div 
            key={item.id || index}
            className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            {/* Priority indicator */}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-4 h-4 rounded-full border-2 ${
                item.impactLevel === 'high' ? 'border-red-500 bg-red-100' :
                item.impactLevel === 'medium' ? 'border-yellow-500 bg-yellow-100' :
                'border-blue-500 bg-blue-100'
              }`}>
                <div className={`w-full h-full rounded-full ${
                  item.impactLevel === 'high' ? 'bg-red-500' :
                  item.impactLevel === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                
                {/* Badges */}
                <div className="flex gap-2 ml-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.impactLevel === 'high' ? 'bg-red-100 text-red-800' :
                    item.impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.impactLevel} impact
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.difficultyLevel === 'hard' ? 'bg-red-100 text-red-800' :
                    item.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {item.difficultyLevel}
                  </span>
                  
                  {item.estimatedTimeToFix && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      ⏱️ {item.estimatedTimeToFix}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{item.description}</p>
              
              {/* Category and related indicators */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="inline-flex items-center gap-1">
                  <span>📂</span>
                  {item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                
                {item.relatedIndicators.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span>🔗</span>
                    {item.relatedIndicators.length} related indicator{item.relatedIndicators.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              {/* Implementation phases */}
              <div className="bg-white rounded-md p-3 border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">Implementation Strategy:</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${
                      item.difficultyLevel === 'easy' ? 'w-1/3 bg-green-500' :
                      item.difficultyLevel === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-red-500'
                    }`} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.difficultyLevel === 'easy' ? 'Quick setup' :
                     item.difficultyLevel === 'medium' ? 'Planned rollout' :
                     'Major project'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {strategicImprovements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🚀</div>
          <p>Excellent! Your site is already optimized for strategic AI readiness.</p>
        </div>
      )}
    </Card>
  );
};