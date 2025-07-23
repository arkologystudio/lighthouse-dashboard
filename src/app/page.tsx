import React from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

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

const HomePage: React.FC = () => (
  <div
    className="min-h-screen overflow-x-hidden"
    style={{ backgroundColor: 'var(--color-bg-main)' }}
  >
    {/* Navigation */}
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5"
      style={{ backgroundColor: 'var(--color-bg-main)aa' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  boxShadow: '0 4px 20px rgba(246, 173, 138, 0.3)',
                }}
              >
                <span className="font-bold text-white text-base">L</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Lighthouse
            </span>
          </div>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 border-0 text-white font-medium px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-orange-400/5 via-pink-400/5 to-purple-400/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="space-y-12">
          {/* Pre-title */}
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-400/20 bg-orange-400/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-orange-400">
              Welcome to the Future of Web
            </span>
          </div>

          {/* Main title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              <span className="block text-white">Lighthouse</span>
              <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Studios
              </span>
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p
            className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed font-light"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            The ultimate{' '}
            <span className="font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              AI-powered portal
            </span>{' '}
            for upgrading your WordPress sites. Plugins & insights to optimize
            agent discoverability in the age of{' '}
            <span className="font-semibold text-white">Web 4.0</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white border-0 px-8 py-4 text-lg font-medium rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-400/25"
              >
                Get Started Free
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-medium rounded-xl border-2 border-white/20 text-white hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
              >
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="pt-16 opacity-60">
            <p className="text-sm font-medium text-white/60 mb-4">
              Trusted by modern web builders
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/40 rounded-full mt-2"></div>
        </div>
      </div>
    </section>

    {/* Why Lighthouse Section */}
    <section
      id="features"
      className="relative py-32"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-400/20 bg-orange-400/5 backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-orange-400">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Why Choose Lighthouse?
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Three powerful pillars that transform your WordPress sites into Web
            4.0-ready, AI-discoverable platforms
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* AI WordPress Plugins */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-pink-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-slate-900/90 transition-all duration-500 group-hover:scale-105">
              <div className="relative">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br from-orange-400/20 to-pink-400/20 border border-orange-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-10 h-10 text-orange-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-orange-400 transition-colors duration-300">
                  AI WordPress Plugins Made Simple
                </h3>
                <p className="text-white/70 leading-relaxed text-lg mb-6">
                  Install, configure, and update our latest AI-driven WordPress
                  plugins in seconds. Make your websites AI ready without
                  writing a single line of code.
                </p>

                {/* Feature list */}
                <ul className="space-y-3">
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    One-click installation
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Auto-configuration
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                    Seamless updates
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Agent Discoverability */}
          <div className="group relative lg:mt-12">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-slate-900/90 transition-all duration-500 group-hover:scale-105">
              <div className="relative">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br from-blue-400/20 to-purple-400/20 border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-10 h-10 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-blue-400 transition-colors duration-300">
                  Agent Websites & Discoverability
                </h3>
                <p className="text-white/70 leading-relaxed text-lg mb-6">
                  Stand out in a crowded market. Our built-in agent registry
                  ensures your AI assistants, bots, and agent-based services are
                  indexed and discoverable.
                </p>

                {/* Feature list */}
                <ul className="space-y-3">
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Global agent registry
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Partner network access
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    Smart indexing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Web 4.0 Ready */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-slate-900/90 transition-all duration-500 group-hover:scale-105">
              <div className="relative">
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 bg-gradient-to-br from-green-400/20 to-emerald-400/20 border border-green-400/30 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-green-400 transition-colors duration-300">
                  Next-Gen Web 4.0 Ready
                </h3>
                <p className="text-white/70 leading-relaxed text-lg mb-6">
                  Embrace the semantic web. Lighthouse Dashboard leverages
                  neural search and structured data to make your site compatible
                  with Web 4.0 standards.
                </p>

                {/* Feature list */}
                <ul className="space-y-3">
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Neural search integration
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    Structured data optimization
                  </li>
                  <li className="flex items-center text-white/60">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                    AI ecosystem compatibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Core Features Section */}
    <section
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-400/20 bg-purple-400/5 backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-purple-400">
              Powerful Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Core Features
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Everything you need to transform your WordPress sites into
            AI-powered, Web 4.0-ready platforms
          </p>
        </div>

        <div className="space-y-32">
          {/* Feature 1 */}
          <div className="group">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400/10 to-pink-400/10 text-orange-400 rounded-full text-sm font-medium border border-orange-400/20">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                    01 — Management
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Centralized Site{' '}
                    <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                      Management
                    </span>
                  </h3>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Transform chaos into clarity with our unified dashboard that
                    puts everything at your fingertips.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400/20 to-pink-400/20 border border-orange-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Multi-Site Dashboard
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Monitor performance, uptime, and security across all
                        your WordPress sites from a single, beautiful interface.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400/20 to-pink-400/20 border border-orange-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        One-Click Download
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Instantly access the best AI plugins for WordPress. No
                        code required. No expertise needed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-16 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                    <svg
                      className="w-40 h-40 text-orange-400 group-hover:scale-110 transition-transform duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 lg:order-1 relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-16 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                    <svg
                      className="w-40 h-40 text-blue-400 group-hover:scale-110 transition-transform duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 lg:order-2 space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-400/10 to-purple-400/10 text-blue-400 rounded-full text-sm font-medium border border-blue-400/20">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    02 — Marketplace
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    AI Plugin{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Marketplace
                    </span>
                  </h3>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Discover, install, and manage cutting-edge AI plugins
                    designed for the future of web.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Curated Selection
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Browse our top AI plugins — Discoverability, Human &
                        Agent Search, and more cutting-edge tools.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-400/20 to-purple-400/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Seamless Integration
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Auto-install and auto-configure plugins optimized for
                        semantic search and neural indexing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-400/10 to-emerald-400/10 text-green-400 rounded-full text-sm font-medium border border-green-400/20">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    03 — AI Readiness
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Agent Discoverability{' '}
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      Suite
                    </span>
                  </h3>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Prepare your site for the AI-driven future with
                    comprehensive diagnostics and optimization tools.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        AI Readiness Diagnostics
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Run comprehensive diagnostics and understand exactly how
                        ready your site is for the era of AI agents.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        Future-Proof Your Site
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        AI agents are becoming the new browsers. Optimize for AI
                        discoverability and drive increased traffic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-16 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                    <svg
                      className="w-40 h-40 text-green-400 group-hover:scale-110 transition-transform duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="group">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-5 lg:order-1 relative">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-16 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                    <svg
                      className="w-40 h-40 text-purple-400 group-hover:scale-110 transition-transform duration-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 lg:order-2 space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-400/10 to-pink-400/10 text-purple-400 rounded-full text-sm font-medium border border-purple-400/20">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    04 — Neural Search
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                    Advanced Neural & Semantic{' '}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Search
                    </span>
                  </h3>
                  <p className="text-xl text-white/70 leading-relaxed">
                    Revolutionary search technology that understands context,
                    meaning, and intent like never before.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        On-Site Neural Search
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Give your users the power of vector-based search for
                        faster, more relevant results that understand context.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-purple-400/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">
                        AI Discoverability
                      </h4>
                      <p className="text-white/60 leading-relaxed">
                        Configure easy interfaces to enable AIs to search your
                        content in machine-readable format.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* How It Works Section */}
    <section
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-secondary)' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-conic from-orange-400/3 via-pink-400/3 to-purple-400/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-pink-400/20 bg-pink-400/5 backdrop-blur-sm mb-6">
            <span className="text-sm font-medium text-pink-400">
              Simple Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Get your WordPress sites AI-ready in five simple steps
          </p>
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
                  className={`w-16 h-16 rounded-2xl mx-auto bg-gradient-to-r ${item.color} flex items-center justify-center relative z-10 shadow-lg`}
                >
                  <span className="text-white font-bold text-lg">
                    {item.step}
                  </span>
                </div>
                {index < 4 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px">
                    {/* Main connecting line */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/15 via-pink-400/20 to-purple-400/15"></div>
                    {/* Decorative dots */}
                    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-orange-400/30 rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-pink-400/40 rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-purple-400/30 rounded-full transform -translate-y-1/2"></div>
                    {/* Connection point to next icon */}
                    <div className="absolute top-1/2 right-4 w-2 h-2 bg-gradient-to-r from-pink-400/50 to-purple-400/50 rounded-full transform -translate-y-1/2 animate-pulse"></div>
                  </div>
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
      className="relative py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-white">Ready to Illuminate Your</span>
              <span className="block bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Web Presence?
              </span>
            </h2>
            <p className="text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Experience the future of website management today. Join thousands
              of forward-thinking developers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white border-0 px-10 py-5 text-xl font-medium rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-orange-400/25"
              >
                Get Started Free
                <span className="ml-2">→</span>
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-5 text-xl font-medium rounded-xl border-2 border-white/20 text-white hover:bg-white/5 backdrop-blur-sm transition-all duration-300"
              >
                Request a Demo
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="pt-16 border-t border-white/10">
            <p className="text-sm text-white/50 mb-6">Join the revolution</p>
            <div className="flex justify-center items-center space-x-12 text-white/30">
              <div className="text-center">
                <div className="text-3xl font-bold">10,000+</div>
                <div className="text-sm">Sites Powered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm">Support</div>
              </div>
            </div>
          </div>
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
              plugins, and billing—optimized for Web 4.0 agent discoverability.
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
              {['Features', 'Pricing', 'Documentation', 'Support'].map(item => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
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

export default HomePage;
