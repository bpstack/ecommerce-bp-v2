// frontend/lib/strapi.ts

import { Product, StrapiResponse } from '@/types/product';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

// 🔴 TEMPORAL - Para ver el loading
const SIMULATE_SLOW_NETWORK = false; // Cambiar a false cuando termines
const DELAY_MS = 2000; // 2 segundos

// Función helper para el delay
async function artificialDelay() {
  if (SIMULATE_SLOW_NETWORK) {
    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }
}

/**
 * Get all products from Strapi
 * @param page - Page number for pagination (default: 1)
 * @param pageSize - Number of items per page (default: 25)
 */
export async function getProducts(page: number = 1, pageSize: number = 25): Promise<StrapiResponse<Product[]>> {
  try {
    await artificialDelay(); // 🔴 AÑADIR AQUÍ
    
    const response = await fetch(
      `${STRAPI_API_URL}/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
      {
        next: { revalidate: 60 },
      }
    );


    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get a single product by document ID
 * @param documentId - Strapi document ID
 */
export async function getProduct(documentId: string): Promise<Product> {
  try {
    await artificialDelay(); // 🔴 AÑADIR AQUÍ (opcional para product detail)
    
    const response = await fetch(
      `${STRAPI_API_URL}/products/${documentId}?populate=*`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Search products by keyword
 * @param query - Search query
 */
export async function searchProducts(query: string): Promise<StrapiResponse<Product[]>> {
  try {
    await artificialDelay(); // 🔴 AÑADIR AQUÍ
    
    const response = await fetch(
      `${STRAPI_API_URL}/products?filters[name][$containsi]=${query}&populate=*`,
      {
        cache: 'no-store',
      }
    );


    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Format price from cents to dollars
 * @param priceCents - Price in cents
 */
export function formatPrice(priceCents: number): string {
  return (priceCents / 100).toFixed(2);
}

/**
 * Get full image URL
 * @param imagePath - Image path from Strapi
 */
export function getImageUrl(imagePath: string): string {
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, construct the URL from public folder
  return `/${imagePath}`;
}

export interface CartResponse {
  items: { id: number; documentId: string; quantity: number; product: Product }[];
}

/** The saved token is expired or invalid: the user has to sign in again. */
export class SessionExpiredError extends Error {
  constructor() {
    super('Session expired');
    this.name = 'SessionExpiredError';
  }
}

/**
 * Call the cart API. The server decides whose cart it is: the logged-in user
 * (token) or, for guests, the session cookie.
 */
async function cartRequest(
  token: string | null,
  method: string,
  path: string,
  body?: object
): Promise<CartResponse> {
  const response = await fetch(`${STRAPI_API_URL}/cart${path}`, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
    cache: 'no-store',
    body: body && JSON.stringify(body),
  });

  // The server only answers 401 when it is sent a token it does not accept.
  if (response.status === 401) throw new SessionExpiredError();

  if (!response.ok) {
    throw new Error(`Cart request failed: ${response.status}`);
  }

  return response.json();
}

export const getCart = (token: string | null) => cartRequest(token, 'GET', '');

export const addCartItem = (token: string | null, productId: string, quantity: number) =>
  cartRequest(token, 'POST', '/items', { productId, quantity });

export const updateCartItem = (token: string | null, documentId: string, quantity: number) =>
  cartRequest(token, 'PUT', `/items/${documentId}`, { quantity });

export const removeCartItem = (token: string | null, documentId: string) =>
  cartRequest(token, 'DELETE', `/items/${documentId}`);

/**
 * Register a new user
 */
export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/auth/local/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Registration failed');
  }

  return response.json();
}

/**
 * Login user
 */
export async function loginUser(
  identifier: string,
  password: string
): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/auth/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Login failed');
  }

  return response.json();
}

/**
 * Create a new order
 */
export async function createOrder(
  token: string,
  totalCents: number,
  shippingAddress: object,
  items: { productId: number; quantity: number; priceCents: number }[]
): Promise<any> {
  // Create the order
  const orderResponse = await fetch(`${STRAPI_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
    body: JSON.stringify({
      data: {
        orderId: `ORD-${Date.now()}`,
        totalCents,
        orderStatus: 'pending',
        shippingAddress,
      },
    }),
  });

  if (!orderResponse.ok) {
    throw new Error('Failed to create order');
  }

  const order = await orderResponse.json();

  // Create order items
  for (const item of items) {
    await fetch(`${STRAPI_API_URL}/order-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          order: order.data.id,
          product: item.productId,
          quantity: item.quantity,
          priceCents: item.priceCents,
        },
      }),
    });
  }

  return order;
}

/**
 * Get user orders
 */
export async function getUserOrders(token: string): Promise<StrapiResponse<any>> {
  const response = await fetch(
    `${STRAPI_API_URL}/orders?populate[order_items][populate]=product&sort=createdAt:desc`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get orders');
  }

  return response.json();
}


/**
 * Get total number of product pages
 * Used by generateStaticParams for ISR
 */
export async function getTotalProductPages(pageSize: number = 25): Promise<number> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/products?pagination[page]=1&pagination[pageSize]=1`,
      { next: { revalidate: 60 } }
    );


    if (!response.ok) {
      throw new Error(`Failed to fetch product count: ${response.statusText}`);
    }

    const data = await response.json();
    const total = data.meta?.pagination?.total || 0;
    
    return Math.ceil(total / pageSize);
  } catch (error) {
    console.error('Error fetching total pages:', error);
    return 1;
  }
}
export { STRAPI_URL, STRAPI_API_URL };