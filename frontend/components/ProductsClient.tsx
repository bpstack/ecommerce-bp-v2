// frontend/components/ProductsClient.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductGrid from './ProductGrid';
import { useCart } from '@/context/CartContext';
import { useSearchParams } from 'next/navigation';
import { Search, X, Loader2, Menu, Shirt, Dumbbell, Home, Sparkles } from 'lucide-react';

interface ProductsClientProps {
  products: Product[];
}

// Organización jerárquica de categorías
const categoryGroups = {
  'Clothing': ['apparel', 'clothing', 'tshirts', 'hoodies', 'underwear'],
  'Sports': ['sports', 'basketballs', 'athletic'],
  'Men': ['mens'],
  'Women': ['womens'],
  'Home': ['home', 'bedroom', 'bathroom', 'kitchen', 'backyard'],
  'Accessories': ['accessories', 'jewelry', 'socks'],
};

const categoryIcons: Record<string, any> = {
  'Clothing': Shirt,
  'Sports': Dumbbell,
  'Men': Shirt,
  'Women': Shirt,
  'Home': Home,
  'Accessories': Sparkles,
};

function getUniqueCategories(products: Product[]): string[] {
  const allKeywords = products.flatMap((p) => p.keywords || []);
  const unique = [...new Set(allKeywords)].sort();
  return unique;
}

function filterProducts(
  products: Product[],
  searchText: string,
  selectedCategories: string[]
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
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => (product.keywords || []).includes(cat));

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchInput(urlSearch);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (searchInput !== debouncedSearch) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }, [searchInput, debouncedSearch]);

  const categories = useMemo(() => getUniqueCategories(products), [products]);

  const filteredProducts = useMemo(
    () => filterProducts(products, debouncedSearch, selectedCategories),
    [products, debouncedSearch, selectedCategories]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product, 1);
    },
    [addToCart]
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedCategories([]);
  };

  const hasActiveFilters = searchInput !== '' || selectedCategories.length > 0;

  // Count products per category
  const getCategoryCount = (categoryKeywords: string[]) => {
    return products.filter(p => 
      categoryKeywords.some(keyword => (p.keywords || []).includes(keyword))
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Search Bar + Filter Buttons - More compact on mobile */}
      <div className="flex gap-2">
        {/* Filter Button - Compact on mobile */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex-shrink-0 px-2 sm:px-4 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 sm:gap-2"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
          <span className="hidden xs:inline text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Filters
          </span>
          {selectedCategories.length > 0 && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
              {selectedCategories.length}
            </span>
          )}
        </button>

        {/* Clear Filters Button - More compact on mobile */}
        {selectedCategories.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex-shrink-0 px-2 sm:px-4 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
            title="Clear filters"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}

        {/* Search Bar - Takes remaining space */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2 sm:py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          
          <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isFiltering && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-spin" />
            )}
            {searchInput && !isFiltering && (
              <button
                onClick={() => setSearchInput('')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Narrower on mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] sm:w-80 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Filters
          </h3>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Clear All Button inside sidebar */}
          {selectedCategories.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}

          {/* Category Groups */}
          {Object.entries(categoryGroups).map(([groupName, keywords]) => {
            const Icon = categoryIcons[groupName];
            const availableKeywords = keywords.filter(k => categories.includes(k));
            
            if (availableKeywords.length === 0) return null;

            const groupCount = getCategoryCount(availableKeywords);

            return (
              <div key={groupName} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  {groupName}
                  <span className="text-xs text-gray-500 dark:text-gray-400">({groupCount})</span>
                </div>
                
                <div className="space-y-0.5 sm:space-y-1 pl-4 sm:pl-6">
                  {availableKeywords.map((keyword) => {
                    const isSelected = selectedCategories.includes(keyword);
                    const count = products.filter(p => 
                      (p.keywords || []).includes(keyword)
                    ).length;

                    return (
                      <label
                        key={keyword}
                        className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(keyword)}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500"
                        />
                        <span className="flex-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {keyword}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm sm:text-base font-medium transition-colors"
          >
            Show {filteredProducts.length} products
          </button>
        </div>
      </div>

      {/* Results Info */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products found
          </p>
        </div>
      )}

      {/* Products Grid */}
      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </div>
  );
}