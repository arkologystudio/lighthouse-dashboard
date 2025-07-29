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
import { usePricing } from '../../../../lib/hooks/usePricing';

const ProductDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { sites, isLoading: sitesLoading } = useSites();
  const { products, isLoading: productsLoading } = useProducts();
  const { licenses, assignLicense, unassignLicense, refreshLicenses, isLoading: licensesLoading } = useLicenses();
  const { simulatePurchase } = usePurchases();
  const { getTierByName } = usePricing();

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
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
    if (!productsLoading && products.length > 0 && !product) {
      router.push('/dashboard/products');
    }
  }, [product, productsLoading, products.length, router]);

  const getProductIcon = (productSlug: string) => {
    switch (productSlug) {
      case 'neural-search-product':
      case 'lumen-search-product':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'neural-search-knowledge':
      case 'lumen-search-knowledge':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'beacon-ai-readiness':
      case 'ai-readiness-analysis':
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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

  const getProductLicenses = () => {
    if (!product || !Array.isArray(licenses) || licenses.length === 0) return [];
    return licenses.filter(
      license => 
        license && (
          license.product?.slug === product.slug ||
          license.metadata?.product_slug === product.slug
        )
    );
  };

  const getAvailableLicense = () => {
    const productLicenses = getProductLicenses();
    return productLicenses.find(
      license => license.status === 'active' && !license.metadata?.assigned_site_id
    );
  };

  const getAssignedLicenses = () => {
    const productLicenses = getProductLicenses();
    return productLicenses.filter(
      license => license.metadata?.assigned_site_id
    );
  };

  const handlePurchaseLicense = async () => {
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
        toast.success(`Successfully purchased ${product.name} license!`);
        await refreshLicenses();
        setShowPurchaseForm(false);
      } else {
        toast.error(result.error || 'Purchase failed');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Purchase failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignLicense = async () => {
    if (!selectedSite) {
      toast.error('Please select a site');
      return;
    }

    const availableLicense = getAvailableLicense();
    if (!availableLicense) {
      toast.error('No available license to assign');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await assignLicense(availableLicense.id, selectedSite);
      if (result.success) {
        toast.success('License assigned successfully!');
        await refreshLicenses();
        setSelectedSite('');
      } else {
        toast.error(result.error || 'Failed to assign license');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign license');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnassignLicense = async (licenseId: string) => {
    if (!confirm('This will remove the license from the site. The license will become available to assign to another site. Continue?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await unassignLicense(licenseId);
      if (result.success) {
        toast.success('License removed from site and is now available');
        await refreshLicenses();
      } else {
        toast.error(result.error || 'Failed to remove license');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove license');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgradeLicense = (currentType: string) => {
    // Set upgrade form to current type and show purchase form
    setSelectedLicenseType(getNextTier(currentType));
    setIsUpgrade(true);
    setShowPurchaseForm(true);
  };

  const getNextTier = (currentType: string): 'trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise' => {
    const tiers: ('trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise')[] = ['trial', 'standard', 'standard_plus', 'premium', 'premium_plus', 'enterprise'];
    const currentIndex = tiers.indexOf(currentType as 'trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise');
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : 'enterprise';
  };

  const formatLicenseType = (type: string) => {
    switch (type) {
      case 'trial': return 'Trial';
      case 'standard': return 'Standard';
      case 'standard_plus': return 'Standard+';
      case 'premium': return 'Premium';
      case 'premium_plus': return 'Premium+';
      case 'enterprise': return 'Enterprise';
      default: return type;
    }
  };

  const getLicenseTypePrice = (type: string, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    if (type === 'trial') return 'Free Trial';

    const tier = getTierByName(type);
    if (!tier) return `$${product?.base_price || 0}/${billingPeriod === 'annual' ? 'year' : 'month'}`;

    const price = billingPeriod === 'annual' ? tier.annual_price : tier.monthly_price;
    const period = billingPeriod === 'annual' ? 'year' : 'month';
    return `$${price}/${period}`;
  };

  // Loading state
  if (sitesLoading || productsLoading || licensesLoading || !Array.isArray(sites) || !Array.isArray(products) || !Array.isArray(licenses)) {
    return (
      <div className="lh-loading-container min-h-64">
        <div className="lh-spinner lh-spinner-lg" />
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

  const productLicenses = getProductLicenses();
  const availableLicense = getAvailableLicense();
  const assignedLicenses = getAssignedLicenses();

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
          <div className={`lh-product-icon-container ${getCategoryColor(product.category)}`}>
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
              <span className="lh-title-card">{formatPrice(product.base_price)}</span>
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
          {Array.isArray(product.features) && product.features.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Features & Capabilities</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-y-4 gap-x-6">
                  {Array.isArray(product.features) && product.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 flex-shrink-0 mt-0.5"
                        style={{ color: '#51cf66' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="lh-text-muted leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Assignments */}
          {assignedLicenses.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Active Assignments</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {Array.isArray(assignedLicenses) && assignedLicenses.map(license => {
                    if (!license) return null;
                    const assignedSite = Array.isArray(sites) ? sites.find(site => site && site.id === license.metadata?.assigned_site_id) : null;
                    if (!assignedSite) return null;
                    
                    return (
                      <div key={license.id} className="lh-assignment-card">
                        <div className="lh-assignment-header">
                          <div>
                            <div className="lh-assignment-site-name">{assignedSite.name}</div>
                            <div className="lh-assignment-site-url">{assignedSite.url}</div>
                            <div className="lh-assignment-license-type">{formatLicenseType(license.license_type)} License Active</div>
                          </div>
                          <span className="lh-assignment-status">
                            Active
                          </span>
                        </div>
                        <div className="lh-assignment-actions">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpgradeLicense(license.license_type)}
                            disabled={isProcessing || license.license_type === 'enterprise'}
                            className="flex-1"
                          >
                            {license.license_type === 'enterprise' ? 'Max Tier' : 'Upgrade'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnassignLicense(license.id)}
                            disabled={isProcessing}
                            className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
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

        {/* Sidebar - Simplified License Management */}
        <div className="space-y-6">
          {/* License Status */}
          <div className="lh-license-status-card">
            <h2 className="lh-title-card mb-4">License Status</h2>
            <div className="lh-license-count">
              {productLicenses.length}
            </div>
            <div className="lh-license-count-label">
              {productLicenses.length === 1 ? 'License Owned' : 'Licenses Owned'}
            </div>
            
            {availableLicense ? (
              <div className="lh-license-available">
                <div className="lh-license-available-title">
                  {formatLicenseType(availableLicense.license_type)} License Available
                </div>
                <div className="lh-license-available-subtitle">Ready to assign to a site</div>
                {availableLicense.license_type !== 'enterprise' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpgradeLicense(availableLicense.license_type)}
                    disabled={isProcessing}
                    className="w-full mt-2 text-xs"
                  >
                    Upgrade to {formatLicenseType(getNextTier(availableLicense.license_type))}
                  </Button>
                )}
              </div>
            ) : productLicenses.length > 0 ? (
              <div className="lh-license-assigned">
                <div className="lh-license-assigned-title">All licenses assigned</div>
                <div className="lh-license-assigned-subtitle mb-3">Purchase additional license or remove from a site</div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsUpgrade(false);
                    setShowPurchaseForm(true);
                  }}
                  disabled={isProcessing}
                  className="w-full text-xs"
                >
                  Purchase Additional License
                </Button>
              </div>
            ) : (
              <div className="lh-license-none">
                <div className="lh-license-none-title">No licenses purchased yet</div>
              </div>
            )}
          </div>

          {/* Purchase License */}
          {!availableLicense && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Purchase License</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4">
                  Purchase a license to use this product on your sites.
                </p>
                <Button 
                  onClick={() => {
                    setIsUpgrade(false);
                    setShowPurchaseForm(true);
                  }}
                  className="w-full"
                >
                  Purchase License
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Assign License */}
          {availableLicense && sites.length > 0 && (
            <Card>
              <CardHeader className="pb-4">
                <h2 className="lh-title-card">Assign License to Site</h2>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Site:
                    </label>
                    <select
                      value={selectedSite}
                      onChange={e => setSelectedSite(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Choose a site...</option>
                      {Array.isArray(sites) && sites.map(site => 
                        site ? (
                          <option key={site.id} value={site.id}>
                            {site.name}
                          </option>
                        ) : null
                      )}
                    </select>
                  </div>
                  
                  <Button 
                    onClick={handleAssignLicense}
                    disabled={!selectedSite || isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Assigning...' : 'Assign License'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Sites Message */}
          {availableLicense && sites.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4">
                  You need to add a site before you can assign a license.
                </p>
                <Link href="/dashboard/sites">
                  <Button className="w-full">Add Your First Site</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isUpgrade ? 'Upgrade License' : 'Purchase License'}
              </h3>
              <Button
                onClick={() => setShowPurchaseForm(false)}
                variant="outline"
                size="sm"
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Type:
                </label>
                <select
                  value={selectedLicenseType}
                  onChange={e => setSelectedLicenseType(e.target.value as 'trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="trial">Trial ({getLicenseTypePrice('trial')})</option>
                  <option value="standard">Standard ({getLicenseTypePrice('standard', selectedBillingPeriod)})</option>
                  <option value="standard_plus">Standard+ ({getLicenseTypePrice('standard_plus', selectedBillingPeriod)})</option>
                  <option value="premium">Premium ({getLicenseTypePrice('premium', selectedBillingPeriod)})</option>
                  <option value="premium_plus">Premium+ ({getLicenseTypePrice('premium_plus', selectedBillingPeriod)})</option>
                  <option value="enterprise">Enterprise ({getLicenseTypePrice('enterprise', selectedBillingPeriod)})</option>
                </select>
              </div>

              {selectedLicenseType !== 'trial' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Period:
                  </label>
                  <select
                    value={selectedBillingPeriod}
                    onChange={e => setSelectedBillingPeriod(e.target.value as 'monthly' | 'annual')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual (Save 10%)</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handlePurchaseLicense}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? 'Processing...' : `${isUpgrade ? 'Upgrade to' : 'Purchase'} ${formatLicenseType(selectedLicenseType)} License`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;