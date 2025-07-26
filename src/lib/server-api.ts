import { cookies } from 'next/headers';
import { API_BASE_URL, STORAGE_KEYS } from './constants';
import type {
  Result,
  Site,
  EcosystemProduct,
  ActivityLog,
  ActivityStatsResponse,
  ApiResponse,
} from '../types';

// Server-side API request function
const serverApiRequest = async <T>(
  endpoint: string,
  token?: string,
  options: RequestInit = {}
): Promise<Result<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
      return {
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
        },
      };
    }

    const apiResponse: ApiResponse<T> = await response.json();

    if (!response.ok || !apiResponse.success) {
      return {
        success: false,
        error: {
          message:
            apiResponse.error ||
            `HTTP ${response.status}: ${response.statusText}`,
          code: response.status.toString(),
          details: apiResponse,
        },
      };
    }

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

// Get auth token from cookies on server side
const getServerAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(STORAGE_KEYS.AUTH_TOKEN)?.value || null;
};

// Server-side API functions
export const serverSitesApi = {
  getAll: async (): Promise<Result<Site[]>> => {
    const token = await getServerAuthToken();
    if (!token) {
      return {
        success: false,
        error: { message: 'No authentication token', code: 'AUTH_REQUIRED' },
      };
    }

    return serverApiRequest<Site[]>('/sites', token);
  },
};

export const serverProductsApi = {
  getAll: async (): Promise<Result<EcosystemProduct[]>> => {
    const token = await getServerAuthToken();
    if (!token) {
      return {
        success: false,
        error: { message: 'No authentication token', code: 'AUTH_REQUIRED' },
      };
    }

    return serverApiRequest<EcosystemProduct[]>('/products', token);
  },
};

export const serverActivitiesApi = {
  getAll: async (options?: { limit?: number }): Promise<Result<ActivityLog[]>> => {
    const token = await getServerAuthToken();
    if (!token) {
      // Return empty activities instead of error for better UX
      return { success: true, data: [] };
    }

    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/api/users/activities${queryString ? `?${queryString}` : ''}`;

    const result = await serverApiRequest<{ activities: ActivityLog[] }>(endpoint, token);
    
    if (result.success && result.data) {
      return { success: true, data: result.data.activities };
    }
    
    // Return empty activities on error for better UX
    return { success: true, data: [] };
  },

  getStats: async (): Promise<Result<ActivityStatsResponse>> => {
    const token = await getServerAuthToken();
    if (!token) {
      // Return default stats instead of error
      return {
        success: true,
        data: {
          total_activities: 0,
          recent_activity_count: 0,
          activities_by_type: {},
        },
      };
    }

    const result = await serverApiRequest<{ stats: ActivityStatsResponse }>('/api/users/activities/stats', token);
    
    if (result.success && result.data) {
      return { success: true, data: result.data.stats };
    }
    
    // Return default stats on error
    return {
      success: true,
      data: {
        total_activities: 0,
        recent_activity_count: 0,
        activities_by_type: {},
      },
    };
  },
};