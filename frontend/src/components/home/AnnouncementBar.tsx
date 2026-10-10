'use client';

import { Truck, Tag, Gift } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-brand-800 text-white py-2 text-xs overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-12">
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Truck className="w-3.5 h-3.5" />
            ৳১০০০+ অর্ডারে ফ্রি ডেলিভারি
          </span>
          <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
            <Tag className="w-3.5 h-3.5" />
            কোড: <strong>WELCOME10</strong> — ১০% ছাড়
          </span>
          <span className="hidden md:flex items-center gap-1.5 whitespace-nowrap">
            <Gift className="w-3.5 h-3.5" />
            ক্যাশ অন ডেলিভারি উপলব্ধ
          </span>
        </div>
      </div>
    </div>
  );
}
