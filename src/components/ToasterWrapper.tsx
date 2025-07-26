'use client';

import { Toaster } from 'react-hot-toast';

export const ToasterWrapper = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 4000,
      style: {
        background: '#fff',
        color: '#374151',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      success: {
        iconTheme: {
          primary: '#10B981',
          secondary: '#fff',
        },
      },
      error: {
        iconTheme: {
          primary: '#EF4444',
          secondary: '#fff',
        },
      },
    }}
  />
);