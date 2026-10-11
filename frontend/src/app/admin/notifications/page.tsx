'use client';

import { useQuery } from '@tanstack/react-query';
import { Bell, ShoppingCart, Package, RefreshCw, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState } from '@/components/admin/ui';
import Link from 'next/link';

function formatDate(d: string) {
  return new Date(d).toLocaleString('en-BD', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'notifications-feed'],
    queryFn: async () => {
      const [ordersRes, reviewsRes] = await Promise.all([
        api.get('/admin/orders', { params: { page: 1, limit: 10, sortOrder: 'desc' } }),
        api.get('/admin/reviews', { params: { page: 1, limit: 5, status: 'PENDING', sortOrder: 'desc' } }),
      ]);
      const orders  = (ordersRes.data?.data  ?? []).map((o: any) => ({
        type: 'order', id: o.id, title: `New order #${o.orderNumber}`,
        sub: `${o.user?.name ?? 'Guest'} — ৳${o.totalAmount}`, time: o.createdAt,
        link: '/admin/orders', status: o.status,
      }));
      const reviews = (reviewsRes.data?.data ?? []).map((r: any) => ({
        type: 'review', id: r.id, title: `New review pending`,
        sub: `${r.user?.name ?? 'Customer'} rated ${r.product?.name ?? 'product'} ★${r.rating}`, time: r.createdAt,
        link: '/admin/customers/reviews', status: 'PENDING',
      }));
      return [...orders, ...reviews].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const notifications = data ?? [];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="Recent orders and activity requiring attention."
        action={<AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>Refresh</AdminBtn>}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Bell className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Real-time notifications coming soon</p>
          <p className="text-xs text-amber-700 mt-0.5">Currently showing recent orders and pending reviews. Email/SMS/WhatsApp notification integration requires SMTP/API configuration.</p>
        </div>
      </div>

      {isLoading && <LoadingState message="Loading notifications..." />}
      {isError   && <ErrorState message="Failed to load notifications." onRetry={refetch} />}

      {!isLoading && !isError && notifications.length === 0 && (
        <EmptyState title="No new notifications" description="Recent orders and pending reviews will appear here." icon={<Bell className="w-7 h-7 text-gray-300" />} />
      )}

      {!isLoading && !isError && notifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {notifications.map((n: any) => (
              <Link key={`${n.type}-${n.id}`} href={n.link}
                className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'order' ? 'bg-orange-50 text-orange-500' : 'bg-amber-50 text-amber-500'}`}>
                  {n.type === 'order' ? <ShoppingCart className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{n.sub}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-400">{formatDate(n.time)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${n.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {n.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}