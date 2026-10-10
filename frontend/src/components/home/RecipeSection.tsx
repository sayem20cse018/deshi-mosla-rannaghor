'use client';

import Link from 'next/link';
import { ChefHat, ArrowRight, Clock, Users, ShoppingCart } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';

const RECIPES = [
  { slug: 'kacchi-biryani',      name: 'কাচ্চি বিরিয়ানি',  emoji: '🍛', time: '৭৫ মিনিট', serving: '৬ জন', difficulty: 'কঠিন',   diffColor: 'text-red-500'    },
  { slug: 'macher-jhol',         name: 'মাছের ঝোল',          emoji: '🐟', time: '৪০ মিনিট', serving: '৪ জন', difficulty: 'সহজ',    diffColor: 'text-green-600'  },
  { slug: 'gorur-mangser-kari',  name: 'গরুর মাংস কারি',     emoji: '🥩', time: '৬৫ মিনিট', serving: '৫ জন', difficulty: 'মাঝারি', diffColor: 'text-amber-600'  },
  { slug: 'mug-daler-khichuri',  name: 'মুগ ডালের খিচুড়ি',  emoji: '🍲', time: '৫০ মিনিট', serving: '৪ জন', difficulty: 'সহজ',    diffColor: 'text-green-600'  },
  { slug: 'ilish-shorshe',       name: 'ইলিশ সরিষা',          emoji: '🐠', time: '৩৫ মিনিট', serving: '৪ জন', difficulty: 'মাঝারি', diffColor: 'text-amber-600'  },
  { slug: 'dim-bhorta',          name: 'ডিম ভর্তা',           emoji: '🥚', time: '২০ মিনিট', serving: '২ জন', difficulty: 'সহজ',    diffColor: 'text-green-600'  },
];

export function RecipeSection() {
  return (
    <section className="section-wrap bg-gradient-to-br from-brand-50 to-emerald-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <ChefHat className="w-3.5 h-3.5" /> রেসিপি শপিং
          </span>
          <h2 className="section-title">আজ কী রান্না করবেন?</h2>
          <p className="section-sub max-w-md mx-auto mt-1">
            রেসিপি বেছে নিন, প্রয়োজনীয় সব উপকরণ এক ক্লিকে কার্টে যোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {RECIPES.map((r) => (
            <Link
              key={r.slug}
              href={`/recipes/${r.slug}`}
              className="group bg-white rounded-2xl border border-brand-100 hover:border-brand-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Emoji area */}
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 p-4 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300 leading-none">
                  {r.emoji}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-gray-800 font-bold text-sm leading-tight group-hover:text-brand-700 transition-colors">
                  {r.name}
                </p>
                <div className="flex items-center gap-2 mt-2 text-gray-400 text-[10px]">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" /> {r.time}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5" /> {r.serving}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold ${r.diffColor} mt-1 block`}>
                  {r.difficulty}
                </span>
                <button className="mt-2 w-full flex items-center justify-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 text-[10px] font-semibold py-1.5 rounded-lg transition-colors">
                  <ShoppingCart className="w-2.5 h-2.5" /> উপকরণ কিনুন
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-6">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 btn-primary px-6 py-2.5"
          >
            সব রেসিপি দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
