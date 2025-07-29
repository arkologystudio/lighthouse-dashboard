'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSites } from '../../../lib/hooks/useSites';
import { useLicenses } from '../../../lib/hooks/useLicenses';
import { useProducts } from '../../../lib/hooks/useProducts';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import { Site, EcosystemProduct, SiteProduct, License } from '../../../types';

interface SiteProductsModalProps {
  site: Site;
  isOpen: boolean;
  onClose: () => void;
}

interface SiteProductWithDetails extends SiteProduct {
  product: EcosystemProduct;
  assigned_license?: License;
}

const SiteProductsModal: React.FC<SiteProductsModalProps> = ({
  site,
  isOpen,
  onClose,
}) => {
  const { assignLicense, unassignLicense } = useLicenses();
  const { licenses } = useLicenses();
  const { products } = useProducts();
  const [siteProducts, setSiteProducts] = useState<SiteProductWithDetails[]>([]);
  const [availableProducts, setAvailableProducts] = useState<EcosystemProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingProduct, setProcessingProduct] = useState<string | null>(null);

  const loadSiteProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Find licenses assigned to this site and create "installed" products from them
      const assignedLicenses = licenses.filter(license => 
        license.metadata?.assigned_site_id === site.id &&
        license.status === 'active'
      );

      // Create site products from assigned licenses
      const enhancedProducts: SiteProductWithDetails[] = assignedLicenses.map(license => {
        const product = products.find(p => 
          p.slug === license.product?.slug || 
          p.slug === license.metadata?.product_slug
        );
        
        if (!product) {
          return null;
        }

        return {
          id: `${site.id}-${product.slug}`,
          site_id: site.id,
          product_id: product.id,
          is_enabled: true, // Assigned licenses are considered enabled
          enabled_at: license.metadata?.assigned_at || license.updated_at,
          config: {},
          usage_count: 0,
          created_at: license.created_at,
          updated_at: license.updated_at,
          product,
          assigned_license: license,
        };
      }).filter(Boolean) as SiteProductWithDetails[];

      setSiteProducts(enhancedProducts);

      // Filter out products that already have assigned licenses
      const assignedProductSlugs = assignedLicenses.map(license => 
        license.product?.slug || license.metadata?.product_slug
      ).filter(Boolean);
      const available = products.filter(p => !assignedProductSlugs.includes(p.slug));
      setAvailableProducts(available);
    } catch (err) {
      setError('Failed to load site products');
      setAvailableProducts(products);
    } finally {
      setIsLoading(false);
    }
  }, [site.id, products, licenses]);

  useEffect(() => {
    if (isOpen) {
      loadSiteProducts();
    }
  }, [isOpen, loadSiteProducts]);

  const handleAssignLicense = async (productSlug: string) => {
    setProcessingProduct(productSlug);
    setError(null);

    try {
      // Find an available license for this product
      const availableLicense = licenses.find(license => 
        license.status === 'active' && 
        (license.product?.slug === productSlug || license.metadata?.product_slug === productSlug) &&
        !license.metadata?.assigned_site_id
      );

      if (!availableLicense) {
        setError('No available license found for this product');
        return;
      }

      const result = await assignLicense(availableLicense.id, site.id);
      
      if (result.success) {
        await loadSiteProducts(); // Refresh the list
      } else {
        setError(result.error || 'Failed to assign license');
      }
    } finally {
      setProcessingProduct(null);
    }
  };

  const handleUnassignLicense = async (licenseId: string, productName: string) => {
    if (!confirm(`Are you sure you want to remove ${productName} from this site? The license will become available for other sites.`)) {
      return;
    }

    setProcessingProduct(licenseId);
    setError(null);

    try {
      const result = await unassignLicense(licenseId);
      
      if (result.success) {
        await loadSiteProducts(); // Refresh the list
      } else {
        setError(result.error || 'Failed to unassign license');
      }
    } finally {
      setProcessingProduct(null);
    }
  };

  const getLicenseInfo = () => {
    // Check if there's a license assigned to this site
    const assignedLicense = licenses.find(license => 
      license.metadata?.assigned_site_id === site.id &&
      license.status === 'active'
    );

    if (!assignedLicense) {
      return {
        hasLicense: false,
        message: 'No license assigned to this site',
        remainingInstalls: 0,
      };
    }

    // Calculate remaining installations based on max_sites
    const usedSites = licenses.filter(license => 
      license.id === assignedLicense.id && 
      license.metadata?.assigned_site_id
    ).length;

    const remainingInstalls = assignedLicense.max_sites - usedSites;

    return {
      hasLicense: true,
      license: assignedLicense,
      remainingInstalls: Math.max(0, remainingInstalls),
      totalSites: assignedLicense.max_sites,
      usedSites,
    };
  };

  const canInstallProduct = (productSlug: string) => {
    // Check if user has any active license for this specific product
    const activeLicenses = licenses.filter(license => 
      license.status === 'active' && (
        license.product?.slug === productSlug ||
        license.metadata?.product_slug === productSlug
      )
    );

    for (const license of activeLicenses) {
      // Count how many sites this license is assigned to
      const assignedSitesCount = licenses.filter(l => 
        l.id === license.id && l.metadata?.assigned_site_id
      ).length;

      // If this license has remaining site capacity
      if (assignedSitesCount < license.max_sites) {
        return true;
      }
    }

    return false;
  };

  if (isLoading && siteProducts.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Site Products" size="xl">
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
      title={`Manage Products: ${site.name}`}
      size="xl"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-700 text-sm">{error}</div>
          </div>
        )}

        {/* Assigned Products */}
        <div>
          <h3 className="lh-section-header-assignments">Assigned Products ({siteProducts.length})</h3>
          
          {siteProducts.length === 0 ? (
            <div className="lh-no-assignments">
              <div className="lh-no-assignments-title">No products assigned</div>
              <div className="lh-no-assignments-subtitle">Assign a product license below to get started</div>
            </div>
          ) : (
            <div className="space-y-4">
              {siteProducts.map(siteProduct => {
                const licenseInfo = getLicenseInfo();
                
                return (
                  <div key={siteProduct.id} className="lh-site-product-assigned">
                    <div className="lh-site-product-header">
                      <div className="lh-site-product-info">
                        <div className="lh-site-product-title">
                          <h4 className="lh-site-product-name">{siteProduct.product.name}</h4>
                          <span className="lh-product-badge-assigned">
                            Assigned
                          </span>
                          <span className="lh-product-badge-active">
                            {siteProduct.is_enabled ? 'Active' : 'Inactive'}
                          </span>
                          {siteProduct.product.is_beta && (
                            <span className="lh-product-badge-beta">
                              Beta
                            </span>
                          )}
                        </div>
                        
                        <p className="lh-site-product-description">{siteProduct.product.description}</p>
                        
                        <div className="lh-site-product-meta">
                          <div className="lh-meta-item">
                            <span className="lh-meta-label">Category:</span>
                            <div className="lh-meta-value">{siteProduct.product.category}</div>
                          </div>
                          
                          <div className="lh-meta-item">
                            <span className="lh-meta-label">Version:</span>
                            <div className="lh-meta-value">{siteProduct.product.version}</div>
                          </div>
                          
                          <div className="lh-meta-item">
                            <span className="lh-meta-label">Assigned:</span>
                            <div className="lh-meta-value">
                              {new Date(siteProduct.enabled_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* License Information */}
                        <div className="lh-license-info-panel">
                          <div className="lh-license-info-header">License Status:</div>
                          {siteProduct.assigned_license ? (
                            <div>
                              <div className="lh-license-status-licensed">
                                Licensed ({siteProduct.assigned_license.license_type.replace('_', ' ').toUpperCase()})
                              </div>
                              <div className="lh-license-key-display">
                                Key: {siteProduct.assigned_license.license_key.substring(0, 8)}...
                              </div>
                              <div className="lh-license-usage-info">
                                Sites: {1} / {siteProduct.assigned_license.max_sites} used
                                {siteProduct.assigned_license.max_sites > 1 ? (
                                  <span className="lh-license-usage-remaining">
                                    ({siteProduct.assigned_license.max_sites - 1} remaining)
                                  </span>
                                ) : (
                                  <span className="lh-license-usage-none">
                                    (no sites remaining)
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="lh-license-status-none">No License Assigned</div>
                              <div className="lh-license-help-text">
                                This site needs a license to use this product
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="lh-assignment-action">
                        <button
                          onClick={() => handleUnassignLicense(siteProduct.assigned_license!.id, siteProduct.product.name)}
                          disabled={processingProduct === siteProduct.assigned_license!.id}
                          className="lh-remove-assignment-btn"
                        >
                          {processingProduct === siteProduct.assigned_license!.id ? 'Processing...' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Products */}
        {availableProducts.length > 0 && (
          <div>
            <h3 className="lh-section-header-available">Available Products ({availableProducts.length})</h3>
            
            <div className="space-y-4">
              {availableProducts.map(product => (
                <div key={product.id} className="lh-available-product">
                  <div className="lh-available-product-header">
                    <div className="lh-available-product-info">
                      <div className="lh-available-product-title">
                        <h4 className="lh-available-product-name">{product.name}</h4>
                        {product.is_beta && (
                          <span className="lh-product-badge-beta">
                            Beta
                          </span>
                        )}
                        {product.base_price && (
                          <span className="lh-product-price-badge">
                            ${product.base_price}/month
                          </span>
                        )}
                      </div>
                      
                      <p className="lh-site-product-description">{product.description}</p>
                      
                      <div className="lh-site-product-meta">
                        <div className="lh-meta-item">
                          <span className="lh-meta-label">Category:</span>
                          <div className="lh-meta-value">{product.category}</div>
                        </div>
                        
                        <div className="lh-meta-item">
                          <span className="lh-meta-label">Version:</span>
                          <div className="lh-meta-value">{product.version}</div>
                        </div>
                      </div>

                      {product.features && product.features.length > 0 && (
                        <div className="lh-available-product-features">
                          <div className="lh-features-label">Features:</div>
                          <div className="lh-features-list">
                            {product.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="lh-feature-tag"
                              >
                                {feature}
                              </span>
                            ))}
                            {product.features.length > 3 && (
                              <span className="lh-feature-tag-more">
                                +{product.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Assign License Action */}
                    <div className="lh-assignment-action">
                      {canInstallProduct(product.slug) ? (
                        <button
                          onClick={() => handleAssignLicense(product.slug)}
                          disabled={processingProduct === product.slug}
                          className="lh-assign-license-btn"
                        >
                          {processingProduct === product.slug ? 'Assigning...' : 'Assign License'}
                        </button>
                      ) : (
                        <div>
                          <button disabled className="lh-no-license-available">
                            No License Available
                          </button>
                          <div className="lh-no-license-help">
                            Purchase a license first
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={loadSiteProducts} disabled={isLoading}>
            Refresh
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default SiteProductsModal;