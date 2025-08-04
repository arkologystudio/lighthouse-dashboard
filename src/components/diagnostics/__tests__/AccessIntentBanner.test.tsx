import React from 'react';
import { render, screen } from '@testing-library/react';
import { AccessIntentBanner } from '../AccessIntentBanner';
import type { AccessIntent } from '../../../types';

describe('AccessIntentBanner', () => {
  it('should render allow access intent with correct styling', () => {
    render(<AccessIntentBanner accessIntent="allow" />);
    
    expect(screen.getByText('Allow')).toBeInTheDocument();
    expect(screen.getByText('Allow')).toHaveClass('bg-green-100', 'text-green-800');
    expect(screen.getByText(/AI agents can freely/)).toBeInTheDocument();
  });

  it('should render partial access intent with correct styling', () => {
    render(<AccessIntentBanner accessIntent="partial" />);
    
    expect(screen.getByText('Partial')).toBeInTheDocument();
    expect(screen.getByText('Partial')).toHaveClass('bg-yellow-100', 'text-yellow-800');
    expect(screen.getByText(/Some content may be restricted/)).toBeInTheDocument();
  });

  it('should render block access intent with correct styling', () => {
    render(<AccessIntentBanner accessIntent="block" />);
    
    expect(screen.getByText('Block')).toBeInTheDocument();
    expect(screen.getByText('Block')).toHaveClass('bg-red-100', 'text-red-800');
    expect(screen.getByText(/AI access is restricted/)).toBeInTheDocument();
  });

  it('should display lock icon for all access intents', () => {
    render(<AccessIntentBanner accessIntent="allow" />);
    
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });

  it('should have info tooltip for allow access', () => {
    render(<AccessIntentBanner accessIntent="allow" />);
    
    const tooltip = screen.getByTestId('info-tooltip');
    expect(tooltip).toHaveAttribute(
      'title',
      expect.stringContaining('allows AI agents full access')
    );
  });

  it('should have info tooltip for partial access', () => {
    render(<AccessIntentBanner accessIntent="partial" />);
    
    const tooltip = screen.getByTestId('info-tooltip');
    expect(tooltip).toHaveAttribute(
      'title',
      expect.stringContaining('some restrictions in place')
    );
  });

  it('should have info tooltip for block access', () => {
    render(<AccessIntentBanner accessIntent="block" />);
    
    const tooltip = screen.getByTestId('info-tooltip');
    expect(tooltip).toHaveAttribute(
      'title',
      expect.stringContaining('blocks AI agents from accessing')
    );
  });

  it('should render with custom className', () => {
    const { container } = render(
      <AccessIntentBanner accessIntent="allow" className="custom-class" />
    );
    
    const banner = container.firstChild;
    expect(banner).toHaveClass('custom-class');
  });

  it('should use neutral language as per spec', () => {
    render(<AccessIntentBanner accessIntent="block" />);
    
    // Should not use judgmental language
    expect(screen.queryByText(/bad/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/wrong/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    
    // Should use neutral descriptive language
    expect(screen.getByText(/AI access is restricted/)).toBeInTheDocument();
  });

  it('should explain trade-offs in tooltip', () => {
    render(<AccessIntentBanner accessIntent="block" />);
    
    const tooltip = screen.getByTestId('info-tooltip');
    const tooltipText = tooltip.getAttribute('title') || '';
    
    // Should mention both benefits and trade-offs
    expect(tooltipText).toMatch(/privacy|control/i);
    expect(tooltipText).toMatch(/discoverability/i);
  });

  it('should be accessible with proper aria attributes', () => {
    render(<AccessIntentBanner accessIntent="allow" />);
    
    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('aria-label', expect.stringContaining('AI Access Intent'));
  });

  it('should handle all access intent types', () => {
    const accessIntents: AccessIntent[] = ['allow', 'partial', 'block'];
    
    accessIntents.forEach((intent) => {
      const { unmount } = render(<AccessIntentBanner accessIntent={intent} />);
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      unmount();
    });
  });
});