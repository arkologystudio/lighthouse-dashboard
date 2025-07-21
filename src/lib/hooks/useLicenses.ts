import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  License,
  UserLicenseStats,
  ValidateLicenseRequest,
  ValidateLicenseResponse,
  Result,
  ApiError,
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
}

export const useLicenses = (): UseLicensesReturn => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [stats, setStats] = useState<UserLicenseStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forceLogout } = useAuth();

  const refreshLicenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await licenseApiRequest<{ licenses: License[] }>(
        '/licenses/me',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setLicenses(result.data.licenses);
      } else {
        setError(
          result.success === false
            ? result.error.message
            : 'Failed to fetch licenses'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const refreshStats = useCallback(async () => {
    try {
      const result = await licenseApiRequest<{ stats: UserLicenseStats }>(
        '/licenses/me/stats',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setStats(result.data.stats);
      }
    } catch (err) {
      // Don't show errors for stats endpoint
      console.warn('Failed to fetch license stats:', err);
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
      } catch (err) {
        console.error('Failed to validate license:', err);
        return null;
      }
    },
    [forceLogout]
  );

  const getLicense = useCallback(
    async (licenseId: string): Promise<License | null> => {
      try {
        const result = await licenseApiRequest<{ license: License }>(
          `/licenses/me/${licenseId}`,
          {},
          forceLogout
        );

        if (result.success && result.data) {
          return result.data.license;
        }
        return null;
      } catch (err) {
        console.error('Failed to get license:', err);
        return null;
      }
    },
    [forceLogout]
  );

  const getLicenseByProduct = useCallback(
    (productSlug: string): License | undefined => {
      return licenses.find(
        license =>
          license.product?.slug === productSlug && license.status === 'active'
      );
    },
    [licenses]
  );

  // Load licenses and stats on mount
  useEffect(() => {
    refreshLicenses();
    refreshStats();
  }, [refreshLicenses, refreshStats]);

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
  };
};
