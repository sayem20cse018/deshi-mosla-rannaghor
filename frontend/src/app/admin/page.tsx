'use client';

import Link from 'next/link';
import {
  ShoppingCart, Users, Package, TrendingUp,
  Clock, CheckCircle, Truck, AlertTriangle, ArrowRight,
  BarChart3, Star, TrendingDown,
} from 'lucide-react';
import { StatCard, PageHeader } from '@/components/admin/ui';

const STATS = [
  { title: 'Total Orders',    value: '--', icon: <ShoppingCart className="w-5 h-5" />, color: '#ea580c' },
  { title: 'Total Revenue',   value: '--', icon: <TrendingUp    className="w-5 h-5" />, color: '#0f4c2a' },
  { title: 'Total Products',  value: '--', icon: <Package       className="w-5 h-5" />, color: '#7c3aed' },
  { title: 'Total Customers', value: '--', icon: <Users         className="w-5 h-5" />, color: '#0369a1' },
];

const ORDER_STATUS = [
  { label: 'Pending',    href: '/admin/orders/pending',    icon: Clock,         color: '#f59e0b' },
  { label: 'Processing', href: '/admin/orders/processing', icon: AlertTriangle, color: '#8b5cf6' },
  { label: 'Shipped',    href: '/admin/orders/shipped',    icon: Truck,         color: '#ea580c' },
  { label: 'Delivered',  href: '/admin/orders/delivered',  icon: CheckCircle,   color: '#22c55e' },
];

const QUICK = [
  { label: 'Add Product',    href: '/admin/catalog/products/new' },
  { label: 'View Orders',    href: '/admin/orders' },
  { label: 'Coupons',        href: '/admin/marketing/coupons' },
  { label: 'Update Banners', href: '/admin/marketing/banners' },
  { label: 'Sales Report',   href: '/admin/reports/sales' },
  { label: 'Settings',       href: '/admin/settings' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to the admin panel. Here is a snapshot of your store."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.title} title={s.title} value={s.value} icon={s.icon} color={s.color} />
        ))}
      </div>

      {/* Order status */}
      <div>
        <h2 className="text-base font-black text-gray-900 mb-4">Order Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ORDER_STATUS.map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors" />
              </div>
              <p className="text-sm font-bold text-gray-700">{label}</p>
              <p className="text-2xl font-black text-gray-900 mt-0.5">0</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            <h3 className="font-black text-gray-900">Sales Overview</h3>
          </div>
          <div className="h-40 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl flex items-center justify-center border-2 border-dashed border-orange-200">
            <p className="text-orange-400 text-sm font-semibold">Chart will appear here</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-purple-500" />
            <h3 className="font-black text-gray-900">Top Products</h3>
          </div>
          <div className="h-40 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl flex items-center justify-center border-2 border-dashed border-purple-200">
            <p className="text-purple-400 text-sm font-semibold">Chart will appear here</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="font-black text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-2.5">
          {QUICK.map(({ label, href }) => (
            <Link key={label} href={href}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-white text-sm font-semibold text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
