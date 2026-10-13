'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ApiResponse, PaginationMeta, Product } from '@/types';

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  stockStatus?: string;
  hasDiscount?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  sortBy?: string;
  tag?: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}

function buildParams(q: ProductQuery) {
  const p: Record<string, any> = {};
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p[k] = v;
  });
  return p;
}

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: ['products', query],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>('/products', {
        params: buildParams(query),
      });
      return res.data;
    },
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product>>(`/products/${slug}`);
      return res.data;
    },
    enabled: !!slug,
    staleTime: 120_000,
  });
}

export function useRelatedProducts(slug: string, limit = 6) {
  return useQuery({
    queryKey: ['related-products', slug],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>(`/products/${slug}/related`, {
        params: { limit },
      });
      return res.data;
    },
    enabled: !!slug,
    staleTime: 120_000,
  });
}

export function useFeaturedProducts(limit = 10) {
  return useQuery({
    queryKey: ['products-featured', limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>('/products/featured', {
        params: { limit },
      });
      return res.data;
    },
    staleTime: 120_000,
  });
}

export function useBestSellers(limit = 10) {
  return useQuery({
    queryKey: ['products-bestsellers', limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>('/products/best-sellers', {
        params: { limit },
      });
      return res.data;
    },
    staleTime: 120_000,
  });
}

export function useNewArrivals(limit = 10) {
  return useQuery({
    queryKey: ['products-newarrivals', limit],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Product[]>>('/products/new-arrivals', {
        params: { limit },
      });
      return res.data;
    },
    staleTime: 120_000,
  });
}

export function useFilterMeta(category?: string) {
  return useQuery({
    queryKey: ['filter-meta', category],
    queryFn: async () => {
      const res = await api.get('/products/filter-meta', {
        params: category ? { category } : {},
      });
      return res.data.data as { brands: any[]; priceRange: { min: number; max: number } };
    },
    staleTime: 300_000,
  });
}
