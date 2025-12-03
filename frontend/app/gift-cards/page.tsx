'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowRight, Gift, Award } from 'lucide-react';

export default function GiftCardsPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
            Gift Cards & Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Coming Soon
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Under Development
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                We're creating a comprehensive rewards system that recognizes customer participation across all platform activities.
              </p>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-3">
                Planned Features
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Points for every purchase</li>
                <li>• Seller performance rewards</li>
                <li>• Redeemable gift cards</li>
                <li>• Loyalty tier system</li>
                <li>• Referral bonuses</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Points System Note */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Points & Rewards System
            </p>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Earn points through platform participation:
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">As a Buyer:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-disc list-inside ml-2">
                <li>Earn points on every purchase</li>
                <li>Bonus points for product reviews</li>
                <li>Special rewards for frequent shopping</li>
              </ul>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">As a Seller:</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 list-disc list-inside ml-2">
                <li>Points for successful transactions</li>
                <li>Rewards for customer satisfaction ratings</li>
                <li>Bonuses for sales milestones</li>
              </ul>
            </div>
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            Points can be redeemed for gift cards, discounts, and exclusive platform benefits.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {user ? (
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm bg-orange-500 hover:bg-orange-600 text-white font-medium rounded transition-colors"
            >
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Back to Home
          </Link>
					<Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Continue shopping as a Buyer
          </Link>
        </div>
      </div>
    </div>
  );
}