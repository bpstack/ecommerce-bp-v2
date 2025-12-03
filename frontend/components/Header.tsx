//frontend/components/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Grid3x3, 
  TrendingUp, 
  HeadphonesIcon, 
  Gift, 
  CreditCard, 
  Store,
  MapPin,
  Package,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Navigation,
  Info
} from 'lucide-react';

const navItems = [
  { 
    name: "All", 
    href: "/products",
    icon: Grid3x3,
    description: "Browse all categories"
  },
  { 
    name: "Today's Deals", 
    href: "/deals",
    icon: TrendingUp,
    description: "Special offers"
  },
  { 
    name: "Customer Service", 
    href: "/support",
    icon: HeadphonesIcon,
    description: "Help & contact"
  },
  { 
    name: "Registry", 
    href: "/register",
    icon: Gift,
    description: "Wedding & Baby"
  },
  { 
    name: "Gift Cards", 
    href: "/gift-cards",
    icon: CreditCard,
    description: "Give the perfect gift"
  },
  { 
    name: "Sell", 
    href: "/seller",
    icon: Store,
    description: "Start selling"
  }
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { user, logout, isLoading } = useAuth();
  const cartCount = getCartItemsCount();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sincronizar el input con el query param
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    } else {
      setSearchQuery('');
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      router.push(`/products?search=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push('/products');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    router.push('/products');
  };

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.href) {
      router.push(item.href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white sticky top-0 z-50 shadow-sm">
        {/* Main Header */}
        <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4 py-3">
              {/* Logo */}
              <Link href="/products" className="flex-shrink-0">
                <Image 
                  src="/images/amazon-logo.png" 
                  alt="Amazon Logo" 
                  width={100} 
                  height={30}
                  className="hidden sm:block dark:hidden"
                  priority
                />
                <Image 
                  src="/images/amazon-logo-white.png" 
                  alt="Amazon Logo" 
                  width={100} 
                  height={30}
                  className="hidden dark:sm:block"
                  priority
                />
                <Image 
                  src="/images/amazon-mobile-logo.png" 
                  alt="Amazon Logo" 
                  width={40} 
                  height={40}
                  className="block sm:hidden dark:hidden"
                  priority
                />
                <Image 
                  src="/images/amazon-mobile-logo-white.png" 
                  alt="Amazon Logo" 
                  width={40} 
                  height={40}
                  className="hidden dark:block dark:sm:hidden"
                  priority
                />
              </Link>

              {/* Deliver to - Desktop Only */}
              <button 
                onClick={() => setLocationModalOpen(true)}
                className="hidden lg:flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Deliver to</div>
                  <div className="font-bold text-sm">Select location</div>
                </div>
              </button>

              {/* Search Bar - Desktop */}
              <form onSubmit={handleSearch} className="flex-1 max-w-3xl hidden sm:block">
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border-2 border-transparent focus-within:border-orange-400 transition-colors">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2.5 text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800 focus:outline-none dark:placeholder-gray-400"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 px-6 transition-colors flex items-center justify-center"
                  >
                    <Search className="w-5 h-5 text-gray-900 dark:text-white" />
                  </button>
                </div>
              </form>

              {/* Right Side */}
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-5">
                {!isLoading && (
                  <>
                    {user ? (
                      <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm p-2">
                          <User className="w-5 h-5 sm:hidden" />
                          <div className="hidden sm:block text-left">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Hello, {user.username}</div>
                            <div className="font-bold text-sm flex items-center gap-1">
                              Account & Lists
                              <ChevronDown className="w-3 h-3" />
                            </div>
                          </div>
                        </button>
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                          </div>
                          <div className="p-2">
                            <Link
                              href="/account"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Your Account
                            </Link>
                            <Link
                              href="/orders"
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <Package className="w-4 h-4" />
                              Your Orders
                            </Link>
                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                            <button
                              onClick={logout}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm p-2"
                      >
                        <User className="w-5 h-5 sm:hidden" />
                        <div className="hidden sm:block">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Hello, sign in</div>
                          <div className="font-bold text-sm">Account & Lists</div>
                        </div>
                      </Link>
                    )}
                  </>
                )}

                {/* Returns & Orders - Desktop */}
                <Link
                  href="/orders"
                  className="hover:text-orange-400 dark:hover:text-orange-300 transition-colors text-sm hidden lg:block p-2"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400">Returns</div>
                  <div className="font-bold text-sm">& Orders</div>
                </Link>

                {/* Theme Toggle */}
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="flex items-center gap-2 hover:text-orange-400 dark:hover:text-orange-300 transition-colors p-2"
                >
                  <div className="relative">
                    <ShoppingCart className="w-7 h-7" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-400 dark:bg-orange-500 text-gray-900 dark:text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-bold text-sm">Cart</div>
                  </div>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden p-2"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="px-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 px-4 transition-colors flex items-center justify-center"
              >
                <Search className="w-5 h-5 text-gray-900 dark:text-white" />
              </button>
            </div>
          </form>
        </div>

        {/* Secondary Navigation - Desktop */}
        <div className="hidden md:block bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-2 px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-all"
                >
                  <item.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-500">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 sm:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform z-50 sm:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 bg-gray-900 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-8 h-8 p-1.5 bg-gray-700 rounded-full" />
                <span className="font-semibold">
                  {user ? `Hello, ${user.username}` : 'Hello, Sign in'}
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-80px)]">
            {/* Mobile Theme Toggle */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Shop By Department</h3>
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="w-full flex items-start gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
                >
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Account Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-xs uppercase text-gray-500 font-semibold mb-3">Help & Settings</h3>
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Account
                  </Link>
                  <Link
                    href="/orders"
                    className="block p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      {locationModalOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
            onClick={() => setLocationModalOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto max-w-lg z-[70]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Location Services
                  </h2>
                </div>
                <button
                  onClick={() => setLocationModalOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium mb-4">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  In Progress
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Geolocation Feature Coming Soon
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Implementing a location service that can be used by the development team to enhance the client's shopping experience.
                      </p>
                    </div>
                  </div>
                  
                  {/* Implementation Steps */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                      Implementation Roadmap
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 text-xs leading-relaxed">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Permission system to enable user geolocation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 text-xs leading-relaxed">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Next.js requests permission and obtains the geolocation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 text-xs leading-relaxed">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Frontend sends data to Strapi endpoint or Next.js API route
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 text-xs leading-relaxed">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Strapi stores data in Location collection type
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-500 text-xs leading-relaxed">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          Optional: Display location on map using Leaflet or Mapbox
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Technical Note */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> Tech Stack: Browser Geolocation API → Next.js API Route → Strapi REST API → PostgreSQL Location table for spatial queries and region-based filtering.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="flex gap-3 justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setLocationModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => setLocationModalOpen(false)}
                  className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}