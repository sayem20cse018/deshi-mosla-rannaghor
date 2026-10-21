'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id:           string;
  title:        string | null;
  titleEn:      string | null;
  subtitle:     string | null;
  subtitleEn:   string | null;
  tag:          string | null;
  tagEn:        string | null;
  badge:        string | null;
  badgeEn:      string | null;
  image:        string | null;
  imageMobile:  string | null;
  ctaLabel:     string | null;
  ctaLabelEn:   string | null;
  ctaUrl:       string | null;
  cta2Label:    string | null;
  cta2LabelEn:  string | null;
  cta2Url:      string | null;
  bgColor:      string | null;
  emoji:        string | null;
  isActive:     boolean;
  sortOrder:    number;
  startDate:    string | null;
  endDate:      string | null;
  createdAt:    string;
  updatedAt:    string;
}

export interface HomepageSection {
  id:             string;
  key:            string;
  title:          string | null;
  titleEn:        string | null;
  subtitle:       string | null;
  subtitleEn:     string | null;
  description:    string | null;
  image:          string | null;
  imageMobile:    string | null;
  buttonLabel:    string | null;
  buttonLabelEn:  string | null;
  buttonUrl:      string | null;
  extraData:      Record<string, unknown> | null;
  isEnabled:      boolean;
  sortOrder:      number;
  updatedAt:      string;
}

export interface Testimonial {
  id:        string;
  name:      string;
  role:      string | null;
  avatar:    string | null;
  rating:    number;
  comment:   string;
  isActive:  boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ── Hero Slides ───────────────────────────────────────────────────────────────

export function useAdminHeroSlides() {
  return useQuery({
    queryKey: ['admin', 'hero-slides'],
    queryFn:  async () => {
      const { data } = await api.get('/admin/homepage/slides');
      return data as { success: boolean; data: HeroSlide[] };
    },
    staleTime: 30_000,
  });
}

export function useCreateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<HeroSlide>) => {
      const { data } = await api.post('/admin/homepage/slides', dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero-slides'] }),
  });
}

export function useUpdateHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<HeroSlide> & { id: string }) => {
      const { data } = await api.patch(`/admin/homepage/slides/${id}`, dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero-slides'] }),
  });
}

export function useDeleteHeroSlide() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/homepage/slides/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero-slides'] }),
  });
}

export function useReorderHeroSlides() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: { id: string; sortOrder: number }[]) => {
      const { data } = await api.patch('/admin/homepage/slides/reorder', { items });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'hero-slides'] }),
  });
}

// ── Homepage Sections ─────────────────────────────────────────────────────────

export function useAdminHomepageSections() {
  return useQuery({
    queryKey: ['admin', 'homepage-sections'],
    queryFn:  async () => {
      const { data } = await api.get('/admin/homepage/sections');
      return data as { success: boolean; data: HomepageSection[] };
    },
    staleTime: 30_000,
  });
}

export function useUpsertHomepageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, ...dto }: Partial<HomepageSection> & { key: string }) => {
      const { data } = await api.post(`/admin/homepage/sections/${key}`, dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'homepage-sections'] }),
  });
}

export function useToggleHomepageSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, isEnabled }: { key: string; isEnabled: boolean }) => {
      const { data } = await api.post(`/admin/homepage/sections/${key}/toggle`, { isEnabled });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'homepage-sections'] }),
  });
}

export function useReorderHomepageSections() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (items: { key: string; sortOrder: number }[]) => {
      const { data } = await api.post('/admin/homepage/sections/reorder', { items });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'homepage-sections'] }),
  });
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export function useAdminTestimonials(params: { page?: number; limit?: number; search?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'testimonials', params],
    queryFn:  async () => {
      const p = new URLSearchParams();
      if (params.page)   p.set('page',   String(params.page));
      if (params.limit)  p.set('limit',  String(params.limit));
      if (params.search) p.set('search', params.search);
      const { data } = await api.get(`/admin/testimonials?${p}`);
      return data as { success: boolean; data: Testimonial[]; meta: { page: number; limit: number; total: number; totalPages: number } };
    },
    staleTime: 30_000,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Partial<Testimonial>) => {
      const { data } = await api.post('/admin/testimonials', dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  });
}

export function useUpdateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<Testimonial> & { id: string }) => {
      const { data } = await api.patch(`/admin/testimonials/${id}`, dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/testimonials/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  });
}
