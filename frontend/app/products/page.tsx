import { getProducts, searchProducts } from '@/lib/strapi';
import Header from '@/components/Header';
import ProductsClient from '@/components/ProductsClient';
import { Github, Linkedin, Mail } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

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

      <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-gray-400 dark:text-gray-500 mb-2">
              e-commerce platform by{' '}
              <a 
                href="https://www.stackbp.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FF9900] hover:text-[#FFB84D] transition-colors"
              >
                stackbp
              </a>
              {' '}- Built with Next.js, Strapi, database at Aiven Cloud
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-500 mr-3">Find me on</span>
            <a
              href="https://github.com/bpstack/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/salvadorperez2021/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact.bstack@gmail.com"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}