import Link from 'next/link';
import { Timer, ArrowRight } from 'lucide-react';

export function SpecialOfferBanner() {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">

          {/* Banner 1 — Main offer */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spice-600 via-spice-500 to-amber-500 p-6 md:p-8 flex flex-col justify-between min-h-[160px]">
            <div className="absolute right-4 top-0 text-8xl opacity-15 select-none leading-none">🌶️</div>
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                <Timer className="w-3 h-3" /> সীমিত সময়
              </span>
              <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug">
                দেশি মসলায়
                <br />
                <span className="text-yellow-200">২৫% পর্যন্ত ছাড়!</span>
              </h3>
              <p className="text-white/80 text-sm mt-1">নির্বাচিত মসলা ও মিক্স কালেকশনে বিশেষ ছাড়</p>
            </div>
            <Link
              href="/shop?category=mosla&discount=true"
              className="mt-4 inline-flex items-center gap-2 bg-white text-spice-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-spice-50 transition-colors w-fit"
            >
              এখনই কিনুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Banner 2 — Free delivery */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600 p-6 md:p-8 flex flex-col justify-between min-h-[160px]">
            <div className="absolute right-4 top-0 text-8xl opacity-15 select-none leading-none">🚚</div>
            <div>
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                🎁 বিশেষ অফার
              </span>
              <h3 className="text-white text-2xl md:text-3xl font-bold leading-snug">
                ৳১০০০+ অর্ডারে
                <br />
                <span className="text-brand-200">ফ্রি ডেলিভারি!</span>
              </h3>
              <p className="text-white/80 text-sm mt-1">কোড: <strong>FREEDEL</strong> — সারাদেশে প্রযোজ্য</p>
            </div>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 bg-white text-brand-700 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors w-fit"
            >
              অর্ডার করুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
