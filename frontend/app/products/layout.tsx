// frontend/app/products/layout.tsx

import HeaderWrapper from '@/components/HeaderWrapper';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <HeaderWrapper />
      {children}
      
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