export interface ScannerContext {
    auditId: string;
    pageId?: string;
    siteUrl: string;
    pageUrl?: string;
    pageHtml?: string;
    pageMetadata?: PageMetadata;
    crawlerMetadata?: CrawlerMetadata;
  }
  
  export interface PageMetadata {
    title?: string;
    metaDescription?: string;
    ogTags?: Record<string, string>;
    statusCode?: number;
    loadTimeMs?: number;
    wordCount?: number;
  }
  
  export interface CrawlerMetadata {
    userAgent?: string;
    viewport?: { width: number; height: number };
    crawledAt?: Date;
  }
  
  // Scanner-specific data type definitions
  export interface SeoAnalysisData {
    title?: {
      exists: boolean;
      title?: string;
      length?: number;
      optimal: boolean;
      issue?: string;
    };
    metaDescription?: {
      exists: boolean;
      metaDescription?: string;
      length?: number;
      optimal: boolean;
      issue?: string;
    };
    headings?: {
      structure: string[];
      h1Count: number;
      hasH1: boolean;
      hierarchy: boolean;
      issue?: string;
    };
    openGraph?: {
      hasTitle: boolean;
      hasDescription: boolean;
      hasImage: boolean;
      hasUrl: boolean;
      hasType: boolean;
      score: number;
    };
    navigation?: {
      menuItems: string[];
      linkTexts: string[];
    };
  }
  
  export interface JsonLdAnalysisData {
    found: boolean;
    count: number;
    types: string[];
    schemas?: string[];
    hasOrganization: boolean;
    hasWebSite: boolean;
    hasWebPage: boolean;
    hasBreadcrumb: boolean;
    hasProduct: boolean;
    hasArticle: boolean;
    validationIssues: string[];
    aiRelevantTypes: string[];
  }
  
  export interface RobotsAnalysisData {
    accessIntent?: 'allow' | 'partial' | 'block';
    hasUserAgent?: boolean;
    hasAiDirectives?: boolean;
    rules?: Array<{
      userAgent: string;
      disallow: string[];
      allow: string[];
    }>;
    sitemaps?: string[];
    robotsTxt?: {
      found: boolean;
      rules: Array<{
        userAgent: string;
        disallow: string[];
        allow: string[];
      }>;
      sitemaps: string[];
    };
    robotsMeta?: {
      found: boolean;
      allowsAI: boolean;
      specificDirectives?: string[];
    };
    aiAgentRestrictions?: Array<{
      userAgent: string;
      directive: string;
      scope?: string;
    }>;
    sitemapReferences?: number;
  }
  
  export interface CanonicalAnalysisData {
    url?: string;
    isValid?: boolean;
    isSelfReferencing?: boolean;
    responseCode?: number;
    canonicalUrl?: string;
    pageUrl?: string;
    ogUrl?: string;
    isAbsolute?: boolean;
    matchesOgUrl?: boolean;
  }
  
  export interface AgentJsonAnalysisData {
    version?: string;
    schema?: Record<string, unknown>;
    endpoints?: Array<{
      path: string;
      method: string;
      description?: string;
    }>;
    capabilities?: string[] | number;
    content?: Record<string, unknown>; // Raw content found
    hasApi?: boolean;
    pageUrl?: string;
  }
  
  export interface McpAnalysisData {
    servers?: Array<{
      name: string;
      description?: string;
      version?: string;
    }>;
    tools?: Array<{
      name: string;
      description?: string;
    }>;
    prompts?: Array<{
      name: string;
      description?: string;
    }>;
    checkedUrl?: string;
    hasMcp?: boolean;
    mcpConfig?: {
      servers?: Array<{
        name: string;
        description?: string;
        version?: string;
      }>;
      tools?: Array<{
        name: string;
        description?: string;
      }>;
      prompts?: Array<{
        name: string;
        description?: string;
      }>;
    };
    actionCount?: number;
    authRequired?: boolean;
  }
  
  export interface SitemapAnalysisData {
    urls?: string[];
    urlCount?: number;
    isValid?: boolean;
    lastModified?: string;
    hasImages?: boolean;
    hasVideos?: boolean;
    checkedLocations?: string[];
    sitemapUrls?: string[];
    totalUrls?: number;
    validSitemaps?: number;
    hasLastmod?: boolean;
    hasChangefreq?: boolean;
    hasPriority?: boolean;
  }
  
  export interface LlmsTxtAnalysisData {
    sections?: Array<{
      title: string;
      content: string;
    }>;
    totalSections?: number;
    hasInstructions?: boolean;
    hasExamples?: boolean;
    checkedPaths?: string[];
    parsedContent?: {
      sections?: Array<{
        title: string;
        content: string;
      }>;
      metadata?: Record<string, unknown>;
      examples?: string[];
    };
    expectedFormat?: string;
    sectionCount?: number;
    examples?: string[];
    detectedSections?: string[];
    contentLength?: number;
    hasTitle?: boolean;
    hasSummary?: boolean;
    linkCount?: number;
  }
  
  // Union type for all scanner-specific data
  export type ScannerSpecificData = 
    | SeoAnalysisData
    | JsonLdAnalysisData 
    | RobotsAnalysisData
    | CanonicalAnalysisData
    | AgentJsonAnalysisData
    | McpAnalysisData
    | SitemapAnalysisData
    | LlmsTxtAnalysisData;
  
  /** Validation findings with different severity levels */
  export interface ValidationFindings {
    /** Critical validation errors that prevent proper functionality */
    errors?: string[];
    
    /** Non-critical warnings that should be addressed for optimization */
    warnings?: string[];
    
    /** Required fields or elements that were not found */
    missing?: string[];
  }
  
  /** Core evidence data from diagnostic scanning */
  export interface StandardEvidence {
    // Content Discovery
    
    /** Whether the expected content/file was found during scanning */
    found?: boolean;
    
    /** HTTP status code returned when checking the resource (e.g., 200, 404, 500) */
    statusCode?: number;
    
    /** Preview of the content found, truncated for display purposes
     * @example "User-agent: *\nDisallow: /admin\nSitemap: https://..." */
    contentPreview?: string;
    
    // Validation Results
    
    /** Numeric score from 0-100 indicating validation quality */
    score?: number;
    
    /** Structured validation findings organized by severity */
    validation?: ValidationFindings;
    
    // Scanner-Specific Analysis
    
    /** Detailed analysis data specific to each scanner type */
    analysis?: ScannerSpecificData;
    
    // AI Optimization Insights
    
    /** Factors that enhance AI agent compatibility */
    aiFactors?: {
      /** Positive aspects that help AI understanding */
      strengths?: string[];
      /** Areas for improvement to enhance AI compatibility */
      opportunities?: string[];
    };
    
    // Technical Metadata
    
    /** Technical details about the scan execution */
    metadata?: {
      /** The specific URL that was checked during scanning */
      checkedUrl?: string;
      /** Time taken to complete the scan in milliseconds */
      responseTime?: number;
      /** Error message if the scan failed or encountered issues */
      error?: string;
      /** Generic reason field for simple cases */
      reason?: string;
    };
  }





  // AI Readiness Index Types - v1.0 specification
export type IndicatorStatus = 'pass' | 'warn' | 'fail' | 'not_applicable';
export type DiagnosticStatus = IndicatorStatus; // Keep for backward compatibility
export type AccessIntent = 'allow' | 'partial' | 'block';
export type IndicatorCategory = 'standards' | 'seo' | 'structured_data' | 'accessibility' | 'performance' | 'security';

// Site Profile Types - matching specification
export type SiteProfile = 
  | 'blog_content'
  | 'ecommerce' 
  | 'saas_app'
  | 'kb_support'
  | 'gov_nontransacting'
  | 'custom';


export interface SpecIndicator {
  name: string;
  score: number; // 0..1
  applicability: {
    status: 'required' | 'optional' | 'not_applicable';
    reason: string;
    included_in_category_math: boolean;
  };
  evidence?: StandardEvidence;
}

export interface SpecCategory {
  score: number; // computed 0..1
  indicator_scores: Record<string, number>; // indicator name -> score
}

export interface SpecWeights {
  discovery: number;
  understanding: number;
  actions: number;
  trust: number;
}

export interface LighthouseAIReport {
  site: {
    url: string;
    scan_date: string;
    category: string; // site profile
  };
  categories: {
    discovery: SpecCategory;
    understanding: SpecCategory;
    actions: SpecCategory;
    trust: SpecCategory;
  };
  indicators: Record<string, SpecIndicator>; // All indicators with full data
  weights: SpecWeights;
  overall: {
    raw_0_1: number;
    score_0_100: number;
  };
}

// Legacy types for backward compatibility - DEPRECATED, use new structure above
export interface Category {
  score: number; // 0.0 to 1.0 range
  indicators: SpecIndicator[];
}

export interface Weights {
  discovery: 0.30;    // Fixed weight
  understanding: 0.30; // Fixed weight  
  actions: 0.25;      // Fixed weight
  trust: 0.15;        // Fixed weight
}

// V2 API Enhanced Indicator Structure
export interface IndicatorResult {
  // Core identifier
  name: string;                    // e.g., "llms_txt"
  displayName: string;             // e.g., "LLMS.txt File"
  description: string;             // Human-readable description
  category: IndicatorCategory;     // 'standards' | 'seo' | 'structured_data' | etc.
  
