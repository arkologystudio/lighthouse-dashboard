import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IndicatorCard } from '../IndicatorCard';
import type { DiagnosticIndicator } from '../../../types';

describe('IndicatorCard', () => {
  const mockIndicator: DiagnosticIndicator = {
    id: 'llms-txt',
    name: 'llms.txt',
    status: 'pass',
    score: 10,
    max_score: 10,
    why_it_matters: 'Enables AI agents to understand your content boundaries',
    fix_recommendation: 'Add llms.txt file to your root directory',
    details: {
      file_exists: true,
      validation_passed: true,
    },
  };

  it('should render indicator name', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    expect(screen.getByText('llms.txt')).toBeInTheDocument();
  });

  it('should render pass status chip with correct styling', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    const statusChip = screen.getByText('Pass');
    expect(statusChip).toBeInTheDocument();
    expect(statusChip).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('should render warn status chip with correct styling', () => {
    const warnIndicator = { ...mockIndicator, status: 'warn' as const };
    render(<IndicatorCard indicator={warnIndicator} />);
    
    const statusChip = screen.getByText('Warning');
    expect(statusChip).toBeInTheDocument();
    expect(statusChip).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should render fail status chip with correct styling', () => {
    const failIndicator = { ...mockIndicator, status: 'fail' as const };
    render(<IndicatorCard indicator={failIndicator} />);
    
    const statusChip = screen.getByText('Fail');
    expect(statusChip).toBeInTheDocument();
    expect(statusChip).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should show why it matters on hover', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    const infoIcon = screen.getByTestId('info-icon');
    expect(infoIcon).toBeInTheDocument();
    
    // Tooltip content should be in title attribute
    expect(infoIcon.parentElement).toHaveAttribute(
      'title',
      'Enables AI agents to understand your content boundaries'
    );
  });

  it('should enforce why_it_matters character limit', () => {
    const longIndicator = {
      ...mockIndicator,
      why_it_matters: 'A'.repeat(121), // Over 120 char limit
    };
    render(<IndicatorCard indicator={longIndicator} />);
    
    const infoIcon = screen.getByTestId('info-icon');
    const tooltip = infoIcon.parentElement?.getAttribute('title');
    expect(tooltip?.length).toBeLessThanOrEqual(120);
  });

  it('should display score', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    expect(screen.getByText('10/10')).toBeInTheDocument();
  });

  it('should toggle accordion to show fix recommendation', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    // Initially, fix recommendation should not be visible
    expect(screen.queryByText('Add llms.txt file to your root directory')).not.toBeInTheDocument();
    
    // Click to expand
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);
    
    // Now fix recommendation should be visible
    expect(screen.getByText('Add llms.txt file to your root directory')).toBeInTheDocument();
    
    // Click to collapse
    fireEvent.click(expandButton);
    
    // Fix recommendation should be hidden again
    expect(screen.queryByText('Add llms.txt file to your root directory')).not.toBeInTheDocument();
  });

  it('should have correct aria attributes for accordion', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    const expandButton = screen.getByRole('button', { name: /expand/i });
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    
    fireEvent.click(expandButton);
    expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render with custom className', () => {
    const { container } = render(
      <IndicatorCard indicator={mockIndicator} className="custom-class" />
    );
    
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('should handle indicators without details', () => {
    const indicatorWithoutDetails = { ...mockIndicator, details: undefined };
    render(<IndicatorCard indicator={indicatorWithoutDetails} />);
    
    expect(screen.getByText('llms.txt')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
  });

  it('should show chevron icon that rotates on expand', () => {
    render(<IndicatorCard indicator={mockIndicator} />);
    
    const chevron = screen.getByTestId('chevron-icon');
    expect(chevron).toHaveClass('rotate-0');
    
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);
    
    expect(chevron).toHaveClass('rotate-180');
  });
});