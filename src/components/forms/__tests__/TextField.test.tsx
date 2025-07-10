import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextField } from '../TextField';

describe('TextField', () => {
  it('renders with label and placeholder', () => {
    render(
      <TextField
        label="Test Label"
        placeholder="Test placeholder"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <TextField
        label="Test Label"
        error="This field is required"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-lighthouse-error');
  });

  it('displays helper text when provided', () => {
    render(
      <TextField
        label="Test Label"
        helperText="This is helpful information"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('This is helpful information')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(<TextField label="Test Label" value="" onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders with start and end icons', () => {
    const startIcon = <span data-testid="start-icon">@</span>;
    const endIcon = <span data-testid="end-icon">✓</span>;

    render(
      <TextField
        label="Test Label"
        startIcon={startIcon}
        endIcon={endIcon}
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <TextField
        label="Test Label"
        className="custom-class"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });
});
