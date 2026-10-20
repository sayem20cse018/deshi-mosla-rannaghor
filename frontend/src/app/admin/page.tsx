'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart, Users, Package, TrendingUp,
  Clock, Truck, CheckCircle, XCircle, AlertTriangle,
  Star, Plus, Tag, ImageIcon, Eye, RefreshCw,
  ArrowUpRight, ArrowDownRight, Boxes, TrendingDown,
  Calendar,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import {
  useAdminStats, useSalesChart, useAdminRecentOrders,
  useTopProducts, useRecentCustomers, useRecentReviews,
  useLowStockProducts, type DashboardFilters, type DashboardPeriod,
} from '@/hooks/useAdminDashboard';
import { LoadingState, ErrorState } from '@/components/admin/ui';

// -- Period selector --
const PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: 'today',     label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: '7days',     label: '7 Days' },
  { value: '30days',    label: '30 Days' },
  { value: 'month',     label: 'This Month' },
  { value: 'year',      label: 'This Year' },
  { value: 'custom',    label: 'Custom' },
];

// -- Status badge --
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:    'bg-yellow-100 text-yellow-700',
    CONFIRMED:  'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-indigo-100 text-indigo-700',
    PACKED:     'bg-purple-100 text-purple-700',
    SHIPPED:    'bg-orange-100 text-orange-700',
    DELIVERED:  'bg-green-100 text-green-700',
    CANCELLED:  'bg-red-100 text-red-700',
    RETURNED:   'bg-gray-100 text-gray-600',
    REFUNDED:   'bg-teal-100 text-teal-700',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold', map[status] ?? 'bg-gray-100 text-gray-600')}>
      {status}
    </span>
  );
}

