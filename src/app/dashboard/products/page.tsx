'use client';

import React, { Suspense } from 'react';
import ProductsClient from './ProductsClient';

// Loading component for the products page
const ProductsLoading = () => (
  <div className="lh-loading-container min-h-64">
    <div className="lh-spinner lh-spinner-lg" />
  </div>
);

// Client component for the products page - revert to client-side for now
const ProductsPage = () => (
  <Suspense fallback={<ProductsLoading />}>
    <ProductsClient />
  </Suspense>
);

export default ProductsPage;
