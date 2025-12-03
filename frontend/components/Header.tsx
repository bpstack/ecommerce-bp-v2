'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const navItems = ["All", "Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell"];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout, isLoading } = useAuth();
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
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-3">
            {/* Logo */}
            <Link href="/products" className="flex-shrink-0">
              {/* Desktop Logo - Light Mode */}
              <Image 
                src="/images/amazon-logo.png" 
                alt="Amazon Logo" 
                width={100} 
                height={30}
                className="hidden sm:block dark:hidden"
                priority
              />
              {/* Desktop Logo - Dark Mode */}
              <Image 
                src="/images/amazon-logo-white.png" 
                alt="Amazon Logo" 
                width={100} 
                height={30}
                className="hidden dark:sm:block"
                priority
              />
              {/* Mobile Logo - Light Mode */}
              <Image 
                src="/images/amazon-mobile-logo.png" 
                alt="Amazon Logo" 
                width={40} 
                height={40}
                className="block sm:hidden dark:hidden"
                priority
              />
              {/* Mobile Logo - Dark Mode */}
              <Image 
                src="/images/amazon-mobile-logo-white.png" 
                alt="Amazon Logo" 
                width={40} 
                height={40}
                className="hidden dark:block dark:sm:hidden"
                priority
              />
            </Link>

            {/* Search Bar - Hidden on mobile, visible on sm and up */}
            <form onSubmit={handleSearch} className="flex-1 max-w-3xl hidden sm:block">
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
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
              {/* User Account */}
              {!isLoading && (
                <>
                  {user ? (
                    <div className="relative group">
                      <button className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm text-left p-1">
                        <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Hello, {user.username}</div>
                        <div className="font-bold text-sm sm:text-base">
                          <span className="hidden sm:inline">Account ▾</span>
                          <span className="sm:hidden">
                            {user.username.length > 10 ? `${user.username.substring(0, 10)}...` : user.username}
                          </span>
                        </div>
                      </button>
                      {/* Dropdown - Adjusted positioning for mobile */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/orders"
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            My Orders
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm"
                    >
                      <div className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Hello, Sign in</div>
                      <div className="font-bold text-sm sm:text-base">
                        <span className="hidden sm:inline">Account</span>
                        <span className="sm:hidden">Sign in</span>
                      </div>
                    </Link>
                  )}
                </>
              )}

              {/* Returns & Orders - Hidden on mobile */}
              <Link
                href="/orders"
                className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm hidden md:block"
              >
                <div className="text-xs text-gray-600 dark:text-gray-400">Returns</div>
                <div className="font-bold">& Orders</div>
              </Link>

              {/* Theme Toggle - Larger size */}
              <div className="scale-110 sm:scale-100">
                <ThemeToggle />
              </div>

              {/* Cart - Larger size */}
              <Link
                href="/cart"
                className="flex items-center gap-1 sm:gap-2 hover:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                <div className="relative">
                  <svg
                    className="w-7 sm:w-8 h-7 sm:h-8"
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
                <span className="font-bold hidden sm:inline">Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Only visible on mobile */}
      <div className="sm:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-2">
        <form onSubmit={handleSearch}>
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
              className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 px-4 transition-colors flex items-center justify-center"
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
      </div>

      {/* Secondary Navigation - Desktop */}
      <div className="hidden md:block bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2 text-sm">
            {navItems.map((item) => (
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

      {/* Secondary Navigation - Mobile */}
      <div className="md:hidden bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-2 text-sm">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 hover:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span>All</span>
            </button>

            {/* Show first 2 items inline */}
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <button className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors font-medium">
              Today's Deals
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="container mx-auto px-4 py-2">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}