'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface DBSlide {
  id: string;
  title: string | null; titleEn: string | null;
  subtitle: string | null; subtitleEn: string | null;
  tag: string | null; tagEn: string | null;
  badge: string | null; badgeEn: string | null;
  image: string | null; imageMobile: string | null;
  ctaLabel: string | null; ctaLabelEn: string | null; ctaUrl: string | null;
  cta2Label: string | null; cta2LabelEn: string | null; cta2Url: string | null;
  bgColor: string | null; emoji: string | null;
  isActive: boolean; sortOrder: number;
}


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
  const slides = dbSlides ?? [];
  const [idx, setIdx] = useState(0);

  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((next: number) => {
    if (animating) return;
    setAnimating(true);
    setIdx(next);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => goTo((idx + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [idx, slides.length, goTo]);

  // No slides yet — render skeleton banner while loading or when CMS is empty
  if (!slides.length) {
    return (
      <section
        className="relative w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse"
        style={{ height: 'clamp(480px, 80vh, 860px)' }}
        aria-label="Loading banner"
      />
    );
  }

  const s = slides[idx];
  const bg = s.bgColor ?? 'from-[#0a1f10] via-[#0f4c2a] to-[#1a6b3c]';
  const titleText  = s.title   ?? s.titleEn;
  const subText    = s.subtitle ?? s.subtitleEn;
  const tagText    = s.tag     ?? s.tagEn;
  const badgeText  = s.badge   ?? s.badgeEn;
  const cta1Label  = s.ctaLabel  ?? s.ctaLabelEn  ?? 'Shop Now';
  const cta2Label  = s.cta2Label ?? s.cta2LabelEn ?? 'View More';

  return (
    <section
      className="relative w-full overflow-hidden select-none z-0"
      style={{ height: 'clamp(480px, 80vh, 860px)' }}
    >
      {/* ── Background: full-bleed image or gradient ────────────────────── */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${bg} transition-opacity duration-700`}
        key={`bg-${idx}`}
      />

      {/* Full-bleed background image (object-cover) */}
      {s.image && (
        <div className="absolute inset-0">
          <Image
            src={s.image}
            alt={titleText ?? ''}
            fill
            priority
            className="object-cover transition-opacity duration-700"
            sizes="100vw"
            quality={90}
          />
          {/* Dark overlay so text stays readable over any image */}
          <div className="absolute inset-0 bg-black/45" />
        </div>
      )}

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(234,88,12,0.12) 0%, transparent 60%)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative h-full flex items-center z-10">
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Text block */}
            <div
              className="text-white space-y-5 lg:space-y-6"
              key={`text-${idx}`}
              style={{ animation: 'fadeUp 0.5s ease both' }}
            >
              {/* Tag + Badge */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {tagText && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-sm"
                    style={{ fontFamily: 'Noto Sans Bengali,Manrope,sans-serif' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse flex-shrink-0" />
                    {tagText}
                  </span>
                )}
                {badgeText && (
                  <span
                    className="inline-flex items-center bg-[#ea580c] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg shadow-[#ea580c]/30"
                    style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Headline */}
              {titleText && (
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight text-white drop-shadow-sm"
                  style={{ fontFamily: 'Noto Sans Bengali,Manrope,sans-serif' }}
                >
                  {titleText}
                </h1>
              )}

              {/* Subtitle */}
              {subText && (
                <p
                  className="text-white/75 text-base md:text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}
                >
                  {subText}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={s.ctaUrl ?? '/shop'}
                  className="inline-flex items-center gap-2.5 bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] text-white font-bold px-7 py-4 rounded-2xl text-sm md:text-base shadow-xl shadow-[#ea580c]/35 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}
                >
                  <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                  {cta1Label}
                </Link>
                <Link
                  href={s.cta2Url ?? '/shop'}
                  className="inline-flex items-center gap-2.5 border-2 border-white/30 bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold px-7 py-4 rounded-2xl text-sm md:text-base transition-all duration-200 backdrop-blur-sm hover:border-white/50"
                  style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}
                >
                  {cta2Label}
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2">
                {[{ v: '500+', l: 'Products' }, { v: '10K+', l: 'Customers' }, { v: '98%', l: 'Satisfied' }].map(({ v, l }) => (
                  <div key={l} className="text-center">
                    <p
                      className="text-white font-black text-2xl leading-none"
                      style={{ fontFamily: 'Manrope,sans-serif' }}
                    >
                      {v}
                    </p>
                    <p
                      className="text-white/50 text-xs mt-1"
                      style={{ fontFamily: 'Manrope,Noto Sans Bengali,sans-serif' }}
                    >
                      {l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual — emoji orb when no image set */}
            {!s.image && (
              <div
                className="hidden lg:flex items-center justify-center"
                key={`orb-${idx}`}
                style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}
              >
                <div className="relative">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full bg-[#ea580c]/20 blur-3xl scale-110" />
                  <div className="relative w-72 h-72 xl:w-80 xl:h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <div className="w-56 h-56 xl:w-64 xl:h-64 rounded-full bg-white/[0.07] border border-white/10 flex items-center justify-center">
                      <span className="text-[8rem] xl:text-[9rem] select-none" style={{ lineHeight: 1 }}>
                        {s.emoji ?? '🌶️'}
                      </span>
                    </div>
                  </div>
                  {/* Floating badge */}
                  {badgeText && (
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#ea580c] rounded-full flex flex-col items-center justify-center shadow-2xl shadow-[#ea580c]/40">
                      <span
                        className="text-white font-black text-[9px] leading-tight text-center px-1"
                        style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}
                      >
                        {badgeText}
                      </span>
                    </div>
                  )}
                  {/* Decorative dots */}
                  <span className="absolute top-8 left-0 w-3 h-3 rounded-full bg-[#ea580c]/40 animate-pulse" />
                  <span className="absolute bottom-12 right-0 w-2 h-2 rounded-full bg-amber-400/40 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Prev / Next arrows ────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo((idx - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/10 hover:border-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo((idx + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/25 hover:bg-black/50 text-white flex items-center justify-center transition-all backdrop-blur-sm border border-white/10 hover:border-white/30"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}

      {/* ── Dot indicators ─────────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width:  i === idx ? '28px' : '8px',
                height: '8px',
                background: i === idx ? '#ea580c' : 'rgba(255,255,255,0.35)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <div className="absolute bottom-6 right-8 z-20 hidden lg:flex items-center gap-1.5 text-white/30 text-xs font-semibold">
        <span style={{ fontFamily: 'Manrope,sans-serif' }}>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
          <path d="M8 3v10M8 13l-3-3M8 13l3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Slide counter ─────────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div
          className="absolute top-6 right-6 z-20 text-white/40 text-xs font-bold tabular-nums hidden sm:block"
          style={{ fontFamily: 'Manrope,sans-serif' }}
        >
          {String(idx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      )}
    </section>
  );
}
