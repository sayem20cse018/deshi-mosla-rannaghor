'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface DBSlide {
  id: string; title: string|null; titleEn: string|null;
  subtitle: string|null; subtitleEn: string|null;
  tag: string|null; tagEn: string|null;
  badge: string|null; badgeEn: string|null;
  image: string|null; imageMobile: string|null;
  ctaLabel: string|null; ctaLabelEn: string|null; ctaUrl: string|null;
  cta2Label: string|null; cta2LabelEn: string|null; cta2Url: string|null;
  bgColor: string|null; emoji: string|null;
  isActive: boolean; sortOrder: number;
}

const FALLBACK: DBSlide[] = [
  { id:'f1', title:'আসল স্বাদ', titleEn:null, subtitle:'নির্বাচিত দেশি মসলা ও নিত্যপ্রয়োজনীয় পণ্য, এখন আপনার দরজায়।', subtitleEn:null, tag:'১০০% খাঁটি দেশীয় পণ্য', tagEn:null, badge:'৩০% পর্যন্ত ছাড়', badgeEn:null, image:null, imageMobile:null, ctaLabel:'এখনই কিনুন', ctaLabelEn:null, ctaUrl:'/shop', cta2Label:'রেসিপি দেখুন', cta2LabelEn:null, cta2Url:'/recipes', bgColor:'from-[#0a1f10] via-[#0f4c2a] to-[#1a6b3c]', emoji:'🌶️', isActive:true, sortOrder:0 },
  { id:'f2', title:'ঈদের রান্নার সব মসলা', titleEn:null, subtitle:'বিরিয়ানি, কোরমা, হালিম — সব রেসিপির জন্য প্রয়োজনীয় পণ্য।', subtitleEn:null, tag:'ঈদ স্পেশাল কালেকশন', tagEn:null, badge:'ফ্রি ডেলিভারি', badgeEn:null, image:null, imageMobile:null, ctaLabel:'কালেকশন দেখুন', ctaLabelEn:null, ctaUrl:'/shop', cta2Label:'অফার দেখুন', cta2LabelEn:null, cta2Url:'/shop', bgColor:'from-[#081a0e] via-[#0f4c2a] to-[#1b5e35]', emoji:'🍛', isActive:true, sortOrder:1 },
  { id:'f3', title:'প্রকৃতির শ্রেষ্ঠ উপহার', titleEn:null, subtitle:'সুন্দরবন থেকে সরাসরি সংগৃহীত খাঁটি মধু। কোনো মিশ্রণ নেই।', subtitleEn:null, tag:'সুন্দরবনের মধু', tagEn:null, badge:'স্টক সীমিত', badgeEn:null, image:null, imageMobile:null, ctaLabel:'মধু দেখুন', ctaLabelEn:null, ctaUrl:'/shop', cta2Label:'সব পণ্য', cta2LabelEn:null, cta2Url:'/shop', bgColor:'from-[#0a1f10] via-[#0f4c2a] to-[#2d6a3f]', emoji:'🍯', isActive:true, sortOrder:2 },
];

function useHeroSlides() {
  return useQuery({
    queryKey: ['hero-slides-public'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/banners/hero-slides');
        const slides = (data?.data ?? []) as DBSlide[];
        return slides.filter((s) => s.isActive);
      } catch {
        return [] as DBSlide[];
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
}

export function HeroBanner() {
  const { data: dbSlides } = useHeroSlides();
  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : FALLBACK;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  const s = slides[idx];
  const bg = s.bgColor ?? 'from-[#0a1f10] via-[#0f4c2a] to-[#1a6b3c]';

  return (
    <section className="relative overflow-hidden select-none z-0">
      <div className={`bg-gradient-to-r ${bg} transition-all duration-700 relative`} style={{ minHeight: 'clamp(300px,40vw,450px)' }}>
        <div className="container mx-auto px-4 h-full absolute inset-0 flex items-center" style={{ maxWidth: '100%' }}>
          <div className="w-full grid md:grid-cols-2 gap-8 items-center py-10 md:py-0">
            <div className="text-white space-y-4" key={idx}>
              <div className="flex items-center gap-2 flex-wrap">
                {(s.tag || s.tagEn) && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm" style={{ fontFamily: 'Noto Sans Bengali,Manrope,sans-serif' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
                    {s.tag ?? s.tagEn}
                  </span>
                )}
                {(s.badge || s.badgeEn) && (
                  <span className="inline-flex items-center bg-[#ea580c]/90 text-white text-[11px] font-black px-2.5 py-1 rounded-full" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                    {s.badge ?? s.badgeEn}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white/90" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                {s.title ?? s.titleEn}
              </h1>
              {(s.subtitle || s.subtitleEn) && (
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-md" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                  {s.subtitle ?? s.subtitleEn}
                </p>
              )}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href={s.ctaUrl ?? '/shop'} className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-[#ea580c]/30 transition-all hover:scale-105 active:scale-95" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                  <ShoppingBag className="w-4 h-4" />{s.ctaLabel ?? s.ctaLabelEn ?? 'Shop Now'}
                </Link>
                <Link href={s.cta2Url ?? '/shop'} className="inline-flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl text-sm transition-all backdrop-blur-sm" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                  {s.cta2Label ?? s.cta2LabelEn ?? 'View More'}<ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-1">
                {[{v:'৫০০+',l:'পণ্য'},{v:'১০হা+',l:'গ্রাহক'},{v:'৯৮%',l:'সন্তুষ্ট'}].map(({v,l}) => (
                  <div key={l} className="text-center">
                    <p className="text-white font-black text-xl leading-none" style={{ fontFamily: 'Manrope,sans-serif' }}>{v}</p>
                    <p className="text-white/50 text-[11px] mt-0.5" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center" key={`v${idx}`}>
              {s.image ? (
                <div className="relative w-[340px] h-[260px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image src={s.image} alt={s.title ?? ''} fill className="object-cover" sizes="340px" />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-64 h-64 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center">
                      <span className="text-[7rem] animate-float">{s.emoji ?? '🌶️'}</span>
                    </div>
                  </div>
                  {(s.badge||s.badgeEn) && (
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-[#ea580c] rounded-full flex flex-col items-center justify-center shadow-xl shadow-[#ea580c]/40">
                      <span className="text-white font-black text-[9px] leading-tight text-center px-1" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>{s.badge??s.badgeEn}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {slides.length > 1 && (
          <>
            <button onClick={() => setIdx((idx-1+slides.length)%slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setIdx((idx+1)%slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all z-10">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_,i) => (
            <button key={i} onClick={() => setIdx(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i===idx?'w-6 bg-[#ea580c]':'w-1.5 bg-white/35'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}