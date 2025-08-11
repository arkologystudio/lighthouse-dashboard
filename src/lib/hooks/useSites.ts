import { useState, useEffect, useCallback } from 'react';
import { sitesApi, matchResult } from '../api';
import { MESSAGES, API_BASE_URL } from '../constants';
import type { Site, CreateSiteRequest } from '../../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return (
    Cookies.get('lighthouse_auth_token') ||
    localStorage.getItem('lighthouse_auth_token')
  );
};

interface UseSitesReturn {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  createSite: (siteData: CreateSiteRequest) => Promise<boolean>;
  deleteSite: (siteId: string) => Promise<boolean>;
  refreshSites: () => Promise<void>;
  getSiteCredentials: (siteId: string) => Promise<{
    success: boolean;
    data?: {
      site: {id: string; name: string; url: string};
      credentials: {
        api_key: {id: string; name: string; key_prefix: string; scopes: string[]; note: string} | null;
        license: {id: string; license_key: string; license_type: string; max_queries: number | null; query_count: number; assigned_at: string} | null;
      };
      setup_complete: boolean;
      next_steps: string[];
    };
    error?: string;
  }>;
  getSiteProducts: (siteId: string) => Promise<{
    success: boolean;
    data?: {products: Array<{product_slug: string; is_enabled: boolean}>};
    error?: string;
  }>;
  installProduct: (siteId: string, productSlug: string, config?: Record<string, unknown>) => Promise<{
    success: boolean;
    data?: {message: string};
    error?: string;
  }>;
  uninstallProduct: (siteId: string, productSlug: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  updateSiteProduct: (siteId: string, productSlug: string, updates: {
    is_enabled?: boolean;
    config?: Record<string, unknown>;
  }) => Promise<{
    success: boolean;
    error?: string;
  }>;
  generateApiKey: (siteId: string, keyName?: string) => Promise<{
    success: boolean;
    data?: {
      id: string;
      name: string;
      key: string;
      key_prefix: string;
      scopes: string[];
      note: string;
    };
    error?: string;
  }>;
  deleteApiKey: (keyId: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export const useSites = (initialSites?: Site[]): UseSitesReturn => {
  const { prefetchedSites } = useAuth();
  
  // Use prefetched data if available, otherwise fall back to initialSites
  const dataToUse = prefetchedSites || initialSites || [];
  const hasData = prefetchedSites || initialSites;
  
  const [sites, setSites] = useState<Site[]>(dataToUse);
  const [isLoading, setIsLoading] = useState(!hasData);
  const [error, setError] = useState<string | null>(null);

  const fetchSites = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const result = await sitesApi.getAll();

    matchResult(result, {
      success: data => {
        setSites(data);
        setIsLoading(false);
      },
      error: apiError => {
        setError(apiError.message);
        setIsLoading(false);
        toast.error(apiError.message || 'Failed to load sites');
      },
    });
  }, []);

  // Update sites when prefetched data becomes available
  useEffect(() => {
    if (prefetchedSites && prefetchedSites.length > 0) {
      setSites(prefetchedSites);
      setIsLoading(false);
    }
  }, [prefetchedSites]);

  useEffect(() => {
    // Only fetch if we don't have any data (initial or prefetched)
    if (!hasData) {
      fetchSites();
    }
  }, [fetchSites, hasData]);

  const createSite = async (siteData: CreateSiteRequest): Promise<boolean> => {
    const result = await sitesApi.create(siteData);

    return matchResult(result, {
      success: newSite => {
        // Optimistic update
        setSites(prev => [...prev, newSite]);
        toast.success(MESSAGES.SUCCESS.SITE_CREATED);
        return true;
      },
      error: apiError => {
        toast.error(apiError.message || 'Failed to create site');
        return false;
      },
    });
  };

  const deleteSite = async (siteId: string): Promise<boolean> => {
    // Optimistic update
    const previousSites = sites;
    setSites(prev => prev.filter(site => site.id !== siteId));

    const result = await sitesApi.delete(siteId);

    return matchResult(result, {
      success: () => {
        toast.success(MESSAGES.SUCCESS.SITE_DELETED);
        return true;
      },
      error: apiError => {
        // Revert optimistic update
        setSites(previousSites);
        toast.error(apiError.message || 'Failed to delete site');
        return false;
      },
    });
  };

  const refreshSites = async (): Promise<void> => {
    await fetchSites();
  };

  const getSiteCredentials = useCallback(async (siteId: string): Promise<{
    success: boolean;
    data?: {
      site: {id: string; name: string; url: string};
      credentials: {
        api_key: {id: string; name: string; key_prefix: string; scopes: string[]; note: string} | null;
        license: {id: string; license_key: string; license_type: string; max_queries: number | null; query_count: number; assigned_at: string} | null;
      };
      setup_complete: boolean;
      next_steps: string[];
    };
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/credentials`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const getSiteProducts = useCallback(async (siteId: string): Promise<{
    success: boolean;
    data?: {products: Array<{product_slug: string; is_enabled: boolean}>};
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/products`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const installProduct = useCallback(async (siteId: string, productSlug: string, config?: Record<string, unknown>): Promise<{
    success: boolean;
    data?: {message: string};
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_slug: productSlug,
          config: config || {},
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const uninstallProduct = useCallback(async (siteId: string, productSlug: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/products/${productSlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const updateSiteProduct = useCallback(async (siteId: string, productSlug: string, updates: {
    is_enabled?: boolean;
    config?: Record<string, unknown>;
  }): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sites/${siteId}/products/${productSlug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const generateApiKey = useCallback(async (siteId: string, keyName = 'WordPress Plugin Key'): Promise<{
    success: boolean;
    data?: {
      id: string;
      name: string;
      key: string;
      key_prefix: string;
      scopes: string[];
      note: string;
    };
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keyName,
          site_id: siteId,
          scopes: ['search', 'embed'],
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { 
        success: true, 
        data: {
          id: result.data.api_key.id,
          name: keyName,
          key: result.data.api_key.key,
          key_prefix: result.data.api_key.key_prefix || result.data.api_key.key?.substring(0, 8),
          scopes: result.data.api_key.scopes || ['search', 'embed'],
          note: 'Generated from dashboard',
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  const deleteApiKey = useCallback(async (keyId: string): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/api-keys/${keyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }, []);

  return {
    sites,
    isLoading,
    error,
    createSite,
    deleteSite,
    refreshSites,
    getSiteCredentials,
    getSiteProducts,
    installProduct,
    uninstallProduct,
    updateSiteProduct,
    generateApiKey,
    deleteApiKey,
  };
};
