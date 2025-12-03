// frontend/app/products/page.tsx

import { getProducts, searchProducts } from '@/lib/strapi';
import ProductsClient from '@/components/ProductsClient';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.search || '';
  const pageSize = 25;

  let productsData;
  
  if (searchQuery) {
    productsData = await searchProducts(searchQuery);
  } else {
    productsData = await getProducts(currentPage, pageSize);
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
        <div>
          <ProductsClient products={products} />

          {!searchQuery && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              {currentPage > 1 && (
                <Link
                  href={`/products?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  Previous
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={`/products?page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-orange-400 dark:bg-orange-500 text-white font-bold'
                          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {currentPage < totalPages && (
                <Link
                  href={`/products?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}

          {!searchQuery && pagination && (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              Page {currentPage} of {totalPages} - {pagination.total} products
            </p>
          )}
        </div>
      )}
    </main>
  );
}