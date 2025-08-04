import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '../components/ui/Button';
import { TypewriterText } from '../components/TypewriterText';
import DiagnosticsSection from '../components/diagnostics/DiagnosticsSection';
import {
  StructuredData,
  organizationSchema,
  websiteSchema,
  softwareApplicationSchema,
  createFAQSchema,
} from '../components/StructuredData';

export const metadata = {
  title: 'Home',
  description:
    'Navigate the AI-powered web with Lighthouse Studios. Discover AI website plugins, agent discoverability tools, and neural search solutions for Web 4.0.',
  keywords:
    'AI website plugins, Web 4.0, agent discoverability, neural search, semantic search, AI navigation tools, Lighthouse Studios',
  alternates: {
    canonical: 'https://lighthousestudios.xyz',
  },
  openGraph: {
    title: 'Lighthouse Studios | Navigate the AI-Powered Web',
    description:
      'Navigate the AI-powered web with Lighthouse Studios. Discover AI website plugins, agent discoverability tools, and neural search solutions for Web 4.0.',
    type: 'website',
    url: 'https://lighthousestudios.xyz',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Lighthouse Studios - Navigate the AI-Powered Web',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lighthouse Studios | Navigate the AI-Powered Web',
    description:
      'Navigate the AI-powered web with Lighthouse Studios. Discover AI website plugins, agent discoverability tools, and neural search solutions for Web 4.0.',
    images: ['/og-home.png'],
  },
  other: {
    'theme-color': '#1e293b',
    'color-scheme': 'dark',
  },
};

