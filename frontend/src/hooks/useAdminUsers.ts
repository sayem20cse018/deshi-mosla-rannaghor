'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface AdminUser {
  id:          string;
  name:        string;
  email:       string;
  phone:       string;
  role:        'ADMIN' | 'SUPER_ADMIN' | 'MANAGER' | 'SUPPORT' | string;
  avatar:      string | null;
  isActive:    boolean;
  isBlocked:   boolean;
  lastLoginAt: string | null;
  createdAt:   string;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/admin-users');
      return data as { success: boolean; data: AdminUser[] };
    },
    staleTime: 30_000,
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: { name: string; email: string; phone: string; password: string; role: string }) => {
      const { data } = await api.post('/admin/admin-users', dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'admin-users'] }),
  });
}

export function useUpdateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...dto }: { id: string; name?: string; role?: string; isActive?: boolean; isBlocked?: boolean }) => {
      const { data } = await api.patch('/admin/admin-users/' + id, dto);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'admin-users'] }),
  });
}

export function useResetAdminPassword() {
  return useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const { data } = await api.post('/admin/admin-users/' + id + '/reset-password', { password });
      return data;
    },
  });
}

export function useDeleteAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete('/admin/admin-users/' + id);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'admin-users'] }),
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'system-health'],
    queryFn: async () => {
      const { data } = await api.get('/admin/system/health');
      return data as {
        success: boolean;
        data: {
          database:    { status: string; message: string };
          stats:       { totalUsers: number; totalProducts: number; totalOrders: number; pendingOrders: number; totalRevenue: number };
          environment: { nodeEnv: string; nodeVersion: string; uptime: number; memoryMB: number };
          timestamp:   string;
        };
      };
    },
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}