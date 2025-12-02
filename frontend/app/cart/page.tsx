//app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, getImageUrl } from '@/lib/strapi';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

export default function CartPage() {
  const { items, isLoading, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-block bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.documentId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(item.product.image)}
                        alt={item.product.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3">
                        ${formatPrice(item.product.priceCents)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.documentId, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l-lg"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-gray-900 dark:text-white font-medium border-x border-gray-300 dark:border-gray-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.documentId, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r-lg"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.documentId)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total - Hidden on mobile, shown on larger screens */}
                    <div className="hidden sm:block text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${formatPrice(item.product.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Item Total - Mobile */}
                  <div className="sm:hidden mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ${formatPrice(item.product.priceCents * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 lg:mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</span>
                    <span>${formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                {user ? (
                  <Link
                    href="/checkout"
                    className="block w-full bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors text-center"
                    >
                      Sign in to Checkout
                    </Link>
                    <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                      Don't have an account?{' '}
                      <Link href="/register" className="text-orange-500 hover:text-orange-600">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}

                <Link
                  href="/"
                  className="block w-full mt-3 text-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 text-sm transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}