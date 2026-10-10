'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSettings(group?: string) {
  return useQuery({
    queryKey: ['settings', group],
    queryFn: async () => {
      const { data } = await api.get('/settings', { params: group ? { group } : {} });
      return data as { success: boolean; data: { settings: any[]; grouped: Record<string, Record<string, string>> } };
    },
    staleTime: 60_000,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      const { data } = await api.post('/settings', { settings });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}