'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  function pages(): (number | '...')[] {
    const delta = 2;
    const range: number[] = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i);
    }
    const result: (number | '...')[] = [1];
    if (range[0] > 2) result.push('...');
    result.push(...range);
    if (range[range.length - 1] < totalPages - 1) result.push('...');
    if (totalPages > 1) result.push(totalPages);
    return result;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 py-6" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-icon border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="আগের পাতা"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages().map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              'w-9 h-9 rounded-xl text-sm font-medium transition-colors',
              page === p
                ? 'bg-brand-700 text-white shadow-sm'
                : 'border border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50',
            )}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn-icon border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="পরের পাতা"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
