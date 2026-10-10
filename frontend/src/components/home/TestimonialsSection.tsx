'use client';

import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { StarRating } from '@/components/ui/StarRating';

const TESTIMONIALS = [
  { name: 'তানজিলা আক্তার',    role: 'গৃহিণী, ঢাকা',         rating: 5, comment: 'অসাধারণ মানের মসলা! রান্নায় সত্যিকারের দেশীয় স্বাদ পাচ্ছি। বিশেষ করে সরিষার তেলের ঘ্রাণ ও স্বাদটা অনন্য। পরিবারের সবাই পছন্দ করেছে।', initial: 'ত', color: 'bg-pink-100 text-pink-700'   },
  { name: 'মোঃ রফিকুল ইসলাম', role: 'ব্যবসায়ী, চট্টগ্রাম',  rating: 5, comment: 'দ্রুত ডেলিভারি এবং পণ্যের গুণমান চমৎকার। অনলাইনে এত ভালো মান আশা করিনি। নিয়মিত অর্ডার করি এখন।',                                           initial: 'র', color: 'bg-blue-100 text-blue-700'   },
  { name: 'নাফিসা খানম',       role: 'শিক্ষার্থী, রাজশাহী', rating: 4, comment: 'অনলাইনে মসলা কিনতে প্রথমে দ্বিধা ছিল, কিন্তু প্যাকেজিং ও মান দেখে মুগ্ধ হয়েছি। বিশেষ করে খেজুরের গুড় অসাধারণ।',                           initial: 'ন', color: 'bg-purple-100 text-purple-700'},
  { name: 'আব্দুল কাদের',      role: 'প্রবাসী, মালয়েশিয়া', rating: 5, comment: 'পরিবারের জন্য দেশি মসলা পাঠাই। মানের কোনো আপোস নেই। বিদেশে থেকেও দেশের স্বাদ পাওয়া যাচ্ছে।',                                                  initial: 'আ', color: 'bg-green-100 text-green-700'  },
  { name: 'শামীমা বেগম',       role: 'গৃহিণী, সিলেট',        rating: 5, comment: 'সুন্দরবনের মধু নিলাম। সম্পূর্ণ খাঁটি। আর দেশি হলুদ গুঁড়া সত্যিই কৃত্রিম রং ছাড়া। এরকম বিশ্বস্ত ব্র্যান্ড দরকার ছিল।',                   initial: 'শ', color: 'bg-amber-100 text-amber-700'  },
  { name: 'হাসান মাহমুদ',      role: 'উদ্যোক্তা, খুলনা',    rating: 5, comment: 'বন্ধুর পরামর্শে প্রথমবার অর্ডার করেছিলাম। এখন আর অন্য কোথাও যাই না। রেসিপি শপিং ফিচারটা দারুণ কাজে আসে।',                                   initial: 'হ', color: 'bg-teal-100 text-teal-700'    },
];

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const visible = 3;
  const pages = Math.ceil(TESTIMONIALS.length / visible);
  const currentPage = Math.floor(idx / visible);

  const prev = () => setIdx(Math.max(0, idx - visible));
  const next = () => setIdx(Math.min(TESTIMONIALS.length - visible, idx + visible));

  const shown = TESTIMONIALS.slice(idx, idx + visible);

  return (
    <section className="section-wrap bg-gradient-to-br from-brand-900 to-brand-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-brand-300 text-xs font-semibold uppercase tracking-widest">রিভিউ</span>
            <h2 className="section-title text-white mt-1">আমাদের গ্রাহকদের কথা</h2>
            <p className="text-brand-300 text-sm mt-1">১০,০০০+ সন্তুষ্ট গ্রাহকের মধ্য থেকে কিছু অভিজ্ঞতা</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="btn-icon bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={idx + visible >= TESTIMONIALS.length}
              className="btn-icon bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shown.map((t, i) => (
            <div
              key={t.name}
              className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col gap-4 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quote className="w-6 h-6 text-spice-400 flex-shrink-0" />
              <p className="text-white/85 text-sm leading-relaxed flex-1">"{t.comment}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}>
                  {t.initial}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-brand-400 text-xs">{t.role}</p>
                </div>
                <div className="ml-auto">
                  <StarRating rating={t.rating} showCount={false} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i * visible)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentPage ? 'w-6 bg-spice-400' : 'w-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Summary bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '৪.৮/৫', label: 'গড় রেটিং' },
            { value: '১০হা+', label: 'সন্তুষ্ট গ্রাহক' },
            { value: '৯৮%', label: 'পুনরায় অর্ডার' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-white text-2xl font-bold">{s.value}</p>
              <p className="text-brand-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
