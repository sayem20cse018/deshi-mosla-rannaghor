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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
