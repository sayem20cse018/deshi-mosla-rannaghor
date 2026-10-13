'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FilterSidebar, ActiveFilters } from '@/components/shop/FilterSidebar';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';
import { ActiveFilterTags } from '@/components/shop/ActiveFilterTags';
import { useProducts } from '@/hooks/useProducts';
import { useCategory } from '@/hooks/useCategories';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { cn } from '@/lib/utils';

const LIMIT = 12;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: catLoading } = useCategory(slug);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({});

  const { data, isLoading, isFetching } = useProducts({
    page,
    limit: LIMIT,
    sortBy,
    category: slug,
    ...filters,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = useCallback((f: ActiveFilters) => {
    setFilters({ ...f, category: undefined }); // category comes from URL
    setPage(1);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-brand-600">
              হোম
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-brand-600">
              ক্যাটাগরি
            </Link>
            {category?.parent && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${category.parent.slug}`} className="hover:text-brand-600">
                  {category.parent.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">{category?.name ?? slug}</span>
          </nav>

          <div className="flex items-center gap-3">
            {category?.icon && <span className="text-4xl">{category.icon}</span>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{category?.name ?? slug}</h1>
              {category?.nameEn && <p className="text-gray-400 text-sm">{category.nameEn}</p>}
              {meta && <p className="text-gray-500 text-sm mt-1">{meta.total} টি পণ্য</p>}
            </div>
          </div>

          {/* Sub-categories */}
          {category?.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {category.children.map((child: any) => (
                <Link
                  key={child.slug}
                  href={`/category/${child.slug}`}
                  className="text-sm bg-brand-50 border border-brand-100 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-100 transition-colors font-medium"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onChange={handleFilterChange} currentCategory={slug} />
          </aside>

          {/* Mobile filter */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white overflow-y-auto p-4">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  currentCategory={slug}
                  onClose={() => setMobileFilterOpen(false)}
                />
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0 space-y-4">
            <SortBar
              total={meta?.total ?? 0}
              sortBy={sortBy}
              onSortChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              view={view}
              onViewChange={setView}
              onFilterToggle={() => setMobileFilterOpen(true)}
              page={page}
              limit={LIMIT}
            />
            <ActiveFilterTags
              filters={filters}
              onRemove={(k) => {
                setFilters((f) => ({ ...f, [k]: undefined }));
                setPage(1);
              }}
              onClearAll={() => {
                setFilters({});
                setPage(1);
              }}
            />
            <div className={cn(isFetching && !isLoading && 'opacity-70')}>
              <ProductGrid products={products} loading={isLoading || catLoading} view={view} />
            </div>
            {meta && (
              <Pagination
                page={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
