// User types - matching backend exactly
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  subscription_tier?: 'free' | 'pro' | 'enterprise';
}

// Authentication types - matching backend exactly
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: Omit<User, 'created_at' | 'updated_at'>;
  token: string;
  expires_in: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  prefetchedSites?: Site[];
  prefetchedProducts?: EcosystemProduct[];
}

// Site management types - matching backend exactly
export interface Site {
  id: string;
  user_id: string;
  name: string;
  url: string;
  description?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  embedding_status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  last_embedding_at?: string;
  post_count: number;
  chunk_count: number;
}

export interface CreateSiteRequest {
  name: string;
  url: string;
  description?: string;
}

export interface UpdateSiteRequest {
  name?: string;
  url?: string;
  description?: string;
  is_active?: boolean;
}

// Ecosystem Products Types
export interface EcosystemProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  version: string;
  is_active: boolean;
  is_beta: boolean;
  base_price?: number;
  usage_based: boolean;
  features?: string[];
  limits?: Record<string, unknown>;
  extended_documentation?: string;
  created_at: string;
  updated_at: string;
}

export interface SiteProduct {
  id: string;
  site_id: string;
  product_id: string;
  is_enabled: boolean;
  enabled_at: string;
  disabled_at?: string;
  config?: Record<string, unknown>;
  usage_limits?: Record<string, unknown>;
  last_used_at?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  product?: EcosystemProduct;
}

export interface RegisterSiteProductRequest {
  product_slug: string;
  config?: Record<string, unknown>;
}

export interface UpdateSiteProductRequest {
  is_enabled?: boolean;
  config?: Record<string, unknown>;
  usage_limits?: Record<string, unknown>;
}

export interface SiteProductsResponse {
  products: (SiteProduct & { product: EcosystemProduct })[];
  total: number;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  description?: string;
  site_id?: string;
  target_id?: string;
  target_type?: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  user?: User;
  site?: Site;
}

export interface ActivityLogResponse {
  activities: ActivityLog[];
  total: number;
  has_more: boolean;
}

export interface ActivityStatsResponse {
  total_activities: number;
  recent_activity_count: number;
  activities_by_type: Record<string, number>;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  isInstalled: boolean;
}

// API response types - matching backend exactly
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Result type for functional error handling
export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

// Form types
export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface LoginForm {
  email: FormField<string>;
  password: FormField<string>;
}

export interface RegisterForm {
  email: FormField<string>;
  password: FormField<string>;
  name: FormField<string>;
}

export interface SiteForm {
  name: FormField<string>;
  url: FormField<string>;
  description: FormField<string>;
}

// Search types - matching backend
export interface SearchRequest {
  query: string;
  topK?: number;
}

export interface SearchResult {
  postId: number;
  postTitle: string;
  postUrl: string;
  siteId: string;
  siteName?: string;
  siteUrl?: string;
  averageScore: number;
  maxScore: number;
  totalChunks: number;
  chunks: SearchResultChunk[];
}

export interface SearchResultChunk {
  chunkId: string;
  chunkIndex: number;
  content: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  site_id: string;
  query: string;
  totalPosts: number;
  totalChunks: number;
}

// Plugin Licensing Types
export interface Plugin {
  id: string;
  product_id: string;
  name: string;
  filename: string;
  version: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_hash: string;
  content_type: string;
  is_active: boolean;
  is_public: boolean;
  release_notes?: string;
  changelog?: string;
  max_downloads?: number;
  created_at: string;
  updated_at: string;
  product?: EcosystemProduct;
}

export interface License {
  id: string;
  user_id: string;
  product_id: string;
  license_key: string;
  license_type:
    | 'trial'
    | 'standard'
    | 'standard_plus'
    | 'premium'
    | 'premium_plus'
    | 'enterprise';
  status: 'active' | 'expired' | 'revoked' | 'suspended';
  is_active: boolean;

  // Billing information
  billing_period: 'monthly' | 'annual';
  amount_paid?: number;
  currency: string;

  // Validity period
  issued_at: string;
  expires_at?: string;
  last_validated?: string;

