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
        <div className="mx-auto w-24 h-24 mb-6 flex items-center justify-center rounded-full"
             style={{ backgroundColor: 'var(--color-ocean-surface)' }}>
          <svg
            className="w-12 h-12"
            style={{ color: 'var(--color-beacon-light)' }}
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

      <h3 className="text-2xl font-semibold mb-4" style={{ color: 'var(--color-lighthouse-beam)' }}>{title}</h3>

      <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--color-maritime-fog)' }}>{description}</p>

      <div className="inline-flex items-center space-x-2" style={{ color: 'var(--color-beacon-light)' }}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-beacon-light)' }} />
          <div className="w-2 h-2 rounded-full animate-pulse delay-100" style={{ backgroundColor: 'var(--color-beacon-light)' }} />
          <div className="w-2 h-2 rounded-full animate-pulse delay-200" style={{ backgroundColor: 'var(--color-beacon-light)' }} />
        </div>
        <span className="text-sm font-medium">In Development</span>
      </div>
    </CardContent>
  </Card>
);
