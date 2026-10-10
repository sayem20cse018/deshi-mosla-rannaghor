import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Static categories — will be replaced with API data in Step 2
const CATEGORIES = [
  { slug: 'mosla', name: 'মসলা', emoji: '🌶️', count: '১০০+' },
  { slug: 'tel', name: 'রান্নার তেল', emoji: '🫙', count: '৮+' },
  { slug: 'chal', name: 'চাল', emoji: '🍚', count: '১৫+' },
  { slug: 'dal', name: 'ডাল', emoji: '🫘', count: '১২+' },
  { slug: 'ata-maida', name: 'আটা ও ময়দা', emoji: '🌾', count: '৬+' },
  { slug: 'lobon', name: 'লবণ', emoji: '🧂', count: '৫+' },
  { slug: 'chini-gur', name: 'চিনি ও গুড়', emoji: '🍯', count: '৭+' },
  { slug: 'cha-kofi', name: 'চা ও কফি', emoji: '☕', count: '৬+' },
];

export function CategorySection() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">ক্যাটাগরির সমূহ</h2>
            <p className="section-subtitle">পছন্দের ক্যাটাগরি থেকে পণ্য বেছে নিন</p>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-brand-700 hover:text-brand-800 text-sm font-medium">
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all text-center"
            >
              <div className="w-12 h-12 bg-brand-50 group-hover:bg-brand-100 rounded-full flex items-center justify-center text-2xl transition-colors">
                {cat.emoji}
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.count} পণ্য</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
