import { ProductCard, ProductCardData } from '@/components/product/ProductCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { PackageSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: ProductCardData[];
  loading?: boolean;
  view?: 'grid' | 'list';
  emptyMessage?: string;
}

export function ProductGrid({ products, loading, view = 'grid', emptyMessage }: ProductGridProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'grid gap-3 md:gap-4',
          view === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1',
        )}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-5 shadow-inner">
          <PackageSearch className="w-11 h-11 text-gray-300" />
        </div>
        <h3 className="text-gray-800 font-black text-lg mb-2" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>কোনো পণ্য পাওয়া যায়নি</h3>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
          {emptyMessage ?? 'অন্য ফিল্টার বা সার্চ ব্যবহার করে দেখুন।'}
        </p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} variant="compact" className="flex-row" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
