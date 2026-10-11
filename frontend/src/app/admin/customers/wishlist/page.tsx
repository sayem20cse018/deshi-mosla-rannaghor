'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import { PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState, FilterBar, Pagination } from '@/components/admin/ui';
import Link from 'next/link';

export default function WishlistAdminPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'wishlists', page, search],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) p.set('search', search);
      const { data } = await api.get('/admin/wishlists?' + p.toString());
      return data;
    },
    staleTime: 30_000,
  });

  const wishlists = data?.data ?? [];
  const meta      = data?.meta;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer Wishlists"
        description={`${meta?.total ?? 0} customers have saved products`}
        action={<AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>Refresh</AdminBtn>}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <FilterBar search={search} onSearch={v => { setSearch(v); setPage(1); }} placeholder="Search by customer name or email..." />
        </div>

        {isLoading && <LoadingState message="Loading wishlists..." />}
        {isError   && <ErrorState message="Failed to load wishlists." onRetry={refetch} />}

        {!isLoading && !isError && wishlists.length === 0 && (
          <EmptyState title="No wishlists found" description="Customers haven't saved any products yet." icon={<Heart className="w-7 h-7 text-gray-300" />} />
        )}

        {!isLoading && !isError && wishlists.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Items</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Top Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {wishlists.map((w: any) => (
                <tr key={w.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-black text-orange-500">{w.user?.name?.[0]?.toUpperCase() ?? '?'}</span>
                      </div>
                      <p className="font-bold text-gray-900 text-xs">{w.user?.name ?? 'Unknown'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-700">{w.user?.email}</p>
                    <p className="text-xs text-gray-400">{w.user?.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-black text-orange-500">{w.itemCount}</span>
                    <span className="text-xs text-gray-400 ml-1">item{w.itemCount !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1.5">
                      {(w.items ?? []).slice(0, 4).map((item: any) => (
                        <Link key={item.id} href={`/admin/catalog/products/${item.product?.id}/edit`} title={item.product?.name}>
                          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                            {item.product?.images?.[0]?.url
                              ? <Image src={item.product.images[0].url} alt={item.product.name} width={32} height={32} className="object-cover w-full h-full" />
                              : <div className="w-full h-full flex items-center justify-center text-[10px]">🌶️</div>
                            }
                          </div>
                        </Link>
                      ))}
                      {w.itemCount > 4 && (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{w.itemCount - 4}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}