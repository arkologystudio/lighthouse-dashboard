'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { useSites } from '../../../../lib/hooks/useSites';
import { useProducts } from '../../../../lib/hooks/useProducts';
import { useLicenses } from '../../../../lib/hooks/useLicenses';
import { usePurchases } from '../../../../lib/hooks/usePurchases';
import { useDownloads } from '../../../../lib/hooks/useDownloads';
import { usePricing } from '../../../../lib/hooks/usePricing';
import { EcosystemProduct, SiteProduct, License } from '../../../../types';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { sites, isLoading: sitesLoading } = useSites();
  const {
    products,
    siteProducts,
    isLoading: productsLoading,
    error,
    registerProduct,
    unregisterProduct,
  } = useProducts();
  const { licenses, getLicenseByProduct } = useLicenses();
  const { simulatePurchase } = usePurchases();
  const { initiateDownload, downloadFile } = useDownloads();
  const { tiers, getTierByName, getProductPricing } = usePricing();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);
  const [selectedLicenseType, setSelectedLicenseType] = useState<
    | 'trial'
    | 'standard'
    | 'standard_plus'
    | 'premium'
    | 'premium_plus'
    | 'enterprise'
  >('standard');
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<
    'monthly' | 'annual'
  >('monthly');

  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    // Only redirect if products have finished loading AND we have products data AND no matching product exists
    if (!productsLoading && products.length > 0 && !product) {
      router.push('/dashboard/products');
    }
  }, [product, productsLoading, products.length, router]);

  const getProductIcon = (productSlug: string) => {
    switch (productSlug) {
      case 'neural-search-product':
      case 'lumen-search-product':
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        );
      case 'neural-search-knowledge':
      case 'lumen-search-knowledge':
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
      case 'beacon-ai-readiness':
      case 'ai-readiness-analysis':
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-16 h-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
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

  const getSiteProductStatus = (siteId: string) => {
    const siteProduct = siteProducts.find(
      sp => sp.product?.slug === product?.slug && sp.site_id === siteId
    );
    return siteProduct
      ? { registered: true, enabled: siteProduct.is_enabled, siteProduct }
      : { registered: false, enabled: false, siteProduct: null };
  };

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

  const handlePurchasePlugin = async () => {
    if (!product) return;

    setIsProcessing(true);
    toast.loading('Processing purchase...');

    try {
      const result = await simulatePurchase({
        product_slug: product.slug,
        license_type: selectedLicenseType,
        billing_period: selectedBillingPeriod,
        additional_sites: 0,
        custom_embedding: false,
      });

      toast.dismiss();
      if (result.success) {
        toast.success(`Successfully purchased ${product.name}!`);
        // Refresh licenses after successful purchase
        window.location.reload();
      } else {
        toast.error(result.error || 'Purchase failed');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Purchase failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPlugin = async () => {
    if (!product) return;

    const license = getLicenseByProduct(product.slug);
    if (!license) {
      toast.error('No valid license found for this product');
      return;
    }

    setIsProcessing(true);
    toast.loading('Preparing download...');

    try {
      const result = await initiateDownload({
        product_slug: product.slug,
        license_key: license.license_key,
      });

      if (result.success && result.data) {
        toast.dismiss();
        toast.loading('Downloading plugin...');

        const downloadSuccess = await downloadFile(
          result.data.download_token,
          result.data.plugin.filename
        );

        toast.dismiss();
        if (downloadSuccess) {
          toast.success('Plugin downloaded successfully!');
        } else {
          toast.error('Download failed');
        }
      } else {
        toast.dismiss();
        toast.error(result.error || 'Failed to initiate download');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Download failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getLicenseInfo = () => {
    if (!product) return null;

    const license = getLicenseByProduct(product.slug);
    return license;
  };

  const formatLicenseType = (type: string) => {
    switch (type) {
      case 'trial':
        return 'Trial';
      case 'standard':
        return 'Standard';
      case 'standard_plus':
        return 'Standard+';
      case 'premium':
        return 'Premium';
      case 'premium_plus':
        return 'Premium+';
      case 'enterprise':
        return 'Enterprise';
      default:
        return type;
    }
  };

  const getLicenseTypePrice = (
    type: string,
    basePrice?: number,
    billingPeriod: 'monthly' | 'annual' = 'monthly'
  ) => {
    if (type === 'trial') return 'Free Trial';

    // Get pricing from backend tiers
    const tier = getTierByName(type);
    if (!tier) {
      return `$${basePrice || 0}/${billingPeriod === 'annual' ? 'year' : 'month'}`;
    }

    const price =
      billingPeriod === 'annual' ? tier.annual_price : tier.monthly_price;
    const period = billingPeriod === 'annual' ? 'year' : 'month';

    // Calculate annual discount percentage
    const annualSavings =
      billingPeriod === 'annual'
        ? Math.round(
            ((tier.monthly_price * 12 - tier.annual_price) /
              (tier.monthly_price * 12)) *
              100
          )
        : 0;
    const savings =
      billingPeriod === 'annual' && annualSavings > 0
        ? ` (${annualSavings}% off)`
        : '';

    return `$${price}/${period}${savings}`;
  };

  const renderDocumentation = (documentation: string) => {
    // Check if content looks like HTML
    const hasHtmlTags = /<[^>]*>/g.test(documentation);

    if (hasHtmlTags) {
      // For HTML content, use dangerouslySetInnerHTML with caution
      // In production, you might want to sanitize this content first
      return (
        <div
          className="lh-text-description leading-relaxed"
          dangerouslySetInnerHTML={{ __html: documentation }}
        />
      );
    } else {
      // For plain text, preserve line breaks and formatting
      return (
        <div className="lh-text-description leading-relaxed whitespace-pre-wrap">
          {documentation}
        </div>
      );
    }
  };

  const getInstallationSteps = (productSlug: string) => {
    switch (productSlug) {
      case 'neural-search-product':
      case 'lumen-search-product':
        return [
          'Select your WordPress site from the dropdown below',
          'Click "Activate Product" to install the plugin',
          'The plugin will be automatically configured',
          'Start using advanced search on your site immediately',
        ];
      case 'neural-search-knowledge':
      case 'lumen-search-knowledge':
        return [
          'Ensure you have content on your WordPress site',
          'Select your site and activate the product',
          'The system will automatically index your content',
          'Access knowledge search through your dashboard',
        ];
      case 'beacon-ai-readiness':
      case 'ai-readiness-analysis':
        return [
          'Select your WordPress site for analysis',
          'Activate the AI readiness scanner',
          'Wait for the comprehensive site analysis',
          'Review recommendations and implement suggestions',
        ];
      default:
        return [
          'Select your WordPress site',
          'Click activate to install',
          'Configure settings as needed',
          'Start using the product',
        ];
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

  if (!product) {
    return (
      <div className="lh-error-container">
        <div className="lh-error-message">Product not found</div>
        <Link href="/dashboard/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const registeredSites = sites.filter(
    site => getSiteProductStatus(site.id).registered
  );

  return (
    <div className="lh-page-container">
      {/* Breadcrumb */}
      <div className="lh-breadcrumb">
        <Link href="/dashboard/products" className="lh-breadcrumb-link">
          Products
        </Link>
        <span className="lh-breadcrumb-separator">/</span>
        <span className="lh-breadcrumb-current">{product.name}</span>
      </div>

      {/* Hero Section */}
      <div className="lh-product-hero">
        <div className="lh-flex-icon-text-xl">
          <div
            className={`lh-product-icon-container ${getCategoryColor(product.category)}`}
          >
            {getProductIcon(product.slug)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="lh-title-page text-3xl">{product.name}</h1>
              {product.is_beta && (
                <span className="lh-badge lh-badge-orange">Beta</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="lh-badge lh-badge-gray">{product.category}</span>
              <span className="lh-text-muted">v{product.version}</span>
              <span className="lh-title-card">
                {formatPrice(product.base_price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="lh-title-card">About This Product</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="lh-text-description leading-relaxed text-lg">
                {product.description}
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Features & Capabilities</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
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
                      <span className="lh-text-muted leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documentation */}
          {product.extended_documentation && (
            <Card>
              <CardHeader className="pb-3">
                <button
                  onClick={() => setIsDocumentationOpen(!isDocumentationOpen)}
                  className="flex items-center justify-between w-full text-left hover:text-lighthouse-primary transition-colors"
                >
                  <h2 className="lh-title-card">Documentation</h2>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isDocumentationOpen ? 'rotate-180' : ''
                    }`}
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
                </button>
              </CardHeader>
              {isDocumentationOpen && (
                <CardContent className="pt-0">
                  <div className="lh-documentation-content">
                    {renderDocumentation(product.extended_documentation)}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Installation Guide */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="lh-title-card">Installation Guide</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {getInstallationSteps(product.slug).map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="lh-step-number">{index + 1}</div>
                    <span className="lh-text-description leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Installations */}
          {registeredSites.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Active Installations</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {registeredSites.map(site => {
                    const status = getSiteProductStatus(site.id);
                    return (
                      <div key={site.id} className="lh-installation-item">
                        <div className="flex-1">
                          <h3 className="lh-table-cell-content">{site.name}</h3>
                          <p className="lh-text-muted text-sm">{site.url}</p>
                          {status.siteProduct && (
                            <p className="lh-text-muted text-xs mt-1">
                              Installed on{' '}
                              {new Date(
                                status.siteProduct.enabled_at
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`lh-status-badge ${
                              status.enabled
                                ? 'lh-status-active'
                                : 'lh-status-inactive'
                            }`}
                          >
                            {status.enabled ? 'Active' : 'Inactive'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDeactivateProduct(product.slug, site.id)
                            }
                            disabled={isProcessing}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Installation Panel */}
        <div className="space-y-6">
          {/* Plugin License Management */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="lh-title-card">Plugin License</h2>
            </CardHeader>
            <CardContent className="pt-0">
              {(() => {
                const license = getLicenseInfo();

                return license ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="lh-stat-item">
                        <span className="lh-text-muted">License Type:</span>
                        <span className="lh-table-cell-content">
                          {formatLicenseType(license.license_type)}
                        </span>
                      </div>
                      <div className="lh-stat-item">
                        <span className="lh-text-muted">Status:</span>
                        <span
                          className={`lh-status-badge ${
                            license.status === 'active'
                              ? 'lh-status-active'
                              : 'lh-status-inactive'
                          }`}
                        >
                          {license.status}
                        </span>
                      </div>
                      {license.billing_period && (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">Billing:</span>
                          <span className="lh-table-cell-content">
                            {license.billing_period === 'annual'
                              ? 'Annual'
                              : 'Monthly'}
                          </span>
                        </div>
                      )}
                      {license.max_queries ? (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">Queries:</span>
                          <span className="lh-table-cell-content">
                            {license.query_count || 0}/{license.max_queries}{' '}
                            this period
                          </span>
                        </div>
                      ) : (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">Queries:</span>
                          <span className="lh-table-cell-content">
                            Unlimited
                          </span>
                        </div>
                      )}
                      {license.query_period_start && (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">Period:</span>
                          <span className="lh-table-cell-content text-sm">
                            {new Date(
                              license.query_period_start
                            ).toLocaleDateString()}
                            {license.query_period_end &&
                              ` - ${new Date(license.query_period_end).toLocaleDateString()}`}
                          </span>
                        </div>
                      )}
                      <div className="lh-stat-item">
                        <span className="lh-text-muted">Agent/API Access:</span>
                        <span
                          className={`lh-status-badge ${
                            license.agent_api_access
                              ? 'lh-status-active'
                              : 'lh-status-inactive'
                          }`}
                        >
                          {license.agent_api_access ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="lh-stat-item">
                        <span className="lh-text-muted">Sites:</span>
                        <span className="lh-table-cell-content">
                          {license.max_sites}{' '}
                          {license.additional_sites > 0 &&
                            `(+${license.additional_sites} add-on)`}
                        </span>
                      </div>
                      {license.custom_embedding && (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">
                            Custom Embedding:
                          </span>
                          <span className="lh-status-badge lh-status-active">
                            Enabled
                          </span>
                        </div>
                      )}
                      <div className="lh-stat-item">
                        <span className="lh-text-muted">Downloads:</span>
                        <span className="lh-table-cell-content">
                          {license.download_count}/
                          {license.max_downloads || '∞'}
                        </span>
                      </div>
                      {license.expires_at && (
                        <div className="lh-stat-item">
                          <span className="lh-text-muted">Expires:</span>
                          <span className="lh-table-cell-content text-sm">
                            {new Date(license.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleDownloadPlugin}
                      disabled={isProcessing || license.status !== 'active'}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isProcessing ? 'Downloading...' : 'Download Plugin'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block lh-table-cell-content mb-2">
                        License Type:
                      </label>
                      <select
                        value={selectedLicenseType}
                        onChange={e =>
                          setSelectedLicenseType(
                            e.target.value as
                              | 'trial'
                              | 'standard'
                              | 'standard_plus'
                              | 'premium'
                              | 'premium_plus'
                              | 'enterprise'
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg lh-focus-ring"
                      >
                        <option value="trial">Trial (Free)</option>
                        <option value="standard">
                          Standard (
                          {getLicenseTypePrice(
                            'standard',
                            product?.base_price,
                            selectedBillingPeriod
                          )}
                          )
                        </option>
                        <option value="standard_plus">
                          Standard+ (
                          {getLicenseTypePrice(
                            'standard_plus',
                            product?.base_price,
                            selectedBillingPeriod
                          )}
                          )
                        </option>
                        <option value="premium">
                          Premium (
                          {getLicenseTypePrice(
                            'premium',
                            product?.base_price,
                            selectedBillingPeriod
                          )}
                          )
                        </option>
                        <option value="premium_plus">
                          Premium+ (
                          {getLicenseTypePrice(
                            'premium_plus',
                            product?.base_price,
                            selectedBillingPeriod
                          )}
                          )
                        </option>
                        <option value="enterprise">
                          Enterprise (
                          {getLicenseTypePrice(
                            'enterprise',
                            product?.base_price,
                            selectedBillingPeriod
                          )}
                          )
                        </option>
                      </select>
                    </div>

                    {selectedLicenseType !== 'trial' && (
                      <div>
                        <label className="block lh-table-cell-content mb-2">
                          Billing Period:
                        </label>
                        <select
                          value={selectedBillingPeriod}
                          onChange={e =>
                            setSelectedBillingPeriod(
                              e.target.value as 'monthly' | 'annual'
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg lh-focus-ring"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="annual">Annual (10% off)</option>
                        </select>
                      </div>
                    )}

                    <div className="text-sm lh-text-muted">
                      {selectedLicenseType === 'trial' &&
                        '30-day trial with limited features'}
                      {selectedLicenseType === 'standard' &&
                        'Basic semantic search for single site (100 queries/month, UI only)'}
                      {selectedLicenseType === 'standard_plus' &&
                        'Standard features + Agent/API access (100 queries/month)'}
                      {selectedLicenseType === 'premium' &&
                        'Higher volume search for growing sites (2,000 queries/month, UI only)'}
                      {selectedLicenseType === 'premium_plus' &&
                        'Premium features + Agent/API access (2,000 queries/month)'}
                      {selectedLicenseType === 'enterprise' &&
                        'Unlimited queries, multi-site support (10 sites), priority support'}
                    </div>

                    <Button
                      onClick={handlePurchasePlugin}
                      disabled={isProcessing}
                      className="w-full bg-lighthouse-primary hover:bg-lighthouse-primary/90 text-white"
                    >
                      {isProcessing
                        ? 'Processing...'
                        : `Purchase ${formatLicenseType(selectedLicenseType)} License`}
                    </Button>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <h2 className="lh-title-card">Install on Site</h2>
            </CardHeader>
            <CardContent className="pt-0">
              {sites.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <label className="block lh-table-cell-content mb-2">
                      Select Site:
                    </label>
                    <select
                      value={selectedSite}
                      onChange={e => setSelectedSite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg lh-focus-ring"
                    >
                      <option value="">Choose a site...</option>
                      {sites.map(site => {
                        const status = getSiteProductStatus(site.id);
                        return (
                          <option key={site.id} value={site.id}>
                            {site.name} {status.registered ? '(Installed)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {selectedSite && (
                    <Button
                      onClick={() => {
                        const status = getSiteProductStatus(selectedSite);
                        if (status.registered) {
                          handleDeactivateProduct(product.slug, selectedSite);
                        } else {
                          handleActivateProduct(product.slug, selectedSite);
                        }
                      }}
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
                          ? 'Remove Product'
                          : 'Install Product'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="lh-empty-state text-center py-6">
                  <p className="lh-text-muted mb-4">
                    You need to add a site before installing products.
                  </p>
                  <Link href="/dashboard/sites">
                    <Button className="w-full">Add Your First Site</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader className="pb-4">
              <h2 className="lh-title-card">Product Information</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="lh-stat-item">
                  <span className="lh-text-muted">Version:</span>
                  <span className="lh-table-cell-content">
                    v{product.version}
                  </span>
                </div>
                <div className="lh-stat-item">
                  <span className="lh-text-muted">Category:</span>
                  <span className="lh-table-cell-content">
                    {product.category}
                  </span>
                </div>
                <div className="lh-stat-item">
                  <span className="lh-text-muted">Pricing:</span>
                  <span className="lh-table-cell-content">
                    {formatPrice(product.base_price)}
                  </span>
                </div>
                <div className="lh-stat-item">
                  <span className="lh-text-muted">Installations:</span>
                  <span className="lh-table-cell-content">
                    {registeredSites.length}
                  </span>
                </div>
                {product.usage_based && (
                  <div className="lh-stat-item">
                    <span className="lh-text-muted">Billing:</span>
                    <span className="lh-table-cell-content">Usage-based</span>
                  </div>
                )}
                {product.extended_documentation && (
                  <div className="lh-stat-item">
                    <span className="lh-text-muted">Documentation:</span>
                    <span className="lh-table-cell-content flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Available
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
