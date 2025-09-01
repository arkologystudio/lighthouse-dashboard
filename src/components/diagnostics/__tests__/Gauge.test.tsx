import React from 'react';
import { render, screen } from '@testing-library/react';
import { Gauge } from '../Gauge';

describe('Gauge', () => {
  it('should render with score percentage', () => {
    render(<Gauge score={85} maxScore={100} />);
    
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should calculate percentage correctly', () => {
    render(<Gauge score={75} maxScore={100} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should handle different max scores', () => {
    render(<Gauge score={42} maxScore={60} />);
    
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('should apply correct color class for high scores', () => {
    const { container } = render(<Gauge score={90} maxScore={100} />);
    
    const progressBar = container.querySelector('[data-testid="gauge-progress"]');
    expect(progressBar).toHaveClass('stroke-green-500');
  });

  it('should apply correct color class for medium scores', () => {
    const { container } = render(<Gauge score={70} maxScore={100} />);
    
    const progressBar = container.querySelector('[data-testid="gauge-progress"]');
    expect(progressBar).toHaveClass('stroke-yellow-500');
  });

  it('should apply correct color class for low scores', () => {
    const { container } = render(<Gauge score={40} maxScore={100} />);
    
    const progressBar = container.querySelector('[data-testid="gauge-progress"]');
    expect(progressBar).toHaveClass('stroke-red-500');
  });

  it('should handle zero score', () => {
    render(<Gauge score={0} maxScore={100} />);
    
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should handle perfect score', () => {
    render(<Gauge score={100} maxScore={100} />);
    
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should render with custom size', () => {
    const { container } = render(<Gauge score={85} maxScore={100} size={200} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('should render with default size if not provided', () => {
    const { container } = render(<Gauge score={85} maxScore={100} />);
    
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '160');
    expect(svg).toHaveAttribute('height', '160');
  });

  it('should have correct aria attributes', () => {
    const { container } = render(<Gauge score={85} maxScore={100} />);
    
    const gauge = container.querySelector('[role="progressbar"]');
    expect(gauge).toHaveAttribute('aria-valuenow', '85');
    expect(gauge).toHaveAttribute('aria-valuemin', '0');
    expect(gauge).toHaveAttribute('aria-valuemax', '100');
    expect(gauge).toHaveAttribute('aria-label', 'AI Readiness Score: 85%');
  });

  it('should render background circle', () => {
    const { container } = render(<Gauge score={85} maxScore={100} />);
    
    const backgroundCircle = container.querySelector('[data-testid="gauge-background"]');
    expect(backgroundCircle).toBeInTheDocument();
    expect(backgroundCircle).toHaveClass('stroke-gray-200');
  });

  it('should calculate correct stroke dasharray for progress', () => {
    const { container } = render(<Gauge score={50} maxScore={100} />);
    
    const progressBar = container.querySelector('[data-testid="gauge-progress"]');
    // For 50%, with radius ~63, circumference ~395, dasharray should be ~197.5
    expect(progressBar).toHaveAttribute('stroke-dasharray');
  });
});