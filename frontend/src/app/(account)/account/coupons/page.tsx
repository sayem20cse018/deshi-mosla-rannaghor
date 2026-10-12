'use client';

import { useQuery } from '@tanstack/react-query';
import { Tag, Copy, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CouponsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-coupons'],
    queryFn: async () => { const r = await api.get('/users/me/coupons'); return r.data.data; },
  });

  // Also fetch available coupons
  const { data: available } = useQuery({
    queryKey: ['available-coupons'],
    queryFn: async () => { const r = await api.get('/coupons'); return r.data.data; },
  });

  function copy(code: string) {
    navigator.clipboard.writeText(code).then(() => toast.success(`"${code}" কপি হয়েছে`));
  }

  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;

  const TYPE_LABEL: Record<string,string> = {
    PERCENTAGE: '% ছাড়',
    FIXED_AMOUNT: '৳ ছাড়',
    FREE_DELIVERY: 'ফ্রি ডেলিভারি',
  };

  return (
    <div className="space-y-7">
      {/* Available coupons */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">উপলব্ধ কুপন</h2>
        {!available?.length ? (
          <p className="text-gray-400 text-sm">বর্তমানে কোনো কুপন নেই</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {available.map((c: any) => (
              <div key={c.code} className="bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-brand-600" />
                      <span className="font-black font-mono text-brand-700 text-base tracking-wider">{c.code}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
                      {c.discountType === 'PERCENTAGE' && `${c.discountValue}% ছাড়`}
                      {c.discountType === 'FIXED_AMOUNT' && `৳${c.discountValue} ছাড়`}
                      {c.discountType === 'FREE_DELIVERY' && 'ফ্রি ডেলিভারি'}
                    </p>
                    {c.minOrderAmount && <p className="text-[11px] text-gray-400 mt-1">ন্যূনতম অর্ডার: ৳{c.minOrderAmount}</p>}
                    <p className="text-[11px] text-gray-400">মেয়াদ: {new Date(c.expiryDate).toLocaleDateString('bn-BD')}</p>
                  </div>
                  <button
                    onClick={() => copy(c.code)}
                    className="flex items-center gap-1 bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex-shrink-0"
                  >
                    <Copy className="w-3 h-3" /> কপি
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Used coupons */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4">ব্যবহৃত কুপন</h2>
        {!data?.length ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">এখনো কোনো কুপন ব্যবহার করা হয়নি</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((usage: any) => (
              <div key={usage.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold font-mono text-gray-700">{usage.coupon?.code}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    ব্যবহার: {new Date(usage.usedAt).toLocaleDateString('bn-BD')}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-medium">ব্যবহৃত</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
