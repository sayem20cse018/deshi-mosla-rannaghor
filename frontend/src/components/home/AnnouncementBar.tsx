'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Truck, Tag, Gift, Zap, Phone } from 'lucide-react';
import Link from 'next/link';

const MESSAGES = [
  {
    icon: Truck,
    text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি',
    en: 'Free delivery on orders over ৳1000',
    color: 'text-emerald-300',
    link: '/shop',
  },
  {
    icon: Tag,
    text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',
    en: 'Code WELCOME10 — 10% off for new customers',
    color: 'text-yellow-300',
    link: '/shop',
  },
  {
    icon: Gift,
    text: 'ক্যাশ অন ডেলিভারি | bKash | Nagad সুবিধা উপলব্ধ',
    en: 'COD | bKash | Nagad payment available',
    color: 'text-pink-300',
    link: '/checkout',
  },
  {
    icon: Zap,
    text: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে অর্ডার করুন',
    en: 'Same-day delivery in Dhaka — order before 11 AM',
    color: 'text-orange-300',
    link: '/shop',
  },
];

const INTERVAL = 3800;

export function AnnouncementBar() {
  const [current, setCurrent]     = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress]   = useState(0);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef     = useRef<number | null>(null);
  const startRef   = useRef<number | null>(null);

  // Progress bar animation
  function startProgress() {
    setProgress(0);
    startRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - (startRef.current ?? now);
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopProgress() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function advance() {
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length);
      setAnimating(false);
      startProgress();
    }, 320);
  }

  useEffect(() => {
    startProgress();
    timerRef.current = setInterval(advance, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopProgress();
    };
  }, []); // eslint-disable-line

  if (dismissed) return null;

  const msg = MESSAGES[current];
  const Icon = msg.icon;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white select-none">
      {/* Decorative shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex items-center h-9 gap-3">

          {/* Left: social / contact (desktop only) */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <a
              href={`tel:+8801700000000`}
              className="flex items-center gap-1.5 text-brand-300 hover:text-white transition-colors text-[11px] font-medium"
            >
              <Phone className="w-3 h-3" />
              <span>+880 1700-000000</span>
            </a>
            <span className="text-brand-600 text-xs">|</span>
            <div className="flex items-center gap-2 text-[11px]">
              <button className="text-brand-300 hover:text-white transition-colors font-medium">বাংলা</button>
              <span className="text-brand-600">•</span>
              <button className="text-brand-400 hover:text-white transition-colors">EN</button>
            </div>
          </div>

          {/* Center: sliding message */}
          <div className="flex-1 flex items-center justify-center min-w-0 overflow-hidden">
            <div
              key={current}
              className={animating ? 'animate-ann-slide-out' : 'animate-ann-slide-in'}
            >
              <Link
                href={msg.link}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <span className={`flex-shrink-0 p-1 rounded-full bg-white/10 ${msg.color}`}>
                  <Icon className="w-3 h-3" />
                </span>
                <p className="text-[12px] font-medium tracking-wide text-white/95 group-hover:text-white transition-colors truncate">
                  {msg.text}
                </p>
                <span className="hidden sm:inline text-[10px] text-white/50 group-hover:text-white/70 transition-colors flex-shrink-0">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* Right: dots nav + dismiss */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Dot indicators */}
            <div className="hidden sm:flex items-center gap-1">
              {MESSAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    stopProgress();
                    if (timerRef.current) clearInterval(timerRef.current);
                    setCurrent(i);
                    setAnimating(false);
                    startProgress();
                    timerRef.current = setInterval(advance, INTERVAL);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    i === current
                      ? 'w-4 h-1.5 bg-white'
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Message ${i + 1}`}
                />
              ))}
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed(true)}
              className="w-5 h-5 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
              aria-label="বন্ধ করুন"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-spice-400 to-spice-300 transition-none rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
