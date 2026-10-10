import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const COLLECTIONS = [
  {
    slug: 'kacchi-biryani',
    title: 'কাচ্চি বিরিয়ানি',
    sub: 'মোট ৯টি উপকরণ',
    emoji: '🍛',
    bg: 'from-amber-500 to-orange-500',
    items: ['বাসমতি চাল', 'বিরিয়ানি মসলা', 'সরিষার তেল'],
  },
  {
    slug: 'macher-jhol',
    title: 'মাছের ঝোল',
    sub: 'মোট ৮টি উপকরণ',
    emoji: '🐟',
    bg: 'from-cyan-500 to-blue-500',
    items: ['সরিষার তেল', 'হলুদ গুঁড়া', 'মরিচ গুঁড়া'],
  },
  {
    slug: 'gorur-mangser-kari',
    title: 'গরুর মাংস কারি',
    sub: 'মোট ৮টি উপকরণ',
    emoji: '🥩',
    bg: 'from-red-500 to-rose-600',
    items: ['মাংসের মসলা', 'গরম মসলা', 'সরিষার তেল'],
  },
  {
    slug: 'mug-daler-khichuri',
    title: 'মুগ ডালের খিচুড়ি',
    sub: 'মোট ৭টি উপকরণ',
    emoji: '🍲',
    bg: 'from-green-500 to-emerald-600',
    items: ['মিনিকেট চাল', 'মুগ ডাল', 'হলুদ গুঁড়া'],
  },
  {
    slug: 'ilish-shorshe',
    title: 'ইলিশ সরিষা',
    sub: 'মোট ৭টি উপকরণ',
    emoji: '🐠',
    bg: 'from-violet-500 to-purple-600',
    items: ['সরিষার তেল', 'হলুদ গুঁড়া', 'মরিচ গুঁড়া'],
  },
  {
    slug: 'dim-bhorta',
    title: 'ডিম ভর্তা',
    sub: 'মোট ৬টি উপকরণ',
    emoji: '🥚',
    bg: 'from-yellow-400 to-amber-500',
    items: ['সরিষার তেল', 'মরিচ গুঁড়া', 'লবণ'],
  },
];

export function CookingCollections() {
  return (
    <section className="section-wrap bg-white">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="কিউরেটেড কালেকশন"
          subtitle="সম্পূর্ণ রেসিপির সব উপকরণ একসাথে কার্টে যোগ করুন"
          accent="রান্নার কালেকশন"
          href="/recipes"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/recipes/${col.slug}`}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* Background gradient */}
              <div className={`bg-gradient-to-br ${col.bg} p-5 h-full min-h-[140px] flex flex-col justify-between`}>
                {/* Emoji */}
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {col.emoji}
                </div>

                <div>
                  <h4 className="text-white font-bold text-base leading-tight">{col.title}</h4>
                  <p className="text-white/70 text-xs mt-0.5">{col.sub}</p>

                  {/* Ingredient chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {col.items.map((item) => (
                      <span key={item} className="bg-black/20 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-3 flex items-center gap-1 text-white/80 text-xs font-medium group-hover:text-white transition-colors">
                  উপকরণ দেখুন <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
