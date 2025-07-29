'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSites } from '../../../lib/hooks/useSites';
import { useLicenses } from '../../../lib/hooks/useLicenses';
import { Modal } from '../../../components/ui/Modal';
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

  const generateWordPressConfig = () => {
    if (
      !credentialsData?.credentials.api_key ||
      !credentialsData?.credentials.license
    ) {
      return '';
    }

    return `// Add these configuration values to your WordPress wp-config.php file:

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
      <div className="lh-credentials-modal-content">
        <div className="lh-credentials-sections">
        {error && (
          <div className="lh-alert lh-alert-error">
            <div className="lh-alert-content">{error}</div>
          </div>
        )}

        {credentialsData ? (
          <>
            {/* Site Information */}
            <div className="lh-credentials-card">
              <div className="lh-credentials-card-header">
                <h3 className="lh-credentials-card-title">
                  <svg className="lh-icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                  </svg>
                  Site Information
                </h3>
              </div>
              <div className="lh-credentials-card-content">
                <div className="lh-site-info-grid">
                  <div className="lh-site-info-item">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">Site Name</label>
                      <div className="lh-credential-value">{site.name}</div>
                    </div>
                  </div>
                  <div className="lh-site-info-item">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">Site ID</label>
                      <div className="lh-credential-value lh-credential-monospace">{site.id}</div>
                    </div>
                  </div>
                  <div className="lh-site-info-item">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">Site URL</label>
                      <div className="lh-credential-value">{site.url}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Setup Status */}
            <div className={`lh-credentials-card ${
              credentialsData.setup_complete
                ? 'lh-setup-status-complete'
                : 'lh-setup-status-incomplete'
            }`}>
              <div className="lh-credentials-card-content">
                <div className="lh-setup-status-header">
                  <div className={`${
                    credentialsData.setup_complete
                      ? 'lh-setup-status-indicator-complete'
                      : 'lh-setup-status-indicator-incomplete'
                  }`} />
                  <span className="lh-setup-status-text">
                    {credentialsData.setup_complete
                      ? 'Setup Complete'
                      : 'Setup Incomplete'}
                  </span>
                </div>
                {!credentialsData.setup_complete &&
                  credentialsData.next_steps.length > 0 && (
                    <div className="lh-setup-next-steps">
                      <div className="lh-setup-next-steps-title">
                        Next Steps:
                      </div>
                      <ul className="lh-setup-next-steps-list">
                        {credentialsData.next_steps.map((step, index) => (
                          <li key={index} className="lh-setup-next-steps-item">
                            <span className="lh-setup-next-steps-bullet"></span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>

            {/* API Key */}
            <div className="lh-credentials-card">
              <div className="lh-credentials-card-header">
                <h3 className="lh-credentials-card-title">
                  <svg className="lh-icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m3 6V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 2V9a2 2 0 00-2-2H9a2 2 0 00-2 2v6z" />
                  </svg>
                  API Key
                </h3>
              </div>
              <div className="lh-credentials-card-content">
                {credentialsData.credentials.api_key ? (
                  <div className="lh-credential-fields">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        Key Name
                      </label>
                      <div className="lh-credential-value">
                        {credentialsData.credentials.api_key.name}
                      </div>
                    </div>

                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        API Key (Prefix)
                      </label>
                      <div className="lh-credential-value-with-copy">
                        <div className="lh-credential-value lh-credential-monospace">
                          {credentialsData.credentials.api_key.key_prefix}...
                        </div>
                        <button
                          className="lh-copy-button"
                          onClick={() =>
                            copyToClipboard(
                              credentialsData.credentials.api_key?.key_prefix ||
                                '',
                              'api_key'
                            )
                          }
                        >
                          {copiedField === 'api_key' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="lh-credential-help">
                        Full API key is only shown once during creation
                      </p>
                    </div>

                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        Scopes
                      </label>
                      <div className="lh-credential-scopes">
                        {credentialsData.credentials.api_key.scopes.map(
                          (scope, index) => (
                            <span key={index} className="lh-credential-scope-tag">
                              {scope}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="lh-credentials-empty-state">
                    <div className="lh-credentials-empty-title">No API key generated</div>
                    <div className="lh-credentials-empty-description">
                      Generate an API key to connect your site
                    </div>
                    <button className="lh-credentials-empty-action">
                      Generate API Key
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* License */}
            <div className="lh-credentials-card">
              <div className="lh-credentials-card-header">
                <h3 className="lh-credentials-card-title">
                  <svg className="lh-icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  License
                </h3>
              </div>
              <div className="lh-credentials-card-content">
                {credentialsData.credentials.license ? (
                  <div className="lh-credential-fields">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        License Type
                      </label>
                      <div className="lh-credential-value">
                        {credentialsData.credentials.license.license_type
                          .replace('_', ' ')
                          .toUpperCase()}
                      </div>
                    </div>

                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        License Key
                      </label>
                      <div className="lh-credential-value-with-copy">
                        <div className="lh-credential-value lh-credential-monospace">
                          {credentialsData.credentials.license.license_key}
                        </div>
                        <button
                          className="lh-copy-button"
                          onClick={() =>
                            copyToClipboard(
                              credentialsData.credentials.license
                                ?.license_key || '',
                              'license_key'
                            )
                          }
                        >
                          {copiedField === 'license_key' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="lh-credential-stats-grid">
                      <div className="lh-credential-field">
                        <label className="lh-credential-label">
                          Query Usage
                        </label>
                        <div className="lh-credential-value">
                          {credentialsData.credentials.license.query_count.toLocaleString()}
                          {credentialsData.credentials.license.max_queries && (
                            <>
                              {' / '}
                              {credentialsData.credentials.license.max_queries.toLocaleString()}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="lh-credential-field">
                        <label className="lh-credential-label">
                          Assigned
                        </label>
                        <div className="lh-credential-value">
                          {new Date(
                            credentialsData.credentials.license.assigned_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="lh-credential-fields">
                    <div className="lh-credentials-empty-state">
                      <div className="lh-credentials-empty-title">No license assigned</div>
                      <div className="lh-credentials-empty-description">
                        Assign a license to enable search functionality
                      </div>
                    </div>

                    {getAvailableLicenses().length > 0 && (
                      <div className="lh-credential-field">
                        <label className="lh-credential-label">
                          Available Licenses
                        </label>
                        <div className="lh-license-assignment-list">
                          {getAvailableLicenses().map(license => (
                            <div key={license.id} className="lh-license-assignment-item">
                              <div className="lh-license-assignment-info">
                                <div className="lh-license-assignment-type">
                                  {license.license_type
                                    .replace('_', ' ')
                                    .toUpperCase()}
                                </div>
                                <div className="lh-license-assignment-description">
                                  {license.max_queries
                                    ? `${license.max_queries.toLocaleString()} queries/month`
                                    : 'Unlimited queries'}
                                </div>
                              </div>
                              <button
                                className="lh-license-assignment-button"
                                onClick={() => handleAssignLicense(license.id)}
                                disabled={isLoading}
                              >
                                Assign
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* WordPress Configuration */}
            {credentialsData.setup_complete && (
              <div className="lh-credentials-card">
                <div className="lh-credentials-card-header">
                  <h3 className="lh-credentials-card-title">
                    <svg className="lh-icon-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    WordPress Configuration
                  </h3>
                </div>
                <div className="lh-credentials-card-content">
                  <div className="lh-credential-fields">
                    <div className="lh-credential-field">
                      <label className="lh-credential-label">
                        wp-config.php Settings
                      </label>
                      <div className="lh-wordpress-config-container">
                        <pre className="lh-wordpress-config-code">
                          {generateWordPressConfig()}
                        </pre>
                        <button
                          className="lh-wordpress-config-copy"
                          onClick={() =>
                            copyToClipboard(
                              generateWordPressConfig(),
                              'wp_config'
                            )
                          }
                        >
                          {copiedField === 'wp_config' ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div className="lh-wordpress-setup-instructions">
                      <div className="lh-wordpress-setup-content">
                        <strong>Setup Instructions:</strong>
                        <ol className="lh-wordpress-setup-list">
                          <li>
                            Install the Lighthouse plugin on your WordPress site
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
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="lh-credentials-empty-state">
            <div className="lh-credentials-empty-title">No credentials data available</div>
          </div>
        )}

        {/* Actions */}
        <div className="lh-credentials-actions">
          <button
            className="lh-credentials-refresh-button"
            onClick={loadCredentials}
            disabled={isLoading}
          >
            <svg className={`lh-icon-sm ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            className="lh-credentials-close-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        </div>
      </div>
    </Modal>
  );
};

export default SiteCredentialsModal;
