import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  License,
  UserLicenseStats,
  ValidateLicenseRequest,
  ValidateLicenseResponse,
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

// Generic API request function for license endpoints
const licenseApiRequest = async <T>(
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

interface UseLicensesReturn {
  licenses: License[];
  stats: UserLicenseStats | null;
  isLoading: boolean;
  error: string | null;
  refreshLicenses: () => Promise<void>;
  refreshStats: () => Promise<void>;
  validateLicense: (
    request: ValidateLicenseRequest
  ) => Promise<ValidateLicenseResponse | null>;
  getLicense: (licenseId: string) => Promise<License | null>;
  getLicenseByProduct: (productSlug: string) => License | undefined;
  assignLicense: (licenseId: string, siteId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  unassignLicense: (licenseId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  getAvailableLicensesForSite: (siteId: string) => Promise<{
    success: boolean;
    data?: {
      assigned_license: License | null;
      unassigned_licenses: License[];
    };
    error?: string;
  }>;
  getLicenseUsage: (licenseId: string) => Promise<{
    success: boolean;
    data?: {usage: {queries_used?: number; sites_used?: number; downloads_used?: number}};
    error?: string;
  }>;
}

export const useLicenses = (): UseLicensesReturn => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<UserLicenseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { forceLogout } = useAuth();

  const refreshLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await licenseApiRequest<{ licenses: License[] }>(
        '/licenses/my',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setLicenses(Array.isArray(result.data.licenses) ? result.data.licenses : []);
      } else {
        setLicenses([]);
        setError(
          result.success === false
            ? result.error.message
            : 'Failed to fetch licenses'
        );
      }
    } catch (_err) {
      setLicenses([]);
      setError(_err instanceof Error ? _err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const refreshStats = useCallback(async () => {
    try {
      const result = await licenseApiRequest<{ stats: UserLicenseStats }>(
        '/licenses/my/stats',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setStats(result.data.stats);
      }
    } catch (_err) {
      // Don't show errors for stats endpoint
      console.warn('Failed to fetch license stats:', _err);
    }
  }, [forceLogout]);

  const validateLicense = useCallback(
    async (
      request: ValidateLicenseRequest
    ): Promise<ValidateLicenseResponse | null> => {
      try {
        const result = await licenseApiRequest<ValidateLicenseResponse>(
          '/licenses/validate',
          {
            method: 'POST',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success && result.data) {
          return result.data;
        }
        return null;
      } catch (_err) {
        console.error('Failed to validate license:', _err);
        return null;
      }
    },
    [forceLogout]
  );

  const getLicense = useCallback(
    async (licenseId: string): Promise<License | null> => {
      try {
        const result = await licenseApiRequest<{ license: License }>(
          `/licenses/my/${licenseId}`,
          {},
          forceLogout
        );

        if (result.success && result.data) {
          return result.data.license;
        }
        return null;
      } catch (_err) {
        console.error('Failed to get license:', _err);
        return null;
      }
    },
    [forceLogout]
  );

  const getLicenseByProduct = useCallback(
    (productSlug: string): License | undefined =>
      licenses.find(
        license =>
          license.product?.slug === productSlug && license.status === 'active'
      ),
    [licenses]
  );

  // Load licenses and stats on mount
  useEffect(() => {
    refreshLicenses();
    refreshStats();
  }, [refreshLicenses, refreshStats]);

  const assignLicense = useCallback(
    async (licenseId: string, siteId: string): Promise<{
      success: boolean;
      error?: string;
    }> => {
      try {
        const result = await licenseApiRequest<{ license: License }>(
          `/licenses/${licenseId}/assign-site`,
          {
            method: 'POST',
            body: JSON.stringify({ site_id: siteId }),
          },
          forceLogout
        );

        if (result.success) {
          // Refresh licenses to get updated assignment info
          await refreshLicenses();
          return { success: true };
        } else {
          return {
            success: false,
            error: result.success === false ? result.error.message : 'Assignment failed',
          };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout, refreshLicenses]
  );

  const unassignLicense = useCallback(
    async (licenseId: string): Promise<{
      success: boolean;
      error?: string;
    }> => {
      try {
        const result = await licenseApiRequest<{ license: License }>(
          `/licenses/${licenseId}/unassign-site`,
          {
            method: 'DELETE',
          },
          forceLogout
        );

        if (result.success) {
          // Refresh licenses to get updated assignment info
          await refreshLicenses();
          return { success: true };
        } else {
          return {
            success: false,
            error: result.success === false ? result.error.message : 'Unassignment failed',
          };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout, refreshLicenses]
  );

  const getAvailableLicensesForSite = useCallback(
    async (siteId: string): Promise<{
      success: boolean;
      data?: {
        assigned_license: License | null;
        unassigned_licenses: License[];
      };
      error?: string;
    }> => {
      try {
        const result = await licenseApiRequest<{
          assigned_license: License | null;
          unassigned_licenses: License[];
        }>(`/licenses/available-for-site/${siteId}`, {}, forceLogout);

        if (result.success && result.data) {
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            error: result.success === false ? result.error.message : 'Failed to fetch available licenses',
          };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout]
  );

  const getLicenseUsage = useCallback(
    async (licenseId: string): Promise<{
      success: boolean;
      data?: {usage: {queries_used?: number; sites_used?: number; downloads_used?: number}};
      error?: string;
    }> => {
      try {
        const result = await licenseApiRequest<{usage: {queries_used?: number; sites_used?: number; downloads_used?: number}}>(
          `/licenses/${licenseId}/usage`,
          {},
          forceLogout
        );

        if (result.success && result.data) {
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            error: result.success === false ? result.error.message : 'Failed to fetch license usage',
          };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout]
  );

  return {
    licenses,
    stats,
    isLoading,
    error,
    refreshLicenses,
    refreshStats,
    validateLicense,
    getLicense,
    getLicenseByProduct,
    assignLicense,
    unassignLicense,
    getAvailableLicensesForSite,
    getLicenseUsage,
  };
};
