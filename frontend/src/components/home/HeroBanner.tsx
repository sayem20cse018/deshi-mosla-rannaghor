'use client';

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, Truck, Shield, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

const SLIDES = [
  {
    badge: '১০০% খাঁটি দেশীয় পণ্য',
    heading: ['প্রতিটি রান্নায়', 'আসল স্বাদ'],
    accent: 'আসল স্বাদ',
    sub: 'নির্বাচিত দেশি মসলা ও নিত্যপ্রয়োজনীয় পণ্য, এখন আপনার দরজায়। ঘরে বসে অর্ডার করুন।',
    cta: { label: 'এখনই কিনুন', href: '/shop' },
    cta2: { label: 'রেসিপি দেখুন', href: '/recipes' },
    emoji: '🌶️',
    bg: 'from-brand-950 via-brand-900 to-brand-800',
    badge2: '৩০% পর্যন্ত ছাড়',
  },
  {
    badge: 'রমজান স্পেশাল কালেকশন',
    heading: ['ঈদের রান্নার', 'সব মসলা'],
    accent: 'সব মসলা',
    sub: 'বিরিয়ানি, কোরমা, হালিম — সব রেসিপির জন্য প্রয়োজনীয় পণ্য একসাথে পাচ্ছেন।',
    cta: { label: 'কালেকশন দেখুন', href: '/recipes/kacchi-biryani' },
    cta2: { label: 'অফার দেখুন', href: '/offers' },
    emoji: '🍛',
    bg: 'from-spice-900 via-spice-800 to-amber-800',
    badge2: 'ফ্রি ডেলিভারি',
  },
  {
    badge: 'সুন্দরবনের খাঁটি মধু',
    heading: ['প্রকৃতির শ্রেষ্ঠ', 'উপহার'],
    accent: 'উপহার',
    sub: 'সুন্দরবন থেকে সরাসরি সংগৃহীত খাঁটি মধু। কোনো মেশানো নেই, কোনো রং নেই।',
    cta: { label: 'মধু দেখুন', href: '/category/modhu' },
    cta2: { label: 'সব পণ্য', href: '/shop' },
    emoji: '🍯',
    bg: 'from-amber-950 via-amber-900 to-yellow-900',
    badge2: 'স্টক সীমিত',
  },
];

const TRUST = [
  { icon: Star,        label: '৪.৮★ রেটিং',   sub: '১০,০০০+ রিভিউ' },
  { icon: Truck,       label: 'দ্রুত ডেলিভারি', sub: 'সারাদেশে' },
  { icon: Shield,      label: '১০০% খাঁটি',    sub: 'গ্যারান্টিড' },
  { icon: RefreshCcw,  label: 'সহজ রিটার্ন',   sub: '৭ দিনের মধ্যে' },
];

export function HeroBanner() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[idx];

  return (
    <div className="relative overflow-hidden">
      {/* Main slide */}
      <div className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}>
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* Left — text */}
            <div className="text-white space-y-5 animate-fade-up" key={idx}>
              {/* Top badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-spice-400 rounded-full animate-pulse" />
                {slide.badge}
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {slide.heading[0]}
                <br />
                <span className="text-spice-400">{slide.heading[1]}</span>
              </h1>

              <p className="text-white/75 text-sm md:text-base leading-relaxed max-w-md">
                {slide.sub}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={slide.cta.href}
                  className="inline-flex items-center gap-2 bg-spice-500 hover:bg-spice-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-spice-500/30 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {slide.cta.label}
                </Link>
                <Link
                  href={slide.cta2.href}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200 backdrop-blur-sm"
                >
                  {slide.cta2.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2">
                {[
                  { value: '৫০০+', label: 'পণ্য' },
                  { value: '১০হাজার+', label: 'গ্রাহক' },
                  { value: '৫ বছর', label: 'অভিজ্ঞতা' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-white font-bold text-lg leading-none">{s.value}</p>
                    <p className="text-white/60 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual */}
            <div className="flex items-center justify-center relative" key={`e-${idx}`}>
              <div className="relative">
                {/* Glow ring */}
                <div className="w-52 h-52 md:w-72 md:h-72 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/8 border border-white/15 flex items-center justify-center">
                    <span className="text-8xl md:text-9xl animate-fade-up">{slide.emoji}</span>
                  </div>
                </div>
                {/* Discount badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-spice-500 rounded-full flex flex-col items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xs leading-none">{slide.badge2}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-6 bg-spice-400' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Trust badges bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-3.5 px-4">
                <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-brand-700" />
                </div>
                <div>
                  <p className="text-gray-800 font-semibold text-sm leading-tight">{label}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
