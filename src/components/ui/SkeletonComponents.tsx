import React from 'react';
import { Card, CardHeader, CardContent } from './Card';

// Generic skeleton component
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Dashboard stats skeleton
export const StatCardSkeleton: React.FC = () => (
  <Card className="lh-card">
    <CardHeader className="pb-2">
      <div className="lh-flex-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-12" />
      </div>
    </CardHeader>
    <CardContent className="pt-2">
      <div className="lh-flex-between">
        <div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="mt-4">
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);

// Activity item skeleton
export const ActivityItemSkeleton: React.FC = () => (
  <div className="lh-flex-start p-4">
    <Skeleton className="flex-shrink-0 w-12 h-12 rounded-full" />
    <div className="flex-1 min-w-0 ml-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-2" />
      <div className="lh-flex-icon-text">
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

// Table row skeleton
export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => (
  <tr className="lh-table-row">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="lh-table-cell">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Quick action card skeleton
export const QuickActionSkeleton: React.FC = () => (
  <Card className="lh-card">
    <CardHeader className="pb-4">
      <div className="lh-flex-icon-text">
        <Skeleton className="flex-shrink-0 w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="h-6 w-32 mb-2" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

// Sites card skeleton
export const SiteCardSkeleton: React.FC = () => (
  <Card className="lh-card">
    <CardHeader className="pb-4">
      <div className="lh-flex-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="lh-flex-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="lh-flex-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="pt-4 space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Products card skeleton
export const ProductCardSkeleton: React.FC = () => (
  <Card className="lh-card">
    <CardHeader className="pb-4">
      <div className="lh-flex-icon-text">
        <Skeleton className="flex-shrink-0 w-12 h-12 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-4" />
      <div className="lh-flex-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
    </CardContent>
  </Card>
);

// Sites page skeleton
export const SitesPageSkeleton: React.FC = () => (
  <div className="lh-page-container">
    <div className="lh-page-header">
      <div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
    
    <div className="lh-grid-cards">
      {Array.from({ length: 6 }).map((_, index) => (
        <SiteCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Products page skeleton
export const ProductsPageSkeleton: React.FC = () => (
  <div className="lh-page-container">
    <div className="lh-page-header">
      <div>
        <Skeleton className="h-8 w-40 mb-2" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
    
    <div className="lh-grid-cards">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Page skeleton for full page loading
export const PageSkeleton: React.FC = () => (
  <div className="lh-page-container">
    {/* Header skeleton */}
    <div className="lh-page-header">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>

    {/* Content skeleton */}
    <div className="space-y-8">
      <div>
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="lh-grid-stats">
          {Array.from({ length: 3 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="lh-grid-cards">
          {Array.from({ length: 3 }).map((_, index) => (
            <QuickActionSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  </div>
);