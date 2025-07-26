'use client';

import React, { Suspense } from 'react';
import ActivitiesClient from './ActivitiesClient';

const ActivitiesLoading = () => (
  <div className="lh-loading-container">
    <div className="lh-spinner lh-spinner-lg" />
  </div>
);

const ActivitiesPage = () => (
  <Suspense fallback={<ActivitiesLoading />}>
    <ActivitiesClient />
  </Suspense>
);

export default ActivitiesPage;