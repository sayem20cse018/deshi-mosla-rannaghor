'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const SLIDES = [
  {
    tag: '১০০% খাঁটি দেশীয় পণ্য',
    discount: '৩০% পর্যন্ত ছাড়',
    heading1: 'প্রতিটি রান্নায়',
    heading2: 'আসল স্বাদ',
    sub: 'নির্বাচিত দেশি মসলা ও নিত্যপ্রয়োজনীয় পণ্য, এখন আপনার দরজায়।',
    cta: { label: 'এখনই কিনুন', href: '/shop' },
    cta2: { label: 'রেসিপি দেখুন', href: '/blog' },
    emoji: '🌶️',
    color: 'from-[#0a1f10] via-[#0f4c2a] to-[#1a6b3c]',
    dot: 'bg-green-400',
  },
  {
    tag: 'ঈদ স্পেশাল কালেকশন',
    discount: 'ফ্রি ডেলিভারি',
    heading1: 'ঈদের রান্নার',
    heading2: 'সব মসলা',
    sub: 'বিরিয়ানি, কোরমা, হালিম — সব রেসিপির জন্য প্রয়োজনীয় পণ্য।',
    cta: { label: 'কালেকশন দেখুন', href: '/shop' },
    cta2: { label: 'অফার দেখুন', href: '/shop' },
    emoji: '🍛',
    color: 'from-[#081a0e] via-[#0f4c2a] to-[#1b5e35]',
    dot: 'bg-emerald-400',
  },
  {
    tag: 'সুন্দরবনের মধু',
    discount: 'স্টক সীমিত',
    heading1: 'প্রকৃতির শ্রেষ্ঠ',
    heading2: 'উপহার',
    sub: 'সুন্দরবন থেকে সরাসরি সংগৃহীত খাঁটি মধু। কোনো মিশ্রণ নেই।',
    cta: { label: 'মধু দেখুন', href: '/shop' },
    cta2: { label: 'সব পণ্য', href: '/shop' },
    emoji: '🍯',
    color: 'from-[#0a1f10] via-[#0f4c2a] to-[#2d6a3f]',
    dot: 'bg-teal-400',
  },
];

export function HeroBanner() {
  const [idx,  setIdx]  = useState(0);
  const [prev, setPrev] = useState(0);
  const [dir,  setDir]  = useState<'left' | 'right'>('right');

  function go(next: number) {
    setPrev(idx);
    setDir(next > idx ? 'right' : 'left');
    setIdx(next);
  }

  useEffect(() => {
    const t = setInterval(() => {
      setPrev(idx);
      setDir('right');
      setIdx((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(t);
  }, [idx]);

  const slide = SLIDES[idx];

  return (
    // z-0 ensures the hero never overlaps the sticky header/dropdown
    <section className="relative overflow-hidden select-none z-0">
      {/* BG gradient — exact heights: mobile 300px, tablet 400px, desktop 450px */}
      <div
        className={`bg-gradient-to-r ${slide.color} transition-all duration-700 relative`}
        style={{ minHeight: 'clamp(300px, 40vw, 450px)' }}
      >
        {/* Use full-height container so content is always centred */}
        <div
          className="container mx-auto px-4 h-full absolute inset-0 flex items-center"
          style={{ maxWidth: '100%' }}
        >
          <div className="w-full grid md:grid-cols-2 gap-8 items-center py-10 md:py-0">

            {/* Text */}
            <div className="text-white space-y-4 animate-fade-up" key={idx}>
              {/* Tags row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm"
                      style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                  {slide.tag}
                </span>
                <span className="inline-flex items-center bg-[#ea580c]/90 text-white text-[11px] font-black px-2.5 py-1 rounded-full"
                      style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  🎁 {slide.discount}
                </span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white/90"
                    style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  {slide.heading1}
                </h1>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-[#fb923c] mt-1"
                    style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  {slide.heading2}
                </h1>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md"
                 style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href={slide.cta.href}
                  className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#ea580c]/30 transition-all hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  <ShoppingBag className="w-4 h-4" />
                  {slide.cta.label}
                </Link>
                <Link href={slide.cta2.href}
                  className="inline-flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all backdrop-blur-sm"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  {slide.cta2.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-1">
                {[
                  { v: '৫০০+', l: 'পণ্য' },
                  { v: '১০হা+', l: 'গ্রাহক' },
                  { v: '৯৮%', l: 'সন্তুষ্ট' },
                ].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <p className="text-white font-black text-xl leading-none"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>{v}</p>
                    <p className="text-white/50 text-[11px] mt-0.5"
                       style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emoji visual — desktop only */}
            <div className="hidden md:flex items-center justify-center" key={`e${idx}`}>
              <div className="relative">
                <div className="w-64 h-64 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center">
                    <span className="text-[7rem] animate-float">{slide.emoji}</span>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#ea580c] rounded-full flex flex-col items-center justify-center shadow-xl shadow-[#ea580c]/40">
                  <span className="text-white font-black text-[9px] leading-tight text-center px-1"
                        style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{slide.discount}</span>
                </div>
                <div className="absolute top-6 left-0 w-3 h-3 rounded-full bg-[#ea580c]/50 animate-pulse" />
                <div className="absolute bottom-10 right-2 w-2 h-2 rounded-full bg-amber-400/50 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button onClick={() => go((idx - 1 + SLIDES.length) % SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => go((idx + 1) % SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-10">
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? `w-6 ${s.dot}` : 'w-1.5 bg-white/35'}`} />
          ))}
        </div>
      </div>

      {/* Trust bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {[
              { e: '🌿', t: '১০০% খাঁটি পণ্য',  s: 'কোনো কৃত্রিম উপাদান নেই' },
              { e: '🚚', t: 'দ্রুত ডেলিভারি',    s: 'সারাদেশে হোম ডেলিভারি' },
              { e: '🔒', t: 'নিরাপদ পেমেন্ট',   s: 'bKash • Nagad • COD' },
              { e: '💬', t: '২৪/৭ সাপোর্ট',    s: 'WhatsApp সহায়তা' },
            ].map(({ e, t, s }) => (
              <div key={t} className="flex items-center gap-3 py-3.5 px-4">
                <span className="text-2xl flex-shrink-0">{e}</span>
                <div className="min-w-0">
                  <p className="text-gray-800 font-bold text-xs leading-tight"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{t}</p>
                  <p className="text-gray-400 text-[11px] mt-0.5 truncate"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{s}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
