'use client';

import React, { useState } from 'react';
import { usePricing } from '../../../lib/hooks/usePricing';
import { usePurchases } from '../../../lib/hooks/usePurchases';
import { Card, CardHeader, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { LicenseType, BillingPeriod, SimulatePurchaseRequest } from '../../../types';

const LicensePurchaseClient: React.FC = () => {
  const { tiers, isLoading: pricingLoading, error: pricingError } = usePricing();
  const { simulatePurchase, isLoading: purchaseLoading } = usePurchases();
  const [selectedTier, setSelectedTier] = useState<LicenseType>('standard');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [additionalSites, setAdditionalSites] = useState(0);
  const [customEmbedding, setCustomEmbedding] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedTierData = tiers.find(tier => tier.tier_name === selectedTier);

  const handlePurchase = async () => {
    if (!selectedTierData) return;

    setIsProcessing(true);
    try {
      const request: SimulatePurchaseRequest = {
        product_slug: 'lumen-search-api',
        license_type: selectedTier,
        billing_period: billingPeriod,
        additional_sites: additionalSites,
        custom_embedding: customEmbedding,
      };

      const result = await simulatePurchase(request);
      
      if (result.success) {
        // Show success message or redirect
        alert('License purchased successfully!');
      } else {
        alert(`Purchase failed: ${result.error}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePrice = () => {
    if (!selectedTierData) return 0;
    
    const basePrice = billingPeriod === 'annual' 
      ? selectedTierData.annual_price 
      : selectedTierData.monthly_price;
    
    const sitesPrice = additionalSites * (selectedTierData.extra_site_price || 0);
    const embeddingPrice = customEmbedding 
      ? basePrice * ((selectedTierData.custom_embedding_markup || 0) / 100)
      : 0;
    
    return basePrice + sitesPrice + embeddingPrice;
  };

  if (pricingLoading) {
    return (
      <div className="lh-loading-container">
        <div className="lh-spinner lh-spinner-lg" />
      </div>
    );
  }

  if (pricingError) {
    return (
      <div className="lh-section-container">
        <div className="lh-error-message">
          Failed to load pricing: {pricingError}
        </div>
      </div>
    );
  }

  return (
    <div className="lh-section-container">
      {/* Header */}
      <div className="lh-page-header">
        <div>
          <h1 className="lh-title-page">License Purchase</h1>
          <p className="lh-text-description">
            Choose a license tier for Lumen Search API and complete your purchase.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pricing Tiers */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="lh-title-small">Choose Your Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiers
              .filter(tier => tier.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map(tier => (
                <div 
                  key={tier.id}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedTier(tier.tier_name as LicenseType)}
                >
                  <Card 
                    className={`${
                      selectedTier === tier.tier_name
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:shadow-md'
                    }`}
                  >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="lh-title-small">{tier.display_name}</h3>
                        <p className="lh-text-description">{tier.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${billingPeriod === 'annual' ? tier.annual_price : tier.monthly_price}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{billingPeriod === 'annual' ? 'year' : 'month'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.max_queries && (
                        <li className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          {tier.max_queries.toLocaleString()} queries/month
                        </li>
                      )}
                      <li className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        {tier.max_sites} site{tier.max_sites > 1 ? 's' : ''}
                      </li>
                      {tier.agent_api_access && (
                        <li className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Agent API Access
                        </li>
                      )}
                      {tier.features?.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        </div>

        {/* Purchase Configuration */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="lh-title-small">Configuration</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Billing Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Period
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billing"
                      value="monthly"
                      checked={billingPeriod === 'monthly'}
                      onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
                      className="mr-2"
                    />
                    Monthly
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="billing"
                      value="annual"
                      checked={billingPeriod === 'annual'}
                      onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
                      className="mr-2"
                    />
                    Annual (Save 20%)
                  </label>
                </div>
              </div>

              {/* Additional Sites */}
              {selectedTierData?.extra_site_price && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Sites
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={additionalSites}
                    onChange={(e) => setAdditionalSites(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ${selectedTierData.extra_site_price}/site
                  </p>
                </div>
              )}

              {/* Custom Embedding */}
              {selectedTierData?.custom_embedding_markup && (
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={customEmbedding}
                      onChange={(e) => setCustomEmbedding(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Custom Embedding (+{selectedTierData.custom_embedding_markup}%)
                    </span>
                  </label>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <h3 className="lh-title-small">Order Summary</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{selectedTierData?.display_name} ({billingPeriod})</span>
                  <span>
                    ${billingPeriod === 'annual' 
                      ? selectedTierData?.annual_price 
                      : selectedTierData?.monthly_price}
                  </span>
                </div>
                
                {additionalSites > 0 && selectedTierData?.extra_site_price && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{additionalSites} additional sites</span>
                    <span>${additionalSites * selectedTierData.extra_site_price}</span>
                  </div>
                )}
                
                {customEmbedding && selectedTierData?.custom_embedding_markup && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Custom embedding markup</span>
                    <span>
                      ${Math.round(
                        (billingPeriod === 'annual' 
                          ? selectedTierData.annual_price 
                          : selectedTierData.monthly_price) *
                        (selectedTierData.custom_embedding_markup / 100)
                      )}
                    </span>
                  </div>
                )}
                
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculatePrice()}</span>
                </div>
              </div>
              
              <Button
                onClick={handlePurchase}
                isLoading={isProcessing || purchaseLoading}
                disabled={isProcessing || purchaseLoading}
                className="w-full mt-4"
              >
                {isProcessing || purchaseLoading ? 'Processing...' : 'Purchase License'}
              </Button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                This is a simulation purchase for demo purposes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LicensePurchaseClient;