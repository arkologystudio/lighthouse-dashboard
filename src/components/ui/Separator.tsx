import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ 
  orientation = 'horizontal',
  className = '' 
}) => {
  const baseStyles = orientation === 'horizontal' 
    ? 'h-[1px] w-full' 
    : 'h-full w-[1px]';
    
  return (
    <div
      className={`${baseStyles} bg-gray-200 dark:bg-gray-700 ${className}`}
      role="separator"
      aria-orientation={orientation}
    />
  );
};