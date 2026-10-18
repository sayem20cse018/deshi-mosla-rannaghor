'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useBestSellers } from '@/hooks/useProducts';
import type { Product } from '@/types';

interface TopSellingSectionProps {
  title?:    string;
  subtitle?: string;
  limit?:    number;
}

export function TopSellingSection({
  title    = 'Top Selling Products',
  subtitle = 'সবচেয়ে বেশি পছন্দের পণ্যগুলো',
  limit    = 10,
}: TopSellingSectionProps) {
  const { data, isLoading } = useBestSellers(limit);
  const products = data?.data ?? [];

  return (
    <section className="py-12 bg-gray-50" style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: '#0f4c2a' }}>
              <TrendingUp className="w-3.5 h-3.5" /> বেস্ট সেলার
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          </div>
          <Link href="/shop?sort=best_selling"
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:underline flex-shrink-0"
                style={{ color: '#0f4c2a' }}>
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">পণ্য লোড হচ্ছে...</p>
        ) : (
          <>
            {/* Mobile horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                {products.map((p: Product) => (
                  <div key={p.id} className="flex-none w-[45vw] max-w-[180px] snap-start">
                    <ProductCard product={p as any} />
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((p: Product) => <ProductCard key={p.id} product={p as any} />)}
            </div>
          </>
        )}

        {/* Mobile view all */}
        <div className="mt-5 flex justify-center sm:hidden">
          <Link href="/shop?sort=best_selling"
                className="inline-flex items-center gap-1.5 text-xs font-bold border px-4 py-2 rounded-xl transition-all"
                style={{ color: '#0f4c2a', borderColor: '#0f4c2a', background: '#f0fdf4' }}>
            সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
