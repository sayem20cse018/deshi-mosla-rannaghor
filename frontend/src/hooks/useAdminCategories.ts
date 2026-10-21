'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminCategory {
  id:          string;
  name:        string;
  nameEn:      string | null;
  slug:        string;
  description: string | null;
  image:       string | null;
  icon:        string | null;
  parentId:    string | null;
  isActive:    boolean;
  sortOrder:   number;
  showInNav:   boolean;
  navOrder:    number;
  metaTitle:   string | null;
  metaDesc:    string | null;
  createdAt:   string;
  updatedAt:   string;
  parent:      { id: string; name: string } | null;
  _count:      { products: number; children: number };
}

export interface CategoryFilters {
  page?:     number;
  limit?:    number;
  search?:   string;
  parentId?: string;
}

export function useAdminCategories(filters: CategoryFilters = {}) {
  const params: Record<string, unknown> = {};
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params[k] = v; });

  return useQuery({
    queryKey: ['admin-categories', filters],
    queryFn: async () => {
      const res = await api.get('/admin/categories', { params });
      return res.data as {
        data: AdminCategory[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useAdminCategory(id: string) {
  return useQuery({
    queryKey: ['admin-category', id],
    queryFn: async () => {
      const res = await api.get('/admin/categories/' + id);
      return res.data.data as AdminCategory & {
        children: AdminCategory[];
        _count: { products: number };
      };
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) =>
      api.post('/admin/categories', data).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      api.patch('/admin/categories/' + id, data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['admin-category'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
      qc.invalidateQueries({ queryKey: ['categories-nav'] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.delete('/admin/categories/' + id).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      qc.invalidateQueries({ queryKey: ['categories-flat'] });
      qc.invalidateQueries({ queryKey: ['categories-nav'] });
    },
  });
}

export function useReorderCategories() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ id: string; sortOrder: number }>) =>
      api.post('/admin/categories/reorder', { items }).then((r) => r.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-categories'] }); },
  });
}
