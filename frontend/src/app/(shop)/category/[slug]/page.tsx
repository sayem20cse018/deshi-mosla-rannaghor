'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight, SlidersHorizontal, X, ChevronDown,
  Grid3X3, List, LayoutGrid, Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FilterSidebar, ActiveFilters } from '@/components/shop/FilterSidebar';
import { SortBar } from '@/components/shop/SortBar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { Pagination } from '@/components/shop/Pagination';
import { ActiveFilterTags } from '@/components/shop/ActiveFilterTags';
import { useProducts } from '@/hooks/useProducts';
import { useCategory, useNavCategories } from '@/hooks/useCategories';

const LIMIT = 16;

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: category, isLoading: catLoading } = useCategory(slug);
  const { data: navCats = [] } = useNavCategories();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({});

  const { data, isLoading, isFetching } = useProducts({
    page, limit: LIMIT, sortBy, category: slug, ...filters,
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const handleFilterChange = useCallback((f: ActiveFilters) => {
    setFilters({ ...f, category: undefined });
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Category Navigation Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3">
            <Link href="/shop"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all',
                !slug ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
              )}>
              All
            </Link>
            {navCats.map(cat => {
              const active = cat.slug === slug;
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all',
                    active
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50',
                  )}>
                  {cat.icon && <span className="text-sm">{cat.icon}</span>}
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Hero */}
      {catLoading ? (
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="h-6 w-48 bg-gray-100 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-72 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      ) : category?.image ? (
        /* Banner hero */
        <div className="relative bg-gray-900 overflow-hidden" style={{ height: 'clamp(180px,25vw,320px)' }}>
          <Image src={category.image} alt={category.name} fill className="object-cover opacity-70" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-3">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-semibold">{category.name}</span>
              </nav>
              <div className="flex items-center gap-3">
                {category.icon && <span className="text-4xl">{category.icon}</span>}
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">{category.name}</h1>
                  {category.nameEn && <p className="text-white/70 text-sm mt-1">{category.nameEn}</p>}
                  {category.description && <p className="text-white/60 text-sm mt-1 max-w-lg leading-relaxed hidden md:block">{category.description}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Compact title hero (no banner) */
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
              <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/categories" className="hover:text-orange-500 transition-colors">Categories</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-700 font-semibold">{category?.name ?? slug}</span>
            </nav>
            <div className="flex items-center gap-3">
              {category?.icon && (
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{category.icon}</span>
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900">{category?.name ?? slug}</h1>
                  {category?.nameEn && <span className="text-gray-400 text-sm hidden sm:block">{category.nameEn}</span>}
                </div>
                {category?.description && (
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed max-w-2xl">{category.description}</p>
                )}
                {meta && (
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">
                    {meta.total} products found
                  </p>
                )}
              </div>
            </div>
            {/* Sub-categories */}
            {category?.children && category.children.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {category.children.map((child: any) => (
                  <Link key={child.slug} href={`/category/${child.slug}`}
                    className="text-xs bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-100 transition-colors font-semibold">
                    {child.icon && <span className="mr-1">{child.icon}</span>}
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products section */}
      <div className="container mx-auto px-4 py-5">
        <div className="flex gap-5">

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-[60px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                  Filters
                </h3>
                {Object.keys(filters).some(k => filters[k as keyof ActiveFilters] !== undefined) && (
                  <button type="button" onClick={() => { setFilters({}); setPage(1); }}
                    className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              <FilterSidebar filters={filters} onChange={handleFilterChange} currentCategory={slug} />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filters
                  </h3>
                  <button type="button" onClick={() => setMobileFilterOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <FilterSidebar filters={filters} onChange={(f) => { handleFilterChange(f); setMobileFilterOpen(false); }} currentCategory={slug} onClose={() => setMobileFilterOpen(false)} />
                </div>
                <div className="p-4 border-t border-gray-100">
                  <button type="button" onClick={() => setMobileFilterOpen(false)}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-sm transition-colors">
                    Show {meta?.total ?? 0} Products
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Sort + Filter bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Mobile filter toggle */}
                <button type="button" onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:border-orange-300 hover:text-orange-600 px-3 py-2 rounded-xl transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                  {Object.keys(filters).filter(k => filters[k as keyof ActiveFilters] !== undefined).length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                      {Object.keys(filters).filter(k => filters[k as keyof ActiveFilters] !== undefined).length}
                    </span>
                  )}
                </button>

                <p className="text-sm text-gray-500 flex-1">
                  <span className="font-black text-gray-900">{meta?.total ?? 0}</span> products
                  {meta && meta.totalPages > 1 && (
                    <span className="text-gray-400 ml-1"> Page {page}/{meta.totalPages}</span>
                  )}
                </p>

                {/* Sort dropdown */}
                <SortBar
                  total={meta?.total ?? 0}
                  sortBy={sortBy}
                  onSortChange={(v) => { setSortBy(v); setPage(1); }}
                  view={view}
                  onViewChange={setView}
                  page={page}
                  limit={LIMIT}
                />

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button type="button" onClick={() => setView('grid')}
                    className={cn('w-9 h-9 flex items-center justify-center transition-colors',
                      view === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500')}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => setView('list')}
                    className={cn('w-9 h-9 flex items-center justify-center transition-colors',
                      view === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500')}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter tags */}
            <ActiveFilterTags
              filters={filters}
              onRemove={(k) => { setFilters(f => ({ ...f, [k]: undefined })); setPage(1); }}
              onClearAll={() => { setFilters({}); setPage(1); }}
            />

            {/* Product grid */}
            <div className={cn('transition-opacity duration-200', isFetching && !isLoading && 'opacity-70')}>
              <ProductGrid products={products} loading={isLoading || catLoading} view={view} />
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
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