  // Feature permissions
  agent_api_access: boolean;
  max_sites: number;

  // Usage tracking and limits
  download_count: number;
  max_downloads?: number;
  query_count: number;
  max_queries?: number;
  query_period_start: string;
  query_period_end?: string;

  // Add-ons
  additional_sites: number;
  custom_embedding: boolean;

  // Metadata
  purchase_reference?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;

  // Relationships
  user?: User;
  product?: EcosystemProduct;
}

export interface Download {
  id: string;
  user_id: string;
  product_id: string;
  license_id: string;
  download_url?: string;
  download_token?: string;
  token_expires?: string;
  ip_address?: string;
  user_agent?: string;
  referer?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';
  started_at: string;
  completed_at?: string;
  bytes_downloaded?: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  user?: User;
  product?: EcosystemProduct;
  license?: License;
}

// License Management Request/Response Types
export interface ValidateLicenseRequest {
  license_key: string;
  product_slug?: string;
}

export interface ValidateLicenseResponse {
  valid: boolean;
  license?: License;
  message?: string;
  download_allowed: boolean;
}

// Purchase Simulation Request/Response Types
export interface SimulatePurchaseRequest {
  product_slug: string;
  license_type?:
    | 'trial'
    | 'standard'
    | 'standard_plus'
    | 'premium'
    | 'premium_plus'
    | 'enterprise';
  billing_period?: 'monthly' | 'annual';
  additional_sites?: number;
  custom_embedding?: boolean;
  payment_reference?: string;
}

export interface SimulatePurchaseResponse {
  success: boolean;
  license: License;
  plugin: Plugin;
  message: string;
}

// Download Request/Response Types
export interface InitiateDownloadRequest {
  product_slug: string;
  license_key: string;
}

export interface InitiateDownloadResponse {
  success: boolean;
  download_token: string;
  download_url: string;
  expires_at: string;
  plugin: Plugin;
  message?: string;
}

// License Statistics Types
export interface UserLicenseStats {
  total_licenses: number;
  active_licenses: number;
  expired_licenses: number;
  total_downloads: number;
  licenses_by_type: Record<string, number>;
}

// Extended Product types with Plugin information
export interface EcosystemProductWithPlugins extends EcosystemProduct {
  plugins: Plugin[];
  has_downloadable_content: boolean;
}

// Pricing Tier Types - matching backend pricing system
export interface PricingTier {
  id: string;
  product_id: string;
  tier_name: string;
  display_name: string;
  description: string;
  monthly_price: number;
  annual_price: number;
  max_queries?: number;
  max_sites: number;
  agent_api_access: boolean;
  extra_site_price?: number;
  overage_price?: number;
  custom_embedding_markup?: number;
  features?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product?: EcosystemProduct;
}

// Pricing calculation types
export interface PricingCalculationRequest {
  license_type:
    | 'standard'
    | 'standard_plus'
    | 'premium'
    | 'premium_plus'
    | 'enterprise';
  billing_period?: 'monthly' | 'annual';
  additional_sites?: number;
  custom_embedding?: boolean;
  query_overage?: number;
}

export interface PricingCalculationResponse {
  success: boolean;
  pricing: {
    license_type: string;
    billing_period: string;
    base_price: number;
    add_ons: {
      additional_sites: {
        count: number;
        unit_price: number;
        total_cost: number;
      };
      custom_embedding: {
        enabled: boolean;
        markup_percentage: number;
        total_cost: number;
      };
      query_overage: {
        count: number;
        unit_price: number;
        total_cost: number;
      };
    };
    total_price: number;
    annual_savings: number;
    annual_savings_percentage: number;
    currency: string;
  };
  tier_details: {
    tier_name: string;
    display_name: string;
    max_queries?: number;
    max_sites: number;
    agent_api_access: boolean;
    features: string[];
  };
}

// License type definitions
export type LicenseType =
  | 'trial'
  | 'standard'
  | 'standard_plus'
  | 'premium'
  | 'premium_plus'
  | 'enterprise';
export type BillingPeriod = 'monthly' | 'annual';
export type LicenseStatus = 'active' | 'expired' | 'revoked' | 'suspended';

