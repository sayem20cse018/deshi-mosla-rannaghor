'use client';

import { ProductRow } from '@/components/product/ProductRow';
import { useNewArrivals } from '@/hooks/useProducts';

export function NewArrivalsSection() {
  const { data, isLoading } = useNewArrivals(10);
  const products = data?.data ?? [];

  return (
    <ProductRow
      title="নতুন পণ্য"
      subtitle="সদ্য যোগ হওয়া পণ্যগুলো দেখুন"
      accent="নিউ অ্যারাইভাল"
      href="/shop?sort=newest"
      products={products}
      loading={isLoading}
      bg="bg-gray-50"
    />
  );
}
