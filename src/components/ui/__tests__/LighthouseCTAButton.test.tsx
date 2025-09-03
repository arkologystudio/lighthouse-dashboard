import { render, screen, fireEvent } from '@testing-library/react';
import { LighthouseCTAButton } from '../LighthouseCTAButton';

describe('LighthouseCTAButton', () => {
  it('renders with children content', () => {
    render(<LighthouseCTAButton>Test Button</LighthouseCTAButton>);
    expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<LighthouseCTAButton onClick={handleClick}>Click Me</LighthouseCTAButton>);
    
    const button = screen.getByRole('button', { name: 'Click Me' });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state correctly', () => {
    const handleClick = jest.fn();
    render(
      <LighthouseCTAButton onClick={handleClick} disabled>
        Disabled Button
      </LighthouseCTAButton>
    );
    
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles mouse events for lighthouse effect', () => {
    render(<LighthouseCTAButton>Hover Me</LighthouseCTAButton>);
    
    const button = screen.getByRole('button', { name: 'Hover Me' });
    
    // Test mouse enter and leave
    fireEvent.mouseEnter(button);
    fireEvent.mouseMove(button, { clientX: 100, clientY: 50 });
    fireEvent.mouseLeave(button);
    
    // Should not throw any errors
    expect(button).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <LighthouseCTAButton className="custom-class">
        Custom Button
      </LighthouseCTAButton>
    );
    
    const button = container.querySelector('.custom-class');
    expect(button).toBeInTheDocument();
  });
});