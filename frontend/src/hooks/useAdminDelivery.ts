'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DeliveryCharge {
  id:           string;
  label:        string;
  division:     string | null;
  district:     string | null;
  area:         string | null;
  charge:       number;
  minOrderFree: number | null;
  isActive:     boolean;
  createdAt:    string;
  updatedAt:    string;
}

export interface DeliveryChargeFilters {
  page?:     number;
  limit?:    number;
  search?:   string;
  isActive?: string;
}

export interface CODOrder {
  id:            string;
  orderId:       string;
  amount:        number;
  paymentMethod: string;
  paymentStatus: string;
  codStatus:     string | null;
  paidAt:        string | null;
  createdAt:     string;
  order: {
    id:          string;
    orderNumber: string;
    totalAmount: number;
    createdAt:   string;
    address: {
      fullName: string;
      phone:    string;
      district: string;
    };
    user: {
      id:    string;
      name:  string;
      email: string;
      phone: string | null;
    } | null;
  };
}

export interface CODFilters {
  page?:      number;
  limit?:     number;
  codStatus?: string;
  from?:      string;
  to?:        string;
}

export interface OnlinePayment {
  id:            string;
  orderId:       string;
  transactionId: string | null;
  amount:        number;
  paymentMethod: string;
  paymentStatus: string;
  paidAt:        string | null;
  failedAt:      string | null;
  createdAt:     string;
  transactions: {
    id:     string;
    txnId:  string;
    status: string;
    amount: number;
  }[];
  order: {
    id:          string;
    orderNumber: string;
    createdAt:   string;
    user: {
      id:    string;
      name:  string;
      email: string;
    } | null;
  };
}

export interface OnlinePaymentFilters {
  page?:   number;
  limit?:  number;
  status?: string;
  method?: string;
  from?:   string;
  to?:     string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildParams(filters: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') p.set(k, String(v));
  });
  return p.toString();
}

// ─── Delivery Charges ─────────────────────────────────────────────────────────

export function useDeliveryCharges(filters: DeliveryChargeFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'delivery', 'charges', filters],
    queryFn: async () => {
      const { data } = await api.get(`/admin/delivery/charges?${buildParams(filters as Record<string, string | number | undefined>)}`);
      return data as {
        success: boolean;
        data:    DeliveryCharge[];
        meta:    { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 30_000,
  });
}

export function useCreateDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: Omit<DeliveryCharge, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data } = await api.post('/admin/delivery/charges', dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'delivery', 'charges'] }),
  });
}

export function useUpdateDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: Partial<DeliveryCharge> & { id: string }) => {
      const { data } = await api.patch(`/admin/delivery/charges/${id}`, dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'delivery', 'charges'] }),
  });
}

export function useDeleteDeliveryCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/delivery/charges/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'delivery', 'charges'] }),
  });
}

// ─── COD Orders ──────────────────────────────────────────────────────────────

export function useCODOrders(filters: CODFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'payments', 'cod', filters],
    queryFn: async () => {
      const { data } = await api.get(`/admin/payments/cod?${buildParams(filters as Record<string, string | number | undefined>)}`);
      return data as {
        success:      boolean;
        data:         CODOrder[];
        meta:         { page: number; limit: number; total: number; totalPages: number };
        pendingTotal: number;
      };
    },
    staleTime: 30_000,
  });
}

export function useUpdateCODStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ paymentId, codStatus }: { paymentId: string; codStatus: 'PENDING' | 'COLLECTED' | 'FAILED' }) => {
      const { data } = await api.patch(`/admin/payments/cod/${paymentId}/status`, { codStatus });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'payments', 'cod'] }),
  });
}

// ─── Online Payments ─────────────────────────────────────────────────────────

export function useOnlinePayments(filters: OnlinePaymentFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'payments', 'online', filters],
    queryFn: async () => {
      const { data } = await api.get(`/admin/payments/online?${buildParams(filters as Record<string, string | number | undefined>)}`);
      return data as {
        success: boolean;
        data:    OnlinePayment[];
        meta:    { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 30_000,
  });
}
