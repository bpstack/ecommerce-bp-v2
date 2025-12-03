//frontend/components/ProductsClient.tsx

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductGrid from './ProductGrid';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';

interface ProductsClientProps {
  products: Product[];
}

function getUniqueCategories(products: Product[]): string[] {
  const allKeywords = products.flatMap((p) => p.keywords || []);
  const unique = [...new Set(allKeywords)].sort();
  return unique;
}

function filterProducts(
  products: Product[],
  searchText: string,
  selectedCategory: string
): Product[] {
  return products.filter((product) => {
    const normalizedSearch = searchText.toLowerCase().trim();
    
    const matchesSearch =
      normalizedSearch === '' ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      (product.keywords || []).some((k) =>
        k.toLowerCase().includes(normalizedSearch)
      );

    const matchesCategory =
      selectedCategory === '' ||
      (product.keywords || []).includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchInput(urlSearch);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Detectar cuando está en proceso de debounce
  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }, [searchInput, debouncedSearch]);

  const categories = useMemo(() => getUniqueCategories(products), [products]);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearch, selectedCategory),
    [products, debouncedSearch, selectedCategory]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
      console.log('Added to cart:', product.name);
    },
    [addToCart]
  );

  const clearFilters = () => {
    setSearchInput('');
    setSelectedCategory('');
  };

  const hasActiveFilters = searchInput !== '' || selectedCategory !== '';

  return (
    <div>
      {/* Filtros */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Input de búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name or keyword on this page..."
                className="w-full px-4 py-3 pl-11 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Indicador de filtrado o botón clear */}
              {isFiltering ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-orange-500 text-xs">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="hidden sm:inline">Filtering...</span>
                </div>
              ) : searchInput ? (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          {/* Select de categoría */}
          <div className="sm:w-64">
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Info de filtros activos */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 px-4 py-3 rounded-lg">
            <div className="text-sm text-orange-800 dark:text-orange-200">
              <span className="font-medium">{filteredProducts.length}</span> products found
              {debouncedSearch && (
                <span> for &quot;{debouncedSearch}&quot;</span>
              )}
              {selectedCategory && (
                <span> in <span className="font-medium capitalize">{selectedCategory}</span></span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Grid de productos - SIEMPRE VISIBLE */}
      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </div>
  );
}