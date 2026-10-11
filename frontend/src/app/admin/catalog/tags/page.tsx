'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hash, Package, RefreshCw } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState } from '@/components/admin/ui';
import api from '@/lib/api';
import Link from 'next/link';

interface TagInfo { tag: string; count: number; }

export default function TagsPage() {
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'tags'],
    queryFn: async () => {
      const { data } = await api.get('/products', { params: { limit: 500, isActive: undefined } });
      const products = data?.data ?? [];
      const tagMap: Record<string, number> = {};
      products.forEach((p: any) => {
        (p.tags ?? []).forEach((t: string) => {
          tagMap[t] = (tagMap[t] ?? 0) + 1;
        });
      });
      return Object.entries(tagMap)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
    },
    staleTime: 60_000,
  });

  const tags: TagInfo[] = (data ?? []).filter((t: TagInfo) =>
    !search || t.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Product Tags"
        description="Tags are managed per product. This view shows all tags in use."
        action={<AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>Refresh</AdminBtn>}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="w-full max-w-sm border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
        />
      </div>

      {isLoading && <LoadingState message="Loading tags..." />}
      {isError   && <ErrorState message="Failed to load tags." onRetry={refetch} />}

      {!isLoading && !isError && tags.length === 0 && (
        <EmptyState
          title="No tags found"
          description="Add tags to products when creating or editing them."
          icon={<Hash className="w-7 h-7 text-gray-300" />}
          action={<Link href="/admin/catalog/products/new" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"><Package className="w-4 h-4" />Add Product with Tags</Link>}
        />
      )}

      {!isLoading && !isError && tags.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{tags.length} unique tags across all products</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/admin/catalog/products?search=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors"
              >
                <Hash className="w-3 h-3" />
                {tag}
                <span className="bg-orange-200 text-orange-800 text-[10px] font-black px-1.5 py-0.5 rounded-full ml-0.5">{count}</span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">Click a tag to view all products with that tag. Edit tags by opening a product.</p>
        </div>
      )}
    </div>
  );
}