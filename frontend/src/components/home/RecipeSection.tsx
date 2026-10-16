'use client';

import Link from 'next/link';
import { ChefHat, ArrowRight, Clock, Users, ShoppingCart } from 'lucide-react';

const RECIPES = [
  { slug: 'kacchi-biryani',       name: 'কাচ্চি বিরিয়ানি', emoji: '🍛', time: '৭৫ মিনিট', serving: '৬ জন', difficulty: 'কঠিন',   diffColor: 'text-red-500' },
  { slug: 'macher-jhol',          name: 'মাছের ঝোল',        emoji: '🐟', time: '৪০ মিনিট', serving: '৪ জন', difficulty: 'সহজ',    diffColor: 'text-green-600' },
  { slug: 'gorur-mangser-kari',   name: 'গরুর মাংস কারি',   emoji: '🥩', time: '৬৫ মিনিট', serving: '৫ জন', difficulty: 'মাঝারি', diffColor: 'text-amber-600' },
  { slug: 'mug-daler-khichuri',   name: 'মুগ ডালের খিচুড়ি', emoji: '🍲', time: '৫০ মিনিট', serving: '৪ জন', difficulty: 'সহজ',    diffColor: 'text-green-600' },
  { slug: 'ilish-shorshe',        name: 'ইলিশ সরিষা',       emoji: '🐠', time: '৩৫ মিনিট', serving: '৪ জন', difficulty: 'মাঝারি', diffColor: 'text-amber-600' },
  { slug: 'dim-bhorta',           name: 'ডিম ভর্তা',         emoji: '🥚', time: '২০ মিনিট', serving: '২ জন', difficulty: 'সহজ',    diffColor: 'text-green-600' },
];

export function RecipeSection() {
  return (
    <section className="section-wrap bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5]">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#0f4c2a] text-xs font-semibold px-3 py-1.5 rounded-full mb-3"
                style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            <ChefHat className="w-3.5 h-3.5" /> রেসিপি শপিং
          </span>
          <h2 className="section-title" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>আজ কী রান্না করবেন?</h2>
          <p className="section-sub max-w-md mx-auto mt-1" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            রেসিপি বেছে নিন, প্রয়োজনীয় সব উপকরণ এক ক্লিকে কার্টে যোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {RECIPES.map((r) => (
            <Link
              key={r.slug}
              href={`/blog`}
              className="group bg-white rounded-2xl border border-gray-100 hover:border-[#ea580c]/30 hover:shadow-lg transition-all duration-200 overflow-hidden"
            >
              {/* Emoji area */}
              <div className="bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-4 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300 leading-none">
                  {r.emoji}
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-gray-800 font-bold text-sm leading-tight group-hover:text-[#0f4c2a] transition-colors"
                   style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
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
                <span className={`text-[10px] font-semibold ${r.diffColor} mt-1 block`}
                      style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                  {r.difficulty}
                </span>
                {/* span instead of button (was nested button inside Link — invalid HTML) */}
                <span className="mt-2 w-full flex items-center justify-center gap-1 bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#0f4c2a] text-[10px] font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                      style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                  <ShoppingCart className="w-2.5 h-2.5" /> উপকরণ কিনুন
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-6">
          <Link href="/blog"
            className="inline-flex items-center gap-2 bg-[#0f4c2a] hover:bg-[#0a3d22] text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
            style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
            ব্লগ ও রেসিপি দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
