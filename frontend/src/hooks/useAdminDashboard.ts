'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export type DashboardPeriod = 'today' | 'yesterday' | '7days' | '30days' | 'month' | 'year' | 'custom';

export interface DashboardFilters {
  period: DashboardPeriod;
  from?: string;
  to?: string;
}

function buildParams(f: DashboardFilters) {
  const p: Record<string, string> = { period: f.period };
  if (f.period === 'custom' && f.from) p.from = f.from;
  if (f.period === 'custom' && f.to)   p.to   = f.to;
  return p;
}

// -- Main stats --
export function useAdminStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['admin-stats', filters],
    queryFn: async () => {
      const res = await api.get('/admin/stats', { params: buildParams(filters) });
      return res.data.data as {
        orders:    { total: number; pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
        customers: { total: number; new: number };
        products:  { total: number; active: number; outOfStock: number; lowStock: number };
        revenue:   { total: number; change: number; positive: boolean };
        period:    { start: string; end: string; label: string };
      };
    },
    staleTime: 60_000,
  });
}

// -- Sales chart --
export function useSalesChart(filters: DashboardFilters) {
  return useQuery({
    queryKey: ['admin-sales-chart', filters],
    queryFn: async () => {
      const res = await api.get('/admin/sales-chart', { params: buildParams(filters) });
      return res.data.data as Array<{ date: string; revenue: number; orders: number }>;
    },
    staleTime: 120_000,
  });
}

// -- Recent orders --
export function useAdminRecentOrders(limit = 10) {
  return useQuery({
    queryKey: ['admin-recent-orders', limit],
    queryFn: async () => {
      const res = await api.get('/admin/recent-orders', { params: { limit } });
      return res.data.data as Array<{
        id: string; orderNumber: string; status: string; paymentStatus: string;
        paymentMethod: string; totalAmount: number; itemCount: number; createdAt: string;
        customer: { name: string; email: string; phone: string };
        items: Array<{ name: string; image: string | null; quantity: number }>;
      }>;
    },
    staleTime: 30_000,
  });
}

// -- Top products --
export function useTopProducts(filters: DashboardFilters, limit = 5) {
  return useQuery({
    queryKey: ['admin-top-products', filters, limit],
    queryFn: async () => {
      const res = await api.get('/admin/top-products', { params: { ...buildParams(filters), limit } });
      return res.data.data as Array<{
        productId: string; totalSold: number; totalRevenue: number;
        product: { id: string; name: string; price: number; stockStatus: string; images: Array<{ url: string }> };
      }>;
    },
    staleTime: 120_000,
  });
}

// -- Recent customers --
export function useRecentCustomers(limit = 6) {
  return useQuery({
    queryKey: ['admin-recent-customers', limit],
    queryFn: async () => {
      const res = await api.get('/admin/recent-customers', { params: { limit } });
      return res.data.data as Array<{
        id: string; name: string; email: string; phone: string;
        createdAt: string; isActive: boolean; isBlocked: boolean;
        _count: { orders: number };
      }>;
    },
    staleTime: 60_000,
  });
}

// -- Recent reviews --
export function useRecentReviews(limit = 5) {
  return useQuery({
    queryKey: ['admin-recent-reviews', limit],
    queryFn: async () => {
      const res = await api.get('/admin/recent-reviews', { params: { limit } });
      return res.data.data as Array<{
        id: string; rating: number; title: string | null; comment: string | null;
        status: string; createdAt: string;
        user:    { name: string; avatar: string | null };
        product: { name: string; slug: string };
      }>;
    },
    staleTime: 60_000,
  });
}

// -- Low stock --
export function useLowStockProducts(limit = 8) {
  return useQuery({
    queryKey: ['admin-low-stock', limit],
    queryFn: async () => {
      const res = await api.get('/admin/low-stock', { params: { limit } });
      return res.data.data as Array<{
        id: string; name: string; sku: string; stockStatus: string;
        images: Array<{ url: string }>;
        inventory: { availableStock: number; lowStockAlert: number } | null;
      }>;
    },
    staleTime: 60_000,
  });
}
