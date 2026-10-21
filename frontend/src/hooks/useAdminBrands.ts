'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminBrand {
  id:          string;
  name:        string;
  nameEn:      string | null;
  slug:        string;
  logo:        string | null;
  description: string | null;
  website:     string | null;
  isActive:    boolean;
  createdAt:   string;
  updatedAt:   string;
  _count:      { products: number };
}

export interface BrandFilters {
  page?:   number;
  limit?:  number;
  search?: string;
}

export function useAdminBrands(filters: BrandFilters = {}) {
  const params: Record<string, unknown> = {};
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params[k] = v; });

  return useQuery({
    queryKey: ['admin-brands', filters],
    queryFn: async () => {
      const res = await api.get('/admin/brands', { params });
      return res.data as {
        data: AdminBrand[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminBrand(id: string) {
  return useQuery({
    queryKey: ['admin-brand', id],
    queryFn: async () => {
      const res = await api.get('/admin/brands/' + id);
      return res.data.data as AdminBrand;
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      api.post('/admin/brands', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-brands'] }); },
  });
}

export function useUpdateBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch('/admin/brands/' + id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-brands'] });
      qc.invalidateQueries({ queryKey: ['admin-brand'] });
    },
  });
}

export function useDeleteBrand() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete('/admin/brands/' + id).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-brands'] }); },
  });
}
