import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center border rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-raleway cursor-pointer';

  const getVariantStyles = () => {
    const styles: React.CSSProperties = {};

    switch (variant) {
      case 'primary':
        styles.background =
          'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)';
        styles.color = 'var(--color-text-primary)';
        styles.borderColor = 'var(--color-accent)';
        break;
      case 'secondary':
        styles.backgroundColor = 'var(--color-bg-surface)';
        styles.color = 'var(--color-text-primary)';
        styles.borderColor = 'var(--color-border)';
        break;
      case 'outline':
        styles.backgroundColor = 'transparent';
        styles.color = 'var(--color-accent)';
        styles.borderColor = 'var(--color-accent)';
        break;
      case 'ghost':
        styles.backgroundColor = 'transparent';
        styles.color = 'var(--color-text-secondary)';
        styles.borderColor = 'transparent';
        break;
      case 'danger':
        styles.backgroundColor = 'var(--color-text-error)';
        styles.color = 'var(--color-text-primary)';
        styles.borderColor = 'var(--color-text-error)';
        break;
    }

    return styles;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2.5 text-base';
    }
  };

  const sizeClasses = getSizeClasses();
  const variantStyles = getVariantStyles();

  const finalClassName = `${baseClasses} ${sizeClasses} ${className}`.trim();

  return (
    <button
      className={finalClassName}
      style={variantStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};
