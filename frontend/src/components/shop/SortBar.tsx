'use client';

import { LayoutGrid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

const SORT_OPTIONS = [
  { value: 'newest',        label: 'সবচেয়ে নতুন'         },
  { value: 'best_selling',  label: 'সেরা বিক্রিত'          },
  { value: 'price_asc',     label: 'মূল্য: কম থেকে বেশি'   },
  { value: 'price_desc',    label: 'মূল্য: বেশি থেকে কম'   },
  { value: 'highest_rated', label: 'সর্বোচ্চ রেটিং'         },
];

interface SortBarProps {
  total: number;
  sortBy: string;
  onSortChange: (v: string) => void;
  view: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
  onFilterToggle?: () => void;
  page: number;
  limit: number;
}

export function SortBar({ total, sortBy, onSortChange, view, onViewChange, onFilterToggle, page, limit }: SortBarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'সাজান';
  const from = Math.min((page - 1) * limit + 1, total);
  const to = Math.min(page * limit, total);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 bg-white rounded-2xl border border-gray-100 px-4 py-3">
      {/* Left: filter toggle (mobile) + count */}
      <div className="flex items-center gap-3">
        <button
          onClick={onFilterToggle}
          className="md:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-brand-300 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> ফিল্টার
        </button>
        <p className="text-gray-500 text-sm hidden sm:block">
          <span className="font-semibold text-gray-800">{from}–{to}</span> দেখানো হচ্ছে{' '}
          <span className="font-semibold text-gray-800">{total}</span> পণ্যের মধ্যে
        </p>
        <p className="text-gray-500 text-sm sm:hidden">
          {total} পণ্য
        </p>
      </div>

      {/* Right: sort + view */}
      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:border-brand-300 px-3 py-2 rounded-xl transition-colors"
          >
            <span className="hidden sm:inline">{currentLabel}</span>
            <span className="sm:hidden">সাজান</span>
            <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-100 z-30 w-52 py-1 animate-fade-up">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onSortChange(opt.value); setOpen(false); }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm transition-colors',
                    sortBy === opt.value
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="hidden sm:flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => onViewChange('grid')}
            className={cn('p-2 transition-colors', view === 'grid' ? 'bg-brand-700 text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}
            aria-label="গ্রিড ভিউ"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn('p-2 transition-colors', view === 'list' ? 'bg-brand-700 text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}
            aria-label="লিস্ট ভিউ"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
