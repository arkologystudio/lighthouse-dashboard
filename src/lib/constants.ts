// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  SITES: {
    LIST: '/api/users/sites', // Backend endpoint for getting user's sites
    CREATE: '/api/sites',
    DELETE: (id: string) => `/api/sites/${id}`,
    GET: (id: string) => `/api/sites/${id}`,
    UPDATE: (id: string) => `/api/sites/${id}`,
    SEARCH: (id: string) => `/api/sites/${id}/search`,
    EMBED: (id: string) => `/api/sites/${id}/embed`,
    STATS: (id: string) => `/api/sites/${id}/stats`,
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    SITES: '/api/users/sites',
  },
  DIAGNOSTICS: {
    SCAN: '/api/v1/diagnostics/scan-url',
    SITE_SCORE: (id: string) => `/api/v1/diagnostics/sites/${id}/score`,
    PAGE_INDICATORS: (pageId: string) => `/api/v1/diagnostics/pages/${pageId}/indicators`,
    TRIGGER_RESCORE: '/api/v1/diagnostics/trigger-rescore',
    AUDIT_DETAILS: (auditId: string) => `/api/v1/diagnostics/audits/${auditId}`,
  },
} as const;

// Navigation Items (Updated - Licenses removed)
export const NAVIGATION_ITEMS = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Sites', href: '/dashboard/sites' },
  { name: 'Billing', href: '/dashboard/billing' },
  { name: 'Products', href: '/dashboard/products' },
  { name: 'Usage', href: '/dashboard/usage' },
  { name: 'Diagnostics', href: '/dashboard/diagnostics' },
  { name: 'Insights', href: '/dashboard/insights' },
  { name: 'Activities', href: '/dashboard/activities' },
] as const;

// Products (hardcoded for MVP)
export const PRODUCTS = [
  {
    id: 'lumen-search-product',
    name: 'Lumen Search - Product',
    description:
      'AI-powered product search functionality for your eCommerce website',
    isInstalled: false,
    category: 'Search',
  },
  {
    id: 'lumen-search-knowledge',
    name: 'Lumen Search - Knowledge',
    description:
      'AI-powered knowledge base search for documentation and support content',
    isInstalled: false,
    category: 'Search',
  },
  {
    id: 'beacon-ai-readiness',
    name: 'Beacon - AI Readiness Check',
    description:
      'Optimize your site for AI crawlers and improve search visibility',
    isInstalled: false,
    category: 'Optimization',
  },
] as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'lighthouse_auth_token',
  USER: 'lighthouse_user',
} as const;

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+\..+/,
  PASSWORD_MIN_LENGTH: 8,
} as const;

// Toast messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    LOGOUT: 'Successfully logged out!',
    REGISTER: 'Account created successfully!',
    SITE_CREATED: 'Site added successfully!',
    SITE_DELETED: 'Site deleted successfully!',
  },
  ERROR: {
    LOGIN_FAILED: 'Invalid email or password',
    REGISTER_FAILED: 'Failed to create account',
    NETWORK_ERROR: 'Network error. Please try again.',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_URL: 'Please enter a valid URL (including http:// or https://)',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_PATTERNS.PASSWORD_MIN_LENGTH} characters`,
    REQUIRED_FIELD: 'This field is required',
  },
} as const;
