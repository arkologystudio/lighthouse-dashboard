import React from 'react';
import type { RecommendationItem } from '../../types';
import { Card } from '../ui/Card';

interface QuickWinsSectionProps {
  quickWins: RecommendationItem[];
  className?: string;
}

export const QuickWinsSection: React.FC<QuickWinsSectionProps> = ({ quickWins, className }) => {
  if (!quickWins || quickWins.length === 0) {
    return null;
  }

  return (
    <Card className={`p-6 ${className || ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">⚡</div>
        <div>
          <h2 className="text-xl font-medium text-gray-900">Quick Wins</h2>
          <p className="text-sm text-gray-600">Easy improvements with high impact</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {quickWins.map((item, index) => (
          <div 
            key={item.id || index}
            className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            {/* Priority indicator */}
            <div className="flex-shrink-0 mt-1">
              <div className={`w-3 h-3 rounded-full ${
                item.impactLevel === 'high' ? 'bg-green-500' :
                item.impactLevel === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                
                {/* Badges */}
                <div className="flex gap-2 ml-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.impactLevel === 'high' ? 'bg-green-100 text-green-800' :
                    item.impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.impactLevel} impact
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    item.difficultyLevel === 'easy' ? 'bg-green-100 text-green-800' :
                    item.difficultyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.difficultyLevel}
                  </span>
                  
                  {item.estimatedTimeToFix && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      ⏱️ {item.estimatedTimeToFix}
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3">{item.description}</p>
              
              {/* Category and related indicators */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
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
            </div>
          </div>
        ))}
      </div>
      
      {quickWins.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <p>Great! No quick wins needed - your site is well optimized.</p>
        </div>
      )}
    </Card>
  );
};