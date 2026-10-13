'use client';

import { ProductCard } from './ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useRelatedProducts } from '@/hooks/useProducts';

export function RelatedProducts({ slug }: { slug: string }) {
  const { data, isLoading } = useRelatedProducts(slug, 6);
  const products = data?.data ?? [];

  if (!isLoading && !products.length) return null;

  return (
    <section className="mt-10 pt-8 border-t border-gray-100">
      <h2 className="text-xl font-bold text-gray-900 mb-6">সম্পর্কিত পণ্য</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
