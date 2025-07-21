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
                <Button>Dashboard</Button>
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
              <span className="block">Lighthouse Dashboard</span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-xl lh-text-description">
              The ultimate AI-powered portal for upgrading your WordPress sites.
              Plugins & insights to optimize agent discoverability in the age of
              Web 4.0.
            </p>

            <div className="lh-hero-actions">
              <Link href="/register">
                <Button size="lg" className="px-8 py-3">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Why Lighthouse Section */}
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
            <div className="text-center mb-16">
              <h2 className="lh-title-hero text-3xl font-bold">
                Why Lighthouse?
              </h2>
            </div>

            <div className="mt-16 lh-grid-cards">
              {/* AI WordPress Plugins */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div
                    className="lh-feature-icon"
                    style={{ border: '2px solid var(--color-accent)' }}
                  >
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">
                    AI WordPress Plugins Made Simple
                  </h3>
                  <p className="lh-text-description">
                    Install, configure, and update our latest AI-driven
                    WordPress plugins in seconds. Make your websites AI ready
                    without writing a single line of code.
                  </p>
                </CardContent>
              </Card>

              {/* Agent Discoverability */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div
                    className="lh-feature-icon"
                    style={{ border: '2px solid var(--color-accent)' }}
                  >
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">
                    Agent Websites & Discoverability
                  </h3>
                  <p className="lh-text-description">
                    Stand out in a crowded market. Our built-in agent registry
                    ensures your AI assistants, bots, and agent-based services
                    are indexed and discoverable by users and partner networks.
                  </p>
                </CardContent>
              </Card>

              {/* Web 4.0 Ready */}
              <Card className="lh-feature-card">
                <CardContent>
                  <div
                    className="lh-feature-icon"
                    style={{ border: '2px solid var(--color-accent)' }}
                  >
                    <svg
                      className="lh-feature-icon-inner"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="lh-title-small mb-2">
                    Next-Gen Web 4.0 Ready
                  </h3>
                  <p className="lh-text-description">
                    Embrace the semantic web. Lighthouse Dashboard leverages
                    neural search and structured data to make your site
                    compatible with Web 4.0 standards and emerging AI
                    ecosystems.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        <div
          className="py-16"
          style={{ backgroundColor: 'var(--color-bg-main)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="lh-title-hero text-3xl font-bold">
                Core Features
              </h2>
            </div>

            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    1. Centralized Site Management
                  </h3>
                  <ul className="space-y-2 lh-text-description">
                    <li>
                      <strong>Multi-Site Dashboard:</strong> Monitor
                      performance, uptime, and security across all your
                      WordPress sites.
                    </li>
                    <li>
                      <strong>One-Click Deployment:</strong> Spin up new
                      WordPress instances pre-configured with industry-leading
                      AI plugins.
                    </li>
                  </ul>
                </div>
                <div
                  className="lh-feature-icon"
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {/* Feature 2 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    2. AI Plugin Marketplace
                  </h3>
                  <ul className="space-y-2 lh-text-description">
                    <li>
                      <strong>Curated Selection:</strong> Browse top AI
                      plugins—content AI, SEO AI, personalization engines, and
                      more.
                    </li>
                    <li>
                      <strong>Seamless Integration:</strong> Auto-install and
                      auto-configure plugins optimized for semantic search and
                      neural indexing.
                    </li>
                  </ul>
                </div>
                <div
                  className="lh-feature-icon md:order-1"
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {/* Feature 3 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    3. Agent Discoverability Suite
                  </h3>
                  <ul className="space-y-2 lh-text-description">
                    <li>
                      <strong>AI Readiness Diagnostics:</strong> Run diagnostics
                      and understand how ready your site is for the era of AI.
                    </li>
                    <li>
                      <strong>AI Readiness Core:</strong> AI agents are becoming
                      the new browsers and web surfers. As AI agents become
                      increasingly autonomous they'll begin to make up the vast
                      majority of website traffic, browsing and even purchasing
                      products online. Already today, chatbots like ChatGPT,
                      Claude, and Perplexity increasingly access web content. AI
                      Ready is a suite of tools for optimizing your website for
                      AI discoverability and comprehension, ultimately leading
                      to increased traffic and conversions.
                    </li>
                  </ul>
                </div>
                <div
                  className="lh-feature-icon"
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {/* Feature 4 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="md:order-2">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    4. Advanced Neural & Semantic Search
                  </h3>
                  <ul className="space-y-2 lh-text-description">
                    <li>
                      <strong>On-Site Neural Search:</strong> Give your users
                      the power of vector-based search for faster, more relevant
                      results.
                    </li>
                    <li>
                      <strong>Semantic Indexing:</strong> Use natural language
                      understanding to tag and categorize content, boosting SEO
                      for keywords like "AI WordPress plugins," "agent
                      websites," and "neural search."
                    </li>
                  </ul>
                </div>
                <div
                  className="lh-feature-icon md:order-1"
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              {/* Feature 5 */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    5. Billing & Subscription Control
                  </h3>
                  <ul className="space-y-2 lh-text-description">
                    <li>
                      <strong>Flexible Plans:</strong> Pay-as-you-grow pricing
                      to suit blogs, agencies, and enterprises.
                    </li>
                    <li>
                      <strong>Automated Invoicing:</strong> Generate and send
                      invoices automatically; track payments in real time.
                    </li>
                  </ul>
                </div>
                <div
                  className="lh-feature-icon"
                  style={{
                    width: '200px',
                    height: '200px',
                    margin: '0 auto',
                  }}
                >
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

        {/* How It Works Section */}
        <div
          className="py-16"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="lh-title-hero text-3xl font-bold">How It Works</h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                {
                  step: '1',
                  title: 'Sign Up & Connect',
                  description:
                    'Create your Lighthouse account and link your WordPress sites via our secure API.',
                },
                {
                  step: '2',
                  title: 'Explore the AI Plugin Library',
                  description:
                    'Install AI plugins optimized for Web 4.0 with a single click.',
                },
                {
                  step: '3',
                  title: 'Make your website AI Ready',
                  description:
                    'Run diagnostics and understand how ready your site is for the era of AI, and get immidiate steps to make this happen.',
                },
                {
                  step: '4',
                  title: 'Optimize & Scale',
                  description:
                    'Leverage neural and semantic search tools to improve on-site engagement and SEO rankings, and enable AI agents to find and use your content.',
                },
                {
                  step: '5',
                  title: 'Manage Billing',
                  description:
                    'View usage reports, upgrade plans, and handle invoices—all from one sleek interface.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 lh-title-small">
                    {item.title}
                  </h3>
                  <p className="lh-text-description text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO & Best Practices Section */}
        <div
          className="py-16"
          style={{ backgroundColor: 'var(--color-bg-main)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="lh-title-hero text-3xl font-bold">
                SEO & Discoverability Best Practices
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Keyword Integration',
                  description:
                    'Content is optimized for "AI WordPress plugins," "AI websites," "Web 4.0," "semantic search," and "neural search."',
                },
                {
                  title: 'Structured Data',
                  description:
                    'Automatic generation of Schema.org markup for AI Agents (SoftwareApplication, Chatbot, FAQPage).',
                },
                {
                  title: 'Performance Optimization',
                  description:
                    'Lazy-loading, CDN integration, and caching for lightning-fast page loads—crucial for SEO.',
                },
                {
                  title: 'Mobile-First Design',
                  description:
                    "Fully responsive dashboard and public pages for optimal rankings on Google's mobile-first index.",
                },
              ].map((item, index) => (
                <Card key={index} className="lh-feature-card">
                  <CardContent>
                    <h3 className="lh-title-small mb-2">{item.title}</h3>
                    <p className="lh-text-description">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div
          className="py-16"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="lh-title-hero text-3xl font-bold">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What is Web 4.0?',
                  answer:
                    'Web 4.0 refers to the next evolution of the internet, centered on semantic understanding, AI-powered personalization, and decentralized architectures. Lighthouse Dashboard equips you with the tools to thrive in this new era.',
                },
                {
                  question: 'Can I control which AI crawlers access my site?',
                  answer:
                    'Yes—the AI Readiness plugin’s Access Control lets you allow or block any crawler without touching server configs.',
                },
                {
                  question: 'Is neural search better than keyword search?',
                  answer:
                    "Yes—neural (vector-based) search understands context and semantics, delivering more accurate results even if the user's query doesn't match exact keywords. Lighthouse integrates both to cover all bases.",
                },
                {
                  question:
                    'Will search indexes update when I add new content?',
                  answer:
                    'Absolutely — our AI Search plugins auto-reindex on publish or update.',
                },
              ].map((faq, index) => (
                <Card key={index} className="lh-feature-card">
                  <CardContent>
                    <h3 className="lh-title-small mb-2 font-semibold">
                      Q: {faq.question}
                    </h3>
                    <p className="lh-text-description">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="lh-cta-section">
          <div className="lh-cta-container">
            <h2 className="lh-cta-title">
              <span className="block">
                Ready to Illuminate Your Web Presence?
              </span>
              <span className="lh-cta-subtitle">
                Experience the future of website management today.
              </span>
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="px-8 py-3">
                    Get Started Free
                  </Button>
                </Link>
              </div>
              <div className="inline-flex rounded-md shadow">
                <Link href="#pricing" id="pricing">
                  <Button size="lg" variant="outline" className="px-8 py-3">
                    View Pricing
                  </Button>
                </Link>
              </div>
              <div className="inline-flex rounded-md shadow">
                <Link href="/contact">
                  <Button size="lg" variant="ghost" className="px-8 py-3">
                    Request a Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--color-bg-card)' }}>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="lh-flex-icon-text mb-4">
                <div className="lh-icon-circle-primary">
                  <span className="font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-semibold lh-title-section">
                  Lighthouse Dashboard
                </span>
              </div>
              <p className="lh-text-description mb-4">
                The ultimate AI-powered portal for managing WordPress sites,
                plugins, and billing—optimized for Web 4.0 agent
                discoverability.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/privacy"
                  className="lh-text-muted hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="lh-text-muted hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold lh-title-small mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold lh-title-small mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/case-studies"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api-docs"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    API Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="lh-text-muted hover:text-primary transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                {/* Social links can be added here */}
              </div>
              <div className="mt-8 md:mt-0 md:order-1">
                <p className="text-center text-base lh-text-muted">
                  &copy; 2025 Lighthouse Studios. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
