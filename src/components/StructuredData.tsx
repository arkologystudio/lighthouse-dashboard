import React from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ data }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lighthouse Studios',
  alternateName: 'Lighthouse Dashboard',
  url: 'https://lighthousestudios.xyz',
  logo: 'https://lighthousestudios.xyz/logo.png',
  description:
    'Navigation tools for the AI-powered web. Enable discovery, optimize visibility, guide intelligent agents to your WordPress sites with precision.',
  foundingDate: '2024',
  sameAs: [
    'https://twitter.com/lighthousestudios',
    'https://linkedin.com/company/lighthouse-studios',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://lighthousestudios.xyz/contact',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Lighthouse Dashboard',
  alternateName: 'Lighthouse Studios Dashboard',
  url: 'https://lighthousestudios.xyz',
  description:
    'AI-powered portal for managing WordPress sites, installing AI website plugins, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
  publisher: {
    '@type': 'Organization',
    name: 'Lighthouse Studios',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://lighthousestudios.xyz/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

// SoftwareApplication Schema
export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Lighthouse Dashboard',
  description:
    'AI-powered portal for managing WordPress sites, installing AI website plugins, and unlocking advanced agent discoverability with neural & semantic search for Web 4.0.',
  url: 'https://lighthousestudios.xyz',
  applicationCategory: 'WebApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  creator: {
    '@type': 'Organization',
    name: 'Lighthouse Studios',
  },
  featureList: [
    'AI WordPress Plugin Management',
    'Agent Discoverability Tools',
    'Neural Search Integration',
    'Semantic Search Tools',
    'Web 4.0 Optimization',
    'Real-time Analytics',
    'Plugin Marketplace',
    'Site Performance Monitoring',
  ],
};

// Breadcrumb Schema Builder
export const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

// FAQ Schema Builder
export const createFAQSchema = (
  faqs: Array<{ question: string; answer: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
