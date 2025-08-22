import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradeCTABanner } from '../UpgradeCTABanner';

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

describe('UpgradeCTABanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the banner with all expected content', () => {
    render(<UpgradeCTABanner />);

    // Check for main heading
    expect(screen.getByText(/Upgrade your Website's AI Readiness Score/i)).toBeInTheDocument();

    // Check for feature items
    expect(screen.getByText(/Enhanced LLMs.txt Generation/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent.json Configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/MCP Server Integration/i)).toBeInTheDocument();

    // Check for Lighthouse subscription features (use getAllByText since "AI Product Search" appears twice)
    expect(screen.getAllByText(/AI Product Search/i)).toHaveLength(2); // Appears in both description and heading
    expect(screen.getByText(/AI Knowledge Search/i)).toBeInTheDocument();

    // Check for CTA button
    expect(screen.getByRole('button', { name: /Explore Enhancements/i })).toBeInTheDocument();
    
    // Check for maritime icon (anchor)
    expect(screen.getByText('⚓')).toBeInTheDocument();
  });

  it('opens upgrade page when CTA button is clicked', () => {
    render(<UpgradeCTABanner />);

    const ctaButton = screen.getByRole('button', { name: /Explore Enhancements/i });
    fireEvent.click(ctaButton);

    expect(window.open).toHaveBeenCalledWith('/upgrade', '_blank');
  });

  it('displays the coming soon badge for MCP Server Integration', () => {
    render(<UpgradeCTABanner />);

    expect(screen.getByText('coming soon!')).toBeInTheDocument();
  });

  it('has proper styling structure', () => {
    const { container } = render(<UpgradeCTABanner />);

    // Check for gradient background overlay
    const gradientOverlay = container.querySelector('.absolute.inset-0.opacity-5');
    expect(gradientOverlay).toBeInTheDocument();

    // Check for relative z-10 content container
    const contentContainer = container.querySelector('.relative.z-10.text-center');
    expect(contentContainer).toBeInTheDocument();
  });
});