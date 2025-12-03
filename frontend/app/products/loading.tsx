// frontend/app/products/loading.tsx

import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Título skeleton */}
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
      </div>

      {/* Grid skeleton */}
      <ProductGridSkeleton count={8} />
    </main>
  );
}