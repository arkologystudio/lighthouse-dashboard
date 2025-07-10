import { useState, useEffect, useCallback } from 'react';
import { sitesApi, matchResult } from '../api';
import { MESSAGES } from '../constants';
import type { Site, CreateSiteRequest, Result } from '../../types';
import toast from 'react-hot-toast';

interface UseSitesReturn {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  createSite: (siteData: CreateSiteRequest) => Promise<boolean>;
  deleteSite: (siteId: string) => Promise<boolean>;
  refreshSites: () => Promise<void>;
}

export const useSites = (): UseSitesReturn => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

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
