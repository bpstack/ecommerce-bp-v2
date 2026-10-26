// frontend/app/page.tsx

import { ShoppingCart, Package, User, Star, AlertCircle, Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MobileNav from '@/components/landing/MovileNav';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#070A13] text-white">
      {/* Top Banner with Test Credentials */}
      <div className="bg-gradient-to-r from-[#FF9900]/15 via-[#FF9900]/10 to-[#FF9900]/15 border-b border-[#FF9900]/20 text-white py-2 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <AlertCircle size={14} className="text-[#FFB547]" />
          <span className="text-gray-200">Development Mode: User registration disabled.</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="font-mono text-gray-200">Test Login: <strong className="text-[#FFB547]">user: test</strong> / <strong className="text-[#FFB547]">pass: test123</strong></span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#070A13]/80 backdrop-blur-md border-b border-white/10 text-white sticky top-0 z-50 relative">
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
            <div className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
              <button className="hover:text-white transition-colors">Categories</button>
              <button className="hover:text-white transition-colors">Deals</button>
              <button className="hover:text-white transition-colors">Customer Service</button>
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-3 text-sm">
              <Link
                href="/products"
                className="px-4 py-2 rounded-full border border-white/15 text-gray-200 hover:border-[#FF9900]/60 hover:text-white transition-colors"
              >
                Browse as Guest
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FFB547] to-[#FF7A00] text-[#0F1111] font-semibold hover:brightness-110 transition"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile Navigation - Client Component */}
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center overflow-hidden">
        {/* Background glows + grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[75%] h-[480px] w-[820px] rounded-full bg-[#FF8A00]/20 blur-[120px]" />
          <div className="absolute top-1/2 -left-32 -translate-y-1/2 h-[380px] w-[380px] rounded-full bg-[#6366F1]/20 blur-[110px]" />
          <div className="absolute top-1/2 -right-32 -translate-y-1/4 h-[380px] w-[380px] rounded-full bg-[#EC4899]/10 blur-[110px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-5 font-mono text-xs uppercase tracking-[0.3em] text-gray-400">
              <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#FF9900]/70" />
              <span>Headless <span className="text-[#FFB547]">/</span> E-Commerce <span className="text-[#FFB547]">/</span> Demo</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#FF9900]/70" />
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">E-Commerce </span>
              <span className="bg-gradient-to-r from-[#FFC861] via-[#FF9900] to-[#FF6A00] bg-clip-text text-transparent">Platform</span>
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-gray-400 max-w-2xl mx-auto mb-7 leading-relaxed">
              Full-stack demo store with mock products, built with Next.js, TypeScript and Strapi CMS on PostgreSQL.
              <span className="block mt-1 text-sm font-mono text-gray-500">Developed by @bpstack</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-7">
              <Link
                href="/products"
                className="group w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-[#FFB547] to-[#FF7A00] text-[#0F1111] font-bold shadow-[0_8px_30px_-6px_rgba(255,138,0,0.6)] hover:shadow-[0_12px_40px_-6px_rgba(255,138,0,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Package size={20} />
                Explore Products
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <User size={20} />
                Sign In
              </Link>
            </div>

            {/* Important Note about Backend */}
            <div className="max-w-3xl mx-auto rounded-2xl border border-[#FF9900]/30 bg-gradient-to-br from-[#FF9900]/10 to-transparent backdrop-blur-sm px-5 py-4 text-left shadow-[0_0_40px_-12px_rgba(255,153,0,0.35)]">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-1.5 rounded-lg bg-[#FF9900]/15">
                  <AlertCircle size={18} className="text-[#FFB547]" />
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  <strong className="text-[#FFC861] font-semibold">Note: </strong>
                  This site is deployed in production for testing/preview purposes only.<br />
                  Live demo backend is hosted on Render&apos;s free tier.
                  It &quot;sleeps&quot; after periods of inactivity, so the first request may take ~60 seconds to wake up.
                  After that, the site will work normally with some latency.<br />
                  Thank you for your understanding!
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: ShoppingCart, title: 'Shopping Cart', subtitle: 'Persistent & guest cart' },
              { icon: User, title: 'User Auth', subtitle: 'JWT Tokens' },
              { icon: Package, title: 'Catalog & Checkout', subtitle: 'Search, filters, orders' },
              { icon: Star, title: 'Reviews', subtitle: 'Rating System' },
            ].map((card) => (
              <div
                key={card.title}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-left backdrop-blur-sm hover:border-[#FF9900]/40 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF9900]/25 to-[#FF6A00]/5 ring-1 ring-[#FF9900]/30">
                  <card.icon className="text-[#FFB547] group-hover:scale-110 transition-transform duration-300" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-xs text-gray-400">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05070D] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <div className="text-center md:text-left text-gray-500">
            <p>This is a demonstration project. No real transactions will be processed.</p>
            <p>
              e-commerce platform by{' '}
              <a
                href="https://www.stackbp.es/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFB547] hover:text-[#FFC861] transition-colors"
              >
                stackbp
              </a>
              {' '}• Built with Next.js, Strapi, database at Aiven Cloud
            </p>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-gray-600 mr-2">Find me on</span>
            <a
              href="https://github.com/bpstack/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/salvadorperez2021/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:contact.bstack@gmail.com"
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
