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
        <div className="absolute top-16 left-0 right-0 bg-[#232F3E] border-t border-gray-700 py-4 px-4 md:hidden">
          <div className="flex flex-col space-y-2">
            <button className="text-left py-2 hover:text-[#FF9900] text-white">Categories</button>
            <button className="text-left py-2 hover:text-[#FF9900] text-white">Deals</button>
            <button className="text-left py-2 hover:text-[#FF9900] text-white">Customer Service</button>
            <div className="pt-4 space-y-2 border-t border-gray-700">
              <Link 
                href="/products" 
                className="block w-full px-4 py-2 border border-[#FF9900] text-white rounded text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse as Guest
              </Link>
              <Link 
                href="/login" 
                className="block w-full px-4 py-2 bg-[#FF9900] text-[#232F3E] font-semibold rounded text-center"
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