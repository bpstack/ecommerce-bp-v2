//app/page.tsx

'use client'

import { ShoppingCart, Package, User, Search, Menu, X, Star, TrendingUp, AlertCircle, Github, Linkedin, Mail, CreditCard, Palette, Server } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Mock product data
const mockProducts = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, rating: 4.5, reviews: 1234, image: '/api/placeholder/200/200' },
  { id: 2, name: 'Smart Watch', price: 249.99, rating: 4.7, reviews: 892, image: '/api/placeholder/200/200' },
  { id: 3, name: 'Laptop Stand', price: 39.99, rating: 4.3, reviews: 567, image: '/api/placeholder/200/200' },
  { id: 4, name: 'USB-C Hub', price: 59.99, rating: 4.6, reviews: 423, image: '/api/placeholder/200/200' },
  { id: 5, name: 'Bluetooth Speaker', price: 129.99, rating: 4.4, reviews: 756, image: '/api/placeholder/200/200' },
  { id: 6, name: 'Webcam HD', price: 89.99, rating: 4.2, reviews: 543, image: '/api/placeholder/200/200' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#EAEDED]">
      {/* Top Banner with Test Credentials */}
      <div className="bg-[#37475A] text-white py-2 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <AlertCircle size={14} className="text-[#FF9900]" />
          <span>Development Mode: User registration disabled.</span>
          <span className="hidden sm:inline">|</span>
          <span className="font-mono">Test Login: <strong>user: test</strong> / <strong>pass: test123</strong></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#232F3E] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              {/* Desktop Logo */}
              <div className="hidden md:block">
                <Image 
                  src="/images/amazon-logo-white.png" 
                  alt="Amazon Logo" 
                  width={100} 
                  height={30}
                  className="cursor-pointer"
                />
              </div>
              {/* Mobile Logo */}
              <div className="md:hidden">
                <Image 
                  src="/images/amazon-mobile-logo-white.png" 
                  alt="Amazon Logo" 
                  width={35} 
                  height={35}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="hover:text-[#FF9900] transition-colors">Categories</button>
              <button className="hover:text-[#FF9900] transition-colors">Deals</button>
              <button className="hover:text-[#FF9900] transition-colors">Customer Service</button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                href="/products"
                className="px-4 py-2 border border-[#FF9900] text-white hover:text-[#FF9900] rounded transition-colors"
              >
                Browse as Guest
              </Link>
              <Link 
                href="/login"
                className="px-4 py-2 bg-[#FF9900] text-[#232F3E] font-semibold rounded hover:bg-[#FFB84D] transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-4">
              <div className="flex flex-col space-y-2">
                <button className="text-left py-2 hover:text-[#FF9900]">Categories</button>
                <button className="text-left py-2 hover:text-[#FF9900]">Deals</button>
                <button className="text-left py-2 hover:text-[#FF9900]">Customer Service</button>
                <div className="pt-4 space-y-2 border-t border-gray-700">
                  <Link 
                    href="/products" 
                    className="block w-full px-4 py-2 border border-[#FF9900] text-white rounded text-center"
                  >
                    Browse as Guest
                  </Link>
                  <Link 
                    href="/login" 
                    className="block w-full px-4 py-2 bg-[#FF9900] text-[#232F3E] font-semibold rounded text-center"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Redesigned */}
      <section className="bg-gradient-to-b from-[#232F3E] via-[#37475A] to-[#485769] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center text-white">
            {/* Status */}
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9900] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF9900]" />
              </span>
              <span className="text-sm uppercase tracking-wider font-light">Live Demo Available</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              E-Commerce Platform
            </h1>
            <p className="text-xl lg:text-2xl text-[#FF9900] font-medium mb-8">
              Full-Stack Application Demo
            </p>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Experience a fully functional e-commerce platform with mock products. 
              Built with Next.js, TypeScript, and Strapi CMS connected to PostgreSQL.
            </p>

            {/* Developer Tag */}
            <p className="text-sm text-gray-400 font-mono mb-10">
              Developed by @bpstack
            </p>

            {/* Important Note about Backend */}
            <div className="max-w-2xl mx-auto mb-10 bg-white/10 backdrop-blur-sm border border-[#FF9900]/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-[#FF9900] flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-gray-200 font-medium mb-1">Note:</p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    This site is deployed in production for testing/preview purposes only.<br />
                    Live demo backend is hosted on Render's free tier.
                    It "sleeps" after periods of inactivity, so the first request may take ~60 seconds to wake up.
                    After that, the site will work normally with some latency.<br />
                    Thank you for your understanding!
                  </p>

                </div>
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/products" 
                className="w-full sm:w-auto px-8 py-4 bg-[#FFD814] text-[#0F1111] font-bold text-lg rounded-lg hover:bg-[#F7CA00] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Package size={24} />
                Explore Products
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-[#232F3E] transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <User size={24} />
                Sign In
              </Link>
            </div>
          </div>

          {/* Feature Cards - Horizontal scroll on mobile */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group cursor-pointer">
              {/* Animated border on hover */}
              <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, #FF9900, #FFB84D, #FF9900)',
                    backgroundSize: '200% 100%',
                    animation: 'borderGlow 2s linear infinite',
                  }}
                />
                <div className="absolute inset-[1px] rounded-lg bg-[#37475A]" />
              </div>
              
              {/* Card content */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-white/20 group-hover:border-transparent transition-all duration-300">
                <ShoppingCart className="mx-auto mb-3 text-[#FF9900] group-hover:text-[#FFB84D] group-hover:scale-110 transition-all duration-300" size={32} />
                <p className="font-semibold group-hover:text-[#FF9900] transition-colors duration-300">Shopping Cart</p>
                <p className="text-xs text-gray-300 mt-1">Full functionality</p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              {/* Animated border on hover */}
              <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, #FF9900, #FFB84D, #FF9900)',
                    backgroundSize: '200% 100%',
                    animation: 'borderGlow 2s linear infinite',
                  }}
                />
                <div className="absolute inset-[1px] rounded-lg bg-[#37475A]" />
              </div>
              
              {/* Card content */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-white/20 group-hover:border-transparent transition-all duration-300">
                <User className="mx-auto mb-3 text-[#FF9900] group-hover:text-[#FFB84D] group-hover:scale-110 transition-all duration-300" size={32} />
                <p className="font-semibold group-hover:text-[#FF9900] transition-colors duration-300">User Auth</p>
                <p className="text-xs text-gray-300 mt-1">JWT Tokens</p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              {/* Animated border on hover */}
              <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, #FF9900, #FFB84D, #FF9900)',
                    backgroundSize: '200% 100%',
                    animation: 'borderGlow 2s linear infinite',
                  }}
                />
                <div className="absolute inset-[1px] rounded-lg bg-[#37475A]" />
              </div>
              
              {/* Card content */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-white/20 group-hover:border-transparent transition-all duration-300">
                <Package className="mx-auto mb-3 text-[#FF9900] group-hover:text-[#FFB84D] group-hover:scale-110 transition-all duration-300" size={32} />
                <p className="font-semibold group-hover:text-[#FF9900] transition-colors duration-300">Product Catalog</p>
                <p className="text-xs text-gray-300 mt-1">Mock Data</p>
              </div>
            </div>

            <div className="relative group cursor-pointer">
              {/* Animated border on hover */}
              <div className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div 
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, #FF9900, #FFB84D, #FF9900)',
                    backgroundSize: '200% 100%',
                    animation: 'borderGlow 2s linear infinite',
                  }}
                />
                <div className="absolute inset-[1px] rounded-lg bg-[#37475A]" />
              </div>
              
              {/* Card content */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center text-white border border-white/20 group-hover:border-transparent transition-all duration-300">
                <Star className="mx-auto mb-3 text-[#FF9900] group-hover:text-[#FFB84D] group-hover:scale-110 transition-all duration-300" size={32} />
                <p className="font-semibold group-hover:text-[#FF9900] transition-colors duration-300">Reviews</p>
                <p className="text-xs text-gray-300 mt-1">Rating System</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Implementation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F1111] mb-4">Project Features</h2>
            <p className="text-gray-600">Full-stack e-commerce implementation with real backend integration</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Product Catalog */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <Package className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Product Catalog</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>84+ products database</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Responsive grid layout</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Optimized images</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Rating system UI</span>
                </li>
              </ul>
            </div>

            {/* Shopping Cart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <ShoppingCart className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Shopping Cart</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Database persistence</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Session management</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Quantity controls</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Guest cart migration</span>
                </li>
              </ul>
            </div>

            {/* User Authentication */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <User className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Authentication</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>JWT token auth</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>User registration</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Secure login/logout</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Profile management</span>
                </li>
              </ul>
            </div>

            {/* Checkout & Orders */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <CreditCard className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Checkout Flow</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Order processing</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Shipping address</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Order confirmation</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Order history</span>
                </li>
              </ul>
            </div>

            {/* Search & Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <Search className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Search & Filters</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Product search</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Category filters</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Price sorting</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Real-time filtering</span>
                </li>
              </ul>
            </div>

            {/* UI/UX Features */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <Palette className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">UI/UX Design</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Dark/Light mode</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Responsive design</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Amazon-inspired UI</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Mobile optimized</span>
                </li>
              </ul>
            </div>

            {/* Infrastructure */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#FF9900]/10 rounded-lg">
                  <Server className="text-[#FF9900]" size={24} />
                </div>
                <h3 className="font-semibold text-[#0F1111]">Infrastructure</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Vercel deployment</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>PostgreSQL database</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Strapi CMS backend</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>SSL certificate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Info Strip - Updated Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <p className="text-gray-400 dark:text-gray-500 mb-2">
              This is a demonstration project. No real transactions will be processed.
            </p>
            <p className="text-gray-400 dark:text-gray-500">
              e-commerce platform by{' '}
              <a 
                href="https://www.stackbp.es/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FF9900] hover:text-[#FFB84D] transition-colors"
              >
                stackbp
              </a>
              {' '}• Built with Next.js, Strapi, database at Aiven Cloud
            </p>
          </div>
          
          {/* Social links */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-500 mr-3">Find me on</span>
            <a
              href="https://github.com/bpstack/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/salvadorperez2021/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:contact.bstack@gmail.com"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}