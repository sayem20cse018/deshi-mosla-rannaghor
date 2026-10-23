'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────────
export interface AdminCustomer {
  id:           string;
  name:         string;
  email:        string;
  phone:        string;
  avatar:       string | null;
  isActive:     boolean;
  isBlocked:    boolean;
  lastLoginAt:  string | null;
  createdAt:    string;
  totalOrders:  number;
  totalReviews: number;
  totalSpending: number;
  lastOrder: {
    id: string; orderNumber: string;
    totalAmount: number; status: string; createdAt: string;
  } | null;
}

export interface AdminCustomerDetail extends AdminCustomer {
  _count?: { orders: number; reviews: number; wishlists: number };
  gender:          string | null;
  dateOfBirth:     string | null;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  updatedAt:       string;
  totalSpending:   number;
  addresses: any[];
  orders: {
    id: string; orderNumber: string; status: string;
    totalAmount: number; paymentMethod: string; createdAt: string; itemCount: number;
  }[];
  reviews: {
    id: string; rating: number; title: string | null;
    status: string; createdAt: string;
    product: { id: string; name: string; slug: string };
  }[];
}

export interface AdminReview {
  id:        string;
  rating:    number;
  title:     string | null;
  comment:   string | null;
  status:    'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote: string | null;
  createdAt: string;
  images:    string[];
  user: { id: string; name: string; email: string; avatar: string | null };
  product: {
    id: string; name: string; slug: string;
    images: { url: string }[];
  };
}

export interface CustomerFilters {
  page?: number; limit?: number; search?: string;
  isActive?: string; isBlocked?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
}

export interface ReviewFilters {
  page?: number; limit?: number; search?: string;
  status?: string; rating?: number; sortOrder?: 'asc' | 'desc';
}

// ── Customer hooks ─────────────────────────────────────────────────────
export function useAdminCustomers(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'customers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      const { data } = await api.get('/admin/customers?' + params.toString());
      return data as {
        success: boolean;
        data: AdminCustomer[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 30_000,
  });
}

export function useAdminCustomer(id: string | null) {
  return useQuery({
    queryKey: ['admin', 'customer', id],
    queryFn: async () => {
      const { data } = await api.get('/admin/customers/' + id);
      return data as { success: boolean; data: AdminCustomerDetail };
    },
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useToggleCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: 'activate' | 'deactivate' | 'block' | 'unblock' }) => {
      const { data } = await api.patch('/admin/customers/' + id + '/toggle', { action });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'customers'] });
      qc.invalidateQueries({ queryKey: ['admin', 'customer'] });
    },
  });
}

// ── Review hooks ────────────────────────────────────────────────────────
export function useAdminReviews(filters: ReviewFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'reviews', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      const { data } = await api.get('/admin/reviews?' + params.toString());
      return data as {
        success: boolean;
        data: AdminReview[];
        meta: { page: number; limit: number; total: number; totalPages: number };
      };
    },
    staleTime: 20_000,
  });
}

export function useUpdateReviewStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id, status, adminNote,
    }: { id: string; status: 'APPROVED' | 'REJECTED' | 'PENDING'; adminNote?: string }) => {
      const { data } = await api.patch('/admin/reviews/' + id + '/status', { status, adminNote });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete('/admin/reviews/' + id);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
    },
  });
}