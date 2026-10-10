'use client';

import Link from 'next/link';
import {
  Store, Search, Receipt, CreditCard, Bell,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';

const GROUPS = [
  {
    href:        '/admin/settings/store',
    icon:        <Store className="w-5 h-5" />,
    title:       'Store Settings',
    description: 'Store name, contact info, address, currency',
    color:       '#ea580c',
  },
  {
    href:        '/admin/settings/seo',
    icon:        <Search className="w-5 h-5" />,
    title:       'SEO Settings',
    description: 'Default page title, meta description, keywords',
    color:       '#7c3aed',
  },
  {
    href:        '/admin/settings/tax',
    icon:        <Receipt className="w-5 h-5" />,
    title:       'Tax Settings',
    description: 'Enable tax and configure tax rate',
    color:       '#0284c7',
  },
  {
    href:        '/admin/settings/payment',
    icon:        <CreditCard className="w-5 h-5" />,
    title:       'Payment Settings',
    description: 'Enable/disable payment methods (COD, SSLCommerz)',
    color:       '#16a34a',
  },
  {
    href:        '/admin/settings/notifications',
    icon:        <Bell className="w-5 h-5" />,
    title:       'Notification Settings',
    description: 'Email and alert preferences',
    color:       '#d97706',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your store" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {GROUPS.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: g.color + '18', color: g.color }}
            >
              {g.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm">{g.title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{g.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
