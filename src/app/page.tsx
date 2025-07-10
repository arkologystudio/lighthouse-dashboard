'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'linear-gradient(135deg, var(--color-bg-main) 0%, var(--color-primary-dark) 50%, var(--color-primary) 100%)',
      }}
    >
      {/* Header */}
      <header
        className="shadow-sm border-b"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lh-flex-between py-6">
            <div className="lh-flex-icon-text">
              <div className="lh-icon-circle-primary">
                <span className="font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold lh-title-section">
                Lighthouse
              </span>
            </div>

            <div className="lh-flex-icon-text">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="lh-hero-container">
          <div className="lh-hero-content">
            <h1 className="lh-title-hero">
              <span className="block">Power Your WordPress</span>
              <span className="block" style={{ color: 'var(--color-accent)' }}>
                with AI Intelligence
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-xl lh-text-description">
              Lighthouse brings cutting-edge AI search capabilities to your
              WordPress sites. Enhance user experience with neural search and
              optimize for the AI-powered web.
            </p>

            <div className="lh-hero-actions">
              <Link href="/register">
                <Button size="lg" className="px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          className="py-16 relative"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(246, 173, 138, 0.05) 0%, transparent 70%)',
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="lh-title-hero text-3xl font-bold">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-lg lh-text-description">
                Transform your WordPress site with our powerful AI-driven
                plugins
              </p>
            </div>

            <div className="mt-16 lh-grid-cards">
              {/* Neural Search */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div className="lh-feature-icon">
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">Neural Search</h3>
                  <p className="lh-text-description">
                    AI-powered search that understands context and intent,
                    delivering more relevant results to your users.
                  </p>
                </CardContent>
              </Card>

              {/* AI Readiness */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div className="lh-feature-icon">
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">AI Readiness</h3>
                  <p className="lh-text-description">
                    Optimize your site structure and content for AI crawlers and
                    modern search engines.
                  </p>
                </CardContent>
              </Card>

              {/* Analytics & Insights */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div className="lh-feature-icon">
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">Smart Analytics</h3>
                  <p className="lh-text-description">
                    Get detailed insights into search behavior and AI-generated
                    recommendations for improvement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="lh-cta-section">
          <div className="lh-cta-container">
            <h2 className="lh-cta-title">
              <span className="block">Ready to get started?</span>
              <span className="lh-cta-subtitle">
                Join thousands of developers today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="px-8 py-3">
                    Get started for free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            {/* Add social links here if needed */}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base lh-text-muted">
              &copy; 2024 Lighthouse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
