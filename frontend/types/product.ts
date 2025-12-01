// frontend/types/products.ts

export interface ProductRating {
  id: number;
  stars: number;
  count: number;
}

export interface Product {
  id: number;
  documentId: string;
  name: string;
  unique_id: string;
  image: string;
  priceCents: number;
  keywords: string[];
  type: string | null;
  sizeChartLink: string | null;
  rating: ProductRating;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}