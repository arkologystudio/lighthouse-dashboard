/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://lighthousestudios.xyz',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  transform: async (config, path) => {
    // Custom priority based on page importance
    const priorities = {
      '/': 1.0,
      '/login': 0.8,
      '/register': 0.8,
      '/dashboard': 0.9,
      '/dashboard/sites': 0.8,
      '/dashboard/products': 0.8,
      '/features': 0.7,
      '/contact': 0.6,
      '/privacy': 0.3,
      '/terms': 0.3,
    };

    // Custom changefreq based on page type
    const changefreqs = {
      '/': 'weekly',
      '/dashboard': 'daily',
      '/dashboard/sites': 'daily',
      '/dashboard/products': 'daily',
      '/features': 'monthly',
      '/contact': 'monthly',
      '/privacy': 'yearly',
      '/terms': 'yearly',
    };

    return {
      loc: path,
      changefreq: changefreqs[path] || config.changefreq,
      priority: priorities[path] || config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*', '/_next/*', '/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*', '/_next/*', '/admin'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/*', '/dashboard/*', '/_next/*', '/admin'],
      },
    ],
    additionalSitemaps: ['https://lighthousestudios.xyz/sitemap.xml'],
  },
  exclude: [
    '/api/*',
    '/dashboard/*', // Protected pages don't need to be indexed
    '/_next/*',
    '/admin',
    '/404',
    '/500',
    '/server-sitemap.xml',
  ],
  additionalPaths: async () => {
    const result = [];

    // Add static pages that might not be auto-discovered
    const staticPages = [
      { loc: '/features', priority: 0.7, changefreq: 'monthly' },
      { loc: '/contact', priority: 0.6, changefreq: 'monthly' },
      { loc: '/privacy', priority: 0.3, changefreq: 'yearly' },
      { loc: '/terms', priority: 0.3, changefreq: 'yearly' },
      { loc: '/about', priority: 0.6, changefreq: 'monthly' },
      { loc: '/documentation', priority: 0.7, changefreq: 'weekly' },
      { loc: '/api-reference', priority: 0.6, changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      result.push({
        loc: page.loc,
        changefreq: page.changefreq,
        priority: page.priority,
        lastmod: new Date().toISOString(),
      });
    });

    return result;
  },
};
