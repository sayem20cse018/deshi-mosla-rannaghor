'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface MediaFile {
  id:           string;
  publicId:     string;
  url:          string;
  secureUrl:    string;
  originalName: string;
  altText:      string | null;
  width:        number | null;
  height:       number | null;
  bytes:        number | null;
  format:       string | null;
  folder:       string | null;
  resourceType: string;
  uploadedBy:   string | null;
  createdAt:    string;
  updatedAt:    string;
}

export interface MediaFilters {
  page?:   number;
  limit?:  number;
  search?: string;
  folder?: string;
  format?: string;
}

interface MediaListResponse {
  success: boolean;
  data:    MediaFile[];
  meta: {
    page:       number;
    limit:      number;
    total:      number;
    totalPages: number;
  };
}

// ---------------------------------------------------------------------------
// useMediaList
// ---------------------------------------------------------------------------
export function useMediaList(filters: MediaFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page)   params.set('page',   String(filters.page));
  if (filters.limit)  params.set('limit',  String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.folder) params.set('folder', filters.folder);
  if (filters.format) params.set('format', filters.format);

  return useQuery<MediaListResponse>({
    queryKey: ['media', filters],
    queryFn:  async () => {
      const { data } = await api.get(`/media?${params.toString()}`);
      return data;
    },
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// useUploadProgress - manage per-file progress state
// ---------------------------------------------------------------------------
export function useUploadProgress() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  const setFileProgress = (name: string, pct: number) =>
    setProgress((prev) => ({ ...prev, [name]: pct }));

  const clearProgress = () => setProgress({});

  return { progress, setFileProgress, clearProgress };
}

// ---------------------------------------------------------------------------
// useUploadMedia - single file
// ---------------------------------------------------------------------------
export function useUploadMedia(
  setFileProgress?: (name: string, pct: number) => void,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      folder = 'misc',
    }: {
      file:    File;
      folder?: string;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post(
        `/media/upload?folder=${encodeURIComponent(folder)}`,
        formData,
        {
          headers:            { 'Content-Type': 'multipart/form-data' },
          onUploadProgress:   (e) => {
            if (e.total && setFileProgress) {
              setFileProgress(
                file.name,
                Math.round((e.loaded / e.total) * 100),
              );
            }
          },
        },
      );
      return data as { success: boolean; data: MediaFile };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// ---------------------------------------------------------------------------
// useBulkUploadMedia - multiple files
// ---------------------------------------------------------------------------
export function useBulkUploadMedia(
  setFileProgress?: (name: string, pct: number) => void,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      files,
      folder = 'misc',
    }: {
      files:   File[];
      folder?: string;
    }) => {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const { data } = await api.post(
        `/media/upload/bulk?folder=${encodeURIComponent(folder)}`,
        formData,
        {
          headers:          { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            if (e.total && setFileProgress) {
              const pct = Math.round((e.loaded / e.total) * 100);
              files.forEach((f) => setFileProgress(f.name, pct));
            }
          },
        },
      );
      return data as {
        succeeded: MediaFile[];
        failed:    string[];
        total:     number;
      };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateMediaAlt
// ---------------------------------------------------------------------------
export function useUpdateMediaAlt() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, altText }: { id: string; altText: string }) => {
      const { data } = await api.patch(`/media/${id}`, { altText });
      return data as { success: boolean; data: MediaFile };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteMedia
// ---------------------------------------------------------------------------
export function useDeleteMedia() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/media/${id}`);
      return data as { success: boolean; message: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}

// ---------------------------------------------------------------------------
// useBulkDeleteMedia
// ---------------------------------------------------------------------------
export function useBulkDeleteMedia() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { data } = await api.post('/media/bulk-delete', { ids });
      return data as { success: boolean; message: string };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media'] });
    },
  });
}
