'use client';

import React, { useState, lazy, Suspense } from 'react';
import { useSites } from '../../../lib/hooks/useSites';
import { validateData, createSiteSchema } from '../../../lib/validators';
import { PRODUCTS } from '../../../lib/constants';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { TextField } from '../../../components/forms/TextField';
import type { CreateSiteRequest, Site } from '../../../types';
import SiteCredentialsModal from './SiteCredentialsModal';
import SiteProductsModal from './SiteProductsModal';

// Lazy load the modal component to improve initial load
const Modal = lazy(() =>
  import('../../../components/ui/Modal').then(module => ({
    default: module.Modal,
  }))
);

// Loading fallback for the modal
const ModalLoading = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <div className="lh-spinner lh-spinner-md" />
    </div>
  </div>
);

interface SitesClientProps {
  initialSites?: Site[];
}

const SitesClient: React.FC<SitesClientProps> = ({ initialSites = [] }) => {
  // Initialize with server-side data but use hook for mutations
  const { sites, isLoading, createSite, deleteSite, refreshSites } = useSites(
    initialSites.length > 0 ? initialSites : undefined
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [credentialsModal, setCredentialsModal] = useState<{
    isOpen: boolean;
    site: Site | null;
  }>({ isOpen: false, site: null });
  const [productsModal, setProductsModal] = useState<{
    isOpen: boolean;
    site: Site | null;
  }>({ isOpen: false, site: null });

  const [formData, setFormData] = useState<CreateSiteRequest>({
    name: '',
    url: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange =
    (field: keyof CreateSiteRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

  const validateForm = (): boolean => {
    const validation = validateData(createSiteSchema, formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};

      // Parse Zod errors into field-specific errors
      validation.error.split(', ').forEach(error => {
        if (error.includes('name')) fieldErrors.name = error;
        if (error.includes('URL') || error.includes('url'))
          fieldErrors.url = error;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await createSite(formData);
      if (success) {
        setFormData({ name: '', url: '', description: '' });
        setErrors({});
        setIsAddModalOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this site? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingId(siteId);
    await deleteSite(siteId);
    setDeletingId(null);
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (isLoading && sites.length === 0) {
    return (
      <div className="lh-loading-container">
        <div className="lh-spinner lh-spinner-lg" />
      </div>
    );
  }

  return (
    <div className="lh-section-container">
      {/* Header */}
      <div className="lh-page-header">
        <div>
          <h1 className="lh-title-page">Sites</h1>
          <p className="lh-text-description">
            Manage your websites and their Lighthouse plugins.
          </p>
        </div>
        <button
          className="lh-btn lh-btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Site
        </button>
      </div>

      {/* Sites table */}
      <div className="lh-table-container">
        <Card>
          <CardHeader>
            <div className="lh-flex-between">
              <h3 className="lh-title-small">Your Sites ({sites.length})</h3>
              <button
                className="lh-btn lh-btn-ghost lh-btn-sm"
                onClick={refreshSites}
              >
                <svg
                  className="lh-icon-sm"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {sites.length === 0 ? (
              <div className="lh-empty-state">
                <svg
                  className="lh-empty-state-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="lh-empty-state-title">No sites yet</h3>
                <p className="lh-empty-state-description">
                  Get started by adding your first website.
                </p>
                <div className="mt-6">
                  <button
                    className="lh-btn lh-btn-primary"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    Add Your First Site
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden">
                <table className="lh-table">
                  <thead className="lh-table-header">
                    <tr>
                      <th className="lh-table-header-cell">Site</th>
                      <th className="lh-table-header-cell">Products</th>
                      <th className="lh-table-header-cell">Added</th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="lh-table tbody">
                    {sites.map(site => (
                      <tr key={site.id} className="lh-table-row">
                        <td className="lh-table-cell">
                          <div>
                            <div className="lh-table-cell-content">
                              {site.name}
                            </div>
                            <div className="lh-table-cell-meta">
                              <a
                                href={site.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="lh-text-link"
                              >
                                {site.url}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="lh-table-cell">
                          <div className="flex flex-wrap gap-2">
                            {PRODUCTS.map(product => (
                              <span
                                key={product.id}
                                className="lh-product-badge lh-product-badge-inactive"
                              >
                                {product.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="lh-table-cell lh-table-cell-meta">
                          {formatDate(site.created_at)}
                        </td>
                        <td className="lh-table-cell text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="lh-btn lh-btn-ghost lh-btn-sm"
                              onClick={() =>
                                setProductsModal({ isOpen: true, site })
                              }
                            >
                              Products
                            </button>
                            <button
                              className="lh-btn lh-btn-ghost lh-btn-sm"
                              onClick={() =>
                                setCredentialsModal({ isOpen: true, site })
                              }
                            >
                              Credentials
                            </button>
                            <button
                              className="lh-btn lh-btn-ghost lh-btn-sm"
                              onClick={() => handleDelete(site.id)}
                              disabled={deletingId === site.id}
                              style={{ color: 'var(--color-text-error)' }}
                            >
                              {deletingId === site.id
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lazy-loaded Add Site Modal */}
      {isAddModalOpen && (
        <Suspense fallback={<ModalLoading />}>
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => {
              if (!isSubmitting) {
                setIsAddModalOpen(false);
                setFormData({ name: '', url: '', description: '' });
                setErrors({});
                setIsSubmitting(false);
              }
            }}
            title="Add New Site"
          >
            <form onSubmit={handleSubmit} className="lh-form">
              <div className="lh-form-section">
                <TextField
                  label="Site Name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={errors.name}
                  placeholder="My WordPress Site"
                  disabled={isSubmitting}
                  required
                />

                <TextField
                  label="Site URL"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange('url')}
                  error={errors.url}
                  placeholder="https://example.com"
                  helperText="Include the full URL with https://"
                  disabled={isSubmitting}
                  required
                />

                <TextField
                  label="Description (optional)"
                  type="text"
                  value={formData.description || ''}
                  onChange={handleInputChange('description')}
                  placeholder="Brief description of your site"
                  disabled={isSubmitting}
                />
              </div>

              <div className="lh-form-actions">
                <button
                  type="button"
                  className="lh-btn lh-btn-ghost"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({ name: '', url: '', description: '' });
                    setErrors({});
                    setIsSubmitting(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="lh-btn lh-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding Site...' : 'Add Site'}
                </button>
              </div>
            </form>
          </Modal>
        </Suspense>
      )}

      {/* Site Products Modal */}
      {productsModal.isOpen && productsModal.site && (
        <SiteProductsModal
          site={productsModal.site}
          isOpen={productsModal.isOpen}
          onClose={() => setProductsModal({ isOpen: false, site: null })}
        />
      )}

      {/* Site Credentials Modal */}
      {credentialsModal.isOpen && credentialsModal.site && (
        <SiteCredentialsModal
          site={credentialsModal.site}
          isOpen={credentialsModal.isOpen}
          onClose={() => setCredentialsModal({ isOpen: false, site: null })}
        />
      )}
    </div>
  );
};

export default SitesClient;
