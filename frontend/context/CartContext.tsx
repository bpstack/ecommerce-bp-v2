// frontend/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Product } from '@/types/product';
import {
  getSession,
  getCart,
  createCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  migrateCart,
} from '@/lib/strapi';
import { useAuth } from './AuthContext';
import { toast } from 'sonner'; // 👈 YA ESTÁ IMPORTADO ✅

export interface CartItem {
  id: number;
  documentId: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  sessionId: string | null;
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
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<number | null>(null);
  const { user } = useAuth();
  const previousUserId = useRef<number | null>(null);

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get or create session
      const sessionData = await getSession();
      setSessionId(sessionData.sessionId);

      // Get cart for this session
      const cartResponse = await getCart(sessionData.sessionId);

      if (cartResponse.data.length > 0) {
        // Cart exists
        const cart = cartResponse.data[0];
        setCartId(cart.id);

        // Map cart items
        const cartItems: CartItem[] = (cart.cart_items || []).map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          product: item.product,
          quantity: item.quantity,
        }));

        setItems(cartItems);
      } else {
        // Create new cart
        const newCart = await createCart(sessionData.sessionId);
        setCartId(newCart.data.id);
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart'); // 👈 NUEVO
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Migrate cart when user logs in
  useEffect(() => {
    const handleMigration = async () => {
      if (user && !previousUserId.current && sessionId) {
        // User just logged in
        try {
          await migrateCart(sessionId, user.id);
          await loadCart();
          toast.success('Cart synced to your account'); // 👈 NUEVO
        } catch (error) {
          console.error('Error migrating cart:', error);
          toast.error('Failed to sync cart'); // 👈 NUEVO
        }
      }
      previousUserId.current = user?.id || null;
    };

    handleMigration();
  }, [user, sessionId, loadCart]);

  const addToCart = async (product: Product, quantity: number = 1) => {
    if (!cartId) {
      toast.error('Cart not ready'); // 👈 NUEVO
      return;
    }

    try {
      // Check if product already in cart
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Update quantity
        await updateCartItem(existingItem.documentId, existingItem.quantity + quantity);
        toast.success('Cart updated', { // 👈 NUEVO
          description: `${product.name} quantity increased`,
        });
      } else {
        // Add new item
        await addCartItem(cartId, product.id, quantity);
        toast.success('Added to cart', { // 👈 NUEVO
          description: product.name,
        });
      }

      // Reload cart to get updated data
      await loadCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart'); // 👈 NUEVO
    }
  };

  const removeFromCart = async (documentId: string) => {
    try {
      // Find product name before removing
      const item = items.find(i => i.documentId === documentId);
      
      await removeCartItem(documentId);
      await loadCart();
      
      if (item) {
        toast.success('Removed from cart', { // 👈 NUEVO
          description: item.product.name,
        });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item'); // 👈 NUEVO
    }
  };

  const updateQuantity = async (documentId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(documentId);
        return;
      }

      await updateCartItem(documentId, quantity);
      await loadCart();
      toast.success('Quantity updated'); // 👈 NUEVO
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity'); // 👈 NUEVO
    }
  };

  const clearCart = () => {
    if (items.length > 0) {
      setItems([]);
      toast.success('Cart cleared'); // 👈 NUEVO
    }
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => {
      return total + item.product.priceCents * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const reloadCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading,
        sessionId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        reloadCart,
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