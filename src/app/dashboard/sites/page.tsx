'use client';

import React, { Suspense } from 'react';
import SitesClient from './SitesClient';

// Loading component for the sites page
const SitesLoading = () => (
  <div className="lh-loading-container">
    <div className="lh-spinner lh-spinner-lg" />
  </div>
);

// Client component for the sites page - revert to client-side for now
const SitesPage = () => (
  <Suspense fallback={<SitesLoading />}>
    <SitesClient />
  </Suspense>
);

export default SitesPage;
