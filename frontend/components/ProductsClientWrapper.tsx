// frontend/components/ProductsClientWrapper.tsx
'use client';

import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { Product } from '@/types/product';

function ProductsClientFallback() {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      Loading filters...
    </div>
  );
}

interface ProductsClientWrapperProps {
  products: Product[];
}

export default function ProductsClientWrapper({ products }: ProductsClientWrapperProps) {
  return (
    <Suspense fallback={<ProductsClientFallback />}>
      <ProductsClient products={products} />
    </Suspense>
  );
}