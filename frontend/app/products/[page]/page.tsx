// app/products/[page]/page.tsx
// Maneja: /products/2, /products/3, etc.
// Pre-genera páginas en build time con ISR

import { getProducts, getTotalProductPages } from '@/lib/strapi';
import ProductsClientWrapper from '@/components/ProductsClientWrapper';
import Pagination from '@/components/Pagination';
import { notFound, redirect } from 'next/navigation';

const PAGE_SIZE = 25;

// ============================================
// ISR: Pre-genera las páginas en build time
// ============================================
export async function generateStaticParams() {
  const totalPages = await getTotalProductPages(PAGE_SIZE);
  
  // Genera páginas 2 hasta totalPages
  // (página 1 es /products sin parámetro)
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

// ============================================
// ISR: Revalida cada 60 segundos
// ============================================
export const revalidate = 60;

// ============================================
// Metadata dinámica para SEO
// ============================================
export async function generateMetadata({ params }: Props) {
  const { page } = await params;
  const pageNumber = parseInt(page, 10);
  
  return {
    title: `Products - Page ${pageNumber} | bpshop`,
    description: `Browse our product catalog - Page ${pageNumber}`,
  };
}

interface Props {
  params: Promise<{ page: string }>;
}

export default async function ProductsPageNumber({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);

  // Validaciones
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Página 1 debería ir a /products (sin número)
  if (currentPage === 1) {
    redirect('/products');
  }

  const productsData = await getProducts(currentPage, PAGE_SIZE);
  const products = productsData.data;
  const pagination = productsData.meta?.pagination;
  const totalPages = pagination?.pageCount || 1;

  // Si la página solicitada no existe
  if (currentPage > totalPages) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Products
        </h2>
      </div>

      <div className="space-y-8">
        {/* Pagination Top */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages}
            />
          </div>
        )}

        <ProductsClientWrapper products={products} />

        {/* Pagination Bottom */}
        {totalPages > 1 && (
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
    </main>
  );
}