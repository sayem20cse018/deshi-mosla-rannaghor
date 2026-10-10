'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { FilterSidebar, ActiveFilters } from '@/components/shop/FilterSidebar';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';
import { ActiveFilterTags } from '@/components/shop/ActiveFilterTags';
import { useProducts } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

const LIMIT = 12;

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State from URL
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') ?? 'newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ActiveFilters>({
    category: searchParams.get('category') ?? undefined,
    brand: searchParams.get('brand') ?? undefined,
    hasDiscount: searchParams.get('discount') === 'true' ? true : undefined,
    isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
  });

  const search = searchParams.get('search') ?? undefined;

  const query = {
    page,
    limit: LIMIT,
    sortBy,
    search,
    ...filters,
  };

  const { data, isLoading, isFetching } = useProducts(query);

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = useCallback((f: ActiveFilters) => {
    setFilters(f);
    setPage(1);
  }, []);

  function handleRemoveFilter(key: keyof ActiveFilters | 'search') {
    if (key === 'search') {
      router.push('/shop');
      return;
    }
    if (key === 'price') {
      setFilters((f) => ({ ...f, minPrice: undefined, maxPrice: undefined }));
    } else {
      setFilters((f) => ({ ...f, [key]: undefined }));
    }
    setPage(1);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <nav className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
            <a href="/" className="hover:text-brand-600">হোম</a>
            <span>/</span>
            <span className="text-gray-700 font-medium">শপ</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `"${search}" এর ফলাফল` : filters.category ? filters.category : 'সব পণ্য'}
          </h1>
          {meta && (
            <p className="text-gray-500 text-sm mt-1">{meta.total} টি পণ্য পাওয়া গেছে</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">

          {/* ── Desktop Filter Sidebar ── */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              currentCategory={filters.category}
            />
          </aside>

          {/* ── Mobile Filter Drawer ── */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setMobileFilterOpen(false)}
              />
              <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white overflow-y-auto">
                <div className="p-4">
                  <FilterSidebar
                    filters={filters}
                    onChange={handleFilterChange}
                    onClose={() => setMobileFilterOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Sort bar */}
            <SortBar
              total={meta?.total ?? 0}
              sortBy={sortBy}
              onSortChange={(v) => { setSortBy(v); setPage(1); }}
              view={view}
              onViewChange={setView}
              onFilterToggle={() => setMobileFilterOpen(true)}
              page={page}
              limit={LIMIT}
            />

            {/* Active filter tags */}
            <ActiveFilterTags
              filters={filters}
              search={search}
              onRemove={handleRemoveFilter}
              onClearAll={() => { setFilters({}); setPage(1); }}
            />

            {/* Product grid */}
            <div className={cn(isFetching && !isLoading && 'opacity-70 transition-opacity')}>
              <ProductGrid
                products={products}
                loading={isLoading}
                view={view}
              />
            </div>

            {/* Pagination */}
            {meta && (
              <Pagination
                page={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
