import React from 'react';
import type { AccessIntent } from '../../types';

interface AccessIntentBannerProps {
  accessIntent: AccessIntent;
  className?: string;
}

export const AccessIntentBanner: React.FC<AccessIntentBannerProps> = ({ 
  accessIntent, 
  className 
}) => {
  const getIntentConfig = (intent: AccessIntent) => {
    switch (intent) {
      case 'allow':
        return {
          label: 'Allow',
          badgeClass: 'bg-green-100 text-green-800',
          description: 'AI agents can freely access and index this site\'s content.',
          tooltip: 'Your site allows AI agents full access to content, improving discoverability and AI-powered search results. This maximizes visibility but provides less content control.',
        };
      case 'partial':
        return {
          label: 'Partial',
          badgeClass: 'bg-yellow-100 text-yellow-800',
          description: 'Some content may be restricted from AI agent access.',
          tooltip: 'Your site has some restrictions in place for AI agents. This provides a balance between content control and discoverability, with some limitations on AI indexing.',
        };
      case 'block':
        return {
          label: 'Block',
          badgeClass: 'bg-red-100 text-red-800',
          description: 'AI access is restricted to protect content privacy.',
          tooltip: 'Your site blocks AI agents from accessing content, providing maximum privacy and content control. This may reduce discoverability in AI-powered search and tools.',
        };
    }
  };
  
  const config = getIntentConfig(accessIntent);
  
  return (
    <div 
      className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className || ''}`}
      role="banner"
      aria-label="AI Access Intent Status"
    >
      <div className="flex items-start gap-3">
        {/* Lock icon */}
        <div className="flex-shrink-0 mt-0.5">
          <svg
            data-testid="lock-icon"
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">AI Access Intent:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeClass}`}>
              {config.label}
            </span>
            
            {/* Info tooltip */}
            <div 
              className="relative group cursor-help"
              title={config.tooltip}
              data-testid="info-tooltip"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">{config.description}</p>
        </div>
      </div>
    </div>
  );
};