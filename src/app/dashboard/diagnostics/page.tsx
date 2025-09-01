import React, { Suspense } from 'react';
import DiagnosticsClient from './DiagnosticsClient';
import { DiagnosticsErrorBoundary } from '../../../components/diagnostics/DiagnosticsErrorBoundary';

const DiagnosticsPage: React.FC = () => (
  <DiagnosticsErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <DiagnosticsClient />
    </Suspense>
  </DiagnosticsErrorBoundary>
);

export default DiagnosticsPage;
