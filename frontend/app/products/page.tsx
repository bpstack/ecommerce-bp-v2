// app/products/page.tsx
// Maneja: /products (página 1) y /products?search=xxx

import { getProducts, searchProducts } from '@/lib/strapi';
import ProductsClientWrapper from '@/components/ProductsClientWrapper';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

const PAGE_SIZE = 25;

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const searchQuery = params.search || '';
  const currentPage = 1; // Esta página siempre es la 1

  let productsData;
  
  if (searchQuery) {
    // Búsqueda: siempre dinámica
    productsData = await searchProducts(searchQuery);
  } else {
    // Página 1 del catálogo
    productsData = await getProducts(currentPage, PAGE_SIZE);
  }

  const products = productsData.data;
  const pagination = productsData.meta?.pagination;
  const totalPages = pagination?.pageCount || 1;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
        </h2>
        {searchQuery && (
          <Link
            href="/products"
            className="text-orange-500 hover:text-orange-600 text-sm font-medium"
          >
            Clear search
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No products found {searchQuery && `for "${searchQuery}"`}
          </p>
          {searchQuery && (
            <Link
              href="/products"
              className="inline-block mt-4 text-orange-500 hover:text-orange-600"
            >
              View all products
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pagination Top - Solo si no hay búsqueda */}
          {!searchQuery && totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages}
              />
            </div>
          )}

          <ProductsClientWrapper products={products} />

          {/* Pagination Bottom */}
          {!searchQuery && totalPages > 1 && (
            <div className="space-y-4">
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages}
              />
              
              {pagination && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages} • {pagination.total} products total
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}