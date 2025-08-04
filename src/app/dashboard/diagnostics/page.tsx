import React, { Suspense } from 'react';
import DiagnosticsClient from './DiagnosticsClient';

const DiagnosticsPage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DiagnosticsClient />
  </Suspense>
);

export default DiagnosticsPage;
