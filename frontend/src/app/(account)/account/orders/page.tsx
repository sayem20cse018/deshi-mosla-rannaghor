'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PACKED: 'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED: 'bg-orange-50 text-orange-700 border-orange-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-gray-50 text-gray-700 border-gray-200',
  REFUNDED: 'bg-teal-50 text-teal-700 border-teal-200',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত',
  CONFIRMED: 'নিশ্চিত',
  PROCESSING: 'প্রক্রিয়াধীন',
  PACKED: 'প্যাক করা',
  SHIPPED: 'পাঠানো হয়েছে',
  DELIVERED: 'ডেলিভারি হয়েছে',
  CANCELLED: 'বাতিল',
  RETURNED: 'ফেরত',
  REFUNDED: 'ফেরত দেওয়া হয়েছে',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'text-xs font-semibold px-2.5 py-1 rounded-full border',
        STATUS_COLOR[status] ?? 'bg-gray-50 text-gray-600 border-gray-200',
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', page],
    queryFn: async () => {
      const r = await api.get(`/users/me/orders?page=${page}&limit=10`);
      return r.data;
    },
    staleTime: 30_000,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">আমার অর্ডার</h2>
        {meta && <p className="text-xs text-gray-400">মোট {meta.total} টি অর্ডার</p>}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold text-lg mb-2">কোনো অর্ডার নেই</p>
          <p className="text-gray-400 text-sm mb-6">এখনো কোনো অর্ডার করা হয়নি।</p>
          <Link href="/shop" className="btn-primary px-6">
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 hover:border-brand-200 hover:shadow-sm transition-all group"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-brand-600" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-gray-900 text-sm">#{order.orderNumber}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  {' · '}
                  {order.items?.length ?? 0} টি পণ্য
                </p>
                {/* Thumbnails */}
                {order.items && order.items.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {order.items.slice(0, 3).map((item: any, i: number) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-lg overflow-hidden"
                      >
                        {item.productImage ? (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          '🌶️'
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="text-right flex-shrink-0">
                <p className="font-black text-brand-700">{formatPriceEn(order.totalAmount)}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {order.paymentMethod?.replace(/_/g, ' ')}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors flex-shrink-0" />
            </Link>
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!meta.hasPrev}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                আগে
              </button>
              <span className="text-sm text-gray-500">
                {meta.page} / {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta.hasNext}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
              >
                পরে
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
