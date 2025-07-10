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
  limits?: Record<string, any>;
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
  config?: Record<string, any>;
  usage_limits?: Record<string, any>;
  last_used_at?: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
  product?: EcosystemProduct;
}

export interface RegisterSiteProductRequest {
  product_slug: string;
  config?: Record<string, any>;
}

export interface UpdateSiteProductRequest {
  is_enabled?: boolean;
  config?: Record<string, any>;
  usage_limits?: Record<string, any>;
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
  metadata?: Record<string, any>;
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
