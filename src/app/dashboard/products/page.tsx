'use client';

import React, { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { ProductsPageSkeleton } from '../../../components/ui/SkeletonComponents';

// Client component for the products page - revert to client-side for now
const ProductsPage = () => (
  <Suspense fallback={<ProductsPageSkeleton />}>
    <ProductsClient />
  </Suspense>
);

export default ProductsPage;
