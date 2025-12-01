'use client';

import { Product } from '@/types/product';
import ProductGrid from './ProductGrid';
import { useCart } from '@/context/CartContext';

interface ProductsClientProps {
  products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    // Optional: Add toast notification here later
    console.log('Added to cart:', product.name);
  };

  return <ProductGrid products={products} onAddToCart={handleAddToCart} />;
}