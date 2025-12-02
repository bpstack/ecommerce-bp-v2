// frontend/lib/strapi.ts

import { Product, StrapiResponse } from '@/types/product';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api';

/**
 * Get all products from Strapi
 * @param page - Page number for pagination (default: 1)
 * @param pageSize - Number of items per page (default: 25)
 */
export async function getProducts(page: number = 1, pageSize: number = 25): Promise<StrapiResponse<Product[]>> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
      {
        cache: 'no-store', // Always fetch fresh data
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

/**
 * Get or create session
 */
export async function getSession(): Promise<{ sessionId: string }> {
  const response = await fetch(`${STRAPI_API_URL}/session`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get session');
  }

  return response.json();
}

/**
 * Get cart by sessionId
 */
export async function getCart(sessionId: string): Promise<StrapiResponse<any>> {
  const response = await fetch(
    `${STRAPI_API_URL}/carts?filters[sessionId][$eq]=${sessionId}&populate[cart_items][populate]=product`,
    {
      credentials: 'include',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get cart');
  }

  return response.json();
}

/**
 * Create a new cart
 */
export async function createCart(sessionId: string): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      data: {
        sessionId,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create cart');
  }

  return response.json();
}

/**
 * Add item to cart
 */
export async function addCartItem(
  cartId: number,
  productId: number,
  quantity: number
): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/cart-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      data: {
        cart: cartId,
        product: productId,
        quantity,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add item to cart');
  }

  return response.json();
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  documentId: string,
  quantity: number
): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/cart-items/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      data: {
        quantity,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update cart item');
  }

  return response.json();
}

/**
 * Remove item from cart
 */
export async function removeCartItem(documentId: string): Promise<void> {
  const response = await fetch(`${STRAPI_API_URL}/cart-items/${documentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to remove cart item');
  }

  // DELETE requests typically return 204 No Content, no need to parse JSON
  // Only parse JSON if there's content
  if (response.status !== 204 && response.headers.get('content-length') !== '0') {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
  }
  
  // Return void for successful deletes with no content
  return;
}

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
 * Migrate anonymous cart to user
 */
export async function migrateCart(sessionId: string, userId: number): Promise<any> {
  const response = await fetch(`${STRAPI_API_URL}/carts/migrate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      sessionId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to migrate cart');
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

export { STRAPI_URL, STRAPI_API_URL };