import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
  style = {}
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = 'px-4 py-3 rounded-lg border text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const defaultStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-lighthouse-structure)',
    borderColor: 'var(--color-maritime-border)',
    color: 'var(--color-lighthouse-beam)',
    ...style
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
      style={defaultStyle}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};