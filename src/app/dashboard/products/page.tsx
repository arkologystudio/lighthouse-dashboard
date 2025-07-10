'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useSites } from '../../../lib/hooks/useSites';
import { useProducts } from '../../../lib/hooks/useProducts';
import { EcosystemProduct, SiteProduct } from '../../../types';

interface ProductCardProps {
  product: EcosystemProduct;
  sites: Array<{ id: string; name: string; url: string }>;
  siteProducts: SiteProduct[];
  onActivate: (productSlug: string, siteId: string) => void;
  onDeactivate: (productSlug: string, siteId: string) => void;
  isProcessing: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  sites,
  siteProducts,
  onActivate,
  onDeactivate,
  isProcessing,
}) => {
  const [selectedSite, setSelectedSite] = useState<string>('');

  const getProductIcon = (productSlug: string) => {
    switch (productSlug) {
      case 'neural-search-product':
      case 'lumen-search-product':
        return (
          <svg
            className="lh-icon-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        );
      case 'neural-search-knowledge':
      case 'lumen-search-knowledge':
        return (
          <svg
            className="lh-icon-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case 'beacon-ai-readiness':
      case 'ai-readiness-analysis':
        return (
          <svg
            className="lh-icon-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="lh-icon-lg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'search':
        return 'lh-action-bg-blue';
      case 'analysis':
      case 'optimization':
        return 'lh-action-bg-green';
      default:
        return 'lh-action-bg-orange';
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Free';
    return `$${price}/month`;
  };

  // Check if this product is already registered for any site
  const isProductRegistered = (siteId: string) => {
    return siteProducts.some(
      sp => sp.product?.slug === product.slug && sp.site_id === siteId
    );
  };

  const getSiteProductStatus = (siteId: string) => {
    const siteProduct = siteProducts.find(
      sp => sp.product?.slug === product.slug && sp.site_id === siteId
    );
    return siteProduct
      ? { registered: true, enabled: siteProduct.is_enabled }
      : { registered: false, enabled: false };
  };

  const handleAction = () => {
    if (!selectedSite) return;

    const status = getSiteProductStatus(selectedSite);
    if (status.registered) {
      onDeactivate(product.slug, selectedSite);
    } else {
      onActivate(product.slug, selectedSite);
    }
  };

  return (
    <Card className="lh-card-hover">
      <CardHeader className="pb-4">
        <div className="lh-flex-between">
          <div className="lh-flex-icon-text">
            <div
              className={`lh-action-icon-container ${getCategoryColor(product.category)}`}
            >
              {getProductIcon(product.slug)}
            </div>
            <div>
              <h3 className="lh-title-card">{product.name}</h3>
              <div className="lh-flex-icon-text mt-1">
                <span className="lh-badge lh-badge-gray">
                  {product.category}
                </span>
                {product.is_beta && (
                  <span className="lh-badge lh-badge-orange">Beta</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="lh-title-card">
              {formatPrice(product.base_price)}
            </div>
            <div className="lh-text-small">v{product.version}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="lh-text-description mb-4 leading-relaxed">
          {product.description}
        </p>

        {product.features && product.features.length > 0 && (
          <div className="mb-6">
            <h4 className="lh-table-cell-content mb-2">Features:</h4>
            <ul className="lh-text-muted space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="lh-flex-icon-text">
                  <svg
                    className="lh-icon-sm flex-shrink-0"
                    style={{ color: '#51cf66' }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {sites.length > 0 && (
          <div className="border-t pt-4">
            <div className="lh-form-section">
              <label className="block lh-table-cell-content mb-2">
                Activate for Site:
              </label>
              <select
                value={selectedSite}
                onChange={e => setSelectedSite(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg lh-focus-ring"
              >
                <option value="">Select a site...</option>
                {sites.map(site => {
                  const status = getSiteProductStatus(site.id);
                  return (
                    <option key={site.id} value={site.id}>
                      {site.name} {status.registered ? '(Registered)' : ''}
                    </option>
                  );
                })}
              </select>

              {selectedSite && (
                <div className="mt-4">
                  <Button
                    onClick={handleAction}
                    disabled={isProcessing}
                    className={`w-full ${
                      getSiteProductStatus(selectedSite).registered
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-lighthouse-primary hover:bg-lighthouse-primary/90 text-white'
                    }`}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : getSiteProductStatus(selectedSite).registered
                        ? 'Deactivate Product'
                        : 'Activate Product'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {sites.length === 0 && (
          <div className="border-t pt-4">
            <div className="lh-empty-state text-left py-6">
              <p className="lh-text-muted mb-4">
                You need to add a site before you can activate products.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Add Your First Site
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ProductsPage: React.FC = () => {
  const { sites, isLoading: sitesLoading } = useSites();
  const {
    products,
    siteProducts,
    isLoading: productsLoading,
    error,
    registerProduct,
    unregisterProduct,
  } = useProducts();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivateProduct = async (productSlug: string, siteId: string) => {
    setIsProcessing(true);
    try {
      await registerProduct(siteId, { product_slug: productSlug });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeactivateProduct = async (
    productSlug: string,
    siteId: string
  ) => {
    if (
      !confirm(
        'Are you sure you want to deactivate this product? You can reactivate it later.'
      )
    ) {
      return;
    }

    setIsProcessing(true);
    try {
      await unregisterProduct(siteId, productSlug);
    } finally {
      setIsProcessing(false);
    }
  };

  if (sitesLoading || productsLoading) {
    return (
      <div className="lh-loading-container min-h-64">
        <div className="lh-spinner lh-spinner-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="lh-error-container">
        <div className="lh-error-message">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="lh-page-container">
      {/* Header */}
      <div className="lh-page-header">
        <div>
          <h1 className="lh-title-page">Products</h1>
          <p className="lh-text-description mt-1">
            Activate Lighthouse products for your registered sites
          </p>
        </div>
        <div className="lh-text-muted">
          {sites.length} {sites.length === 1 ? 'site' : 'sites'} available
        </div>
      </div>

      {/* Products Grid */}
      <div className="lh-grid-cards">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            sites={sites}
            siteProducts={siteProducts}
            onActivate={handleActivateProduct}
            onDeactivate={handleDeactivateProduct}
            isProcessing={isProcessing}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
