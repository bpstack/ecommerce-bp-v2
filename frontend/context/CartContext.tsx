// frontend/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product } from '@/types/product';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  CartResponse,
  SessionExpiredError,
} from '@/lib/strapi';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem {
  id: number;
  documentId: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (documentId: string) => Promise<void>;
  updateQuantity: (documentId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  reloadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, isLoading: isAuthLoading, logout } = useAuth();

  // Every cart call answers with the whole cart; a failure shows `errorMessage`.
  const sync = useCallback(
    async (request: Promise<CartResponse>, errorMessage: string) => {
      try {
        setItems((await request).items);
        return true;
      } catch (error) {
        if (error instanceof SessionExpiredError) {
          // Drop the dead token: the cart reloads as a guest instead of failing forever.
          logout();
          toast.error('Your session has expired. Please sign in again.');
          return false;
        }
        console.error(errorMessage, error);
        toast.error(errorMessage);
        return false;
      }
    },
    [logout]
  );

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    await sync(getCart(token), 'Failed to load cart');
    setIsLoading(false);
  }, [token, sync]);

  // Load once auth is known, and again on login/logout: the server returns the
  // cart of whoever is asking and merges the guest cart into the user's.
  useEffect(() => {
    if (!isAuthLoading) loadCart();
  }, [isAuthLoading, loadCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (await sync(addCartItem(token, product.documentId, quantity), 'Failed to add to cart')) {
      toast.success('Added to cart', { description: product.name });
    }
  };

  const removeFromCart = async (documentId: string) => {
    const item = items.find((i) => i.documentId === documentId);
    if (await sync(removeCartItem(token, documentId), 'Failed to remove item')) {
      toast.success('Removed from cart', { description: item?.product.name });
    }
  };

  const updateQuantity = async (documentId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(documentId);
    if (await sync(updateCartItem(token, documentId, quantity), 'Failed to update quantity')) {
      toast.success('Quantity updated');
    }
  };

  // Local only: the server empties the cart itself when the order is created.
  const clearCart = () => setItems([]);

  const getCartTotal = () =>
    items.reduce((total, item) => total + item.product.priceCents * item.quantity, 0);

  const getCartItemsCount = () => items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
