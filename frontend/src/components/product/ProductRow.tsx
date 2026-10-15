import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard, ProductCardData } from './ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SkeletonRow } from '@/components/ui/SkeletonCard';
import { cn } from '@/lib/utils';

interface ProductRowProps {
  title: string;
  subtitle?: string;
  accent?: string;
  href?: string;
  products: ProductCardData[];
  loading?: boolean;
  className?: string;
  bg?: string;
}

export function ProductRow({
  title,
  subtitle,
  accent,
  href,
  products,
  loading,
  className,
  bg = 'bg-white',
}: ProductRowProps) {
  return (
    <section className={cn('section-wrap', bg, className)}>
      <div className="container mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} accent={accent} href={href} />

        {loading ? (
          <SkeletonRow />
        ) : (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {products.map((p) => (
                  <div key={p.id} className="flex-none w-[45vw] max-w-[180px] snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Tablet+: grid layout */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        {/* Mobile "সব দেখুন" link */}
        {href && !loading && (
          <div className="mt-4 flex justify-center md:hidden">
            <Link
              href={href}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-4 py-2 rounded-xl transition-all"
            >
              সব দেখুন
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
