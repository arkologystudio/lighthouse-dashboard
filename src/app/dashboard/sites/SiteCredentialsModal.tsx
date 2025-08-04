'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSites } from '../../../lib/hooks/useSites';
import { useLicenses } from '../../../lib/hooks/useLicenses';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Site } from '../../../types';

interface SiteCredentialsModalProps {
  site: Site;
  isOpen: boolean;
  onClose: () => void;
}

interface CredentialsData {
  site: {
    id: string;
    name: string;
    url: string;
  };
  credentials: {
    api_key: {
      id: string;
      name: string;
      key_prefix: string;
      scopes: string[];
      note: string;
    } | null;
    license: {
      id: string;
      license_key: string;
      license_type: string;
      max_queries: number | null;
      query_count: number;
      assigned_at: string;
    } | null;
  };
  setup_complete: boolean;
  next_steps: string[];
}

const SiteCredentialsModal: React.FC<SiteCredentialsModalProps> = ({
  site,
  isOpen,
  onClose,
}) => {
  const { getSiteCredentials } = useSites();
  const { assignLicense, licenses } = useLicenses();
  const [credentialsData, setCredentialsData] =
    useState<CredentialsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadCredentials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getSiteCredentials(site.id);

      if (result.success && result.data) {
        // Enhance the backend data with client-side license assignment data
        const assignedLicense = licenses.find(
          license =>
            license.status === 'active' &&
            license.metadata?.assigned_site_id === site.id
        );

        const enhancedData = {
          ...result.data,
          credentials: {
            ...result.data.credentials,
            license: assignedLicense
              ? {
                  id: assignedLicense.id,
                  license_key: assignedLicense.license_key,
                  license_type: assignedLicense.license_type,
                  max_queries: assignedLicense.max_queries ?? null,
                  query_count: assignedLicense.query_count,
                  assigned_at: (assignedLicense.metadata?.assigned_at ||
                    assignedLicense.updated_at) as string,
                }
              : result.data.credentials.license,
          },
        };

        // Update setup status based on actual assigned license
        enhancedData.setup_complete = !!(
          enhancedData.credentials.api_key && assignedLicense
        );

        // Update next steps based on what's missing
        enhancedData.next_steps = [];
        if (!enhancedData.credentials.api_key) {
          enhancedData.next_steps.push('Create an API key for this site');
        }
        if (!assignedLicense) {
          enhancedData.next_steps.push('Assign a license to this site');
        }

        setCredentialsData(enhancedData);
      } else {
        setError(result.error || 'Failed to load credentials');
      }
    } catch {
      setError('Failed to load credentials');
    } finally {
      setIsLoading(false);
    }
  }, [site.id, getSiteCredentials, licenses]);

  useEffect(() => {
    if (isOpen) {
      loadCredentials();
    }
  }, [isOpen, loadCredentials]);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getAvailableLicenses = () =>
    licenses.filter(
      license =>
        license.status === 'active' && !license.metadata?.assigned_site_id
    );

  const handleAssignLicense = async (licenseId: string) => {
    try {
      setIsLoading(true);
      const result = await assignLicense(licenseId, site.id);

      if (result.success) {
        await loadCredentials(); // Refresh data
      } else {
        setError(result.error || 'Failed to assign license');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const generateSiteConfig = () => {
    if (
      !credentialsData?.credentials.api_key ||
      !credentialsData?.credentials.license
    ) {
      return '';
    }

    return `// Add these configuration values to your site's wp-config.php file:

// Lighthouse API Configuration
define('LIGHTHOUSE_API_KEY', '${credentialsData.credentials.api_key.key_prefix}...');
define('LIGHTHOUSE_LICENSE_KEY', '${credentialsData.credentials.license.license_key}');
define('LIGHTHOUSE_SITE_ID', '${site.id}');
define('LIGHTHOUSE_API_URL', 'https://api.lighthousestudios.xyz');

// Optional: Enable debug mode
define('LIGHTHOUSE_DEBUG', false);`;
  };

  if (isLoading && !credentialsData) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Site Credentials"
        size="lg"
      >
        <div className="flex justify-center py-8">
          <div className="lh-spinner lh-spinner-lg" />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Site Credentials: ${site.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {credentialsData ? (
          <>
            {/* Setup Status */}
            <Card
              className={
                credentialsData.setup_complete
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      credentialsData.setup_complete
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <span className="font-medium">
                    {credentialsData.setup_complete
                      ? 'Setup Complete'
                      : 'Setup Incomplete'}
                  </span>
                </div>
                {!credentialsData.setup_complete &&
                  credentialsData.next_steps.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Next Steps:
                      </div>
                      <ul className="text-sm space-y-1">
                        {credentialsData.next_steps.map((step, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <span className="text-gray-400">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* API Key */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">API Key</h3>
              </CardHeader>
              <CardContent>
                {credentialsData.credentials.api_key ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Name
                      </label>
                      <div className="text-sm bg-gray-100 px-3 py-2 rounded">
                        {credentialsData.credentials.api_key.name}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Key (Prefix)
                      </label>
                      <div className="flex space-x-2">
                        <div className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded font-mono">
                          {credentialsData.credentials.api_key.key_prefix}...
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              credentialsData.credentials.api_key?.key_prefix ||
                                '',
                              'api_key'
                            )
                          }
                        >
                          {copiedField === 'api_key' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Full API key is only shown once during creation
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scopes
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {credentialsData.credentials.api_key.scopes.map(
                          (scope, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                            >
                              {scope}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-sm">No API key generated</div>
                    <div className="text-xs mt-1">
                      Generate an API key to connect your site
                    </div>
                    <Button className="mt-3" size="sm">
                      Generate API Key
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* License */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">License</h3>
              </CardHeader>
              <CardContent>
                {credentialsData.credentials.license ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Type
                      </label>
                      <div className="text-sm bg-gray-100 px-3 py-2 rounded">
                        {credentialsData.credentials.license.license_type
                          .replace('_', ' ')
                          .toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        License Key
                      </label>
                      <div className="flex space-x-2">
                        <div className="flex-1 text-sm bg-gray-100 px-3 py-2 rounded font-mono">
                          {credentialsData.credentials.license.license_key}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              credentialsData.credentials.license
                                ?.license_key || '',
                              'license_key'
                            )
                          }
                        >
                          {copiedField === 'license_key' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Query Usage
                        </label>
                        <div className="text-sm">
                          {credentialsData.credentials.license.query_count.toLocaleString()}
                          {credentialsData.credentials.license.max_queries && (
                            <>
                              {' / '}
                              {credentialsData.credentials.license.max_queries.toLocaleString()}
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assigned
                        </label>
                        <div className="text-sm">
                          {new Date(
                            credentialsData.credentials.license.assigned_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-6 text-gray-500">
                      <div className="text-sm">No license assigned</div>
                      <div className="text-xs mt-1">
                        Assign a license to enable search functionality
                      </div>
                    </div>

                    {getAvailableLicenses().length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Licenses
                        </label>
                        <div className="space-y-2">
                          {getAvailableLicenses().map(license => (
                            <div
                              key={license.id}
                              className="flex items-center justify-between p-3 border rounded"
                            >
                              <div>
                                <div className="font-medium">
                                  {license.license_type
                                    .replace('_', ' ')
                                    .toUpperCase()}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {license.max_queries
                                    ? `${license.max_queries.toLocaleString()} queries/month`
                                    : 'Unlimited queries'}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleAssignLicense(license.id)}
                                disabled={isLoading}
                              >
                                Assign
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Site Configuration */}
            {credentialsData.setup_complete && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Site Configuration
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        wp-config.php Settings
                      </label>
                      <div className="relative">
                        <pre className="text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                          {generateSiteConfig()}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 text-gray-300 hover:text-white"
                          onClick={() =>
                            copyToClipboard(
                              generateSiteConfig(),
                              'wp_config'
                            )
                          }
                        >
                          {copiedField === 'wp_config' ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="text-blue-800 text-sm">
                        <strong>Setup Instructions:</strong>
                        <ol className="mt-2 space-y-1 list-decimal list-inside">
                          <li>
                            Install the Lighthouse plugin on your website
                          </li>
                          <li>
                            Add the configuration above to your wp-config.php
                            file
                          </li>
                          <li>Activate the plugin and verify the connection</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No credentials data available
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="ghost"
            onClick={loadCredentials}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SiteCredentialsModal;
