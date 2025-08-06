import { API_BASE_URL, ENDPOINTS, STORAGE_KEYS } from './constants';
import { validateData, authResponseSchema, siteSchema } from './validators';
import type {
  Result,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Site,
  CreateSiteRequest,
  ApiError,
  ApiResponse,
  DiagnosticReport,
  DiagnosticPageScore,
  TriggerRescoreRequest,
  TriggerRescoreResponse,
  DiagnosticScanRequest,
  DiagnosticScanResponse,
  DiagnosticIndicator,
  DiagnosticAuditDetails,
  DiagnosticStatus,
} from '../types';
import Cookies from 'js-cookie';

// Global logout callback (can be set by auth context)
let globalLogoutCallback: (() => void) | null = null;

export const setGlobalLogoutCallback = (callback: () => void): void => {
  globalLogoutCallback = callback;
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    Cookies.get(STORAGE_KEYS.AUTH_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  );
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  Cookies.set(STORAGE_KEYS.AUTH_TOKEN, token, {
    expires: 7,
    secure: true,
    sameSite: 'strict',
  });
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  Cookies.remove(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Result<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    // Check for authentication errors
    if (response.status === 401 && globalLogoutCallback) {
      globalLogoutCallback();
      return {
        success: false,
        error: {
          message: 'Session expired',
          code: 'AUTH_EXPIRED',
        },
      };
    }

    // Parse response as ApiResponse format
    const apiResponse: ApiResponse<T> = await response.json();

    if (!response.ok || !apiResponse.success) {
      // Map HTTP status codes to user-friendly error codes
      let errorCode = response.status.toString();
      const errorMessage = apiResponse.error || `HTTP ${response.status}: ${response.statusText}`;
      
      switch (response.status) {
        case 400:
          errorCode = 'INVALID_REQUEST';
          break;
        case 404:
          errorCode = 'SITE_NOT_ACCESSIBLE';
          break;
        case 429:
          errorCode = 'RATE_LIMIT_EXCEEDED';
          break;
        case 500:
          errorCode = 'SERVER_ERROR';
          break;
        case 503:
          errorCode = 'SERVICE_UNAVAILABLE';
          break;
        case 504:
          errorCode = 'SCAN_TIMEOUT';
          break;
      }
      
      return {
        success: false,
        error: {
          message: errorMessage,
          code: errorCode,
          details: apiResponse,
        },
      };
    }

    // Return the data from the ApiResponse wrapper
    return { success: true, data: apiResponse.data as T };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : 'Network error occurred',
        code: 'NETWORK_ERROR',
      },
    };
  }
};

// Authenticated API request
const authenticatedRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Result<T>> => {
  const token = getAuthToken();

  if (!token) {
    return {
      success: false,
      error: {
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      },
    };
  }

  return apiRequest<T>(endpoint, options);
};

