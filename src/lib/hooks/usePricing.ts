import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  PricingTier,
  PricingCalculationRequest,
  PricingCalculationResponse,
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

// Generic API request function for pricing endpoints (with authentication)
const pricingApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  onAuthError?: () => void
): Promise<Result<T>> => {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;
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

// Generic API request function for public pricing endpoints (without authentication)
const publicPricingApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<Result<T>> => {
  try {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
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

interface PricingTiersResponse {
  tiers: PricingTier[];
  add_ons: {
    extra_site_price: number;
    query_overage_price: number;
    custom_embedding_markup: number;
  };
  total: number;
}

interface UsePricingReturn {
  tiers: PricingTier[];
  addOns: {
    extra_site_price: number;
    query_overage_price: number;
    custom_embedding_markup: number;
  };
  isLoading: boolean;
  error: string | null;
  refreshTiers: () => Promise<void>;
  getTierByName: (tierName: string) => PricingTier | undefined;
  calculatePricing: (request: PricingCalculationRequest) => Promise<{
    success: boolean;
    data?: PricingCalculationResponse;
    error?: string;
  }>;
  getProductPricing: (productSlug: string) => Promise<{
    success: boolean;
    data?: PricingTiersResponse;
    error?: string;
  }>;
  getPricingComparison: () => Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }>;
}

export const usePricing = (): UsePricingReturn => {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [addOns, setAddOns] = useState({
    extra_site_price: 0,
    query_overage_price: 0,
    custom_embedding_markup: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forceLogout } = useAuth();

  const refreshTiers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try public endpoint first (no authentication required)
      const result =
        await publicPricingApiRequest<PricingTiersResponse>('/pricing/tiers');

      if (result.success && result.data) {
        setTiers(result.data.tiers);
        setAddOns(result.data.add_ons);
      } else {
        // If public endpoint fails, try with authentication
        const authResult = await pricingApiRequest<PricingTiersResponse>(
          '/pricing/tiers',
          {},
          forceLogout
        );

        if (authResult.success && authResult.data) {
          setTiers(authResult.data.tiers);
          setAddOns(authResult.data.add_ons);
        } else {
          setError(
            authResult.success === false
              ? authResult.error.message
              : 'Failed to fetch pricing tiers'
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const getTierByName = useCallback(
    (tierName: string): PricingTier | undefined => {
      return tiers.find(tier => tier.tier_name === tierName);
    },
    [tiers]
  );

  const calculatePricing = useCallback(
    async (
      request: PricingCalculationRequest
    ): Promise<{
      success: boolean;
      data?: PricingCalculationResponse;
      error?: string;
    }> => {
      try {
        const result = await pricingApiRequest<PricingCalculationResponse>(
          '/pricing/calculate',
          {
            method: 'POST',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success && result.data) {
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            error:
              result.success === false
                ? result.error.message
                : 'Pricing calculation failed',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout]
  );

  const getProductPricing = useCallback(
    async (
      productSlug: string
    ): Promise<{
      success: boolean;
      data?: PricingTiersResponse;
      error?: string;
    }> => {
      try {
        // Try public endpoint first (no authentication required)
        const result = await publicPricingApiRequest<PricingTiersResponse>(
          `/pricing/products/${productSlug}/tiers`
        );

        if (result.success && result.data) {
          return { success: true, data: result.data };
        } else {
          // If public endpoint fails, try with authentication
          const authResult = await pricingApiRequest<PricingTiersResponse>(
            `/pricing/products/${productSlug}/tiers`,
            {},
            forceLogout
          );

          if (authResult.success && authResult.data) {
            return { success: true, data: authResult.data };
          } else {
            return {
              success: false,
              error:
                authResult.success === false
                  ? authResult.error.message
                  : 'Failed to fetch product pricing',
            };
          }
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout]
  );

  const getPricingComparison = useCallback(async (): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> => {
    try {
      // Try public endpoint first (no authentication required)
      const result = await publicPricingApiRequest<any>('/pricing/comparison');

      if (result.success && result.data) {
        return { success: true, data: result.data };
      } else {
        // If public endpoint fails, try with authentication
        const authResult = await pricingApiRequest<any>(
          '/pricing/comparison',
          {},
          forceLogout
        );

        if (authResult.success && authResult.data) {
          return { success: true, data: authResult.data };
        } else {
          return {
            success: false,
            error:
              authResult.success === false
                ? authResult.error.message
                : 'Failed to fetch pricing comparison',
          };
        }
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred',
      };
    }
  }, [forceLogout]);

  // Load pricing tiers on mount
  useEffect(() => {
    refreshTiers();
  }, [refreshTiers]);

  return {
    tiers,
    addOns,
    isLoading,
    error,
    refreshTiers,
    getTierByName,
    calculatePricing,
    getProductPricing,
    getPricingComparison,
  };
};
