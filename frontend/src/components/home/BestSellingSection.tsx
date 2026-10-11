'use client';

import { ProductRow } from '@/components/product/ProductRow';
import { useBestSellers } from '@/hooks/useProducts';

export function BestSellingSection() {
  const { data, isLoading } = useBestSellers(10);
  const products = data?.data ?? [];

  return (
    <ProductRow
      title="সেরা বিক্রিত পণ্য"
      subtitle="সবচেয়ে বেশি পছন্দের পণ্যগুলো"
      accent="বেস্ট সেলার"
      href="/shop?sort=best_selling"
      products={products}
      loading={isLoading}
      bg="bg-gray-50"
    />
  );
}
