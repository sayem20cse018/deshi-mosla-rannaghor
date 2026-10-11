'use client';

import { ProductRow } from '@/components/product/ProductRow';
import { useFeaturedProducts } from '@/hooks/useProducts';

export function FeaturedSection() {
  const { data, isLoading } = useFeaturedProducts(10);
  const products = data?.data ?? [];

  return (
    <ProductRow
      title="ফিচার্ড পণ্য"
      subtitle="বিশেষভাবে নির্বাচিত প্রিমিয়াম পণ্য"
      accent="আমাদের বাছাই"
      href="/shop?featured=true"
      products={products}
      loading={isLoading}
      bg="bg-white"
    />
  );
}
