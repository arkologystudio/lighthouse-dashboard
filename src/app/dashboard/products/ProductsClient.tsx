'use client';

import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';

import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useSites } from '../../../lib/hooks/useSites';
import { useProducts } from '../../../lib/hooks/useProducts';
import type { EcosystemProduct, Site } from '../../../types';

// Lazy load heavy components
const ProductCard = lazy(() => import('./ProductCard'));

// Loading fallback for product cards
const ProductCardSkeleton = () => (
  <Card className="lh-card h-full animate-pulse">
    <CardHeader className="pb-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1"></div>
        <div className="text-right">
          <div className="h-6 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
      <div className="lh-flex-icon-text">
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0 flex flex-col flex-1">
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="mb-6 flex-1">
        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </CardContent>
  </Card>
);

interface ProductsClientProps {
  initialProducts?: EcosystemProduct[];
  initialSites?: Site[];
}

const ProductsClient: React.FC<ProductsClientProps> = ({
  initialProducts = [],
  initialSites = [],
}) => {
  const { sites, isLoading: sitesLoading } = useSites(initialSites.length > 0 ? initialSites : undefined);
  const {
    products,
    siteProducts,
    isLoading: productsLoading,
    error,
    registerProduct,
    unregisterProduct,
    refreshProducts,
  } = useProducts(initialProducts.length > 0 ? initialProducts : undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState<EcosystemProduct[]>(
    []
  );
  const [loadedCount, setLoadedCount] = useState(6); // Initial load count

  // Implement progressive loading of products
  useEffect(() => {
    setVisibleProducts(products.slice(0, loadedCount));
  }, [products, loadedCount]);

  const loadMoreProducts = useCallback(() => {
    setLoadedCount(prev => Math.min(prev + 6, products.length));
  }, [products.length]);

  const handleRefreshProducts = useCallback(async () => {
    toast.loading('Refreshing products...');
    try {
      await refreshProducts();
      toast.dismiss();
      toast.success('Products refreshed successfully!');
    } catch {
      toast.dismiss();
      toast.error('Failed to refresh products');
    }
  }, [refreshProducts]);

  // Add keyboard shortcut for refresh (Ctrl/Cmd + R)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        handleRefreshProducts();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleRefreshProducts]);

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

  if (sitesLoading || (productsLoading && products.length === 0)) {
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
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRefreshProducts}
            disabled={productsLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg
              className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`}
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
            {productsLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <div className="lh-text-muted">
            {sites.length} {sites.length === 1 ? 'site' : 'sites'} available
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="lh-grid-cards">
        {visibleProducts.map((product, index) => (
          <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
            <ProductCard
              product={product}
              sites={sites}
              siteProducts={siteProducts}
              onActivate={handleActivateProduct}
              onDeactivate={handleDeactivateProduct}
              isProcessing={isProcessing}
              priority={index < 3} // Prioritize first 3 products
            />
          </Suspense>
        ))}
      </div>

      {/* Load More Button */}
      {loadedCount < products.length && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMoreProducts}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            Load More Products ({products.length - loadedCount} remaining)
          </Button>
        </div>
      )}

      {/* Show loading skeletons while loading more */}
      {productsLoading && loadedCount > 0 && (
        <div className="lh-grid-cards mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <ProductCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsClient;
