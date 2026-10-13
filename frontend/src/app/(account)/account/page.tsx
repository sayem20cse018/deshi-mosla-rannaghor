'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Star,
  Tag,
  ChevronRight,
  Package,
  User,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: any;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-4 border ${color} flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white/60`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-black">{value ?? '—'}</p>
        <p className="text-xs font-medium opacity-70">{label}</p>
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { href: '/account/orders', icon: ShoppingBag, label: 'আমার অর্ডার', sub: 'সব অর্ডার দেখুন' },
  { href: '/account/wishlist', icon: Heart, label: 'উইশলিস্ট', sub: 'পছন্দের পণ্য' },
  { href: '/account/addresses', icon: MapPin, label: 'ঠিকানা', sub: 'সংরক্ষিত ঠিকানা' },
  { href: '/account/payment-history', icon: CreditCard, label: 'পেমেন্ট', sub: 'পেমেন্ট ইতিহাস' },
  { href: '/account/reviews', icon: Star, label: 'রিভিউ', sub: 'আমার রিভিউ' },
  { href: '/account/coupons', icon: Tag, label: 'কুপন', sub: 'ব্যবহৃত কুপন' },
];

export default function AccountDashboard() {
  const { user } = useAuthStore();

  const { data: profileData } = useQuery({
    queryKey: ['account-profile'],
    queryFn: async () => {
      const res = await api.get('/users/me');
      return res.data.data;
    },
    staleTime: 60_000,
  });

  const counts = profileData?._count;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-brand-700 to-brand-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name ?? 'avatar'}
                width={56}
                height={56}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">{user?.name?.charAt(0) ?? 'গ'}</span>
            )}
          </div>
          <div>
            <p className="text-brand-200 text-sm">স্বাগতম!</p>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-brand-300 text-xs mt-0.5">{user?.email}</p>
          </div>
          <Link
            href="/account/profile"
            className="ml-auto bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" /> প্রোফাইল সম্পাদনা
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          icon={ShoppingBag}
          label="মোট অর্ডার"
          value={counts?.orders ?? 0}
          color="bg-blue-50 border-blue-100 text-blue-700"
        />
        <StatCard
          icon={Star}
          label="মোট রিভিউ"
          value={counts?.reviews ?? 0}
          color="bg-amber-50 border-amber-100 text-amber-700"
        />
        <StatCard
          icon={MapPin}
          label="সংরক্ষিত ঠিকানা"
          value={counts?.addresses ?? 0}
          color="bg-green-50 border-green-100 text-green-700"
        />
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
          দ্রুত অ্যাক্সেস
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-brand-300 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center transition-colors flex-shrink-0">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight">{label}</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate">{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 ml-auto transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Track order shortcut */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-spice-50 flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-spice-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm">অর্ডার ট্র্যাক করুন</p>
          <p className="text-gray-400 text-xs mt-0.5">আপনার অর্ডারের বর্তমান অবস্থা দেখুন</p>
        </div>
        <Link href="/order-tracking" className="btn-primary text-xs py-2 px-4 flex-shrink-0">
          ট্র্যাক করুন
        </Link>
      </div>
    </div>
  );
}
