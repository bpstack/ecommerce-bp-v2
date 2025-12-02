//frontend/app/orders/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserOrders, formatPrice, getImageUrl } from '@/lib/strapi';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';

interface OrderItem {
  id: number;
  documentId: string;
  quantity: number;
  priceCents: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
}

interface Order {
  id: number;
  documentId: string;
  orderId: string;
  totalCents: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  order_items: OrderItem[];
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

export default function OrdersPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const response = await getUserOrders(token!);
        setOrders(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to view your orders
          </h1>
          <Link
            href="/login"
            className="inline-block bg-orange-400 hover:bg-orange-500 text-gray-900 font-medium py-3 px-8 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto px-4 py-6 lg:py-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          My Orders
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No orders yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              When you place an order, it will appear here.
            </p>
            <Link
              href="/products"
              className="inline-block bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-600 text-gray-900 dark:text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.documentId}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Order placed</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Total</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          ${formatPrice(order.totalCents)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Ship to</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {order.shippingAddress?.fullName || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.orderStatus]
                        }`}
                      >
                        {statusLabels[order.orderStatus]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Order ID: <span className="font-mono">{order.orderId || order.documentId}</span>
                  </p>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div key={item.documentId} className="flex gap-4">
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                          {item.product?.image ? (
                            <Image
                              src={getImageUrl(item.product.image)}
                              alt={item.product?.name || 'Product'}
                              width={80}
                              height={80}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                            {item.product?.name || 'Product'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Qty: {item.quantity} × ${formatPrice(item.priceCents)}
                          </p>
                        </div>
                        <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                          ${formatPrice(item.priceCents * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shippingAddress.fullName}<br />
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}