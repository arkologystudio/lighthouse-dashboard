import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const metadata = {
  title:
    'Lighthouse Dashboard | AI WordPress Plugins & Web 4.0 Agent Discoverability',
  description:
    'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing WordPress sites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
  keywords:
    'AI WordPress plugins, AI website builder, Agent discoverability, Web 4.0 dashboard, Neural search integration, Semantic search tools, AI site management, Plugin marketplace, AI billing portal',
  openGraph: {
    title:
      'Lighthouse Dashboard | AI WordPress Plugins & Web 4.0 Agent Discoverability',
    description:
      'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing WordPress sites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Lighthouse Dashboard | AI WordPress Plugins & Web 4.0 Agent Discoverability',
    description:
      'Discover Lighthouse Dashboard—your all-in-one AI-powered portal for managing WordPress sites, installing AI website plugins, billing, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
  },
};

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      {/* Navigation */}
      <nav
        className="relative z-50 backdrop-blur-xl border-b"
        style={{
          backgroundColor: 'var(--color-bg-card)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <span className="font-bold text-white text-lg">L</span>
              </div>
              <span
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Lighthouse
              </span>
            </div>

            <Link href="/login">
              <Button
                className="border-0 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                }}
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h1
              className="text-5xl md:text-7xl font-bold leading-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <span style={{ color: 'var(--color-accent)' }}>
                Lighthouse Studios
              </span>
            </h1>

            <p
              className="text-xl max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              The ultimate AI-powered portal for upgrading your WordPress sites.
              Plugins & insights to optimize agent discoverability in the age of
              Web 4.0.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-white border-0 transition-all duration-300 px-8 py-4 text-lg"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg transition-all duration-300"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Lighthouse Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Why Choose Lighthouse?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI WordPress Plugins */}
            <div className="group relative">
              <div className="relative bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 hover:bg-slate-800/60 transition-all duration-300">
                <div>
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      backgroundColor: 'rgba(246, 173, 138, 0.15)',
                      border: '1px solid rgba(246, 173, 138, 0.3)',
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#f6ad8a', strokeWidth: 2.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    AI WordPress Plugins Made Simple
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Install, configure, and update our latest AI-driven
                    WordPress plugins in seconds. Make your websites AI ready
                    without writing a single line of code.
                  </p>
                </div>
              </div>
            </div>

            {/* Agent Discoverability */}
            <div className="group relative">
              <div className="relative bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 hover:bg-slate-800/60 transition-all duration-300">
                <div>
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      backgroundColor: 'rgba(246, 173, 138, 0.15)',
                      border: '1px solid rgba(246, 173, 138, 0.3)',
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#f6ad8a', strokeWidth: 2.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Agent Websites & Discoverability
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Stand out in a crowded market. Our built-in agent registry
                    ensures your AI assistants, bots, and agent-based services
                    are indexed and discoverable by users and partner networks.
                  </p>
                </div>
              </div>
            </div>

            {/* Web 4.0 Ready */}
            <div className="group relative">
              <div className="relative bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 hover:bg-slate-800/60 transition-all duration-300">
                <div>
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      backgroundColor: 'rgba(249, 196, 168, 0.15)',
                      border: '1px solid rgba(249, 196, 168, 0.3)',
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: '#f9c4a8', strokeWidth: 2.5 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Next-Gen Web 4.0 Ready
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Embrace the semantic web. Lighthouse Dashboard leverages
                    neural search and structured data to make your site
                    compatible with Web 4.0 standards and emerging AI
                    ecosystems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-bg-main)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Core Features
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-24">
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-orange-400/10 text-orange-400 rounded-full text-sm font-medium border border-orange-400/20">
                  01 — Management
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Centralized Site Management
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Multi-Site Dashboard:
                      </strong>{' '}
                      Monitor performance, uptime, and security across all your
                      WordPress sites.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        One-Click Download:
                      </strong>{' '}
                      Instantly access the best AI plugins for WordPress. No
                      code. No expertise.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-12 flex items-center justify-center hover:bg-slate-800/60 transition-all duration-300">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#f6ad8a', strokeWidth: 2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-400/10 text-blue-400 rounded-full text-sm font-medium border border-blue-400/20">
                  02 — Marketplace
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  AI Plugin Marketplace
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Curated Selection:
                      </strong>{' '}
                      Browse our top AI plugins — Discoverability, Human & Agent
                      Search, and more.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Seamless Integration:
                      </strong>{' '}
                      Auto-install and auto-configure plugins optimized for
                      semantic search and neural indexing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:order-1 relative">
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-blue-400/20 rounded-3xl p-12 flex items-center justify-center hover:bg-slate-800/60 transition-all duration-300">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#60a5fa', strokeWidth: 2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-green-400/10 text-green-400 rounded-full text-sm font-medium border border-green-400/20">
                  03 — AI Readiness
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Agent Discoverability Suite
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        AI Readiness Diagnostics:
                      </strong>{' '}
                      Run diagnostics and understand how ready your site is for
                      the era of AI.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Future-Proof Your Site:
                      </strong>{' '}
                      AI agents are becoming the new browsers. Optimize your
                      website for AI discoverability and comprehension, leading
                      to increased traffic and conversions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-green-400/20 rounded-3xl p-12 flex items-center justify-center hover:bg-slate-800/60 transition-all duration-300">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#4ade80', strokeWidth: 2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2 space-y-6">
                <div className="inline-block px-4 py-2 bg-purple-400/10 text-purple-400 rounded-full text-sm font-medium border border-purple-400/20">
                  04 — Neural Search
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Advanced Neural & Semantic Search
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        On-Site Neural Search:
                      </strong>{' '}
                      Give your users the power of vector-based search for
                      faster, more relevant results.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Semantic Indexing:
                      </strong>{' '}
                      Use natural language understanding to tag and categorize
                      content, boosting SEO for AI discovery.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:order-1 relative">
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-3xl p-12 flex items-center justify-center hover:bg-slate-800/60 transition-all duration-300">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#a855f7', strokeWidth: 2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-orange-400/10 text-orange-400 rounded-full text-sm font-medium border border-orange-400/20">
                  05 — Billing
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Billing & Subscription Control
                </h3>
                <div
                  className="space-y-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Flexible Plans:
                      </strong>{' '}
                      Pay-as-you-grow pricing to suit blogs, agencies, and
                      enterprises.
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    ></div>
                    <p>
                      <strong style={{ color: 'var(--color-text-primary)' }}>
                        Automated Invoicing:
                      </strong>{' '}
                      Generate and send invoices automatically; track payments
                      in real time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative bg-slate-800/40 backdrop-blur-xl border border-orange-400/20 rounded-3xl p-12 flex items-center justify-center hover:bg-slate-800/60 transition-all duration-300">
                  <svg
                    className="w-32 h-32"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#f6ad8a', strokeWidth: 2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Connect',
                description:
                  'Create your Lighthouse account and link your WordPress sites via our secure API.',
                color: 'from-orange-400 to-red-400',
              },
              {
                step: '02',
                title: 'Explore AI Plugins',
                description:
                  'Install AI plugins optimized for Web 4.0 with a single click.',
                color: 'from-blue-400 to-cyan-400',
              },
              {
                step: '03',
                title: 'AI Readiness Check',
                description:
                  'Run diagnostics and get immediate steps to make your site AI-ready.',
                color: 'from-green-400 to-emerald-400',
              },
              {
                step: '04',
                title: 'Optimize & Scale',
                description:
                  'Leverage neural search tools to improve engagement and enable AI discovery.',
                color: 'from-purple-400 to-violet-400',
              },
              {
                step: '05',
                title: 'Manage Billing',
                description:
                  'View usage reports, upgrade plans, and handle invoices from one interface.',
                color: 'from-pink-400 to-rose-400',
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto bg-gradient-to-r ${item.color} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">
                      {item.step}
                    </span>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-16 w-full h-0.5 bg-gradient-to-r from-white/20 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'What is Web 4.0?',
                answer:
                  'Web 4.0 refers to the next evolution of the internet, centered on semantic understanding, AI-powered personalization, and decentralized architectures. Lighthouse Dashboard equips you with the tools to thrive in this new era.',
              },
              {
                question: 'Can I control which AI crawlers access my site?',
                answer:
                  "Yes—the AI Readiness plugin's Access Control lets you allow or block any crawler without touching server configs.",
              },
              {
                question: 'Is neural search better than keyword search?',
                answer:
                  "Yes—neural (vector-based) search understands context and semantics, delivering more accurate results even if the user's query doesn't match exact keywords. Lighthouse integrates both to cover all bases.",
              },
              {
                question: 'Will search indexes update when I add new content?',
                answer:
                  'Absolutely — our AI Search plugins auto-reindex on publish or update.',
              },
              {
                question: 'Who will be able to use the AI Search plugins?',
                answer:
                  'Who and What. Our search plugins can be used by humans, and importantly, AI agents that search the web. Your site can now be accessed by AI agents, and your content can be discovered by them.',
              },
            ].map((faq, index) => (
              <div key={index} className="group">
                <div className="bg-slate-800/40 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-8 hover:bg-slate-800/60 transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg-secondary)' }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Ready to Illuminate Your
            <span style={{ color: 'var(--color-accent)' }} className="block">
              Web Presence?
            </span>
          </h2>
          <p
            className="text-xl mb-12 max-w-2xl mx-auto"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Experience the future of website management today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="text-white border-0 transition-all duration-300 px-8 py-4 text-lg"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#pricing" id="pricing">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg transition-all duration-300"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                View Pricing
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="ghost"
                className="px-8 py-4 text-lg transition-all duration-300"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative border-t backdrop-blur-xl"
        style={{
          borderColor: 'var(--color-border)',
          backgroundColor: 'var(--color-bg-card)',
        }}
      >
        <div className="max-w-7xl mx-auto py-16 px-6">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  <span className="font-bold text-white text-lg">L</span>
                </div>
                <span
                  className="text-xl font-semibold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Lighthouse Dashboard
                </span>
              </div>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                The ultimate AI-powered portal for managing WordPress sites,
                plugins, and billing—optimized for Web 4.0 agent
                discoverability.
              </p>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="font-semibold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                {['Features', 'Pricing', 'Documentation', 'Support'].map(
                  item => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3
                className="font-semibold mb-6"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Resources
              </h3>
              <ul className="space-y-3">
                {['Blog', 'Case Studies', 'API Documentation', 'Community'].map(
                  item => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase().replace(' ', '-')}`}
                        className="transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div
            className="mt-12 pt-8 border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="text-center">
              <p style={{ color: 'var(--color-text-muted)' }}>
                &copy; 2025 Lighthouse Studios. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
