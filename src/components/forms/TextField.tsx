import React, { useId } from 'react';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  id,
  className = '',
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const inputClassName = `lh-field-input ${
    error ? 'lh-field-input-error' : ''
  } ${startIcon ? 'lh-field-input-with-start-icon' : ''} ${
    endIcon ? 'lh-field-input-with-end-icon' : ''
  } ${className}`.trim();

  return (
    <div className="lh-field-container">
      {label && (
        <label htmlFor={inputId} className="lh-field-label">
          {label}
        </label>
      )}

      <div className="lh-field-input-container">
        {startIcon && <div className="lh-field-icon-start">{startIcon}</div>}

        <input id={inputId} className={inputClassName} {...props} />

        {endIcon && <div className="lh-field-icon-end">{endIcon}</div>}
      </div>

      {error && (
        <div className="lh-field-error">
          <svg
            className="lh-icon-sm flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {helperText && !error && (
        <div className="lh-field-helper">{helperText}</div>
      )}
    </div>
  );
};
