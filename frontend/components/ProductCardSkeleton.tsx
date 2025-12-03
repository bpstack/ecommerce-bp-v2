//frontend/components/ProductCardSkeleton.tsx

'use client';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="absolute inset-0 skeleton-shimmer" />
      </div>

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 skeleton-shimmer" />
        </div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer"
              />
            ))}
          </div>
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />
        </div>

        {/* Price skeleton */}
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-shimmer" />

        {/* Button skeleton */}
        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}