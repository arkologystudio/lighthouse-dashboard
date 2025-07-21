import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  EcosystemProduct,
  SimulatePurchaseRequest,
  SimulatePurchaseResponse,
  License,
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

// Generic API request function for purchase endpoints
const purchaseApiRequest = async <T>(
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

interface AvailableProduct extends EcosystemProduct {
  has_license: boolean;
  license_status?: string;
}

interface PurchaseHistoryItem {
  purchase_reference: string;
  product_name: string;
  license_type: string;
  purchased_at: string;
  license: License;
}

interface UsePurchasesReturn {
  availableProducts: AvailableProduct[];
  purchaseHistory: PurchaseHistoryItem[];
  isLoading: boolean;
  error: string | null;
  refreshAvailableProducts: () => Promise<void>;
  refreshPurchaseHistory: () => Promise<void>;
  simulatePurchase: (request: SimulatePurchaseRequest) => Promise<{
    success: boolean;
    data?: SimulatePurchaseResponse;
    error?: string;
  }>;
}

export const usePurchases = (): UsePurchasesReturn => {
  const [availableProducts, setAvailableProducts] = useState<
    AvailableProduct[]
  >([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forceLogout } = useAuth();

  const refreshAvailableProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await purchaseApiRequest<{ products: AvailableProduct[] }>(
        '/purchases/available',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setAvailableProducts(result.data.products);
      } else {
        setError(
          result.success === false
            ? result.error.message
            : 'Failed to fetch available products'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const refreshPurchaseHistory = useCallback(async () => {
    try {
      const result = await purchaseApiRequest<{
        purchases: PurchaseHistoryItem[];
      }>('/purchases/user/history', {}, forceLogout);

      if (result.success && result.data) {
        setPurchaseHistory(result.data.purchases);
      }
    } catch (err) {
      console.warn('Failed to fetch purchase history:', err);
    }
  }, [forceLogout]);

  const simulatePurchase = useCallback(
    async (
      request: SimulatePurchaseRequest
    ): Promise<{
      success: boolean;
      data?: SimulatePurchaseResponse;
      error?: string;
    }> => {
      try {
        const result = await purchaseApiRequest<SimulatePurchaseResponse>(
          '/purchases/simulate',
          {
            method: 'POST',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success && result.data) {
          // Refresh data after successful purchase
          await Promise.all([
            refreshAvailableProducts(),
            refreshPurchaseHistory(),
          ]);

          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            error:
              result.success === false
                ? result.error.message
                : 'Purchase failed',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout, refreshAvailableProducts, refreshPurchaseHistory]
  );

  // Load data on mount - DISABLED to prevent auth issues
  // TODO: Enable when purchase API endpoints are properly implemented
  // useEffect(() => {
  //   refreshAvailableProducts();
  //   refreshPurchaseHistory();
  // }, [refreshAvailableProducts, refreshPurchaseHistory]);

  return {
    availableProducts,
    purchaseHistory,
    isLoading,
    error,
    refreshAvailableProducts,
    refreshPurchaseHistory,
    simulatePurchase,
  };
};
