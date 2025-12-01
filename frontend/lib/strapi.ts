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

export { STRAPI_URL, STRAPI_API_URL };