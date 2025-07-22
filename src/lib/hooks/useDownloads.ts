import { useState, useCallback } from 'react';
import { API_BASE_URL } from '../constants';
import {
  Download,
  InitiateDownloadRequest,
  InitiateDownloadResponse,
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

// Generic API request function for download endpoints
const downloadApiRequest = async <T>(
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

interface UseDownloadsReturn {
  downloads: Download[];
  isLoading: boolean;
  error: string | null;
  refreshDownloads: () => Promise<void>;
  initiateDownload: (request: InitiateDownloadRequest) => Promise<{
    success: boolean;
    data?: InitiateDownloadResponse;
    error?: string;
  }>;
  downloadFile: (downloadToken: string, filename: string) => Promise<boolean>;
}

export const useDownloads = (): UseDownloadsReturn => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forceLogout } = useAuth();

  const refreshDownloads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await downloadApiRequest<{ downloads: Download[] }>(
        '/downloads/user/history',
        {},
        forceLogout
      );

      if (result.success && result.data) {
        setDownloads(result.data.downloads);
      } else {
        setError(
          result.success === false
            ? result.error.message
            : 'Failed to fetch downloads'
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [forceLogout]);

  const initiateDownload = useCallback(
    async (
      request: InitiateDownloadRequest
    ): Promise<{
      success: boolean;
      data?: InitiateDownloadResponse;
      error?: string;
    }> => {
      try {
        const result = await downloadApiRequest<InitiateDownloadResponse>(
          '/downloads/initiate',
          {
            method: 'POST',
            body: JSON.stringify(request),
          },
          forceLogout
        );

        if (result.success && result.data) {
          // Refresh download history after successful initiation
          await refreshDownloads();
          return { success: true, data: result.data };
        } else {
          return {
            success: false,
            error:
              result.success === false
                ? result.error.message
                : 'Failed to initiate download',
          };
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error occurred',
        };
      }
    },
    [forceLogout, refreshDownloads]
  );

  const downloadFile = useCallback(
    async (downloadToken: string, filename: string): Promise<boolean> => {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${API_BASE_URL}/api/downloads/file/${downloadToken}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Download failed: ${response.statusText}`);
        }

        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Refresh download history after successful download
        await refreshDownloads();
        return true;
      } catch (err) {
        console.error('Download failed:', err);
        return false;
      }
    },
    [refreshDownloads]
  );

  // Load downloads on mount - DISABLED to prevent auth issues
  // TODO: Enable when download API endpoints are properly implemented
  // useEffect(() => {
  //   refreshDownloads();
  // }, [refreshDownloads]);

  return {
    downloads,
    isLoading,
    error,
    refreshDownloads,
    initiateDownload,
    downloadFile,
  };
};
