// components/Header.tsx

'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

import { useCart } from '@/context/CartContext';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemsCount } = useCart();
  const cartCount = getCartItemsCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white sticky top-0 z-50">
  {/* Main Header */}
  <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-4 py-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop</h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2.5 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none dark:placeholder-gray-400"
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 px-6 transition-colors flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 text-gray-900 dark:text-white"
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
            </button>
          </div>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Returns & Orders */}
          <button className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm">
            <div className="text-xs">Returns</div>
            <div className="font-bold">& Orders</div>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart */}
          <button className="flex items-center gap-2 hover:text-orange-400 dark:hover:text-orange-300 transition-colors">
            <div className="relative">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-orange-400 dark:bg-orange-500 text-gray-900 dark:text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="font-bold">Cart</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  {/* Secondary Navigation */}
  <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
    <div className="container mx-auto px-4">
      <div className="flex items-center gap-6 py-2 text-sm">
        {["All", "Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell"].map((item) => (
          <button
            key={item}
            className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  </div>
</header>
  );}
