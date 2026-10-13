'use client';

import { X } from 'lucide-react';
import { ActiveFilters } from './FilterSidebar';

interface Props {
  filters: ActiveFilters;
  search?: string;
  onRemove: (key: keyof ActiveFilters | 'search' | 'price') => void;
  onClearAll: () => void;
}

const LABEL_MAP: Record<string, string> = {
  category: 'ক্যাটাগরি',
  brand: 'ব্র্যান্ড',
  minRating: 'রেটিং',
  stockStatus: 'স্টক',
  hasDiscount: 'ছাড়',
};

export function ActiveFilterTags({ filters, search, onRemove, onClearAll }: Props) {
  const tags: { key: string; label: string }[] = [];

  if (search) tags.push({ key: 'search', label: `"${search}"` });
  if (filters.category) tags.push({ key: 'category', label: filters.category });
  if (filters.brand) tags.push({ key: 'brand', label: filters.brand });
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    tags.push({
      key: 'price',
      label: `৳${filters.minPrice ?? 0}–${filters.maxPrice ? `৳${filters.maxPrice}` : '...'}`,
    });
  }
  if (filters.minRating) tags.push({ key: 'minRating', label: `${filters.minRating}★+` });
  if (filters.stockStatus)
    tags.push({
      key: 'stockStatus',
      label: filters.stockStatus === 'IN_STOCK' ? 'স্টকে আছে' : 'সীমিত স্টক',
    });
  if (filters.hasDiscount) tags.push({ key: 'hasDiscount', label: 'ছাড়ের পণ্য' });

  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 font-medium">সক্রিয় ফিল্টার:</span>
      {tags.map((tag) => (
        <button
          key={tag.key}
          onClick={() => onRemove(tag.key as any)}
          className="flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium px-2.5 py-1 rounded-full hover:bg-brand-100 transition-colors"
        >
          {tag.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      {tags.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-700 font-medium underline"
        >
          সব সাফ করুন
        </button>
      )}
    </div>
  );
}
