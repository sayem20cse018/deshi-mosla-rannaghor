'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

//  Types 

export interface AdminOrder {
  id:             string;
  orderNumber:    string;
  status:         OrderStatus;
  paymentStatus:  string;
  paymentMethod:  string;
  subtotal:       number;
  totalAmount:    number;
  deliveryCharge: number;
  discountAmount: number;
  couponDiscount: number;
  itemCount:      number;
  createdAt:      string;
  confirmedAt:    string | null;
  shippedAt:      string | null;
  deliveredAt:    string | null;
  cancelledAt:    string | null;
  cancelReason:   string | null;
  deliveryNote:   string | null;
  estimatedDelivery: string | null;
  user: {
    id:     string;
    name:   string;
    email:  string;
    phone:  string;
    avatar: string | null;
  };
  address: {
    fullName:    string;
    phone:       string;
    district:    string;
    division:    string;
    area:        string;
    fullAddress: string;
  };
  items: {
    productName:  string;
    productImage: string | null;
    quantity:     number;
    unitPrice:    number;
    totalPrice:   number;
  }[];
  payment: {
    paymentStatus: string;
    paymentMethod: string;
    codStatus:     string | null;
    paidAt:        string | null;
    transactionId: string | null;
  } | null;
  delivery: {
    status:         string;
    courierName:    string | null;
    trackingNumber: string | null;
    estimatedDate:  string | null;
    deliveredAt:    string | null;
  } | null;
}

export interface AdminOrderDetail extends AdminOrder {
  items: {
    id:           string;
    productId:    string;
    productName:  string;
    productImage: string | null;
    productSku:   string;
    quantity:     number;
    unitPrice:    number;
    discountPrice: number | null;
    totalPrice:   number;
  }[];
  payment: {
    id:            string;
    transactionId: string | null;
    amount:        number;
    paymentMethod: string;
    paymentStatus: string;
    codStatus:     string | null;
    paidAt:        string | null;
    refundAmount:  number | null;
    refundReason:  string | null;
  } | null;
  delivery: {
    id:             string;
    status:         string;
    courierName:    string | null;
    trackingNumber: string | null;
    estimatedDate:  string | null;
    deliveredAt:    string | null;
    deliveryCharge: number;
    deliveryNote:   string | null;
  } | null;
  statusHistory: {
    id:        string;
    status:    string;
    note:      string | null;
    createdBy: string | null;
    createdAt: string;
  }[];
  coupon: {
    code:          string;
    discountType:  string;
    discountValue: number;
  } | null;
  address: {
    id:          string;
    fullName:    string;
    phone:       string;
    division:    string;
    district:    string;
    area:        string;
    fullAddress: string;
    postalCode:  string | null;
  };
}

export type OrderStatus =
  | 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKED'
  | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED' | 'REFUNDED';

export interface OrderFilters {
  page?:          number;
  limit?:         number;
  search?:        string;
  status?:        string;
  paymentStatus?: string;
  paymentMethod?: string;
  from?:          string;
  to?:            string;
  sortBy?:        string;
  sortOrder?:     'asc' | 'desc';
}

//  Hooks 

export function useAdminOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      return data as { success: boolean; data: AdminOrder[]; meta: { page: number; limit: number; total: number; totalPages: number } };
    },
    staleTime: 30_000,
  });
}

export function useAdminOrderStatusCounts() {
  return useQuery({
    queryKey: ['admin', 'orders', 'status-counts'],
    queryFn: async () => {
      const { data } = await api.get('/admin/orders/status-counts');
      return data as { success: boolean; data: Record<string, number> };
    },
    staleTime: 30_000,
  });
}

export function useAdminOrder(orderId: string | null) {
  return useQuery({
    queryKey: ['admin', 'orders', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${orderId}`);
      return data as { success: boolean; data: AdminOrderDetail };
    },
    enabled: !!orderId,
    staleTime: 10_000,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId, status, note, courierName, trackingNumber,
    }: {
      orderId:        string;
      status:         string;
      note?:          string;
      courierName?:   string;
      trackingNumber?: string;
    }) => {
      const { data } = await api.patch(`/admin/orders/${orderId}/status`, {
        status, note, courierName, trackingNumber,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}

export function useBulkUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderIds, status }: { orderIds: string[]; status: string }) => {
      const { data } = await api.post('/admin/orders/bulk-status', { orderIds, status });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}
