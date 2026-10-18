'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useProducts }  from '@/hooks/useProducts';

interface CollectionSectionProps {
  title:        string;
  subtitle?:    string;
  categorySlug: string;
  limit?:       number;
  accentColor?: string;
  accentBg?:    string;
  emoji?:       string;
}

export function CollectionSection({
  title,
  subtitle,
  categorySlug,
  limit       = 8,
  accentColor = '#0f4c2a',
  accentBg    = '#f0fdf4',
  emoji       = '🌿',
}: CollectionSectionProps) {
  const { data, isLoading } = useProducts({ category: categorySlug, limit, sortBy: 'best_selling' });
  const products = data?.data ?? [];

  return (
    <section className="py-12 bg-white" style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div className="flex items-start gap-4">
            {/* Emoji badge */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl leading-none"
                 style={{ background: accentBg, border: `1.5px solid ${accentColor}20` }}>
              {emoji}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] mb-1" style={{ color: accentColor }}>
                কালেকশন
              </p>
              <h2 className="text-xl md:text-2xl font-black text-gray-900">{title}</h2>
              {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <Link href={`/category/${categorySlug}`}
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:underline flex-shrink-0"
                style={{ color: accentColor }}>
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          /* Empty state — admin hasn't added products yet */
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border-2 border-dashed"
               style={{ borderColor: `${accentColor}30`, background: accentBg }}>
            <span className="text-5xl mb-4">{emoji}</span>
            <p className="font-bold text-gray-700" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              শীঘ্রই আসছে
            </p>
            <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              এই ক্যাটাগরিতে পণ্য যোগ করা হচ্ছে
            </p>
            <Link href={`/category/${categorySlug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all"
                  style={{ color: accentColor, background: 'white', border: `1px solid ${accentColor}40` }}>
              ক্যাটাগরি দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                {products.map((p: any) => (
                  <div key={p.id} className="flex-none w-[45vw] max-w-[180px] snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {products.slice(0, limit).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}

        {/* Mobile view all */}
        <div className="mt-5 flex justify-center sm:hidden">
          <Link href={`/category/${categorySlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold border px-4 py-2 rounded-xl transition-all"
                style={{ color: accentColor, borderColor: `${accentColor}60`, background: accentBg }}>
            সব দেখুন <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
