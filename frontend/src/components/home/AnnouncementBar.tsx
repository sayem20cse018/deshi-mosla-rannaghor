'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Truck, Tag, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

const MESSAGES = [
  { icon: Truck, text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি', link: '/shop' },
  { icon: Tag,   text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',  link: '/shop' },
  { icon: Gift,  text: 'ক্যাশ অন ডেলিভারি | bKash | Nagad সুবিধা', link: '/checkout' },
  { icon: Zap,   text: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে',  link: '/shop' },
];

const INTERVAL = 3800;

export function AnnouncementBar() {
  const [current,   setCurrent]   = useState(0);
  const [exiting,   setExiting]   = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [progress,  setProgress]  = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  function startProgress() {
    setProgress(0);
    startRef.current = performance.now();
    function tick(now: number) {
      const pct = Math.min(((now - (startRef.current ?? now)) / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopProgress() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function goTo(i: number) {
    stopProgress();
    if (timerRef.current) clearInterval(timerRef.current);
    setExiting(true);
    setTimeout(() => {
      setCurrent(i);
      setExiting(false);
      startProgress();
      timerRef.current = setInterval(advance, INTERVAL);
    }, 280);
  }

  function advance() {
    setExiting(true);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length);
      setExiting(false);
      startProgress();
    }, 280);
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

  const { icon: Icon, text, link } = MESSAGES[current];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-spice-700 via-spice-600 to-spice-700 text-white select-none">
      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex items-center h-9 gap-2">

          {/* Sliding message */}
          <div className="flex-1 flex items-center justify-center overflow-hidden min-w-0">
            <Link
              href={link}
              key={current}
              className={`flex items-center gap-2 group ${exiting ? 'animate-ann-slide-out' : 'animate-ann-slide-in'}`}
            >
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
                <Icon className="w-3 h-3 text-white" />
              </span>
              <p className="text-[12px] font-semibold tracking-wide text-white truncate group-hover:text-yellow-100 transition-colors">
                {text}
              </p>
              <span className="hidden sm:inline text-white/50 text-[11px] group-hover:text-white/80 transition-colors flex-shrink-0">›</span>
            </Link>
          </div>

          {/* Dot indicators */}
          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
            {MESSAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Message ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
            aria-label="বন্ধ করুন"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-black/20">
        <div
          className="h-full bg-white/60 rounded-full transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
