import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  EcosystemProduct,
  SiteProduct,
  RegisterSiteProductRequest,
  UpdateSiteProductRequest,
  SiteProductsResponse,
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

// Generic API request function for ecosystem endpoints
const ecosystemApiRequest = async <T>(
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

interface UseProductsReturn {
  products: EcosystemProduct[];
  siteProducts: SiteProduct[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  refreshSiteProducts: (siteId: string) => Promise<void>;
  registerProduct: (
    siteId: string,
    request: RegisterSiteProductRequest
  ) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (
    siteId: string,
    productSlug: string,
    request: UpdateSiteProductRequest
  ) => Promise<{ success: boolean; error?: string }>;
  unregisterProduct: (
    siteId: string,
    productSlug: string
  ) => Promise<{ success: boolean; error?: string }>;
  checkProductStatus: (
    siteId: string,
    productSlug: string
  ) => Promise<{ has_product: boolean; enabled: boolean } | null>;
}

export const useProducts = (initialProducts?: EcosystemProduct[]): UseProductsReturn => {
  const { prefetchedProducts, forceLogout } = useAuth();
  
  // Use prefetched data if available, otherwise fall back to initialProducts
  const dataToUse = prefetchedProducts || initialProducts || [];
  const hasData = prefetchedProducts || initialProducts;
  
  const [products, setProducts] = useState<EcosystemProduct[]>(dataToUse);
  const [siteProducts, setSiteProducts] = useState<SiteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(!hasData);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ecosystemApiRequest<{
        products: EcosystemProduct[];
      }>(
        '/ecosystem/products',
        {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
          },
        },
        forceLogout
      );

      if (result.success && result.data) {
        setProducts(result.data.products);
      } else {
        setError(
          result.success === false
            ? result.error.message
            : 'Failed to fetch products'
        );
      }
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const refreshSiteProducts = useCallback(
    async (siteId: string) => {
      setError(null);

      try {
        const result = await ecosystemApiRequest<SiteProductsResponse>(
          `/sites/${siteId}/products`,
          {},
          forceLogout
        );
        if (result.success && result.data) {
          setSiteProducts(result.data.products);
        } else {
          setError(
            !result.success
              ? result.error.message
              : 'Failed to fetch site products'
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    },
    [forceLogout]
  );

  const registerProduct = useCallback(
    async (
      siteId: string,
      request: RegisterSiteProductRequest
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await ecosystemApiRequest<{ site_product: SiteProduct }>(
          `/sites/${siteId}/products`,
          {
            method: 'POST',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success) {
          // Refresh site products after successful registration
          await refreshSiteProducts(siteId);
          return { success: true };
        } else {
          return { success: false, error: result.error.message };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [refreshSiteProducts, forceLogout]
  );

  const updateProduct = useCallback(
    async (
      siteId: string,
      productSlug: string,
      request: UpdateSiteProductRequest
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await ecosystemApiRequest<{ site_product: SiteProduct }>(
          `/sites/${siteId}/products/${productSlug}`,
          {
            method: 'PUT',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success) {
          // Refresh site products after successful update
          await refreshSiteProducts(siteId);
          return { success: true };
        } else {
          return { success: false, error: result.error.message };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [refreshSiteProducts, forceLogout]
  );

  const unregisterProduct = useCallback(
    async (
      siteId: string,
      productSlug: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const result = await ecosystemApiRequest(
          `/sites/${siteId}/products/${productSlug}`,
          {
            method: 'DELETE',
          },
          forceLogout
        );

        if (result.success) {
          // Refresh site products after successful unregistration
          await refreshSiteProducts(siteId);
          return { success: true };
        } else {
          return { success: false, error: result.error.message };
        }
      } catch (_err) {
        return {
          success: false,
          error: _err instanceof Error ? _err.message : 'Unknown error occurred',
        };
      }
    },
    [refreshSiteProducts, forceLogout]
  );

  const checkProductStatus = useCallback(
    async (
      siteId: string,
      productSlug: string
    ): Promise<{ has_product: boolean; enabled: boolean } | null> => {
      try {
        const result = await ecosystemApiRequest<{
          has_product: boolean;
          enabled: boolean;
        }>(`/sites/${siteId}/products/${productSlug}/status`, {}, forceLogout);
        if (result.success && result.data) {
          return result.data;
        }
        return null;
      } catch (_err) {
        console.error('Failed to check product status:', _err);
        return null;
      }
    },
    [forceLogout]
  );

  // Update products when prefetched data becomes available
  useEffect(() => {
    if (prefetchedProducts && prefetchedProducts.length > 0) {
      setProducts(prefetchedProducts);
      setIsLoading(false);
    }
  }, [prefetchedProducts]);

  // Load products on mount only if we don't have any data (initial or prefetched)
  useEffect(() => {
    if (!hasData) {
      refreshProducts();
    }
  }, [refreshProducts, hasData]);

  return {
    products,
    siteProducts,
    isLoading,
    error,
    refreshProducts,
    refreshSiteProducts,
    registerProduct,
    updateProduct,
    unregisterProduct,
    checkProductStatus,
  };
};