// Diagnostics Types
export type DiagnosticStatus = 'pass' | 'warn' | 'fail';
export type AccessIntent = 'allow' | 'partial' | 'block';

export interface DiagnosticIndicator {
  id: string;
  name: string;
  status: DiagnosticStatus;
  score: number;
  max_score: number;
  why_it_matters: string; // ≤ 120 chars per spec
  fix_recommendation: string;
  details?: Record<string, unknown>;
}

export interface DiagnosticReport {
  id: string;
  site_id: string;
  overall_score: number;
  max_possible_score: number;
  access_intent: AccessIntent; // Based on robots/noai tags
  indicators: DiagnosticIndicator[];
  created_at: string;
  updated_at: string;
}

export interface DiagnosticPageScore {
  id: string;
  site_id: string;
  url: string;
  path: string;
  score: number;
  max_possible_score: number;
  indicators_summary: {
    pass: number;
    warn: number;
    fail: number;
  };
  last_analyzed_at: string;
}

export interface TriggerRescoreRequest {
  site_id: string;
  force?: boolean;
}

export interface TriggerRescoreResponse {
  success: boolean;
  message: string;
  job_id?: string;
  estimated_completion_time?: number; // seconds
}

// Free Diagnostics Scan Types (matching backend spec)
export interface DiagnosticScanRequest {
  siteId?: string; // Optional for authenticated users
  url?: string; // Required for free/anonymous scans
  options?: {
    auditType?: 'full' | 'quick' | 'scheduled' | 'on_demand';
    includeSitemap?: boolean; // Pro only
    maxPages?: number; // Free: max 5, Pro: max 20
    storeRawData?: boolean; // Pro only
    skipCache?: boolean;
  };
}

export type AIReadinessLevel = 'excellent' | 'good' | 'needs_improvement' | 'poor';

// Server diagnostic types - matching backend exactly
export interface DiagnosticResult {
  auditId: string;
  status: 'completed' | 'failed' | 'partial';
  result?: AggregatedResult;
  error?: string;
  duration: number;
}

export interface AggregatedResult {
  auditId: string;
  siteUrl: string;
  pages: PageAggregation[];
  siteScore: SiteScore;
  categoryScores: CategoryScore[];
  summary: AuditSummary;
  aiReadiness: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  accessIntent: 'allow' | 'partial' | 'block';
}

export interface PageAggregation {
  id: string;
  url: string;
  title: string;
  pageScore: number;
  indicatorCount: number;
}

export interface SiteScore {
  overall: number;
  breakdown?: {
    standards: number;
    structured_data: number;
    seo: number;
    accessibility: number;
  };
}

export interface CategoryScore {
  category: 'standards' | 'structured_data' | 'seo' | 'accessibility';
  score: number;
  weight: number;
  indicatorCount: number;
  passedCount: number;
  warningCount: number;
  failedCount: number;
}

export interface AuditSummary {
  totalIndicators: number;
  passedIndicators: number;
  warnedIndicators: number;
  failedIndicators: number;
  topIssues?: string[];
  topRecommendations?: string[];
}

// Response from the diagnostics scan endpoint
export interface DiagnosticScanResponse {
  message: string;
  status: 'completed' | 'failed' | 'partial';
  duration: number; // seconds
  result: AggregatedResult;
}

export interface DiagnosticCategoryScore {
  category: 'standards' | 'structured_data' | 'seo' | 'accessibility';
  score: number;
  weight: number;
  indicatorCount: number;
}

export interface DiagnosticAuditDetails {
  id: string;
  siteId: string;
  siteName: string;
  siteUrl: string;
  auditType: 'full' | 'quick' | 'scheduled' | 'on_demand';
  status: 'completed' | 'failed';
  siteScore: number;
  aiReadiness: AIReadinessLevel;
  accessIntent: AccessIntent;
  startedAt: string;
  completedAt: string;
  errorMessage?: string;
  pages?: Array<{
    id: string;
    url: string;
    title: string;
    pageScore: number;
    indicatorCount: number;
  }>;
  categoryScores?: DiagnosticCategoryScore[];
}
