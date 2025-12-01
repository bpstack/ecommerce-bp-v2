// frontend/app/page.tsx

import { getProducts } from '@/lib/strapi';
import Header from '@/components/Header';
import ProductsClient from '@/components/ProductsClient';

export default async function Home() {
  const productsData = await getProducts(1, 100);
  const products = productsData.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          All Products
        </h2>
        
        <ProductsClient products={products} />
      </main>

      <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">
            Modern E-commerce Platform • Built with Next.js & Strapi
          </p>
        </div>
      </footer>
    </div>
  );
}