const HomePage: React.FC = () => {
  // FAQ data for structured schema
  const faqData = [
    {
      question: 'What defines Web 4.0 architecture?',
      answer:
        'Web 4.0 represents the semantic, AI-driven internet layer built on intelligent agents, contextual understanding, and decentralized data structures. Lighthouse provides the infrastructure tools necessary for site compatibility with these emerging protocols.',
    },
    {
      question: 'How does agent access control function?',
      answer:
        'The AI Readiness module includes granular access control for automated agents. Configure which crawlers, indexers, and AI systems can access your content without modifying server configurations or .htaccess files.',
    },
    {
      question:
        'What advantages does neural search provide over keyword matching?',
      answer:
        'Neural search operates on vector embeddings, enabling semantic understanding rather than literal string matching. This allows contextual queries to return relevant results even when exact keywords are absent, improving both human and agent navigation efficiency.',
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: 'var(--color-bg-main)' }}
    >
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <StructuredData data={softwareApplicationSchema} />
      <StructuredData data={createFAQSchema(faqData)} />
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          borderColor: 'var(--color-maritime-border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                {/* Lighthouse icon - geometric, architectural */}
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L8 8H16L12 2Z"
                      fill="var(--color-beacon-light)"
                    />
                    <rect
                      x="10"
                      y="8"
                      width="4"
                      height="12"
                      fill="var(--color-lighthouse-beam)"
                      fillOpacity="0.9"
                    />
                    <rect
                      x="8"
                      y="20"
                      width="8"
                      height="2"
                      fill="var(--color-lighthouse-structure)"
                    />
                    <circle
                      cx="12"
                      cy="5"
                      r="1"
                      fill="var(--color-navigation-blue)"
                    />
                  </svg>
                </div>
              </div>
              <span
                className="text-lg font-medium tracking-wide"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Lighthouse
              </span>
            </div>

            <Link href="/login">
              <Button
                className="border font-medium px-5 py-2 rounded-md transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--color-navigation-blue)',
                  borderColor: 'var(--color-navigation-blue)',
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
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
        style={{ backgroundColor: 'var(--color-ocean-deep)' }}
      >
        {/* Lighthouse beam effect - subtle, purposeful */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary lighthouse beam - focused cone of light */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96">
            <div className="w-full h-full bg-gradient-radial from-white/3 via-blue-400/2 to-transparent rounded-full"></div>
          </div>
          {/* Secondary depth layers */}
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-400/1 to-transparent rounded-full"></div>
          {/* Subtle horizon line effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent"></div>
        </div>

        {/* Technical lighthouse sketch - positioned behind content */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[700px] h-[700px] opacity-15 pointer-events-none hidden lg:block">
          <Image
            src="/lighthouse_sketch.png"
            alt="Lighthouse Technical Sketch - Navigation Infrastructure Diagram"
            width={700}
            height={700}
            className="w-full h-full object-contain"
            priority={false}
            loading="lazy"
            sizes="(max-width: 1024px) 0px, 700px"
            quality={75}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="space-y-16">
            {/* Technical badge */}
            <div
              className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase"
              style={{
                borderColor: 'var(--color-maritime-border)',
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                color: 'var(--color-beacon-light)',
              }}
            >
              <span className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></span>
              <TypewriterText text="Navigation System Active" speed={40} />
            </div>

            {/* Main title - clean, architectural */}
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-light leading-[1.1] tracking-tight">
                <span
                  className="block font-thin"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Lighthouse
                </span>
                <span
                  className="block font-normal"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Studios
                </span>
              </h1>

              {/* Clean separator line */}
              <div
                className="w-16 h-px mx-auto"
                style={{ backgroundColor: 'var(--color-beacon-light)' }}
              ></div>
            </div>

            {/* Purposeful subtitle */}
            <div className="max-w-3xl mx-auto space-y-6">
              <p
                className="text-xl md:text-2xl leading-relaxed font-light"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Navigation tools for the AI-powered web.{' '}
                <span style={{ color: 'var(--color-lighthouse-beam)' }}>
                  Enable discovery, optimize visibility, guide intelligent
                  agents
                </span>{' '}
                to your websites with precision.
              </p>

              <p
                className="text-sm font-mono tracking-wide opacity-75"
                style={{ color: 'var(--color-beacon-light)' }}
              >
                WEB 4.0 • AGENT DISCOVERABILITY • NEURAL SEARCH
              </p>
            </div>

            {/* Clean, purposeful CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="font-medium px-8 py-3 text-lg rounded transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-navigation-blue)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Begin Navigation
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-medium rounded transition-all duration-200"
                  style={{
                    borderColor: 'var(--color-maritime-border)',
                    color: 'var(--color-lighthouse-beam)',
                    backgroundColor: 'transparent',
                  }}
                >
                  Explore Systems
                </Button>
              </Link>
            </div>

            {/* Technical indicators */}
            <div className="pt-20 opacity-60">
              <div
                className="flex justify-center items-center space-x-8 text-xs font-mono uppercase tracking-wider"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'var(--color-navigation-green)' }}
                  ></div>
                  <span>10K+ Sites</span>
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
                  <span>AI Ready</span>
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
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Readiness Diagnostics Section */}
      <DiagnosticsSection />

      {/* Core Systems Section */}
      <section
        id="features"
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-ocean-deep)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase mb-8"
              style={{
                borderColor: 'var(--color-maritime-border)',
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                color: 'var(--color-beacon-light)',
              }}
            >
              <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
              Core Navigation Systems
            </div>
            <h2
              className="text-4xl md:text-5xl font-light leading-tight mb-6"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Precision Tools for{' '}
              <span style={{ color: 'var(--color-beacon-light)' }}>
                Web Discovery
              </span>
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Three integrated systems that make your websites visible
              and navigable to intelligent agents across the evolving web
              infrastructure.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plugin Management System */}
            <div className="group relative h-full">
              <div
                className="border rounded-lg p-8 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--color-lighthouse-structure)',
                  borderColor: 'var(--color-maritime-border)',
                }}
              >
                {/* System indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="text-xs font-mono tracking-wider uppercase"
                    style={{ color: 'var(--color-beacon-light)' }}
                  >
                    01 • Plugin Management
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-navigation-green)' }}
                  ></div>
                </div>

                {/* Icon - geometric, purposeful */}
                <div
                  className="w-12 h-12 mb-6 flex items-center justify-center rounded"
                  style={{ backgroundColor: 'rgba(96, 165, 250, 0.2)' }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: 'var(--color-beacon-light)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>

                <h3
                  className="text-xl font-medium mb-4 leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  AI Plugin Infrastructure
                </h3>

                <p
                  className="leading-relaxed mb-6 text-sm flex-grow"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Automated deployment and configuration of AI-ready website
                  plugins. Transform existing sites into agent-discoverable
                  platforms without technical overhead.
                </p>

                {/* Technical specs */}
                <div
                  className="space-y-2 text-xs font-mono mt-auto"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <div className="flex justify-between">
                    <span>Deployment</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Automated
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Configuration</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Zero-touch
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Updates</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Continuous
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Discovery Registry */}
            <div className="group relative h-full">
              <div
                className="border rounded-lg p-8 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--color-lighthouse-structure)',
                  borderColor: 'var(--color-maritime-border)',
                }}
              >
                {/* System indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="text-xs font-mono tracking-wider uppercase"
                    style={{ color: 'var(--color-beacon-light)' }}
                  >
                    02 • Discovery Registry
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-navigation-green)' }}
                  ></div>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 mb-6 flex items-center justify-center rounded"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: 'var(--color-navigation-green)' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>

                <h3
                  className="text-xl font-medium mb-4 leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Agent Discovery Network
                </h3>

                <p
                  className="leading-relaxed mb-6 text-sm flex-grow"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Distributed registry system that indexes your AI services,
                  making them discoverable to intelligent agents and partner
                  networks across the web.
                </p>

                {/* Technical specs */}
                <div
                  className="space-y-2 text-xs font-mono mt-auto"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <div className="flex justify-between">
                    <span>Network</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Global
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Indexing</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Real-time
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Neural Search Engine */}
            <div className="group relative h-full">
              <div
                className="border rounded-lg p-8 transition-all duration-200 hover:shadow-lg h-full flex flex-col"
                style={{
                  backgroundColor: 'var(--color-lighthouse-structure)',
                  borderColor: 'var(--color-maritime-border)',
                }}
              >
                {/* System indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="text-xs font-mono tracking-wider uppercase"
                    style={{ color: 'var(--color-beacon-light)' }}
                  >
                    03 • Neural Search
                  </div>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-navigation-green)' }}
                  ></div>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 mb-6 flex items-center justify-center rounded"
                  style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)' }}
                >
                  <svg
                    className="w-6 h-6"
                    style={{ color: 'var(--color-beacon-light)' }}
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

                <h3
                  className="text-xl font-medium mb-4 leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Semantic Search Interface
                </h3>

                <p
                  className="leading-relaxed mb-6 text-sm flex-grow"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Advanced neural search infrastructure that enables contextual,
                  semantic content discovery for both human users and AI agents
                  navigating your site.
                </p>

                {/* Technical specs */}
                <div
                  className="space-y-2 text-xs font-mono mt-auto"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <div className="flex justify-between">
                    <span>Algorithm</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Vector-based
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Context</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Semantic
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interface</span>
                    <span style={{ color: 'var(--color-navigation-green)' }}>
                      Universal
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Implementation Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-ocean-deep)' }}
      >
        {/* Subtle technical grid background */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(var(--color-maritime-border) 1px, transparent 1px),
                                linear-gradient(90deg, var(--color-maritime-border) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase mb-8"
              style={{
                borderColor: 'var(--color-maritime-border)',
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                color: 'var(--color-beacon-light)',
              }}
            >
              <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
              Technical Implementation
            </div>
            <h2
              className="text-4xl md:text-5xl font-light leading-tight mb-6"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Comprehensive Navigation{' '}
              <span style={{ color: 'var(--color-beacon-light)' }}>
                Infrastructure
              </span>
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Lighthouse Studios packages a comprehensive suite of tools to
              transform your websites into navigable waypoints in the
              evolving AI-powered web ecosystem.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Module 1: Site Management */}
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: 'var(--color-navigation-blue)' }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="text-xs font-mono tracking-wider uppercase px-2 py-1 rounded border"
                    style={{
                      borderColor: 'var(--color-navigation-blue)',
                      backgroundColor: 'rgba(37, 99, 235, 0.1)',
                      color: 'var(--color-navigation-blue)',
                    }}
                  >
                    Module 01
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: 'var(--color-maritime-border)' }}
                  ></div>
                </div>

                <h3
                  className="text-2xl font-medium leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Centralized Site Management Console
                </h3>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Unified command center for monitoring and controlling multiple
                  website installations. Real-time diagnostics, performance
                  metrics, and automated maintenance protocols.
                </p>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Multi-Site Coordination
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Real-time performance monitoring</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Centralized security protocols</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Automated backup systems</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Plugin Deployment
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>One-click AI plugin installation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Automated configuration setup</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Continuous update management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2: Plugin Marketplace */}
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: 'var(--color-navigation-green)' }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="text-xs font-mono tracking-wider uppercase px-2 py-1 rounded border"
                    style={{
                      borderColor: 'var(--color-navigation-green)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--color-navigation-green)',
                    }}
                  >
                    Module 02
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: 'var(--color-maritime-border)' }}
                  ></div>
                </div>

                <h3
                  className="text-2xl font-medium leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  AI Plugin Distribution Network
                </h3>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Curated collection of specialized AI plugins engineered for
                  Web 4.0 compatibility. Each plugin is tested, optimized, and
                  configured for seamless agent integration.
                </p>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Curated Selection
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Agent Discoverability plugins</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Neural search interfaces</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Semantic content processors</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Integration Protocol
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Automated dependency resolution</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Configuration-free deployment</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Version compatibility checking</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3: Neural Search */}
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: 'var(--color-beacon-light)' }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="text-xs font-mono tracking-wider uppercase px-2 py-1 rounded border"
                    style={{
                      borderColor: 'var(--color-beacon-light)',
                      backgroundColor: 'rgba(96, 165, 250, 0.1)',
                      color: 'var(--color-beacon-light)',
                    }}
                  >
                    Module 03
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: 'var(--color-maritime-border)' }}
                  ></div>
                </div>

                <h3
                  className="text-2xl font-medium leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Semantic Search Engine
                </h3>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Vector-based search infrastructure that enables contextual
                  content discovery for both human users and AI agents
                  navigating your site.
                </p>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Search Infrastructure
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Vector-based algorithm processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Real-time content indexing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Contextual result ranking</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Agent Interface
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Structured API endpoints</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Semantic query processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Machine-readable responses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 4: Analytics */}
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: 'var(--color-signal-amber)' }}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="text-xs font-mono tracking-wider uppercase px-2 py-1 rounded border"
                    style={{
                      borderColor: 'var(--color-signal-amber)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: 'var(--color-signal-amber)',
                    }}
                  >
                    Module 04
                  </div>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: 'var(--color-maritime-border)' }}
                  ></div>
                </div>

                <h3
                  className="text-2xl font-medium leading-tight"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Navigation Analytics
                </h3>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Track agent interactions, monitor discoverability metrics, and
                  optimize navigation patterns across your site network.
                </p>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Traffic Analysis
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Agent interaction tracking</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Human user analytics</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Search pattern analysis</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4
                      className="text-sm font-mono uppercase tracking-wider"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      Performance Metrics
                    </h4>
                    <ul
                      className="space-y-2 text-sm"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Real-time reporting dashboard</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Discoverability optimization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: 'var(--color-navigation-green)',
                          }}
                        ></div>
                        <span>Network performance insights</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Protocol Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-ocean-surface)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase mb-8"
              style={{
                borderColor: 'var(--color-maritime-border)',
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                color: 'var(--color-beacon-light)',
              }}
            >
              <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
              Navigation Protocol
            </div>
            <h2
              className="text-4xl md:text-5xl font-light leading-tight mb-6"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              Deployment{' '}
              <span style={{ color: 'var(--color-beacon-light)' }}>
                Sequence
              </span>
            </h2>
            <p
              className="text-lg max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Five-phase implementation protocol for establishing your website
              sites as navigable waypoints in the AI-powered web infrastructure.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div
              className="hidden lg:block absolute top-8 left-0 w-full h-px"
              style={{ backgroundColor: 'var(--color-maritime-border)' }}
            >
              <div
                className="absolute top-1/2 left-1/4 w-1 h-1 rounded-full transform -translate-y-1/2"
                style={{ backgroundColor: 'var(--color-beacon-light)' }}
              ></div>
              <div
                className="absolute top-1/2 left-2/4 w-1 h-1 rounded-full transform -translate-y-1/2"
                style={{ backgroundColor: 'var(--color-beacon-light)' }}
              ></div>
              <div
                className="absolute top-1/2 left-3/4 w-1 h-1 rounded-full transform -translate-y-1/2"
                style={{ backgroundColor: 'var(--color-beacon-light)' }}
              ></div>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
              {[
                {
                  phase: '01',
                  title: 'System Integration',
                  description:
                    'Establish secure API connection between Lighthouse control center and your website installations.',
                  status: 'Initialize',
                },
                {
                  phase: '02',
                  title: 'Plugin Deployment',
                  description:
                    'Install and configure AI-ready plugins optimized for agent interaction and semantic indexing.',
                  status: 'Deploy',
                },
                {
                  phase: '03',
                  title: 'Readiness Diagnostic',
                  description:
                    'Run comprehensive analysis to identify optimization opportunities and compatibility issues.',
                  status: 'Analyze',
                },
                {
                  phase: '04',
                  title: 'Optimization Protocol',
                  description:
                    'Implement neural search, structured data, and agent discovery interfaces across your network.',
                  status: 'Optimize',
                },
                {
                  phase: '05',
                  title: 'Monitoring System',
                  description:
                    'Activate real-time analytics, performance tracking, and automated maintenance protocols.',
                  status: 'Monitor',
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    {/* Phase indicator */}
                    <div className="relative mb-6">
                      <div
                        className="w-16 h-16 mx-auto rounded border-2 flex items-center justify-center relative z-10"
                        style={{
                          backgroundColor: 'var(--color-ocean-surface)',
                          borderColor: 'var(--color-navigation-blue)',
                        }}
                      >
                        <span
                          className="text-lg font-mono font-medium"
                          style={{ color: 'var(--color-navigation-blue)' }}
                        >
                          {item.phase}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className="text-xs font-mono tracking-wider uppercase mb-3"
                      style={{ color: 'var(--color-beacon-light)' }}
                    >
                      {item.status}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-medium mb-3 leading-tight"
                      style={{ color: 'var(--color-lighthouse-beam)' }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Documentation Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-ocean-deep)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div
              className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase mb-8"
              style={{
                borderColor: 'var(--color-maritime-border)',
                backgroundColor: 'rgba(51, 65, 85, 0.3)',
                color: 'var(--color-beacon-light)',
              }}
            >
              <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
              Technical Documentation
            </div>
            <h2
              className="text-4xl md:text-5xl font-light leading-tight mb-6"
              style={{ color: 'var(--color-lighthouse-beam)' }}
            >
              System{' '}
              <span style={{ color: 'var(--color-beacon-light)' }}>
                Specifications
              </span>
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: 'var(--color-maritime-fog)' }}
            >
              Common implementation questions and technical requirements for Web
              4.0 navigation systems.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                query: 'What defines Web 4.0 architecture?',
                response:
                  'Web 4.0 represents the semantic, AI-driven internet layer built on intelligent agents, contextual understanding, and decentralized data structures. Lighthouse provides the infrastructure tools necessary for site compatibility with these emerging protocols.',
              },
              {
                query: 'How does agent access control function?',
                response:
                  'The AI Readiness module includes granular access control for automated agents. Configure which crawlers, indexers, and AI systems can access your content without modifying server configurations or .htaccess files.',
              },
              {
                query:
                  'What advantages does neural search provide over keyword matching?',
                response:
                  'Neural search operates on vector embeddings, enabling semantic understanding rather than literal string matching. This allows contextual queries to return relevant results even when exact keywords are absent, improving both human and agent navigation efficiency.',
              },
              {
                query: 'How does content indexing update with site changes?',
                response:
                  'The neural search infrastructure monitors content changes through site hooks, automatically reprocessing and reindexing modified content. Updates propagate to the search layer without manual intervention or batch processing delays.',
              },
              {
                query: 'Which entities can utilize the search interfaces?',
                response:
                  'The search system is designed for dual access: human users through traditional web interfaces, and AI agents through structured API endpoints. This enables your content to be discoverable by both current users and emerging intelligent navigation systems.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border rounded-lg"
                style={{
                  backgroundColor: 'var(--color-lighthouse-structure)',
                  borderColor: 'var(--color-maritime-border)',
                }}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className="text-xs font-mono tracking-wider uppercase px-2 py-1 rounded border mt-1"
                      style={{
                        borderColor: 'var(--color-beacon-light)',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                        color: 'var(--color-beacon-light)',
                      }}
                    >
                      Q{String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-medium mb-3 leading-tight"
                        style={{ color: 'var(--color-lighthouse-beam)' }}
                      >
                        {item.query}
                      </h3>
                      <p
                        className="leading-relaxed"
                        style={{ color: 'var(--color-maritime-fog)' }}
                      >
                        {item.response}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Ready Section */}
      <section
        className="relative py-24"
        style={{ backgroundColor: 'var(--color-ocean-surface)' }}
      >
        {/* Subtle lighthouse beam effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-400/2 via-blue-400/1 to-transparent rounded-full"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="space-y-12">
            <div className="space-y-8">
              {/* Status indicator */}
              <div
                className="inline-flex items-center px-3 py-1 rounded border text-xs font-mono tracking-wider uppercase"
                style={{
                  borderColor: 'var(--color-navigation-green)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--color-navigation-green)',
                }}
              >
                <span className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></span>
                System Ready For Deployment
              </div>

              <h2
                className="text-4xl md:text-5xl font-light leading-tight"
                style={{ color: 'var(--color-lighthouse-beam)' }}
              >
                Ready to establish{' '}
                <span style={{ color: 'var(--color-beacon-light)' }}>
                  navigation beacons
                </span>
                <br />
                for your web infrastructure?
              </h2>

              <p
                className="text-lg max-w-3xl mx-auto leading-relaxed"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Deploy Lighthouse navigation systems across your website
                network. Enable AI agent discovery and semantic search
                capabilities.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="font-medium px-8 py-4 text-lg rounded transition-all duration-200 hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-navigation-blue)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Initialize Navigation System
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-medium rounded transition-all duration-200"
                  style={{
                    borderColor: 'var(--color-maritime-border)',
                    color: 'var(--color-lighthouse-beam)',
                    backgroundColor: 'transparent',
                  }}
                >
                  Technical Consultation
                </Button>
              </Link>
            </div>

            {/* Network status */}
            <div
              className="pt-16 border-t"
              style={{ borderColor: 'var(--color-maritime-border)' }}
            >
              <div
                className="text-xs font-mono tracking-wider uppercase mb-4"
                style={{ color: 'var(--color-beacon-light)' }}
              >
                Network Status
              </div>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div
                    className="text-2xl font-mono font-medium mb-1"
                    style={{ color: 'var(--color-lighthouse-beam)' }}
                  >
                    10K+
                  </div>
                  <div
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: 'var(--color-maritime-fog)' }}
                  >
                    Sites Connected
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-mono font-medium mb-1"
                    style={{ color: 'var(--color-lighthouse-beam)' }}
                  >
                    99.9%
                  </div>
                  <div
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: 'var(--color-maritime-fog)' }}
                  >
                    System Uptime
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-mono font-medium mb-1"
                    style={{ color: 'var(--color-lighthouse-beam)' }}
                  >
                    24/7
                  </div>
                  <div
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: 'var(--color-maritime-fog)' }}
                  >
                    Monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Footer */}
      <footer
        className="relative border-t"
        style={{
          borderColor: 'var(--color-maritime-border)',
          backgroundColor: 'var(--color-ocean-deep)',
        }}
      >
        <div className="max-w-7xl mx-auto py-12 px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Navigation Control */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L8 8H16L12 2Z"
                      fill="var(--color-beacon-light)"
                    />
                    <rect
                      x="10"
                      y="8"
                      width="4"
                      height="12"
                      fill="var(--color-lighthouse-beam)"
                      fillOpacity="0.9"
                    />
                    <rect
                      x="8"
                      y="20"
                      width="8"
                      height="2"
                      fill="var(--color-lighthouse-structure)"
                    />
                    <circle
                      cx="12"
                      cy="5"
                      r="1"
                      fill="var(--color-navigation-blue)"
                    />
                  </svg>
                </div>
                <span
                  className="text-lg font-medium"
                  style={{ color: 'var(--color-lighthouse-beam)' }}
                >
                  Lighthouse Studios
                </span>
              </div>
              <p
                className="mb-6 leading-relaxed text-sm"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                Navigation infrastructure for AI-powered web discovery.
                Specialized tools for website optimization and agent
                discoverability protocols.
              </p>
              <div className="flex space-x-6 text-xs">
                <Link
                  href="/privacy"
                  className="transition-colors font-mono tracking-wider uppercase"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="transition-colors font-mono tracking-wider uppercase"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  Terms
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3
                className="text-sm font-mono tracking-wider uppercase mb-4"
                style={{ color: 'var(--color-beacon-light)' }}
              >
                Navigation
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'Systems',
                  'Documentation',
                  'Technical Support',
                  'Status',
                ].map(item => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className="transition-colors"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Resources */}
            <div>
              <h3
                className="text-sm font-mono tracking-wider uppercase mb-4"
                style={{ color: 'var(--color-beacon-light)' }}
              >
                Resources
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  'API Reference',
                  'Implementation Guide',
                  'Network Status',
                  'Technical Blog',
                ].map(item => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase().replace(/\s/g, '-')}`}
                      className="transition-colors"
                      style={{ color: 'var(--color-maritime-fog)' }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: 'var(--color-maritime-border)' }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p
                className="text-xs font-mono tracking-wider"
                style={{ color: 'var(--color-maritime-fog)' }}
              >
                © 2025 LIGHTHOUSE STUDIOS • NAVIGATION SYSTEMS DIVISION
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div
                  className="flex items-center space-x-2 text-xs font-mono tracking-wider"
                  style={{ color: 'var(--color-maritime-fog)' }}
                >
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ backgroundColor: 'var(--color-navigation-green)' }}
                  ></div>
                  <span>System Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
