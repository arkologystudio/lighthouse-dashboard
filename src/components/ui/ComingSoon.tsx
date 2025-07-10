import React from 'react';
import { Card, CardContent } from './Card';

interface ComingSoonProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Coming Soon',
  description = 'This feature is currently under development and will be available soon.',
  showIcon = true,
}) => (
  <Card className="text-center">
    <CardContent>
      {showIcon && (
        <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center bg-lighthouse-surface rounded-full">
          <svg
            className="w-12 h-12 text-lighthouse-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}

      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>

      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>

      <div className="inline-flex items-center space-x-2 text-lighthouse-primary">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-lighthouse-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-lighthouse-primary rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-lighthouse-primary rounded-full animate-pulse delay-200" />
        </div>
        <span className="text-sm font-medium">In Development</span>
      </div>
    </CardContent>
  </Card>
);
