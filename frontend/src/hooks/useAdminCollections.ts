'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminCollection {
  id:          string;
  name:        string;
  nameEn:      string | null;
  slug:        string;
  description: string | null;
  image:       string | null;
  banner:      string | null;
  isActive:    boolean;
  sortOrder:   number;
  metaTitle:   string | null;
  metaDesc:    string | null;
  createdAt:   string;
  updatedAt:   string;
  _count:      { products: number };
}

export interface CollectionFilters {
  page?:   number;
  limit?:  number;
  search?: string;
}

export interface CollectionProduct {
  id:                  string;
  name:                string;
  slug:                string;
  sku:                 string;
  price:               number;
  discountPrice:       number | null;
  stockStatus:         string;
  primaryImage:        string | null;
  sortOrder:           number;
  collectionProductId: string;
}

export function useAdminCollections(filters: CollectionFilters = {}) {
  const params: Record<string, unknown> = {};
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params[k] = v; });

  return useQuery({
    queryKey: ['admin-collections', filters],
    queryFn: async () => {
      const res = await api.get('/collections/admin/list', { params });
      return res.data as {
        data: AdminCollection[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminCollection(id: string) {
  return useQuery({
    queryKey: ['admin-collection', id],
    queryFn: async () => {
      const res = await api.get('/collections/admin/' + id);
      return res.data.data as AdminCollection & { products: CollectionProduct[] };
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      api.post('/collections/admin', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-collections'] }); },
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch('/collections/admin/' + id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-collections'] });
      qc.invalidateQueries({ queryKey: ['admin-collection'] });
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete('/collections/admin/' + id).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-collections'] }); },
  });
}

export function useAddCollectionProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { collectionId: string; productId: string; sortOrder?: number }) =>
      api.post('/collections/admin/' + vars.collectionId + '/products', { productId: vars.productId, sortOrder: vars.sortOrder }).then((r) => r.data),
    onSuccess: (_: unknown, vars: { collectionId: string; productId: string; sortOrder?: number }) => {
      qc.invalidateQueries({ queryKey: ['admin-collection', vars.collectionId] });
    },
  });
}

export function useRemoveCollectionProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { collectionId: string; productId: string }) =>
      api.delete('/collections/admin/' + vars.collectionId + '/products/' + vars.productId).then((r) => r.data),
    onSuccess: (_: unknown, vars: { collectionId: string; productId: string }) => {
      qc.invalidateQueries({ queryKey: ['admin-collection', vars.collectionId] });
    },
  });
}
