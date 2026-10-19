'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'তানজিলা আক্তার',
    role: 'গৃহিণী',
    location: 'ঢাকা',
    rating: 5,
    comment: 'অসাধারণ মানের মসলা! রান্নায় সত্যিকারের দেশীয় স্বাদ পাচ্ছি। বিশেষ করে সরিষার তেলের ঘ্রাণ ও স্বাদটা অনন্য। পরিবারের সবাই পছন্দ করেছে।',
    initial: 'ত',
    avatarBg: '#fce7f3',
    avatarColor: '#9d174d',
  },
  {
    name: 'মোঃ রফিকুল ইসলাম',
    role: 'ব্যবসায়ী',
    location: 'চট্টগ্রাম',
    rating: 5,
    comment: 'দ্রুত ডেলিভারি এবং পণ্যের গুণমান চমৎকার। অনলাইনে এত ভালো মান আশা করিনি। নিয়মিত অর্ডার করি এখন।',
    initial: 'র',
    avatarBg: '#dbeafe',
    avatarColor: '#1d4ed8',
  },
  {
    name: 'নাফিসা খানম',
    role: 'শিক্ষার্থী',
    location: 'রাজশাহী',
    rating: 4,
    comment: 'অনলাইনে মসলা কিনতে প্রথমে দ্বিধা ছিল, কিন্তু প্যাকেজিং ও মান দেখে মুগ্ধ হয়েছি। বিশেষ করে খেজুরের গুড় অসাধারণ।',
    initial: 'ন',
    avatarBg: '#ede9fe',
    avatarColor: '#6d28d9',
  },
  {
    name: 'আব্দুল কাদের',
    role: 'প্রবাসী',
    location: 'মালয়েশিয়া',
    rating: 5,
    comment: 'পরিবারের জন্য দেশি মসলা পাঠাই। মানের কোনো আপোস নেই। বিদেশে থেকেও দেশের স্বাদ পাওয়া যাচ্ছে।',
    initial: 'আ',
    avatarBg: '#d1fae5',
    avatarColor: '#065f46',
  },
  {
    name: 'শামীমা বেগম',
    role: 'গৃহিণী',
    location: 'সিলেট',
    rating: 5,
    comment: 'সুন্দরবনের মধু নিলাম। সম্পূর্ণ খাঁটি। আর দেশি হলুদ গুঁড়া সত্যিই কৃত্রিম রং ছাড়া। এরকম বিশ্বস্ত ব্র্যান্ড দরকার ছিল।',
    initial: 'শ',
    avatarBg: '#fef3c7',
    avatarColor: '#92400e',
  },
  {
    name: 'হাসান মাহমুদ',
    role: 'উদ্যোক্তা',
    location: 'খুলনা',
    rating: 5,
    comment: 'বন্ধুর পরামর্শে প্রথমবার অর্ডার করেছিলাম। এখন আর অন্য কোথাও যাই না। রেসিপি শপিং ফিচারটা দারুণ কাজে আসে।',
    initial: 'হ',
    avatarBg: '#ccfbf1',
    avatarColor: '#0f766e',
  },
];

const VISIBLE = 4;

export function TestimonialsSection() {
  const [idx, setIdx] = useState(0);

  const pages    = Math.ceil(TESTIMONIALS.length / VISIBLE);
  const curPage  = Math.floor(idx / VISIBLE);
  const shown    = TESTIMONIALS.slice(idx, idx + VISIBLE);
  const canPrev  = idx > 0;
  const canNext  = idx + VISIBLE < TESTIMONIALS.length;

  return (
    <section className="py-14 bg-white" style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: '#ea580c' }}>
              গ্রাহকদের মতামত
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
              Loved by 50K Plus Customers
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">১০,০০০+ সন্তুষ্ট গ্রাহকের মধ্য থেকে কিছু অভিজ্ঞতা</p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setIdx(i => Math.max(0, i - VISIBLE))} disabled={!canPrev}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setIdx(i => Math.min(TESTIMONIALS.length - VISIBLE, i + VISIBLE))} disabled={!canNext}
              className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#ea580c] hover:text-[#ea580c] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shown.map((t, i) => (
            <div key={t.name}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', animationDelay: `${i * 60}ms` }}>

              {/* Quote icon + stars */}
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                     style={{ background: '#fff7ed' }}>
                  <Quote className="w-4 h-4" style={{ color: '#ea580c' }} />
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-3.5 h-3.5"
                      style={{ fill: s <= t.rating ? '#f59e0b' : '#e5e7eb', color: s <= t.rating ? '#f59e0b' : '#e5e7eb' }} />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4"
                 style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* User */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                     style={{ background: t.avatarBg, color: t.avatarColor }}>
                  {t.initial}
                </div>
                <div className="min-w-0">
                  <p className="text-gray-900 font-semibold text-sm leading-tight truncate"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{t.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i * VISIBLE)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === curPage ? '24px' : '6px', background: i === curPage ? '#ea580c' : '#d1d5db' }} />
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4 text-center max-w-sm mx-auto">
          {[
            { value: '৪.৮/৫', label: 'গড় রেটিং' },
            { value: '৫০হা+', label: 'গ্রাহক' },
            { value: '৯৮%', label: 'সন্তুষ্ট' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-gray-900 text-2xl font-black" style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</p>
              <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
