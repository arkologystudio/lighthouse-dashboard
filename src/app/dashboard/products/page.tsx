'use client';

import React, { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { ProductsPageSkeleton } from '../../../components/ui/SkeletonComponents';

// Error Boundary to catch and display React errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Products page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="lh-error-container">
          <div className="lh-error-message">
            Something went wrong loading the products page.
          </div>
          <div className="text-sm text-gray-600 mb-4">
            Error: {this.state.error?.message}
          </div>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Client component for the products page - revert to client-side for now
const ProductsPage = () => (
  <ErrorBoundary>
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsClient />
    </Suspense>
  </ErrorBoundary>
);

export default ProductsPage;
