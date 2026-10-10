'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-spice-500/20 border border-spice-400/30 text-spice-300 text-xs px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-spice-400 rounded-full animate-pulse" />
            ১০০% দেশীয় ও প্রাকৃতিক পণ্য
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
            দেশি মসলার রান্নাঘর
            <br />
            <span className="text-spice-400">প্রতিটি রান্নায়</span>
            <br />
            আসল স্বাদ
          </h1>

          <p className="text-brand-200 text-base md:text-lg mb-8 leading-relaxed">
            নির্বাচিত দেশি মসলা ও নিত্যপ্রয়োজনীয় পণ্য, এখন আপনার দরজায়।
            ঘরে বসেই অর্ডার করুন, দ্রুত ডেলিভারি পান।
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button variant="spice" size="xl" className="gap-2">
                এখনই কিনুন
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/recipes">
              <Button variant="outline" size="xl"
                className="gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent">
                রেসিপি দেখুন
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: '৫০০+', label: 'পণ্য' },
              { value: '১০ হাজার+', label: 'গ্রাহক' },
              { value: '৪.৮★', label: 'রেটিং' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-brand-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
