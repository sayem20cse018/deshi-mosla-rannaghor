'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminProduct {
  id:             string;
  name:           string;
  nameEn:         string | null;
  slug:           string;
  sku:            string;
  price:          number;
  discountPrice:  number | null;
  discountPercent:number | null;
  stockStatus:    string;
  isActive:       boolean;
  isFeatured:     boolean;
  isBestSeller:   boolean;
  isNewArrival:   boolean;
  primaryImage:   string | null;
  availableStock: number;
  reviewCount:    number;
  orderCount:     number;
  createdAt:      string;
  category:       { id: string; name: string; slug: string } | null;
  brand:          { id: string; name: string } | null;
}

export interface ProductFilters {
  page?:        number;
  limit?:       number;
  search?:      string;
  category?:    string;
  brand?:       string;
  isActive?:    string;
  stockStatus?: string;
  sortBy?:      string;
}

export function useAdminProducts(filters: ProductFilters = {}) {
  const params: Record<string, unknown> = {};
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params[k] = v; });

  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: async () => {
      const res = await api.get('/products/admin/list', { params });
      return res.data as {
        data: AdminProduct[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminProduct(id: string) {
  return useQuery({
    queryKey: ['admin-product', id],
    queryFn: async () => {
      const res = await api.get('/products/' + id + '/admin');
      return res.data.data;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => api.post('/products', data).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch('/products/' + id, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['admin-product'] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete('/products/' + id).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });
}

export function useBulkDeleteProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      api.post('/products/admin/bulk-delete', { ids }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });
}

export function useBulkStatusProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      api.post('/products/admin/bulk-status', { ids, isActive }).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });
}

export function useToggleProductFlag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, flag }: { id: string; flag: string }) =>
      api.patch('/products/' + id + '/toggle/' + flag).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); },
  });
}

export function useAddProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, url, isPrimary }: { id: string; url: string; isPrimary?: boolean }) =>
      api.post('/products/' + id + '/images', { url, isPrimary }).then(r => r.data),
    onSuccess: (_: unknown, v: { id: string; url: string; isPrimary?: boolean }) => {
      qc.invalidateQueries({ queryKey: ['admin-product', v.id] });
    },
  });
}

export function useDeleteProductImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (imageId: string) =>
      api.delete('/products/images/' + imageId).then(r => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-product'] }); },
  });
}