// Authentication API functions
export const authApi = {
  login: async (credentials: LoginRequest): Promise<Result<AuthResponse>> => {
    const result = await apiRequest<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (result.success && result.data) {
      const validation = validateData(authResponseSchema, result.data);
      if (validation.success) {
        setAuthToken(validation.data.token);
        // Store user data with backend format (created_at, updated_at, etc.)
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({
            ...validation.data.user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );
        return { success: true, data: validation.data };
      }
      return {
        success: false,
        error: { message: validation.error, code: 'VALIDATION_ERROR' },
      };
    }

    return result;
  },

  register: async (
    userData: RegisterRequest
  ): Promise<Result<AuthResponse>> => {
    const result = await apiRequest<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (result.success && result.data) {
      const validation = validateData(authResponseSchema, result.data);
      if (validation.success) {
        setAuthToken(validation.data.token);
        // Store user data with backend format
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({
            ...validation.data.user,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );
        return { success: true, data: validation.data };
      }
      return {
        success: false,
        error: { message: validation.error, code: 'VALIDATION_ERROR' },
      };
    }

    return result;
  },

  logout: async (): Promise<Result<void>> => {
    const result = await authenticatedRequest<void>(ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });

    // Always clear local storage regardless of API response
    removeAuthToken();

    return result.success ? result : { success: true, data: undefined };
  },
};

// Sites API functions
export const sitesApi = {
  getAll: async (): Promise<Result<Site[]>> => {
    const result = await authenticatedRequest<Site[]>(ENDPOINTS.SITES.LIST);

    if (result.success && result.data && Array.isArray(result.data)) {
      const validatedSites: Site[] = [];

      for (const site of result.data) {
        const validation = validateData(siteSchema, site);
        if (validation.success) {
          validatedSites.push(validation.data);
        } else {
          console.warn('Invalid site data received:', validation.error);
        }
      }

      return { success: true, data: validatedSites };
    }

    return result;
  },

  create: async (siteData: CreateSiteRequest): Promise<Result<Site>> => {
    const result = await authenticatedRequest<Site>(ENDPOINTS.SITES.CREATE, {
      method: 'POST',
      body: JSON.stringify(siteData),
    });

    if (result.success && result.data) {
      const validation = validateData(siteSchema, result.data);
      if (validation.success) {
        return { success: true, data: validation.data };
      }
      return {
        success: false,
        error: { message: validation.error, code: 'VALIDATION_ERROR' },
      };
    }

    return result;
  },

  update: async (
    id: string,
    updates: Partial<CreateSiteRequest>
  ): Promise<Result<Site>> => {
    const result = await authenticatedRequest<Site>(
      ENDPOINTS.SITES.UPDATE(id),
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );

    if (result.success && result.data) {
      const validation = validateData(siteSchema, result.data);
      if (validation.success) {
        return { success: true, data: validation.data };
      }
      return {
        success: false,
        error: { message: validation.error, code: 'VALIDATION_ERROR' },
      };
    }

    return result;
  },

  delete: async (id: string): Promise<Result<void>> =>
    authenticatedRequest<void>(ENDPOINTS.SITES.DELETE(id), {
      method: 'DELETE',
    }),
};

// Utility functions for working with Result type
export const mapResult = <T, U>(
  result: Result<T>,
  mapper: (data: T) => U
): Result<U> =>
  result.success ? { success: true, data: mapper(result.data) } : result;

export const flatMapResult = <T, U>(
  result: Result<T>,
  mapper: (data: T) => Result<U>
): Result<U> => (result.success ? mapper(result.data) : result);

export const matchResult = <T, U>(
  result: Result<T>,
  handlers: {
    success: (data: T) => U;
    error: (error: ApiError) => U;
  }
): U =>
  result.success ? handlers.success(result.data) : handlers.error(result.error);

// Diagnostics API functions
export const diagnosticsApi = {
  // Free scan endpoint (no authentication required for anonymous scans)
  scan: async (request: DiagnosticScanRequest): Promise<Result<DiagnosticScanResponse>> => {
    // For free scans, we need to make an unauthenticated request
    const isFreeScan = !request.siteId && request.url;
    
    if (isFreeScan) {
      // Free scan - no authentication (apiRequest handles the case where no token is provided)
      return apiRequest<DiagnosticScanResponse>(ENDPOINTS.DIAGNOSTICS.SCAN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    } else {
      // Authenticated scan for existing site
      return authenticatedRequest<DiagnosticScanResponse>(ENDPOINTS.DIAGNOSTICS.SCAN, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    }
  },

  getSiteScore: async (siteId: string): Promise<Result<DiagnosticReport>> => {
    const result = await authenticatedRequest<DiagnosticReport>(
      ENDPOINTS.DIAGNOSTICS.SITE_SCORE(siteId)
    );

    // No additional validation needed as the backend returns the correct format
    return result;
  },

  getPageScores: async (siteId: string): Promise<Result<DiagnosticPageScore[]>> => {
    // This is now handled by getPageIndicators for the new API structure
    // Keeping this for backward compatibility but it may need to be updated
    const result = await authenticatedRequest<DiagnosticPageScore[]>(
      `${ENDPOINTS.DIAGNOSTICS.SITE_SCORE(siteId)}/pages`
    );

    return result;
  },

  triggerRescore: async (
    siteId: string,
    force?: boolean
  ): Promise<Result<TriggerRescoreResponse>> => {
    const requestData: TriggerRescoreRequest = {
      site_id: siteId,
      ...(force !== undefined && { force }),
    };

    const result = await authenticatedRequest<TriggerRescoreResponse>(
      ENDPOINTS.DIAGNOSTICS.TRIGGER_RESCORE,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    return result;
  },

  getPageIndicators: async (
    pageId: string,
    params?: { 
      category?: string; 
      status?: DiagnosticStatus; 
      limit?: number; 
      offset?: number;
    }
  ): Promise<Result<{ indicators: DiagnosticIndicator[]; pagination: { total: number; limit: number; offset: number; hasMore: boolean } }>> => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const url = `${ENDPOINTS.DIAGNOSTICS.PAGE_INDICATORS(pageId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return authenticatedRequest(url);
  },

  getAuditDetails: async (auditId: string): Promise<Result<DiagnosticAuditDetails>> => 
    authenticatedRequest<DiagnosticAuditDetails>(
      ENDPOINTS.DIAGNOSTICS.AUDIT_DETAILS(auditId)
    ),
};
