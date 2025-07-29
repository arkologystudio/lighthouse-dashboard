'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { usePurchases } from '../../../lib/hooks/usePurchases';
import { useLicenses } from '../../../lib/hooks/useLicenses';
import { useProducts } from '../../../lib/hooks/useProducts';
import { usePricing } from '../../../lib/hooks/usePricing';
import toast from 'react-hot-toast';

const BillingDashboardClient: React.FC = () => {
  const { purchaseHistory: purchases, isLoading: purchasesLoading, simulatePurchase } = usePurchases();
  const { licenses, stats, isLoading: licensesLoading, refreshLicenses, getLicenseUsage } = useLicenses();
  const { products } = useProducts();
  const { tiers } = usePricing();

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedLicenseType, setSelectedLicenseType] = useState<
    'trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise'
  >('standard');
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [usageData, setUsageData] = useState<{license: {id: string; license_type: string; status: string}; usage: {queries_used?: number; sites_used?: number; downloads_used?: number}}[]>([]);
  const [loadingUsage, setLoadingUsage] = useState(false);

  const loadUsageData = useCallback(async () => {
    setLoadingUsage(true);
    const usageResults = [];

    for (const license of licenses) {
      if (!license.id || license.id === 'undefined' || license.id === '') {
        continue;
      }

      try {
        const usageResult = await getLicenseUsage(license.id);
        if (usageResult.success && usageResult.data) {
          const usage = usageResult.data.usage || { queries_used: 0, sites_used: 0, downloads_used: 0 };
          usageResults.push({
            license: {
              id: license.id,
              license_type: license.license_type,
              status: license.status
            },
            usage
          });
        }
      } catch (err) {
        console.warn(`Failed to load usage for license ${license.id}:`, err);
      }
    }

    setUsageData(usageResults);
    setLoadingUsage(false);
  }, [licenses, getLicenseUsage]);

  useEffect(() => {
    if (licenses.length > 0) {
      loadUsageData();
    }
  }, [licenses, loadUsageData]);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getTierByName = (name: string) => tiers.find(tier => tier.tier_name === name);

  const getLicenseTypePrice = (type: string, billingPeriod: 'monthly' | 'annual' = 'monthly') => {
    if (type === 'trial') return 'Free Trial';

    const tier = getTierByName(type);
    if (!tier) return '$0/month';

    const price = billingPeriod === 'annual' ? tier.annual_price : tier.monthly_price;
    const period = billingPeriod === 'annual' ? 'year' : 'month';

    const annualSavings = billingPeriod === 'annual'
      ? Math.round(((tier.monthly_price * 12 - tier.annual_price) / (tier.monthly_price * 12)) * 100)
      : 0;
    const savings = billingPeriod === 'annual' && annualSavings > 0 ? ` (${annualSavings}% off)` : '';

    return `$${price}/${period}${savings}`;
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing purchase...');

    try {
      const result = await simulatePurchase({
        product_slug: selectedProduct,
        license_type: selectedLicenseType,
        billing_period: selectedBillingPeriod,
        additional_sites: 0,
        custom_embedding: false,
      });

      toast.dismiss();
      if (result.success) {
        toast.success('Purchase completed successfully!');
        await refreshLicenses();
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

  const getTotalSpent = () => purchases?.reduce((total: number, purchase) => total + (purchase.license?.amount_paid || 0), 0) || 0;

  const getMonthlySpend = () => {
    if (!purchases) return 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return purchases
      .filter((purchase) => {
        const purchaseDate = new Date(purchase.purchased_at);
        return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
      })
      .reduce((total: number, purchase) => total + (purchase.license?.amount_paid || 0), 0);
  };

  const getTotalUsage = () => {
    let totalQueries = 0;
    let totalSites = 0;

    usageData.forEach(({ usage }) => {
      if (usage) {
        totalQueries += usage.queries_used || 0;
        totalSites += usage.sites_used || 0;
      }
    });

    return { totalQueries, totalSites };
  };

  const isLoading = purchasesLoading || licensesLoading;
  const totalUsage = getTotalUsage();

  if (isLoading) {
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
          <h1 className="lh-title-page">Billing & Licenses</h1>
          <p className="lh-text-description">
            Manage your subscriptions, view payment history, and track usage across all licenses.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="ghost" 
            onClick={() => {
              refreshLicenses();
              loadUsageData();
            }}
            disabled={isLoading || loadingUsage}
          >
            <svg className="lh-icon-sm mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              ${getTotalSpent().toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
              ${getMonthlySpend().toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">This Month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
              {totalUsage.totalQueries.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Queries</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-6">
            <div className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
              {stats?.active_licenses || 0}
            </div>
            <div className="text-sm text-gray-600">Active Licenses</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Purchase New License */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-white">
            <h3 className="lh-title-small">Purchase New License</h3>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Product:
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a product...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Type:
                </label>
                <select
                  value={selectedLicenseType}
                  onChange={(e) => setSelectedLicenseType(e.target.value as 'trial' | 'standard' | 'standard_plus' | 'premium' | 'premium_plus' | 'enterprise')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="trial">Trial (Free)</option>
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
                    onChange={(e) => setSelectedBillingPeriod(e.target.value as 'monthly' | 'annual')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual (Save 10%)</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handlePurchase}
                disabled={isProcessing || !selectedProduct}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? 'Processing...' : 'Purchase License'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-white">
            <h3 className="lh-title-small">Payment History</h3>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {purchases.length === 0 ? (
              <div className="lh-empty-state">
                <svg className="lh-empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="lh-empty-state-title">No payments yet</h3>
                <p className="lh-empty-state-description">
                  Your payment history will appear here after your first purchase.
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-6 bg-white">
                {purchases?.slice(0, 5).map((purchase, index) => (
                  <div key={purchase.purchase_reference || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-900">
                        {purchase.product_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(purchase.purchased_at)} • {purchase.license_type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${(purchase.license?.amount_paid || 0).toFixed(2)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        purchase.license?.status === 'active' ? 'bg-green-100 text-green-600' :
                        purchase.license?.status === 'suspended' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {(purchase.license?.status || 'unknown').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                {(purchases?.length || 0) > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="ghost" size="sm">
                      View All Payments
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Overview */}
      <Card className="bg-white border border-gray-200 mt-8">
        <CardHeader className="bg-white">
          <h3 className="lh-title-small">Usage Overview</h3>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {usageData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-sm">No usage data available</div>
              <div className="text-xs mt-1">Purchase a license to start tracking usage</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usageData.map(({ license, usage }, index) => (
                <div key={license.id || index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">
                      {license.license_type.replace('_', ' ').toUpperCase()}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      license.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {license.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Queries Used:</span>
                      <span className="font-medium">{usage?.queries_used?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sites Used:</span>
                      <span className="font-medium">{usage?.sites_used || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Downloads:</span>
                      <span className="font-medium">{usage?.downloads_used || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboardClient;