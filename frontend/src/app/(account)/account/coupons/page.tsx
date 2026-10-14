'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Tag, Copy, Check, Loader2, ShoppingBag, Clock,
  Percent, Truck, Banknote, AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

// ─── Discount type config ─────────────────────────────────
const TYPE_CONFIG = {
  PERCENTAGE:    { icon: Percent, label: 'শতকরা ছাড়',     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200'   },
  FIXED_AMOUNT:  { icon: Banknote, label: 'নির্দিষ্ট ছাড়', color: 'text-forest-600', bg: 'bg-forest-50', border: 'border-forest-200' },
  FREE_DELIVERY: { icon: Truck,   label: 'ফ্রি ডেলিভারি',  color: 'text-spice-600',  bg: 'bg-spice-50',  border: 'border-spice-200'  },
};

function discountLabel(type: string, value: number, maxDiscount?: number | null) {
  if (type === 'PERCENTAGE') {
    return `${value}% ছাড়${maxDiscount ? ` (সর্বোচ্চ ৳${maxDiscount})` : ''}`;
  }
  if (type === 'FIXED_AMOUNT') return `৳${value} ছাড়`;
  if (type === 'FREE_DELIVERY') return 'ফ্রি ডেলিভারি';
  return '';
}

// ─── Coupon card ──────────────────────────────────────────
function CouponCard({ coupon, used = false }: { coupon: any; used?: boolean }) {
  const [copied, setCopied] = useState(false);
  const cfg = TYPE_CONFIG[coupon.discountType as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.FIXED_AMOUNT;
  const Icon = cfg.icon;

  const isExpired = new Date() > new Date(coupon.expiryDate);
  const expiresIn = Math.ceil(
    (new Date(coupon.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  function copyCode() {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      toast.success(`কুপন "${coupon.code}" কপি হয়েছে`);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className={cn(
      'relative bg-white rounded-2xl border overflow-hidden transition-all',
      used || isExpired ? 'opacity-60 border-gray-200' : `${cfg.border} hover:shadow-md`,
    )}>
      {/* Top color strip */}
      <div className={cn('h-1.5', cfg.bg.replace('bg-', 'bg-').replace('50', '400'))} />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Type icon + label */}
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cfg.bg)}>
            <Icon className={cn('w-5 h-5', cfg.color)} />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 justify-end">
            {used && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                ব্যবহৃত
              </span>
            )}
            {isExpired && !used && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-200">
                মেয়াদ শেষ
              </span>
            )}
            {!isExpired && !used && expiresIn <= 3 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" /> {expiresIn}দিন বাকি
              </span>
            )}
          </div>
        </div>

        {/* Discount headline */}
        <p className={cn('font-black text-xl leading-none mb-1', cfg.color)}>
          {discountLabel(coupon.discountType, coupon.discountValue, coupon.maxDiscount)}
        </p>

        {/* Description */}
        {coupon.description && (
          <p className="text-gray-500 text-xs mb-2 leading-relaxed">{coupon.description}</p>
        )}

        {/* Conditions */}
        <div className="space-y-0.5 mb-3">
          {coupon.minOrderAmount && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block flex-shrink-0" />
              ন্যূনতম অর্ডার: {formatPriceEn(coupon.minOrderAmount)}
            </p>
          )}
          {!isExpired && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block flex-shrink-0" />
              মেয়াদ: {new Date(coupon.expiryDate).toLocaleDateString('bn-BD', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          )}
          {used && coupon.usedAt && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block flex-shrink-0" />
              ব্যবহার: {new Date(coupon.usedAt).toLocaleDateString('bn-BD')}
            </p>
          )}
        </div>

        {/* Code + copy */}
        <div className={cn(
          'flex items-center justify-between rounded-xl border px-3 py-2',
          isExpired || used ? 'bg-gray-50 border-gray-200' : `${cfg.bg} ${cfg.border}`,
        )}>
          <span className={cn(
            'font-black font-mono tracking-widest text-sm',
            isExpired || used ? 'text-gray-400' : cfg.color,
          )}>
            {coupon.code}
          </span>
          {!isExpired && !used && (
            <button onClick={copyCode}
              className={cn('flex items-center gap-1 text-xs font-semibold transition-all px-2 py-1 rounded-lg',
                copied
                  ? 'text-green-600 bg-green-50'
                  : `${cfg.color} hover:opacity-80`)}>
              {copied
                ? <><Check className="w-3 h-3" /> কপি</>
                : <><Copy className="w-3 h-3" /> কপি</>
              }
            </button>
          )}
        </div>

        {/* Use now btn */}
        {!isExpired && !used && (
          <Link href="/shop"
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-forest-700 bg-forest-50 hover:bg-forest-100 border border-forest-200 py-2 rounded-xl transition-colors">
            <ShoppingBag className="w-3.5 h-3.5" /> এখনই ব্যবহার করুন
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────
export default function CouponsPage() {
  const [tab, setTab] = useState<'available' | 'used'>('available');

  // Available coupons (public)
  const { data: available, isLoading: availLoading } = useQuery({
    queryKey: ['available-coupons'],
    queryFn: async () => {
      const r = await api.get('/coupons');
      return r.data.data ?? [];
    },
    staleTime: 60_000,
  });

  // My used coupons (authenticated)
  const { data: used, isLoading: usedLoading } = useQuery({
    queryKey: ['my-used-coupons'],
    queryFn: async () => {
      const r = await api.get('/users/me/coupons');
      return r.data.data ?? [];
    },
    staleTime: 30_000,
  });

  const loading = tab === 'available' ? availLoading : usedLoading;
  const items   = tab === 'available' ? (available ?? []) : (used ?? []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-spice-500" />
          কুপন ও ছাড়
        </h2>
      </div>

      {/* Info banner */}
      <div className="bg-spice-50 border border-spice-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-spice-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-spice-700 mb-0.5">কীভাবে কুপন ব্যবহার করবেন?</p>
          <p className="text-xs text-spice-600 leading-relaxed">
            কার্টে পণ্য যোগ করুন → চেকআউটে যান → &ldquo;কুপন কোড&rdquo; বক্সে কোড লিখুন → &ldquo;প্রয়োগ&rdquo; চাপুন।
            ছাড় স্বয়ংক্রিয়ভাবে যোগ হবে।
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {([
          { key: 'available', label: `উপলব্ধ কুপন`, count: available?.length },
          { key: 'used',      label: `ব্যবহারের ইতিহাস`, count: used?.length },
        ] as const).map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all border',
              tab === key
                ? 'bg-forest-700 text-white border-forest-700 shadow-sm'
                : 'bg-white text-gray-600 border-gray-100 hover:border-forest-200',
            )}>
            {label}
            {count !== undefined && (
              <span className={cn('text-[10px] font-black px-1.5 py-0.5 rounded-full',
                tab === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500')}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-7 h-7 animate-spin text-forest-600" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Tag className="w-14 h-14 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-700 font-bold mb-1">
            {tab === 'available' ? 'এখন কোনো সক্রিয় কুপন নেই' : 'কোনো কুপন ব্যবহার করা হয়নি'}
          </p>
          <p className="text-gray-400 text-sm mb-5">
            {tab === 'available'
              ? 'নতুন কুপনের জন্য আমাদের সোশ্যাল মিডিয়া ফলো করুন।'
              : 'কুপন ব্যবহার করে কেনাকাটা করলে এখানে দেখা যাবে।'}
          </p>
          <Link href="/shop" className="btn-primary px-6">কেনাকাটা করুন</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tab === 'available'
            ? items.map((c: any) => <CouponCard key={c.code} coupon={c} />)
            : items.map((u: any) => (
                <CouponCard
                  key={u.id}
                  coupon={{ ...u.coupon, expiryDate: u.coupon.expiryDate, usedAt: u.usedAt }}
                  used
                />
              ))}
        </div>
      )}
    </div>
  );
}
