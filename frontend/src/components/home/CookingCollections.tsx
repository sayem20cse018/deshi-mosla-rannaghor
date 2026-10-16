import Link from 'next/link';
import { ArrowRight, ShoppingCart, Clock, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const COLLECTIONS = [
  {
    slug:  'kacchi-biryani',
    title: 'কাচ্চি বিরিয়ানি',
    sub:   '৯টি উপকরণ',
    emoji: '🍛',
    time:  '৭৫ মিনিট',
    serving: '৬ জন',
    gradient: 'from-amber-600 via-orange-500 to-red-500',
    glow: 'shadow-orange-500/25',
    items: ['বাসমতি চাল', 'বিরিয়ানি মসলা', 'সরিষার তেল', 'গরম মসলা'],
  },
  {
    slug:  'macher-jhol',
    title: 'মাছের ঝোল',
    sub:   '৮টি উপকরণ',
    emoji: '🐟',
    time:  '৪০ মিনিট',
    serving: '৪ জন',
    gradient: 'from-cyan-600 via-blue-500 to-indigo-500',
    glow: 'shadow-blue-500/25',
    items: ['সরিষার তেল', 'হলুদ গুঁড়া', 'মরিচ গুঁড়া', 'জিরা'],
  },
  {
    slug:  'gorur-mangser-kari',
    title: 'গরুর মাংস কারি',
    sub:   '৮টি উপকরণ',
    emoji: '🥩',
    time:  '৬৫ মিনিট',
    serving: '৫ জন',
    gradient: 'from-red-600 via-rose-500 to-pink-500',
    glow: 'shadow-rose-500/25',
    items: ['মাংসের মসলা', 'গরম মসলা', 'সরিষার তেল', 'পেঁয়াজ'],
  },
  {
    slug:  'mug-daler-khichuri',
    title: 'মুগ ডালের খিচুড়ি',
    sub:   '৭টি উপকরণ',
    emoji: '🍲',
    time:  '৫০ মিনিট',
    serving: '৪ জন',
    gradient: 'from-emerald-600 via-green-500 to-teal-500',
    glow: 'shadow-green-500/25',
    items: ['মিনিকেট চাল', 'মুগ ডাল', 'হলুদ গুঁড়া', 'জিরা'],
  },
  {
    slug:  'ilish-shorshe',
    title: 'ইলিশ সরিষা',
    sub:   '৭টি উপকরণ',
    emoji: '🐠',
    time:  '৩৫ মিনিট',
    serving: '৪ জন',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    glow: 'shadow-purple-500/25',
    items: ['সরিষার তেল', 'হলুদ গুঁড়া', 'মরিচ গুঁড়া', 'লবণ'],
  },
  {
    slug:  'dim-bhorta',
    title: 'ডিম ভর্তা',
    sub:   '৬টি উপকরণ',
    emoji: '🥚',
    time:  '২০ মিনিট',
    serving: '২ জন',
    gradient: 'from-yellow-500 via-amber-400 to-orange-400',
    glow: 'shadow-amber-500/25',
    items: ['সরিষার তেল', 'মরিচ গুঁড়া', 'লবণ', 'পেঁয়াজ'],
  },
];

export function CookingCollections() {
  return (
    <section className="section-wrap bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="কিউরেটেড কালেকশন"
          subtitle="রেসিপির সব উপকরণ একসাথে কার্টে যোগ করুন"
          accent="রান্নার কালেকশন"
          href="/blog"
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href="/blog"
              className={`group relative overflow-hidden rounded-2xl shadow-lg ${col.glow} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              {/* Gradient background */}
              <div className={`bg-gradient-to-br ${col.gradient} p-5 h-full min-h-[180px] flex flex-col`}>

                {/* Top row: emoji + time/serving */}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300 leading-none drop-shadow-sm">
                    {col.emoji}
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 bg-black/20 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm"
                          style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <Clock className="w-2.5 h-2.5" /> {col.time}
                    </span>
                    <span className="flex items-center gap-1 bg-black/20 text-white/90 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm"
                          style={{ fontFamily: 'Manrope, sans-serif' }}>
                      <Users className="w-2.5 h-2.5" /> {col.serving}
                    </span>
                  </div>
                </div>

                {/* Title + subtitle */}
                <div className="flex-1">
                  <h4 className="text-white font-black text-[15px] md:text-base leading-tight drop-shadow-sm mb-0.5"
                      style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    {col.title}
                  </h4>
                  <p className="text-white/65 text-[11px] font-medium mb-3"
                     style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {col.sub}
                  </p>

                  {/* Ingredient chips */}
                  <div className="flex flex-wrap gap-1">
                    {col.items.map((item) => (
                      <span
                        key={item}
                        className="bg-black/25 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/10"
                        style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA row */}
                <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-white/75 text-[11px] font-semibold flex items-center gap-1 group-hover:text-white transition-colors"
                        style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    <ShoppingCart className="w-3 h-3" />
                    উপকরণ দেখুন
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>

                {/* Hover shine overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 rounded-2xl pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
