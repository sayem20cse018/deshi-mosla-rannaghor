import Link from 'next/link';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Big emoji */}
        <div className="text-8xl mb-6 animate-float">🌶️</div>

        {/* 404 */}
        <h1 className="text-8xl font-black text-orange-600 leading-none mb-2">৪০৪</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">পেজটি পাওয়া যায়নি</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা ঠিকানা পরিবর্তন হয়েছে।
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            হোমে যান
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white border border-forest-200 text-orange-600 hover:bg-forest-50 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            পণ্য দেখুন
          </Link>
        </div>

        {/* Popular categories */}
        <div className="mt-10">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            জনপ্রিয় ক্যাটাগরি
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: '🌶️ মসলা', href: '/category/mosla' },
              { label: '🫙 তেল', href: '/category/tel' },
              { label: '🍚 চাল', href: '/category/chal' },
              { label: '🍯 মধু', href: '/category/modhu' },
              { label: '☕ চা', href: '/category/cha' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs bg-white border border-gray-200 hover:border-forest-300 text-gray-600 hover:text-orange-600 px-3 py-1.5 rounded-full transition-all"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
