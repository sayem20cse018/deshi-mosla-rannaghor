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
    <div className={`rounded-2xl p-4 border ${color} flex items-center gap-3 shadow-sm`}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/80 shadow-sm flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-black leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>{value ?? '—'}</p>
        <p className="text-xs font-medium opacity-70 mt-0.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{label}</p>
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
      <div className="rounded-2xl p-6 text-white overflow-hidden relative"
           style={{ background: 'linear-gradient(135deg, #0f4c2a 0%, #0a3d22 60%, #072d18 100%)' }}>
        {/* decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.07]"
             style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0 shadow-lg">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name ?? 'avatar'}
                width={56}
                height={56}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{user?.name?.charAt(0) ?? 'গ'}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/60 text-xs" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>স্বাগতম!</p>
            <h2 className="text-xl font-black text-white truncate" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{user?.name}</h2>
            <p className="text-white/50 text-xs mt-0.5 truncate" style={{ fontFamily: 'Manrope, sans-serif' }}>{user?.email}</p>
          </div>
          <Link
            href="/account/profile"
            className="flex-shrink-0 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
          >
            <User className="w-3.5 h-3.5" /> প্রোফাইল
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard
          icon={ShoppingBag}
          label="মোট অর্ডার"
          value={counts?.orders ?? 0}
          color="bg-[#eff6ff] border-[#bfdbfe] text-[#1d4ed8]"
        />
        <StatCard
          icon={Star}
          label="মোট রিভিউ"
          value={counts?.reviews ?? 0}
          color="bg-[#fffbeb] border-[#fde68a] text-[#92400e]"
        />
        <StatCard
          icon={MapPin}
          label="সংরক্ষিত ঠিকানা"
          value={counts?.addresses ?? 0}
          color="bg-[#f0fdf4] border-[#bbf7d0] text-[#0f4c2a]"
        />
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.12em] mb-3">
          দ্রুত অ্যাক্সেস
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 hover:border-[#0f4c2a]/30 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] group-hover:bg-[#dcfce7] flex items-center justify-center transition-colors flex-shrink-0">
                <Icon className="w-5 h-5 text-[#0f4c2a]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 text-sm leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{label}</p>
                <p className="text-gray-400 text-xs mt-0.5 truncate" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#0f4c2a] ml-auto transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Track order shortcut */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-[#fff7ed] flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-[#ea580c]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>অর্ডার ট্র্যাক করুন</p>
          <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>আপনার অর্ডারের বর্তমান অবস্থা দেখুন</p>
        </div>
        <Link href="/order-tracking"
          className="flex-shrink-0 inline-flex items-center gap-1.5 text-xs font-black py-2 px-4 rounded-xl text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#0f4c2a,#1a6b3c)', fontFamily: 'Noto Sans Bengali, sans-serif' }}>
          ট্র্যাক করুন
        </Link>
      </div>
    </div>
  );
}
