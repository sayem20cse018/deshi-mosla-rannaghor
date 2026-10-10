'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const STALE = 60_000;

export function useSalesReport(period = '30days', from?: string, to?: string) {
  return useQuery({
    queryKey: ['reports', 'sales', period, from, to],
    queryFn: async () => {
      const p: any = { period };
      if (from) p.from = from;
      if (to)   p.to   = to;
      const { data } = await api.get('/admin/reports/sales', { params: p });
      return data;
    },
    staleTime: STALE,
  });
}

export function useOrdersReport(period = '30days', from?: string, to?: string) {
  return useQuery({
    queryKey: ['reports', 'orders', period, from, to],
    queryFn: async () => {
      const p: any = { period };
      if (from) p.from = from;
      if (to)   p.to   = to;
      const { data } = await api.get('/admin/reports/orders', { params: p });
      return data;
    },
    staleTime: STALE,
  });
}

export function useProductsReport(period = '30days') {
  return useQuery({
    queryKey: ['reports', 'products', period],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports/products', { params: { period } });
      return data;
    },
    staleTime: STALE,
  });
}

export function useCustomersReport(period = '30days', from?: string, to?: string) {
  return useQuery({
    queryKey: ['reports', 'customers', period, from, to],
    queryFn: async () => {
      const p: any = { period };
      if (from) p.from = from;
      if (to)   p.to   = to;
      const { data } = await api.get('/admin/reports/customers', { params: p });
      return data;
    },
    staleTime: STALE,
  });
}

export function useInventoryReport() {
  return useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reports/inventory');
      return data;
    },
    staleTime: STALE,
  });
}