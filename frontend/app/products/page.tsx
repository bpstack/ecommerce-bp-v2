// frontend/app/products/page.tsx

import { getProducts } from '@/lib/strapi';
import Header from '@/components/Header';
import ProductsClient from '@/components/ProductsClient';
import { Github, Linkedin, Mail } from 'lucide-react';

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
              {' '}• Built with Next.js, Strapi, database at Aiven Cloud
            </p>
          </div>
          
          {/* Social links */}
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