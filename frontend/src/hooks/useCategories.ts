'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data as Category[];
    },
    staleTime: 300_000,
  });
}

export function useCategoriesFlat() {
  return useQuery({
    queryKey: ['categories-flat'],
    queryFn: async () => {
      const res = await api.get('/categories/flat');
      return res.data.data as Category[];
    },
    staleTime: 300_000,
  });
}

export function useNavCategories() {
  return useQuery({
    queryKey: ['categories-nav'],
    queryFn: async () => {
      const res = await api.get('/categories/nav');
      return res.data.data as (Category & { navOrder: number })[];
    },
    staleTime: 600_000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const res = await api.get(`/categories/${slug}`);
      return res.data.data as Category;
    },
    enabled: !!slug,
    staleTime: 300_000,
  });
}
