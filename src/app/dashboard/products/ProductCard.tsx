import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { EcosystemProduct, SiteProduct } from '../../../types';

interface ProductCardProps {
  product: EcosystemProduct;
  sites: Array<{ id: string; name: string; url: string }>;
  siteProducts: SiteProduct[];
  onActivate: (productSlug: string, siteId: string) => void;
  onDeactivate: (productSlug: string, siteId: string) => void;
  isProcessing: boolean;
  priority?: boolean; // For image loading priority
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {

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

  return (
    <Card className="lh-card-hover group flex flex-col h-full">
      <CardHeader className="pb-4">
        {/* Price positioned at top-right, title spans full width below */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1"></div>
          <div className="text-right">
            <div className="lh-title-card text-lg font-semibold">
              {formatPrice(product.base_price)}
            </div>
            <div className="lh-text-small">v{product.version}</div>
          </div>
        </div>

        {/* Product info section - icon, title, and badges */}
        <div className="lh-flex-icon-text">
          <div
            className={`lh-action-icon-container ${getCategoryColor(product.category)}`}
          >
            {getProductIcon(product.slug)}
          </div>
          <div className="flex-1">
            <Link
              href={`/dashboard/products/${product.slug}`}
              className="lh-title-card hover:text-lighthouse-primary transition-colors cursor-pointer block mb-2"
            >
              <h3 className="text-xl">{product.name}</h3>
            </Link>
            <div className="lh-flex-icon-text">
              <span className="lh-badge lh-badge-gray">{product.category}</span>
              {product.is_beta && (
                <span className="lh-badge lh-badge-orange">Beta</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col flex-1">
        {/* Description - fixed height to maintain uniformity */}
        <div className="mb-4 min-h-[3rem]">
          <p className="lh-text-description leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Features section - consistent height */}
        <div className="mb-6 flex-1">
          <h4 className="lh-table-cell-content mb-3">Features:</h4>
          <div className="min-h-[8rem]">
            {product.features && product.features.length > 0 ? (
              <ul className="lh-text-muted space-y-2">
                {product.features.slice(0, 4).map((feature, index) => (
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
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
                {product.features.length > 4 && (
                  <li className="lh-text-muted text-sm italic">
                    +{product.features.length - 4} more features
                  </li>
                )}
              </ul>
            ) : (
              <p className="lh-text-muted text-sm italic">No features listed</p>
            )}
          </div>
        </div>

        {/* Action section - always at bottom */}
        <div className="mt-auto">
          <div className="mt-3">
            <Link href={`/dashboard/products/${product.slug}`}>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;