  // Status and scoring
  status: IndicatorStatus;
  score: number;                   // 0-10
  weight: number;                  // Importance multiplier
  maxScore: number;                // Always 10 for normalization
  
  // User-facing messaging
  message: string;                 // Status message
  recommendation?: string;         // Actionable advice
  
  // Technical details
  checkedUrl?: string;             // URL that was analyzed
  found: boolean;                  // Whether the resource was found
  isValid: boolean;                // Whether it passed validation
  
  // Rich details for UI
  details: IndicatorDetails;       // Structured data specific to indicator
  
  // Performance context
  scannedAt: Date;                 // When this indicator was checked
}

// Structured details for different indicator types
export interface IndicatorDetails {
  // Technical validation results
  validationErrors?: string[];
  validationWarnings?: string[];
  
  // File/resource specific data
  fileSize?: number;
  contentType?: string;
  lastModified?: string;
  
  // Content analysis
  contentSample?: string;
  parsedStructure?: Record<string, unknown>;
  
  // URLs and references
  relatedUrls?: string[];
  externalReferences?: string[];
  
  // Recommendations with context
  impactLevel?: 'high' | 'medium' | 'low';
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  estimatedTimeToFix?: string;
  
  // Custom data per indicator type
  [key: string]: unknown;
}

// Legacy interface for backward compatibility
export interface DiagnosticIndicator {
  id: string;
  name: string;
  status: IndicatorStatus;
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
  auditType: 'full' | 'quick' | 'scheduled' | 'on_demand';
  pages: PageAggregation[];
  siteScore: SiteScore;
  categoryScores: CategoryScore[];
  summary: AuditSummary;
  
  // V2 Enhancement: AI-specific insights
  aiReadiness: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  aiReadinessDetails: AiReadinessDetails;
  accessIntent: 'allow' | 'partial' | 'block';
  accessIntentDetails: AccessIntentDetails;
  
  // V2 Enhancement: Metadata
  scanMetadata: ScanMetadata;
}

// V2 AI Readiness Details
export interface AiReadinessDetails {
  overallReadinessScore: number;
  categoryBreakdown: {
    standards: {
      score: number;
      completedIndicators: string[];
      missingIndicators: string[];
    };
    seo: {
      score: number;
      completedIndicators: string[];
      missingIndicators: string[];
    };
    structuredData: {
      score: number;
      completedIndicators: string[];
      missingIndicators: string[];
    };
  };
  keyStrengths: string[];
  criticalGaps: string[];
  nextSteps: string[];
}

// V2 Access Intent Details
export interface AccessIntentDetails {
  reasoning: string;
  detectedSignals: {
    robotsTxt: {
      found: boolean;
      allowsAI: boolean;
      specificDirectives?: string[];
    };
    metaRobots: {
      found: boolean;
      allowsAI: boolean;
      specificDirectives?: string[];
    };
    noaiTags: {
      found: boolean;
      locations?: string[];
    };
  };
  recommendations: string[];
}

// V2 Scan Metadata
export interface ScanMetadata {
  scanStartTime: Date;
  scanEndTime: Date;
  totalDuration: number; // milliseconds
  pagesAnalyzed: number;
  indicatorsChecked: number;
  errors: string[];
  warnings: string[];
  userAgent: string;
  version: string;
}

// V2 API Enhanced Page Structure
export interface PageAggregation {
  id: string;
  url: string;
  title: string;
  pageScore: number;
  indicatorCount: number;
  // V2 Enhancement: Individual indicators for each page
  indicators: IndicatorResult[];
}

export interface SiteScore {
  overall: number;
  // V2 Enhancement: Detailed breakdown by category
  breakdown: {
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
  completionPercentage: number;
  
  // V2 Enhancement: Prioritized recommendations
  quickWins: RecommendationItem[];
  strategicImprovements: RecommendationItem[];
  
  // Legacy fields for backward compatibility
  topIssues?: string[];
  topRecommendations?: string[];
}

// V2 Recommendation structure
export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  impactLevel: 'high' | 'medium' | 'low';
  difficultyLevel: 'easy' | 'medium' | 'hard';
  estimatedTimeToFix?: string;
  category: IndicatorCategory;
  relatedIndicators: string[];
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

// AI Readiness scan request for the new API
export interface AIReadinessScanRequest {
  siteId?: string; // For authenticated users
  url?: string;    // For anonymous scans
  options?: {
    auditType?: 'full' | 'quick' | 'scheduled' | 'on_demand';
    includeSitemap?: boolean;
    maxPages?: number;
    storeRawData?: boolean;
    skipCache?: boolean;
    site_category?: SiteProfile
  };
}

export interface SiteCategory {
  blog_content: string;
  ecommerce: string;
  saas_app: string;
  kb_support: string;
  gov_nontransacting: string;
  custom: string;
}
