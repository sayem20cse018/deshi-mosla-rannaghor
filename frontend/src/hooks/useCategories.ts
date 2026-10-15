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

type NavCategory = Category & { navOrder: number };

const MOCK_NAV_CATEGORIES: NavCategory[] = [
  { id: '1',  name: 'মসলা',      nameEn: 'Spices',  slug: 'mosla',   icon: '🌶️', navOrder: 1  },
  { id: '2',  name: 'তেল',       nameEn: 'Oil',     slug: 'tel',     icon: '🫙',  navOrder: 2  },
  { id: '3',  name: 'চাল',       nameEn: 'Rice',    slug: 'chal',    icon: '🍚',  navOrder: 3  },
  { id: '4',  name: 'ডাল',       nameEn: 'Dal',     slug: 'dal',     icon: '🫘',  navOrder: 4  },
  { id: '5',  name: 'আটা',       nameEn: 'Flour',   slug: 'ata',     icon: '🌾',  navOrder: 5  },
  { id: '6',  name: 'মধু',       nameEn: 'Honey',   slug: 'modhu',   icon: '🍯',  navOrder: 6  },
  { id: '7',  name: 'চিনি',      nameEn: 'Sugar',   slug: 'chini',   icon: '🍬',  navOrder: 7  },
  { id: '8',  name: 'চা',        nameEn: 'Tea',     slug: 'cha',     icon: '☕',  navOrder: 8  },
  { id: '9',  name: 'স্ন্যাকস', nameEn: 'Snacks',  slug: 'snacks',  icon: '🍿',  navOrder: 9  },
  { id: '10', name: 'নুডলস',    nameEn: 'Noodles', slug: 'noodles', icon: '🍜',  navOrder: 10 },
  { id: '11', name: 'সস',        nameEn: 'Sauce',   slug: 'sauce',   icon: '🥫',  navOrder: 11 },
  { id: '12', name: 'আচার',      nameEn: 'Pickle',  slug: 'achar',   icon: '🥒',  navOrder: 12 },
];

export function useNavCategories() {
  return useQuery({
    queryKey: ['categories-nav'],
    queryFn: async (): Promise<NavCategory[]> => {
      try {
        const res = await api.get('/categories/nav');
        const data = res.data.data as NavCategory[];
        if (data && data.length > 0) return data;
        return MOCK_NAV_CATEGORIES;
      } catch {
        return MOCK_NAV_CATEGORIES;
      }
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
