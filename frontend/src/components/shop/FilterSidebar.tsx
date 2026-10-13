'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, X, SlidersHorizontal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterMeta } from '@/hooks/useProducts';
import { useCategoriesFlat } from '@/hooks/useCategories';

export interface ActiveFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  stockStatus?: string;
  hasDiscount?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

interface FilterSidebarProps {
  filters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  currentCategory?: string;
  onClose?: () => void;
  className?: string;
}

function Accordion({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-800 py-1"
      >
        {title}
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

const WEIGHT_OPTIONS = [
  '৫০ গ্রাম',
  '১০০ গ্রাম',
  '২০০ গ্রাম',
  '২৫০ গ্রাম',
  '৫০০ গ্রাম',
  '১ কেজি',
  '২ কেজি',
  '৫ কেজি',
];

export function FilterSidebar({
  filters,
  onChange,
  currentCategory,
  onClose,
  className,
}: FilterSidebarProps) {
  const { data: meta } = useFilterMeta(currentCategory);
  const { data: categories = [] } = useCategoriesFlat();

  const [localMin, setLocalMin] = useState(filters.minPrice?.toString() ?? '');
  const [localMax, setLocalMax] = useState(filters.maxPrice?.toString() ?? '');

  const update = useCallback(
    (patch: Partial<ActiveFilters>) => onChange({ ...filters, ...patch }),
    [filters, onChange],
  );

  const clear = () => {
    setLocalMin('');
    setLocalMax('');
    onChange({});
  };

  const activeCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== false && v !== '',
  ).length;

  const priceMin = meta?.priceRange?.min ?? 0;
  const priceMax = meta?.priceRange?.max ?? 10000;

  function applyPrice() {
    const mn = localMin ? parseFloat(localMin) : undefined;
    const mx = localMax ? parseFloat(localMax) : undefined;
    update({ minPrice: mn, maxPrice: mx });
  }

  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span className="font-bold text-gray-900 text-sm">ফিল্টার</span>
          {activeCount > 0 && (
            <span className="bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={clear}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-0.5"
            >
              <X className="w-3 h-3" /> সাফ
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="btn-icon md:hidden">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <Accordion title="ক্যাটাগরি">
        <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-hide">
          <button
            onClick={() => update({ category: undefined })}
            className={cn(
              'w-full text-left text-sm px-3 py-2 rounded-xl transition-colors',
              !filters.category
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'hover:bg-gray-50 text-gray-700',
            )}
          >
            সব ক্যাটাগরি
          </button>
          {categories
            .filter((c) => !c.parentId)
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => update({ category: cat.slug })}
                className={cn(
                  'w-full text-left text-sm px-3 py-2 rounded-xl transition-colors flex items-center justify-between',
                  filters.category === cat.slug
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'hover:bg-gray-50 text-gray-700',
                )}
              >
                <span className="flex items-center gap-2">
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </span>
              </button>
            ))}
        </div>
      </Accordion>

      {/* Price Range */}
      <Accordion title="মূল্য সীমা">
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">সর্বনিম্ন (৳)</label>
              <input
                type="number"
                placeholder={priceMin.toString()}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="input-base text-xs py-2"
                min={0}
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">সর্বোচ্চ (৳)</label>
              <input
                type="number"
                placeholder={priceMax.toString()}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="input-base text-xs py-2"
                min={0}
              />
            </div>
          </div>
          <button onClick={applyPrice} className="w-full btn-primary text-xs py-2">
            মূল্য প্রয়োগ করুন
          </button>
          {/* Quick price presets */}
          <div className="flex flex-wrap gap-1.5">
            {[
              [0, 200],
              [200, 500],
              [500, 1000],
              [1000, 99999],
            ].map(([mn, mx]) => (
              <button
                key={`${mn}-${mx}`}
                onClick={() => {
                  setLocalMin(mn.toString());
                  setLocalMax(mx === 99999 ? '' : mx.toString());
                  update({ minPrice: mn, maxPrice: mx === 99999 ? undefined : mx });
                }}
                className={cn(
                  'text-[11px] px-2.5 py-1 rounded-lg border transition-colors',
                  filters.minPrice === mn
                    ? 'bg-brand-50 border-brand-300 text-brand-700 font-semibold'
                    : 'border-gray-200 text-gray-600 hover:border-brand-200',
                )}
              >
                {mn === 0 ? `৳০–৳${mx}` : mx === 99999 ? `৳${mn}+` : `৳${mn}–৳${mx}`}
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      {/* Brand */}
      {meta?.brands && meta.brands.length > 0 && (
        <Accordion title="ব্র্যান্ড">
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
            {meta.brands.map((brand: any) => (
              <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.brand === brand.slug}
                  onChange={() =>
                    update({ brand: filters.brand === brand.slug ? undefined : brand.slug })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <span
                  className={cn(
                    'text-sm group-hover:text-brand-700 transition-colors',
                    filters.brand === brand.slug ? 'text-brand-700 font-medium' : 'text-gray-700',
                  )}
                >
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </Accordion>
      )}

      {/* Rating */}
      <Accordion title="রেটিং">
        <div className="space-y-1.5">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => update({ minRating: filters.minRating === r ? undefined : r })}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-sm',
                filters.minRating === r
                  ? 'bg-amber-50 text-amber-700'
                  : 'hover:bg-gray-50 text-gray-700',
              )}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'w-3.5 h-3.5',
                      i < r ? 'fill-amber-400 text-amber-400' : 'text-gray-300',
                    )}
                  />
                ))}
              </div>
              <span className="text-xs">ও তার বেশি</span>
            </button>
          ))}
        </div>
      </Accordion>

      {/* Availability */}
      <Accordion title="স্টক অবস্থা">
        <div className="space-y-2">
          {[
            { value: 'IN_STOCK', label: 'স্টকে আছে', color: 'text-green-600' },
            { value: 'LOW_STOCK', label: 'সীমিত স্টক', color: 'text-amber-600' },
          ].map(({ value, label, color }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.stockStatus === value}
                onChange={() =>
                  update({ stockStatus: filters.stockStatus === value ? undefined : value })
                }
                className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <span className={cn('text-sm', color)}>{label}</span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* Discount */}
      <Accordion title="ছাড়">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.hasDiscount}
            onChange={() => update({ hasDiscount: filters.hasDiscount ? undefined : true })}
            className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-700">শুধু ছাড়ের পণ্য দেখান</span>
        </label>
      </Accordion>
    </div>
  );
}
