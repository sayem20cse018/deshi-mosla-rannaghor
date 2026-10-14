'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight, Loader2, ShoppingBag, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';

// ─── constants ────────────────────────────────────────────
const TABS = [
  { key: '',          label: 'সব',          icon: Package     },
  { key: 'PENDING',   label: 'অপেক্ষারত',   icon: Clock       },
  { key: 'CONFIRMED', label: 'নিশ্চিত',     icon: CheckCircle },
  { key: 'SHIPPED',   label: 'পাঠানো',       icon: Truck       },
  { key: 'DELIVERED', label: 'ডেলিভারি',    icon: CheckCircle },
  { key: 'CANCELLED', label: 'বাতিল',       icon: XCircle     },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  CONFIRMED:  'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PACKED:     'bg-purple-50 text-purple-700 border-purple-200',
  SHIPPED:    'bg-orange-50 text-orange-700 border-orange-200',
  DELIVERED:  'bg-green-50 text-green-700 border-green-200',
  CANCELLED:  'bg-red-50 text-red-700 border-red-200',
  RETURNED:   'bg-gray-50 text-gray-600 border-gray-200',
  REFUNDED:   'bg-teal-50 text-teal-700 border-teal-200',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'অপেক্ষারত', CONFIRMED: 'নিশ্চিত', PROCESSING: 'প্রক্রিয়াধীন',
  PACKED: 'প্যাক করা', SHIPPED: 'পাঠানো হয়েছে', DELIVERED: 'ডেলিভারি হয়েছে',
  CANCELLED: 'বাতিল', RETURNED: 'ফেরত', REFUNDED: 'রিফান্ড',
};

const PAY_METHOD_LABEL: Record<string, string> = {
  CASH_ON_DELIVERY: 'COD', BKASH: 'bKash', NAGAD: 'Nagad',
  ROCKET: 'Rocket', SSLCOMMERZ: 'Online', VISA: 'Visa',
  MASTERCARD: 'Mastercard', CREDIT_CARD: 'Card', DEBIT_CARD: 'Card',
};

// ─── Order card ───────────────────────────────────────────
function OrderCard({ order }: { order: any }) {
  return (
    <Link
      href={`/account/orders/${order.id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-forest-200 hover:shadow-md transition-all p-4 flex items-center gap-4"
    >
      {/* Status icon */}
      <div className={cn(
        'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
        order.status === 'DELIVERED' ? 'bg-green-50'
          : order.status === 'CANCELLED' ? 'bg-red-50'
          : order.status === 'SHIPPED' ? 'bg-orange-50'
          : 'bg-forest-50',
      )}>
        {order.status === 'DELIVERED' ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : order.status === 'CANCELLED' ? (
          <XCircle className="w-5 h-5 text-red-500" />
        ) : order.status === 'SHIPPED' ? (
          <Truck className="w-5 h-5 text-orange-500" />
        ) : (
          <Package className="w-5 h-5 text-forest-600" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-gray-900 text-sm font-mono">#{order.orderNumber}</p>
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
            STATUS_BADGE[order.status] ?? 'bg-gray-50 text-gray-600 border-gray-200')}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>

        <p className="text-gray-400 text-xs mt-0.5">
          {new Date(order.createdAt).toLocaleDateString('bn-BD', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
          {' · '}
          {order.items?.length ?? 0} টি পণ্য
          {order.estimatedDelivery && !['DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(order.status) && (
            <span className="text-spice-500 font-medium">
              {' · '}আনুমানিক {new Date(order.estimatedDelivery).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </p>

        {/* Product thumbnails */}
        {order.items && order.items.length > 0 && (
          <div className="flex gap-1 mt-2">
            {order.items.slice(0, 4).map((item: any, i: number) => (
              <div key={i}
                className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center text-sm overflow-hidden flex-shrink-0">
                {item.productImage
                  ? <Image src={item.productImage} alt={item.productName} width={32} height={32} className="w-full h-full object-cover" />
                  : '🌶️'}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 flex-shrink-0">
                +{order.items.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right */}
      <div className="text-right flex-shrink-0 space-y-1">
        <p className="font-black text-forest-700">{formatPriceEn(order.totalAmount)}</p>
        <p className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          {PAY_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}
        </p>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-forest-500 transition-colors flex-shrink-0" />
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────
export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', activeTab, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (activeTab) params.set('status', activeTab);
      const r = await api.get(`/users/me/orders?${params}`);
      return r.data;
    },
    staleTime: 30_000,
  });

  const orders = data?.data ?? [];
  const meta   = data?.meta;

  function handleTab(key: string) {
    setActiveTab(key);
    setPage(1);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-gray-900">আমার অর্ডার</h2>
        {meta && (
          <p className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            মোট {meta.total} টি
          </p>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mb-4">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleTab(key)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 border',
              activeTab === key
                ? 'bg-forest-700 text-white border-forest-700 shadow-sm shadow-forest-700/20'
                : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200 hover:text-forest-700',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-forest-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg mb-2">
            {activeTab ? `কোনো "${STATUS_LABEL[activeTab]}" অর্ডার নেই` : 'কোনো অর্ডার নেই'}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            {activeTab ? 'অন্য ক্যাটাগরি দেখুন' : 'এখনো কোনো অর্ডার করা হয়নি।'}
          </p>
          {!activeTab && (
            <Link href="/shop" className="btn-primary px-6">
              কেনাকাটা শুরু করুন
            </Link>
          )}
          {activeTab && (
            <button onClick={() => handleTab('')} className="btn-secondary px-6">
              সব অর্ডার দেখুন
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage(p => p - 1)} disabled={!meta.hasPrev}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">
                ← আগে
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-8 h-8 rounded-lg text-sm font-bold transition-all',
                      p === meta.page
                        ? 'bg-forest-700 text-white'
                        : 'text-gray-500 hover:bg-gray-100')}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => setPage(p => p + 1)} disabled={!meta.hasNext}
                className="btn-secondary px-4 py-2 text-sm disabled:opacity-40">
                পরে →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
