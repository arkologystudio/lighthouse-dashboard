'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLicenses } from '../../../lib/hooks/useLicenses';
import { useSites } from '../../../lib/hooks/useSites';
import { Button } from '../../../components/ui/Button';
import { License, Site } from '../../../types';

interface LicenseWithUsage extends License {
  usage?: {
    queries_used: number;
    queries_remaining: number | null;
    query_period_start: string;
    query_period_end: string | null;
    downloads_used: number;
    downloads_remaining: number | null;
    sites_used: number;
    sites_remaining: number;
    agent_access_enabled: boolean;
    custom_embedding_enabled: boolean;
  };
}

const UsageDashboardClient: React.FC = () => {
  const { licenses, isLoading, error, refreshLicenses, getLicenseUsage } = useLicenses();
  const { sites } = useSites();
  const [licensesWithUsage, setLicensesWithUsage] = useState<LicenseWithUsage[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const loadUsageData = useCallback(async () => {
    setLoadingUsage(true);
    const licensesWithUsageData: LicenseWithUsage[] = [];

    for (const license of licenses) {
      // Validate license ID before making API call
      if (!license.id || license.id === 'undefined' || license.id === '') {
        console.warn('Invalid license ID:', license.id);
        licensesWithUsageData.push(license);
        continue;
      }

      try {
        const usageResult = await getLicenseUsage(license.id);
        const usage = usageResult.success && usageResult.data ? usageResult.data.usage : undefined;
        licensesWithUsageData.push({
          ...license,
          usage: usage ? {
            queries_used: usage.queries_used || 0,
            queries_remaining: null,
            query_period_start: new Date().toISOString(),
            query_period_end: null,
            downloads_used: usage.downloads_used || 0,
            downloads_remaining: null,
            sites_used: usage.sites_used || 0,
            sites_remaining: 0,
            agent_access_enabled: false,
            custom_embedding_enabled: false,
          } : undefined,
        });
      } catch (err) {
        console.warn(`Failed to load usage for license ${license.id}:`, err);
        licensesWithUsageData.push(license);
      }
    }

    setLicensesWithUsage(licensesWithUsageData);
    setLoadingUsage(false);
  }, [licenses, getLicenseUsage]);

  useEffect(() => {
    if (licenses.length > 0) {
      loadUsageData();
    }
  }, [licenses, loadUsageData]);

  const getAssignedSite = (license: License): Site | undefined => {
    const assignedSiteId = license.metadata?.assigned_site_id;
    return assignedSiteId ? sites.find(site => site.id === assignedSiteId) : undefined;
  };

  const getUsagePercentage = (used: number, total: number | null): number => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getTotalUsage = () => {
    let totalQueriesUsed = 0;
    let totalQueriesLimit = 0;
    let totalDownloadsUsed = 0;
    let totalSitesUsed = 0;
    let totalSitesLimit = 0;

    licensesWithUsage.forEach(license => {
      if (license.usage) {
        totalQueriesUsed += license.usage.queries_used;
        totalDownloadsUsed += license.usage.downloads_used;
        totalSitesUsed += license.usage.sites_used;
        totalSitesLimit += license.usage.sites_used + license.usage.sites_remaining;
        
        if (license.usage.queries_remaining !== null) {
          totalQueriesLimit += license.usage.queries_used + license.usage.queries_remaining;
        }
      }
    });

    return {
      totalQueriesUsed,
      totalQueriesLimit: totalQueriesLimit || null,
      totalDownloadsUsed,
      totalSitesUsed,
      totalSitesLimit,
    };
  };

  const totalUsage = getTotalUsage();

  if (isLoading && licenses.length === 0) {
    return (
      <div className="lh-loading-container">
        <div className="lh-spinner lh-spinner-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usage Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor your license usage, quotas, and consumption across all sites.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => {
                refreshLicenses();
                loadUsageData();
              }}
              disabled={isLoading || loadingUsage}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loadingUsage ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-blue-600">
              {totalUsage.totalQueriesUsed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Queries Used</div>
            {totalUsage.totalQueriesLimit && (
              <div className="text-xs text-gray-500 mt-1">
                of {totalUsage.totalQueriesLimit.toLocaleString()} available
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">{totalUsage.totalSitesUsed}</div>
            <div className="text-sm text-gray-600">Sites Used</div>
            <div className="text-xs text-gray-500 mt-1">
              of {totalUsage.totalSitesLimit} available
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-purple-600">{totalUsage.totalDownloadsUsed}</div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-2xl font-bold text-orange-600">{licensesWithUsage.length}</div>
            <div className="text-sm text-gray-600">Active Licenses</div>
          </div>
        </div>

        {/* License Usage Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">License Usage Details</h3>
          </div>
          <div className="p-6">
            {licensesWithUsage.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No usage data available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Purchase a license to start tracking usage.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {licensesWithUsage.map(license => {
                  const assignedSite = getAssignedSite(license);
                  const usage = license.usage;
                  
                  return (
                    <div key={license.id} className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">
                            {license.license_type.replace('_', ' ').toUpperCase()}
                          </h4>
                          <div className="text-sm text-gray-600">
                            {assignedSite ? (
                              <span>Assigned to <strong>{assignedSite.name}</strong></span>
                            ) : (
                              <span className="text-yellow-600">Unassigned</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            license.status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {license.status.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {usage ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Query Usage */}
                          {(usage.queries_used > 0 || usage.queries_remaining !== null) && (
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">Query Usage</div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Used:</span>
                                  <span className="font-medium">{usage.queries_used.toLocaleString()}</span>
                                </div>
                                {usage.queries_remaining !== null && (
                                  <>
                                    <div className="flex justify-between text-sm">
                                      <span>Remaining:</span>
                                      <span className="font-medium">{usage.queries_remaining.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${getUsageColor(
                                          getUsagePercentage(usage.queries_used, usage.queries_used + usage.queries_remaining)
                                        )}`}
                                        style={{ 
                                          width: `${Math.min(
                                            getUsagePercentage(usage.queries_used, usage.queries_used + usage.queries_remaining), 
                                            100
                                          )}%` 
                                        }}
                                      />
                                    </div>
                                    <div className={`text-xs ${getTextColor(
                                      getUsagePercentage(usage.queries_used, usage.queries_used + usage.queries_remaining)
                                    )}`}>
                                      {getUsagePercentage(usage.queries_used, usage.queries_used + usage.queries_remaining)}% used
                                    </div>
                                  </>
                                )}
                                {usage.query_period_start && (
                                  <div className="text-xs text-gray-500">
                                    Period: {formatDate(usage.query_period_start)}
                                    {usage.query_period_end && ` - ${formatDate(usage.query_period_end)}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Site Usage */}
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Site Usage</div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Used:</span>
                                <span className="font-medium">{usage.sites_used}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Available:</span>
                                <span className="font-medium">{usage.sites_remaining}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getUsageColor(
                                    getUsagePercentage(usage.sites_used, usage.sites_used + usage.sites_remaining)
                                  )}`}
                                  style={{ 
                                    width: `${Math.min(
                                      getUsagePercentage(usage.sites_used, usage.sites_used + usage.sites_remaining), 
                                      100
                                    )}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Features & Downloads */}
                          <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">Features & Downloads</div>
                            <div className="space-y-2">
                              {usage.downloads_used > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span>Downloads:</span>
                                  <span className="font-medium">{usage.downloads_used}</span>
                                </div>
                              )}
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${
                                    usage.agent_access_enabled ? 'bg-green-500' : 'bg-gray-300'
                                  }`} />
                                  <span>Agent API</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <div className={`w-2 h-2 rounded-full ${
                                    usage.custom_embedding_enabled ? 'bg-green-500' : 'bg-gray-300'
                                  }`} />
                                  <span>Custom Embedding</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <div className="text-sm">Usage data not available</div>
                          {loadingUsage && (
                            <div className="mt-2">
                              <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full inline-block" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Usage Alerts */}
        {licensesWithUsage.some(license => {
          if (!license.usage) return false;
          const queryUsage = license.usage.queries_remaining !== null 
            ? getUsagePercentage(license.usage.queries_used, license.usage.queries_used + license.usage.queries_remaining)
            : 0;
          const siteUsage = getUsagePercentage(license.usage.sites_used, license.usage.sites_used + license.usage.sites_remaining);
          return queryUsage >= 80 || siteUsage >= 80;
        }) && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="px-6 py-4 border-b border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800">Usage Alerts</h3>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                {licensesWithUsage.map(license => {
                  if (!license.usage) return null;
                  
                  const queryUsage = license.usage.queries_remaining !== null 
                    ? getUsagePercentage(license.usage.queries_used, license.usage.queries_used + license.usage.queries_remaining)
                    : 0;
                  const siteUsage = getUsagePercentage(license.usage.sites_used, license.usage.sites_used + license.usage.sites_remaining);
                  
                  const alerts = [];
                  if (queryUsage >= 90) alerts.push(`Query usage at ${queryUsage}%`);
                  else if (queryUsage >= 80) alerts.push(`Query usage at ${queryUsage}%`);
                  
                  if (siteUsage >= 90) alerts.push(`Site usage at ${siteUsage}%`);
                  else if (siteUsage >= 80) alerts.push(`Site usage at ${siteUsage}%`);
                  
                  if (alerts.length === 0) return null;
                  
                  return (
                    <div key={license.id} className="text-sm text-yellow-800">
                      <strong>{license.license_type.replace('_', ' ').toUpperCase()}:</strong> {alerts.join(', ')}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageDashboardClient;