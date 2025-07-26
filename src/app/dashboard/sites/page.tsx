'use client';

import React, { Suspense } from 'react';
import SitesClient from './SitesClient';
import { SitesPageSkeleton } from '../../../components/ui/SkeletonComponents';

// Client component for the sites page - revert to client-side for now
const SitesPage = () => (
  <Suspense fallback={<SitesPageSkeleton />}>
    <SitesClient />
  </Suspense>
);

export default SitesPage;
