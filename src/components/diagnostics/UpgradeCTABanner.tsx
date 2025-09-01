import React from 'react';
import { Card } from '../ui/Card';
import { LighthouseCTAButton } from '../ui/LighthouseCTAButton';

export const UpgradeCTABanner: React.FC = () => {
  const handleExploreEnhancements = () => {
    // Navigate to upgrade/enhancement page
    window.open('/upgrade', '_blank');
  };

  return (
    <Card className="p-8 mt-8 relative overflow-hidden">
      {/* Gradient background overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: 'linear-gradient(135deg, var(--color-lighthouse-beam) 0%, var(--color-navigation-blue) 100%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Lighthouse Icon */}
        
        <svg
          width="136"
          height="136"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="title desc"
          className="mx-auto mb-2"
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          <title id="title">Minimal Lighthouse</title>
          <desc id="desc">A simple, elegant lighthouse with subtle light beams and a wave line</desc>
          {/* soft light beams with lighter color and fade out */}
          <polygon
            points="64,35 30,28 30,42"
            fill="url(#beamLeft)"
            opacity="0.5"
          />
          <polygon
            points="64,35 98,28 98,42"
            fill="url(#beamRight)"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="beamLeft" x1="64" y1="35" x2="30" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.65"/>
              <stop offset="0.8" stopColor="white" stopOpacity="0.08"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="beamRight" x1="64" y1="35" x2="98" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="white" stopOpacity="0.95"/>
              <stop offset="0.8" stopColor="white" stopOpacity="0.08"/>
              <stop offset="1" stopColor="white" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* lantern roof */}
            <path d="M58 34 H70 L64 28 Z"/>
            {/* lantern room */}
            <rect x="59" y="34" width="10" height="6" rx="1"/>
            {/* gallery/platform line */}
            <path d="M56 40 H72"/>
            {/* tower body (tapered) */}
            <path d="M52 88 L76 88 L70 40 L58 40 Z"/>
            {/* stripes (subtle detailing) */}
            <path d="M57 58 H71" opacity="0.6"/>
            <path d="M55 72 H73" opacity="0.6"/>
          </g>
          {/* door with thinner line */}
          <rect
            x="62"
            y="76"
            width="4"
            height="8"
            rx="1"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          {/* wave line */}
          <path
            d="M16 112 Q40 104 64 112 T112 112"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        {/* Heading */}
        <h2 
          className="text-2xl md:text-3xl font-bold mb-10 "
          style={{ color: 'var(--color-lighthouse-beam)' }}
        >
          Upgrade your Website&apos;s AI Readiness in a few clicks:
        </h2>

        {/* Feature list */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 text-left max-w-4xl mx-auto">
          {/* Quick Wins */}
          <div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-signal-green)' }}
                />
                <span 
                  className="text-md leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <strong style={{ color: 'var(--color-lighthouse-beam)' }}>Enhanced LLMs.txt Generation</strong> - 
                  Automatically create comprehensive AI-readable site descriptions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-signal-green)' }}
                />
                <span 
                  className="text-md leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <strong style={{ color: 'var(--color-lighthouse-beam)' }}>Agent.json Configuration</strong> - 
                  Define API endpoints and capabilities for AI agents
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: 'var(--color-signal-yellow)' }}
                />
                <span 
                  className="text-md leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <strong style={{ color: 'var(--color-lighthouse-beam)' }}>MCP Server Integration</strong> 
                  <span 
                    className="text-sm ml-2 px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: 'var(--color-signal-yellow)',
                      color: 'var(--color-coal-depths)'
                    }}
                  >
                    (coming soon!)
                  </span>
                  <br />
                  <span className="text-md">
                    Enable agents to perform direct knowledge/product search, checkout and payments.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Lighthouse Subscription Features */}
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              borderColor: 'var(--color-maritime-border)',
              borderWidth: '2px',
              backgroundColor: 'var(--color-maritime-mist)'
            }}
          >
            <h3 
              className="font-semibold mb-3 text-sm uppercase tracking-wide text-blue-200"
            >
              Also available from the Lighthouse Suite:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-200"
                />
                <div>
                  <strong 
                    className="text-sm"
                    style={{ color: 'var(--color-lighthouse-beam)' }}
                  >
                    AI Product Search
                  </strong>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: 'var(--color-maritime-fog)' }}
                  >
                    Increase sales by enabling users/agents to discover relevant products/services faster
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div 
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-200"
                />
                <div>
                  <strong 
                    className="text-sm"
                    style={{ color: 'var(--color-lighthouse-beam)' }}
                  >
                    AI Knowledge Search
                  </strong>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: 'var(--color-maritime-fog)' }}
                  >
                    Improve information discovery for humans and agents across 
                    your website using natural language queries.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <LighthouseCTAButton onClick={handleExploreEnhancements}>
          Explore Enhancements
        </LighthouseCTAButton>

        {/* Supporting text */}
        <p 
          className="text-sm mt-4 opacity-75"
          style={{ color: 'var(--color-maritime-fog)' }}
        >
          Unlock the future of AI web navigation
        </p>
      </div>
    </Card>
  );
};