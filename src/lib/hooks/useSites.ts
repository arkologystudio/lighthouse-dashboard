import { useState, useEffect, useCallback } from 'react';
import { sitesApi, matchResult } from '../api';
import { MESSAGES } from '../constants';
import type { Site, CreateSiteRequest } from '../../types';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface UseSitesReturn {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  createSite: (siteData: CreateSiteRequest) => Promise<boolean>;
  deleteSite: (siteId: string) => Promise<boolean>;
  refreshSites: () => Promise<void>;
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

  return {
    sites,
    isLoading,
    error,
    createSite,
    deleteSite,
    refreshSites,
  };
};
