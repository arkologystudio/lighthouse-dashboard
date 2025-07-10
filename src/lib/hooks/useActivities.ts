import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  ActivityLog,
  ActivityLogResponse,
  ActivityStatsResponse,
  Result,
} from '../../types';
import { useAuth } from './useAuth';
import Cookies from 'js-cookie';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    Cookies.get('lighthouse_auth_token') ||
    localStorage.getItem('lighthouse_auth_token')
  );
};

// Generic API request function for activity endpoints
const activityApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  onAuthError?: () => void
): Promise<Result<T>> => {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
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

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    // Check for authentication errors
    if (response.status === 401) {
      onAuthError?.();
      return {
        success: false,
        error: {
          message: 'Session expired',
          code: 'AUTH_EXPIRED',
        },
      };
    }

    const apiResponse = await response.json();

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

    return { success: true, data: apiResponse.data || apiResponse };
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

interface UseActivitiesReturn {
  activities: ActivityLog[];
  stats: ActivityStatsResponse | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  refreshActivities: (options?: {
    limit?: number;
    offset?: number;
    siteId?: string;
  }) => Promise<void>;
  refreshStats: (options?: { siteId?: string; days?: number }) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useActivities = (): UseActivitiesReturn => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentLimit] = useState(20);
  const { forceLogout } = useAuth();

  const refreshActivities = useCallback(
    async (options?: { limit?: number; offset?: number; siteId?: string }) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.offset) params.append('offset', options.offset.toString());
        if (options?.siteId) params.append('site_id', options.siteId);

        const queryString = params.toString();
        const endpoint = `/users/activities${queryString ? `?${queryString}` : ''}`;

        const result = await activityApiRequest<ActivityLogResponse>(
          endpoint,
          {},
          forceLogout
        );

        if (result.success && result.data) {
          if (options?.offset && options.offset > 0) {
            // Append to existing activities for pagination
            setActivities(prev => [...prev, ...result.data.activities]);
          } else {
            // Replace activities for fresh fetch
            setActivities(result.data.activities);
          }
          setHasMore(result.data.has_more);
          setCurrentOffset(
            (options?.offset || 0) + result.data.activities.length
          );
        } else {
          setError(
            !result.success
              ? result.error.message
              : 'Failed to fetch activities'
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [forceLogout]
  );

  const refreshStats = useCallback(
    async (options?: { siteId?: string; days?: number }) => {
      try {
        const params = new URLSearchParams();
        if (options?.siteId) params.append('site_id', options.siteId);
        if (options?.days) params.append('days', options.days.toString());

        const queryString = params.toString();
        const endpoint = `/users/activities/stats${queryString ? `?${queryString}` : ''}`;

        const result = await activityApiRequest<{
          stats: ActivityStatsResponse;
        }>(endpoint, {}, forceLogout);

        if (result.success && result.data) {
          setStats(result.data.stats);
        } else {
          // For development: Don't show errors for missing stats endpoint
          // Just set empty stats to avoid error logging
          setStats({
            total_activities: 0,
            recent_activity_count: 0,
            activities_by_type: {},
          });
        }
      } catch (err) {
        // For development: Don't show errors for missing stats endpoint
        setStats({
          total_activities: 0,
          recent_activity_count: 0,
          activities_by_type: {},
        });
      }
    },
    [forceLogout]
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    await refreshActivities({
      limit: currentLimit,
      offset: currentOffset,
    });
  }, [hasMore, isLoading, currentLimit, currentOffset, refreshActivities]);

  // Load initial data on mount
  useEffect(() => {
    // For development: Use empty data instead of trying to fetch
    setActivities([]);
    refreshStats();
  }, [refreshStats]);

  return {
    activities,
    stats,
    isLoading,
    error,
    hasMore,
    refreshActivities,
    refreshStats,
    loadMore,
  };
};
