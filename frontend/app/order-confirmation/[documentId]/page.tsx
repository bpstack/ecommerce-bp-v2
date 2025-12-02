//frontend/app/order-confirmation/[documentId]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/strapi';

export default function OrderConfirmationPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Order Confirmed!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your purchase. Your order has been received.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Order ID: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{documentId}</span>
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 text-left">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              What's Next?
            </h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span>You will receive an email confirmation shortly.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span>We will notify you when your order ships.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span>Track your order in the Orders section.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}