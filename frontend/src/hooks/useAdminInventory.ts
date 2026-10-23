'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────
export interface InventoryProduct {
  id:          string;
  name:        string;
  sku:         string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category:    { name: string };
  images:      { url: string }[];
  inventory:   {
    id:             string;
    totalStock:     number;
    availableStock: number;
    soldQuantity:   number;
    reservedStock:  number;
    lowStockAlert:  number;
    updatedAt:      string;
  } | null;
  variants: { id: string; name: string; sku: string; stock: number }[];
}

export interface InventoryLog {
  id:         string;
  changeQty:  number;
  type:       string;
  reason:     string | null;
  reference:  string | null;
  createdAt:  string;
  inventory: {
    productId: string;
    product:   { id: string; name: string; sku: string };
  };
}

export interface InventoryFilters {
  page?: number; limit?: number; search?: string;
  stockStatus?: string; categoryId?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
}

export interface LogFilters {
  page?: number; limit?: number;
  productId?: string; type?: string;
  from?: string; to?: string;
}

// ── Hooks ──────────────────────────────────────────────────────────────
export function useAdminInventory(filters: InventoryFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'inventory', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/inventory?' + p.toString());
      return data as {
        success: boolean;
        data: InventoryProduct[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 30_000,
  });
}

export function useAdminInventoryLogs(filters: LogFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'inventory-logs', filters],
    queryFn: async () => {
      const p = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') p.set(k, String(v)); });
      const { data } = await api.get('/admin/inventory/logs?' + p.toString());
      return data as {
        success: boolean;
        data: InventoryLog[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 20_000,
  });
}

export function useAdminLowStock() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock-full'],
    queryFn: async () => {
      const { data } = await api.get('/admin/inventory/low-stock-full');
      return data as { success: boolean; data: InventoryProduct[] };
    },
    staleTime: 30_000,
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      productId, adjustment, type, reason,
    }: {
      productId:  string;
      adjustment: number;
      type:       'MANUAL_ADD' | 'MANUAL_REMOVE' | 'CORRECTION' | 'DAMAGE' | 'RETURN';
      reason?:    string;
    }) => {
      const { data } = await api.post('/admin/inventory/' + productId + '/adjust', { adjustment, type, reason });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'inventory'] });
      qc.invalidateQueries({ queryKey: ['admin', 'inventory-logs'] });
    },
  });
}
