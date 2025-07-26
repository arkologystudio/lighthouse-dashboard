'use client';

import React, { Suspense } from 'react';
import DashboardClient from './DashboardClient';

// Loading component for the dashboard
const DashboardLoading = () => (
  <div className="lh-loading-container">
    <div className="lh-spinner lh-spinner-lg" />
  </div>
);

// Client component for the dashboard page - revert to client-side for now
const DashboardPage = () => (
  <Suspense fallback={<DashboardLoading />}>
    <DashboardClient />
  </Suspense>
);

export default DashboardPage;
