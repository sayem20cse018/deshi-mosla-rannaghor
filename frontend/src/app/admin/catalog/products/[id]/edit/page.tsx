'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProductForm } from '@/components/admin/products/ProductForm';
import { LoadingState, ErrorState } from '@/components/admin/ui';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-product-edit', id],
    queryFn: async () => {
      const res = await api.get('/products/' + id);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingState message="Loading product..." />;
  if (error)     return <ErrorState message="Could not load product" />;

  return <ProductForm initialData={data} isEdit />;
}
