'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { VALIDATION_PATTERNS } from '../../lib/constants';

// Fallback URL validation pattern in case import fails
const URL_PATTERN = /^https?:\/\/.+\..+/;

// Site profile options
const SITE_PROFILE_OPTIONS = [
  { value: 'custom', label: 'Default' },
  { value: 'blog_content', label: 'Blog' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'saas_app', label: 'SAAS App' },
  { value: 'kb_support', label: 'Knowledge Base/Wiki' },
  { value: 'gov_nontransacting', label: 'Government' }
];

interface DiagnosticsUrlInputProps {
  onSubmit?: (url: string, siteCategory?: string) => void;
  className?: string;
}

export const DiagnosticsUrlInput: React.FC<DiagnosticsUrlInputProps> = ({ 
  onSubmit, 
  className 
}) => {
  const [url, setUrl] = useState('');
  const [siteCategory, setSiteCategory] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) {
      setError('Please enter a website URL');
      return false;
    }

    // Add protocol if missing
    let normalizedUrl = inputUrl.trim();
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validate URL format using defensive pattern access
    const urlPattern = VALIDATION_PATTERNS?.URL || URL_PATTERN;
    if (!urlPattern?.test?.(normalizedUrl)) {
      setError('Please enter a valid website URL');
      return false;
    }

    try {
      const urlObj = new URL(normalizedUrl);
      
      // Ensure it's a proper website (not localhost, etc.)
      if (urlObj.hostname === 'localhost' || urlObj.hostname.startsWith('127.') || urlObj.hostname.startsWith('192.168.')) {
        setError('Please enter a public website URL');
        return false;
      }

      // Ensure it's homepage or root level (no deep paths)
      if (urlObj.pathname !== '/' && urlObj.pathname !== '') {
        setError('Please enter the homepage URL (root domain)');
        return false;
      }

      setError('');
      return true;
    } catch {
      setError('Please enter a valid website URL');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateUrl(url)) {
      return;
    }

    setIsLoading(true);
    
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    try {
      if (onSubmit) {
        onSubmit(normalizedUrl, siteCategory);
      } else {
        // Navigate to diagnostics page with URL and site category parameters
        const queryParams = new URLSearchParams({
          url: normalizedUrl,
          site_category: siteCategory || 'custom'
        });
        router.push(`/dashboard/diagnostics?${queryParams.toString()}`);
      }
    } catch {
      setError('Failed to start diagnostics. Please try again.');
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) {
      setError(''); // Clear error when user starts typing
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* All elements on same line with consistent height */}
        <div className="flex gap-3 items-stretch">
          <div className="flex-[2]">
            <input
              type="text"
              value={url}
              onChange={handleInputChange}
              placeholder="Enter your website URL (e.g., example.com)"
              className="w-full h-12 px-4 rounded-lg border text-base"
              style={{
                backgroundColor: 'var(--color-lighthouse-structure)',
                borderColor: error ? 'var(--color-signal-red)' : 'var(--color-maritime-border)',
                color: 'var(--color-lighthouse-beam)',
              }}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex-1">
            <Select
              value={siteCategory}
              onChange={setSiteCategory}
              options={SITE_PROFILE_OPTIONS}
              placeholder="Site Type"
              disabled={isLoading}
              className="w-full h-12"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="h-12 px-6 text-base font-medium rounded-lg transition-all duration-200 hover:shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: 'var(--color-navigation-blue)',
              color: 'white',
              border: 'none',
            }}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                />
                <span>Scanning...</span>
              </div>
            ) : (
              'Scan'
            )}
          </Button>
        </div>

        {/* Error message below inputs */}
        {error && (
          <p
            className="text-sm"
            style={{ color: 'var(--color-signal-red)' }}
          >
            {error}
          </p>
        )}
      </form>
    </div>
  );
};