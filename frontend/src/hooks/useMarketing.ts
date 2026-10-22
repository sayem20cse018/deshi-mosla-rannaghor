'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// - Types -

export interface AdminCoupon {
  id: string; code: string; description: string|null;
  discountType: string; discountValue: number;
  minOrderAmount: number|null; maxDiscount: number|null;
  startDate: string; expiryDate: string;
  usageLimit: number|null; userLimit: number; usedCount: number; usageCount: number;
  isActive: boolean; createdAt: string; updatedAt: string;
}

export interface AdminBanner {
  id: string; title: string|null; titleEn: string|null; subtitle: string|null;
  image: string; imageMobile: string|null; link: string|null; buttonText: string|null;
  position: string; isActive: boolean; sortOrder: number;
  startDate: string|null; endDate: string|null;
  createdAt: string; updatedAt: string;
}

export interface AdminOffer {
  id: string; name: string; nameEn: string|null; description: string|null;
  image: string|null; discountType: string; discountValue: number;
  minOrderAmount: number|null; maxDiscount: number|null;
  startDate: string; endDate: string;
  isActive: boolean; sortOrder: number; targetType: string; targetIds: string[];
  createdAt: string; updatedAt: string;
}

export interface AdminPromotion {
  id: string; name: string; nameEn: string|null; description: string|null;
  discountType: string; discountValue: number;
  startDate: string; endDate: string;
  isActive: boolean; targetType: string; targetIds: string[];
  createdAt: string; updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string; email: string; name: string|null; source: string|null;
  isActive: boolean; subscribedAt: string; unsubscribedAt: string|null;
}

// - Coupons -

export function useAdminCoupons(p: { page?:number; limit?:number; search?:string } = {}) {
  return useQuery({
    queryKey: ['admin','coupons', p],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (p.page)   params.set('page',   String(p.page));
      if (p.limit)  params.set('limit',  String(p.limit));
      if (p.search) params.set('search', p.search);
      const { data } = await api.get(`/admin/coupons?${params}`);
      return data as { success:boolean; data:AdminCoupon[]; meta:{ page:number; limit:number; total:number; totalPages:number } };
    }, staleTime: 30_000,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<AdminCoupon> & { startDate:string; expiryDate:string }) => {
      const { data } = await api.post('/admin/coupons', dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','coupons'] }),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<AdminCoupon> & { id:string }) => {
      const { data } = await api.patch(`/admin/coupons/${id}`, dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','coupons'] }),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => { const { data } = await api.delete(`/admin/coupons/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','coupons'] }),
  });
}

// - Banners -

export function useAdminBanners(p: { position?:string } = {}) {
  return useQuery({
    queryKey: ['admin','banners', p],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (p.position) params.set('position', p.position);
      const { data } = await api.get(`/admin/banners?${params}`);
      return data as { success:boolean; data:AdminBanner[]; meta:{ page:number; limit:number; total:number; totalPages:number } };
    }, staleTime: 30_000,
  });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<AdminBanner>) => {
      const { data } = await api.post('/admin/banners', dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','banners'] }),
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<AdminBanner> & { id:string }) => {
      const { data } = await api.patch(`/admin/banners/${id}`, dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','banners'] }),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => { const { data } = await api.delete(`/admin/banners/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','banners'] }),
  });
}

// - Offers -

export function useAdminOffers(p: { page?:number; search?:string } = {}) {
  return useQuery({
    queryKey: ['admin','offers', p],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (p.page)   params.set('page',   String(p.page));
      if (p.search) params.set('search', p.search);
      const { data } = await api.get(`/admin/offers?${params}`);
      return data as { success:boolean; data:AdminOffer[]; meta:{ page:number; limit:number; total:number; totalPages:number } };
    }, staleTime: 30_000,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<AdminOffer>) => {
      const { data } = await api.post('/admin/offers', dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','offers'] }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<AdminOffer> & { id:string }) => {
      const { data } = await api.patch(`/admin/offers/${id}`, dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','offers'] }),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => { const { data } = await api.delete(`/admin/offers/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','offers'] }),
  });
}

// - Promotions -

export function useAdminPromotions(p: { page?:number; search?:string } = {}) {
  return useQuery({
    queryKey: ['admin','promotions', p],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (p.page)   params.set('page',   String(p.page));
      if (p.search) params.set('search', p.search);
      const { data } = await api.get(`/admin/promotions?${params}`);
      return data as { success:boolean; data:AdminPromotion[]; meta:{ page:number; limit:number; total:number; totalPages:number } };
    }, staleTime: 30_000,
  });
}

export function useCreatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<AdminPromotion>) => {
      const { data } = await api.post('/admin/promotions', dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','promotions'] }),
  });
}

export function useUpdatePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<AdminPromotion> & { id:string }) => {
      const { data } = await api.patch(`/admin/promotions/${id}`, dto); return data;
    }, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','promotions'] }),
  });
}

export function useDeletePromotion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => { const { data } = await api.delete(`/admin/promotions/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','promotions'] }),
  });
}

// - Newsletter -

export function useNewsletterSubscribers(p: { page?:number; limit?:number; search?:string } = {}) {
  return useQuery({
    queryKey: ['admin','newsletter', p],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (p.page)   params.set('page',   String(p.page));
      if (p.limit)  params.set('limit',  String(p.limit));
      if (p.search) params.set('search', p.search);
      const { data } = await api.get(`/admin/newsletter/subscribers?${params}`);
      return data as { success:boolean; data:NewsletterSubscriber[]; meta:{ page:number; limit:number; total:number; totalPages:number } };
    }, staleTime: 30_000,
  });
}

export function useDeleteSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => { const { data } = await api.delete(`/admin/newsletter/subscribers/${id}`); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','newsletter'] }),
  });
}

export function useBulkDeleteSubscribers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids:string[]) => { const { data } = await api.post('/admin/newsletter/subscribers/bulk-delete', { ids }); return data; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin','newsletter'] }),
  });
}

export function useExportSubscribers() {
  return useMutation({
    mutationFn: async () => { const { data } = await api.get('/admin/newsletter/export'); return data as { success:boolean; data:string }; },
  });
}