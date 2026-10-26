'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function MobileNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#070A13]/95 backdrop-blur-md border-y border-white/10 py-4 px-4 md:hidden">
          <div className="flex flex-col space-y-2">
            <button className="text-left py-2 hover:text-[#FFB547] text-gray-200">Categories</button>
            <button className="text-left py-2 hover:text-[#FFB547] text-gray-200">Deals</button>
            <button className="text-left py-2 hover:text-[#FFB547] text-gray-200">Customer Service</button>
            <div className="pt-4 space-y-2 border-t border-white/10">
              <Link
                href="/products"
                className="block w-full px-4 py-2 border border-white/15 text-white rounded-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse as Guest
              </Link>
              <Link
                href="/login"
                className="block w-full px-4 py-2 bg-gradient-to-r from-[#FFB547] to-[#FF7A00] text-[#0F1111] font-semibold rounded-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}