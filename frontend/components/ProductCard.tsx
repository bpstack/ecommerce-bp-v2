// components/ProductCard.tsx

'use client';

import { Product } from '@/types/product';
import { formatPrice, getImageUrl } from '@/lib/strapi';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-gray-700/50 transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700 group">
      <div className="relative aspect-square bg-gray-100 dark:bg-white overflow-hidden">
        <Image
          src={getImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 min-h-[40px] hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const fullStars = Math.floor(product.rating.stars);
              const hasHalfStar = product.rating.stars % 1 !== 0;
              
              return (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < fullStars
                      ? 'text-yellow-400 fill-current'
                      : i === fullStars && hasHalfStar
                      ? 'text-yellow-400 fill-current opacity-50'
                      : 'text-gray-300 dark:text-gray-600 fill-current'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              );
            })}
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            ({product.rating.count.toLocaleString()})
          </span>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${formatPrice(product.priceCents)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 font-medium py-2.5 px-4 rounded-lg transition-colors active:scale-95 transform"
        >
          Add to Cart
        </button>

        {product.type === 'clothing' && (
          <div className="mt-3">
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded">
              Clothing
            </span>
          </div>
        )}
      </div>
    </div>
  );
}