// -- Mini bar chart --
function MiniBarChart({ data }: { data: Array<{ date: string; revenue: number; orders: number }> }) {
  if (!data.length) return <div className="h-32 flex items-center justify-center text-gray-400 text-sm">No data</div>;

  const maxRev = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex items-end gap-0.5 h-32 overflow-hidden">
      {data.slice(-30).map((d) => {
        const h = Math.max(4, (d.revenue / maxRev) * 100);
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className="w-full rounded-t-sm bg-orange-400 group-hover:bg-orange-500 transition-colors cursor-pointer"
              style={{ height: h + '%' }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
              {d.date.slice(5)}: {formatPriceEn(d.revenue)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// -- Star rating --
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} className={cn('w-3 h-3', s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200')} />
      ))}
    </div>
  );
}

// -- Main page --
export default function AdminDashboardPage() {
  const [period, setPeriod]   = useState<DashboardPeriod>('30days');
  const [showCustom, setShowCustom] = useState(false);
  const [from, setFrom]       = useState('');
  const [to,   setTo]         = useState('');

  const filters: DashboardFilters = useMemo(
    () => ({ period, from: period === 'custom' ? from : undefined, to: period === 'custom' ? to : undefined }),
    [period, from, to],
  );

  const stats     = useAdminStats(filters);
  const chart     = useSalesChart(filters);
  const orders    = useAdminRecentOrders(10);
  const products  = useTopProducts(filters, 5);
  const customers = useRecentCustomers(6);
  const reviews   = useRecentReviews(5);
  const lowStock  = useLowStockProducts(8);

  const d = stats.data;

  return (
    <div className="space-y-6">

      {/* Header + period filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Real-time store overview</p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex-wrap">
            {PERIODS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setPeriod(value); setShowCustom(value === 'custom'); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                  period === value ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={() => { stats.refetch(); chart.refetch(); orders.refetch(); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom date range */}
      {showCustom && (
        <div className="flex items-center gap-3 bg-white border border-orange-200 rounded-2xl p-4 shadow-sm">
          <Calendar className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
            <span className="text-gray-400 text-sm">to</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
          </div>
        </div>
      )}

      {/* -- Stat cards -- */}
      {stats.isLoading ? <LoadingState message="Loading dashboard stats..." /> : stats.error ? (
        <ErrorState message="Failed to load stats" onRetry={() => stats.refetch()} />
      ) : d && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>
                {formatPriceEn(d.revenue.total)}
              </p>
              <div className={cn('flex items-center gap-1 mt-1 text-xs font-semibold', d.revenue.positive ? 'text-green-600' : 'text-red-500')}>
                {d.revenue.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(d.revenue.change)}% vs prev period
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>{d.orders.total}</p>
              <p className="text-xs text-gray-400 mt-1">{d.orders.delivered} delivered</p>
            </div>

            {/* Customers */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-500" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>{d.customers.total}</p>
              <p className="text-xs text-green-600 mt-1 font-medium">+{d.customers.new} new this period</p>
            </div>

            {/* Products */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Products</p>
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>{d.products.total}</p>
              <p className="text-xs text-gray-400 mt-1">{d.products.active} active</p>
            </div>
          </div>

          {/* Order status strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Pending',    value: d.orders.pending,    icon: Clock,        color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Processing', value: d.orders.processing, icon: RefreshCw,    color: '#8b5cf6', bg: '#f5f3ff' },
              { label: 'Shipped',    value: d.orders.shipped,    icon: Truck,        color: '#ea580c', bg: '#fff7ed' },
              { label: 'Delivered',  value: d.orders.delivered,  icon: CheckCircle,  color: '#22c55e', bg: '#f0fdf4' },
              { label: 'Cancelled',  value: d.orders.cancelled,  icon: XCircle,      color: '#ef4444', bg: '#fef2f2' },
              { label: 'Low Stock',  value: d.products.lowStock + d.products.outOfStock, icon: AlertTriangle, color: '#f97316', bg: '#fff7ed' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-black text-gray-900 leading-none" style={{ fontFamily: 'Manrope,sans-serif' }}>{value}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* -- Sales chart -- */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-gray-900">Revenue Trend</h2>
            <p className="text-xs text-gray-400 mt-0.5">Daily revenue for selected period</p>
          </div>
          <TrendingUp className="w-5 h-5 text-orange-500" />
        </div>
        {chart.isLoading ? (
          <div className="h-32 flex items-center justify-center"><div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>
        ) : chart.error ? (
          <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Chart unavailable</div>
        ) : (
          <MiniBarChart data={chart.data ?? []} />
        )}
      </div>

      {/* -- Two column: Recent Orders + Top Products -- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Recent Orders (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-black text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              View all <Eye className="w-3 h-3" />
            </Link>
          </div>
          {orders.isLoading ? <LoadingState message="Loading orders..." /> : orders.error ? (
            <ErrorState message="Could not load orders" onRetry={() => orders.refetch()} />
          ) : !orders.data?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <ShoppingCart className="w-10 h-10 mb-2 text-gray-200" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order', 'Customer', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-black text-gray-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.data.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={'/admin/orders?id=' + o.id} className="font-bold text-gray-900 hover:text-orange-600 text-xs font-mono">
                          #{o.orderNumber}
                        </Link>
                        <p className="text-[10px] text-gray-400">{o.itemCount} items</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-xs leading-tight">{o.customer.name}</p>
                        <p className="text-[10px] text-gray-400">{o.customer.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-orange-600 text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
                          {formatPriceEn(o.totalAmount)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-black text-gray-900">Top Products</h2>
            <Link href="/admin/reports/products" className="text-xs font-bold text-orange-600 hover:text-orange-700">View</Link>
          </div>
          {products.isLoading ? <LoadingState message="Loading..." /> : products.error ? (
            <ErrorState message="Could not load products" onRetry={() => products.refetch()} />
          ) : !products.data?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package className="w-10 h-10 mb-2 text-gray-200" />
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-3">
              {products.data.map((item, idx) => (
                <div key={item.productId} className="flex items-center gap-3 py-2">
                  <span className="w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    {item.product.images[0]?.url
                      ? <Image src={item.product.images[0].url} alt={item.product.name} width={40} height={40} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-lg">+</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-gray-400">{item.totalSold} sold</p>
                  </div>
                  <span className="text-xs font-black text-orange-600 flex-shrink-0" style={{ fontFamily: 'Manrope,sans-serif' }}>
                    {formatPriceEn(item.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -- Three column: Customers + Reviews + Low Stock -- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Customers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-black text-gray-900">New Customers</h2>
            <Link href="/admin/customers" className="text-xs font-bold text-orange-600 hover:text-orange-700">View all</Link>
          </div>
          {customers.isLoading ? <LoadingState message="Loading..." /> : customers.error ? (
            <ErrorState message="Could not load customers" onRetry={() => customers.refetch()} />
          ) : !customers.data?.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Users className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-sm">No customers yet</p>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-2.5">
              {customers.data.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-black">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-400">{c._count.orders} orders</p>
                  </div>
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', c.isBlocked ? 'bg-red-400' : c.isActive ? 'bg-green-400' : 'bg-gray-300')} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-black text-gray-900">Recent Reviews</h2>
            <Link href="/admin/customers/reviews" className="text-xs font-bold text-orange-600 hover:text-orange-700">View all</Link>
          </div>
          {reviews.isLoading ? <LoadingState message="Loading..." /> : reviews.error ? (
            <ErrorState message="Could not load reviews" onRetry={() => reviews.refetch()} />
          ) : !reviews.data?.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Star className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-sm">No reviews yet</p>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-3">
              {reviews.data.map((r) => (
                <div key={r.id} className="py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{r.user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{r.product.name}</p>
                    </div>
                    <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0',
                      r.status === 'APPROVED' ? 'bg-green-100 text-green-700' : r.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>
                      {r.status}
                    </span>
                  </div>
                  <StarRating rating={r.rating} />
                  {r.comment && <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-black text-gray-900 flex items-center gap-2">
              Low Stock
              {lowStock.data && lowStock.data.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                  {lowStock.data.length}
                </span>
              )}
            </h2>
            <Link href="/admin/inventory/low-stock" className="text-xs font-bold text-orange-600 hover:text-orange-700">View all</Link>
          </div>
          {lowStock.isLoading ? <LoadingState message="Loading..." /> : lowStock.error ? (
            <ErrorState message="Could not load inventory" onRetry={() => lowStock.refetch()} />
          ) : !lowStock.data?.length ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Boxes className="w-8 h-8 mb-2 text-gray-200" />
              <p className="text-sm">All products in stock</p>
            </div>
          ) : (
            <div className="px-4 py-2 space-y-2.5">
              {lowStock.data.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    {p.images[0]?.url
                      ? <Image src={p.images[0].url} alt={p.name} width={32} height={32} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-3.5 h-3.5 text-gray-300" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded-full',
                      p.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}>
                      {p.stockStatus === 'OUT_OF_STOCK' ? 'OUT' : (p.inventory?.availableStock ?? 0) + ' left'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* -- Quick Actions -- */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-black text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Add Product',   href: '/admin/catalog/products/new', icon: Plus,     color: '#ea580c', bg: '#fff7ed' },
            { label: 'Add Category',  href: '/admin/catalog/categories',   icon: Boxes,    color: '#8b5cf6', bg: '#f5f3ff' },
            { label: 'Add Banner',    href: '/admin/marketing/banners',    icon: ImageIcon, color: '#0369a1', bg: '#eff6ff' },
            { label: 'Add Coupon',    href: '/admin/marketing/coupons',    icon: Tag,      color: '#0f4c2a', bg: '#f0fdf4' },
            { label: 'View Orders',   href: '/admin/orders',               icon: ShoppingCart, color: '#b45309', bg: '#fffbeb' },
          ].map(({ label, href, icon: Icon, color, bg }) => (
            <Link key={label} href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all group text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="text-xs font-bold text-gray-700 group-hover:text-orange-600 transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
