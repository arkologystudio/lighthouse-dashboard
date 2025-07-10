import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const baseClasses = 'lh-card';
  const paddingClass = paddingClasses[padding];

  return (
    <div className={`${baseClasses} ${paddingClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => <div className={`lh-card-header ${className}`.trim()}>{children}</div>;

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => <div className={className}>{children}</div>;

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => (
  <div className={`border-t border-color-border pt-4 mt-4 ${className}`.trim()}>
    {children}
  </div>
);
