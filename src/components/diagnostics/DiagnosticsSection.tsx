

import React from 'react';
import { DiagnosticsUrlInput } from './DiagnosticsUrlInput';

const DiagnosticsSection: React.FC = () => (
    <section
      className="relative py-24"
      style={{ backgroundColor: 'var(--color-ocean-surface)' }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Section header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase mb-8"
            style={{
              borderColor: 'var(--color-maritime-border)',
              backgroundColor: 'rgba(51, 65, 85, 0.3)',
              color: 'var(--color-beacon-light)',
            }}
          >
            <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
            Diagnostic Analysis
          </div>
          
          <h2
            className="text-4xl md:text-5xl font-light leading-tight mb-6"
            style={{ color: 'var(--color-lighthouse-beam)' }}
          >
            Is your site ready for{' '}
            <span style={{ color: 'var(--color-beacon-light)' }}>
              the Agentic Web?
            </span>
          </h2>
          
          {/* <p
            className="text-xl mb-2"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Audit your Website
          </p> */}
          
          {/* Free label */}
          <div
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-8"
            style={{
              backgroundColor: 'var(--color-navigation-green)',
              color: 'white',
            }}
          >
            Free Audit
          </div>
          
          <p
            className="text-lg max-w-3xl mx-auto leading-relaxed mb-12"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            Dermine your site&apos;s AI Readiness by running our free diagnostics scan. 
            We&apos;ll audit your site based on the Lighthouse AI Readiness Index, 
            identifying key indicators that make discoverable, understandable, and trusted 
            by AI Agents and services. Receive actionable insights and recommendations to  
            improve your site&apos;s AI Readiness.
          </p>
        </div>

        {/* URL Input */}
        <div className="max-w-2xl mx-auto">
          <DiagnosticsUrlInput />
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 pt-8">
          <div
            className="flex justify-center items-center space-x-8 text-xs font-mono uppercase tracking-wider opacity-60"
            style={{ color: 'var(--color-maritime-fog)' }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-navigation-green)' }}
              ></div>
              <span>No Signup Required</span>
            </div>
            <div
              className="w-px h-4"
              style={{ backgroundColor: 'var(--color-maritime-border)' }}
            ></div>
            <div className="flex items-center space-x-2">
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-navigation-green)' }}
              ></div>
              <span>Optimisation Suggestions</span>
            </div>
            <div
              className="w-px h-4"
              style={{ backgroundColor: 'var(--color-maritime-border)' }}
            ></div>
            <div className="flex items-center space-x-2">
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-navigation-green)' }}
              ></div>
              <span>Comprehensive Analysis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
);

export default DiagnosticsSection;