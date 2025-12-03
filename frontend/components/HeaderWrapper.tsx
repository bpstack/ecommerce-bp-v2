// frontend/components/HeaderWrapper.tsx
'use client';

import { Suspense } from 'react';
import Header from './Header';

function HeaderFallback() {
  return (
    <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 h-32" />
  );
}

export default function HeaderWrapper() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <Header />
    </Suspense>
  );
}