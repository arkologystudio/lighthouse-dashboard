import React from 'react';

interface SEOOptimizationsProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
}

// Note: SEOOptimizations component is not needed in App Router
// All metadata should be defined in metadata exports in page/layout files
export const SEOOptimizations: React.FC<SEOOptimizationsProps> = () => null;

// Utility function to generate breadcrumb JSON-LD
export const generateBreadcrumbsLD = (
  breadcrumbs: Array<{ name: string; url: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: crumb.url,
  })),
});

// Utility function to generate article JSON-LD
export const generateArticleLD = (article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Lighthouse Studios',
    logo: {
      '@type': 'ImageObject',
      url: 'https://lighthousestudios.xyz/logo.png',
    },
  },
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  url: article.url,
  image: article.image || 'https://lighthousestudios.xyz/og-image.png',
});
