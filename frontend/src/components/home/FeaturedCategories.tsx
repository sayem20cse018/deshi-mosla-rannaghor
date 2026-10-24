'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

// Color palette per category slug — future: from Admin Panel
const COLOR_MAP: Record<string, { from: string; to: string; border: string; text: string; iconBg: string }> = {
  mosla:    { from: '#fff1f2', to: '#ffe4e6', border: '#fecdd3', text: '#9f1239', iconBg: '#ffe4e6' },
  tel:      { from: '#fffbeb', to: '#fef3c7', border: '#fde68a', text: '#78350f', iconBg: '#fef3c7' },
  chal:     { from: '#eff6ff', to: '#dbeafe', border: '#bfdbfe', text: '#1e3a8a', iconBg: '#dbeafe' },
  dal:      { from: '#fff7ed', to: '#ffedd5', border: '#fed7aa', text: '#14532d', iconBg: '#ffedd5' },
  ata:      { from: '#fffbeb', to: '#fef9c3', border: '#fde68a', text: '#713f12', iconBg: '#fef9c3' },
  modhu:    { from: '#fffbeb', to: '#fef08a', border: '#fde047', text: '#854d0e', iconBg: '#fef08a' },
  cha:      { from: '#fafaf9', to: '#f5f5f4', border: '#e7e5e4', text: '#44403c', iconBg: '#f5f5f4' },
  snacks:   { from: '#fdf4ff', to: '#f3e8ff', border: '#e9d5ff', text: '#6b21a8', iconBg: '#f3e8ff' },
  noodles:  { from: '#f0f9ff', to: '#e0f2fe', border: '#bae6fd', text: '#0c4a6e', iconBg: '#e0f2fe' },
  sauce:    { from: '#fff7ed', to: '#ffedd5', border: '#a7f3d0', text: '#065f46', iconBg: '#ffedd5' },
  achar:    { from: '#fff7ed', to: '#ffedd5', border: '#fed7aa', text: '#7c2d12', iconBg: '#ffedd5' },
  chini:    { from: '#fff1f2', to: '#ffe4e6', border: '#fecdd3', text: '#881337', iconBg: '#ffe4e6' },
  superfood:{ from: '#fff7ed', to: '#ffedd5', border: '#86efac', text: '#14532d', iconBg: '#ffedd5' },
};

const DEFAULT_COLOR = { from: '#f8fafc', to: '#f1f5f9', border: '#e2e8f0', text: '#1e293b', iconBg: '#f1f5f9' };

interface FeaturedCategoriesProps {
  title?: string;
  subtitle?: string;
}

export function FeaturedCategories({
  title   = 'Featured Categories',
  subtitle = 'পছন্দের ক্যাটাগরি থেকে বেছে নিন',
}: FeaturedCategoriesProps) {
  const { data: rawCats = [], isLoading, isError } = useCategories();
  const cats = rawCats as any[];

  return (
    <section className="py-12 bg-white" style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: '#ea580c' }}>
              ক্যাটাগরি
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
          </div>
          <Link href="/categories"
                className="hidden sm:flex items-center gap-1.5 text-sm font-bold hover:underline flex-shrink-0"
                style={{ color: '#ea580c' }}>
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-gray-400 text-sm">Categories could not be loaded.</div>
        ) : cats.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">No categories found.</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {cats.map((cat: any) => {
              const c = COLOR_MAP[cat.slug] ?? DEFAULT_COLOR;
              const count = cat._count?.products ?? 0;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 rounded-2xl border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})`, borderColor: c.border }}>
                  {/* Icon container */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                       style={{ background: c.iconBg }}>
                    <span className="text-3xl leading-none">{cat.icon ?? '🛒'}</span>
                  </div>
                  <p className="font-bold text-xs leading-tight" style={{ color: c.text, fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    {cat.name}
                  </p>
                  {count > 0 && (
                    <p className="text-[10px] mt-0.5" style={{ color: c.text, opacity: 0.6 }}>{count} পণ্য</p>
                  )}
                </Link>
              );
            })}
            {/* View all card */}
            <Link href="/categories"
              className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-dashed border-gray-200 hover:border-[#ea580c]/40 hover:bg-[#fff7ed] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-gray-50">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 group-hover:border-[#ea580c]/30 flex items-center justify-center mb-3 transition-colors">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ea580c] transition-colors" />
              </div>
              <p className="font-bold text-xs text-gray-500 group-hover:text-[#ea580c] transition-colors">সব দেখুন</p>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
