'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ── BLOG ────────────────────────────────────────────────────
export function useAdminBlogs(filters: { page?: number; limit?: number; search?: string; isPublished?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'blog', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/blog?' + p.toString());
      return data as { success: boolean; data: any[]; meta: any };
    },
    staleTime: 30_000,
  });
}

export function useAdminBlog(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'blog', id],
    queryFn: async () => { const { data } = await api.get('/admin/blog/' + id); return data; },
    enabled: !!id,
  });
}

export function useCreateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: any) => { const { data } = await api.post('/admin/blog', dto); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

export function useUpdateBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: any) => { const { data } = await api.patch('/admin/blog/' + id, dto); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

export function useDeleteBlog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.delete('/admin/blog/' + id); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'blog'] }),
  });
}

// ── FAQ ────────────────────────────────────────────────────────
export function useAdminFaqs(filters: { page?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'faqs', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/faqs?' + p.toString());
      return data as { success: boolean; data: any[]; meta: any };
    },
    staleTime: 30_000,
  });
}

export function useCreateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: any) => { const { data } = await api.post('/admin/faqs', dto); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });
}

export function useUpdateFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: any) => { const { data } = await api.patch('/admin/faqs/' + id, dto); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });
}

export function useDeleteFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => { const { data } = await api.delete('/admin/faqs/' + id); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'faqs'] }),
  });
}

// ── PAYMENT TRANSACTIONS ──────────────────────────────────────
export function useAdminTransactions(filters: { page?: number; limit?: number; search?: string; status?: string; method?: string; from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'transactions', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/transactions?' + p.toString());
      return data as { success: boolean; data: any[]; meta: any };
    },
    staleTime: 30_000,
  });
}

// ── ACTIVITY LOGS ─────────────────────────────────────────────
export function useActivityLogs(filters: { page?: number; adminId?: string; action?: string; entity?: string; from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'activity-logs', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/activity-logs?' + p.toString());
      return data as { success: boolean; data: any[]; meta: any };
    },
    staleTime: 20_000,
  });
}