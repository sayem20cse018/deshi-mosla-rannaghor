'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Truck, Tag, Gift, Zap } from 'lucide-react';
import Link from 'next/link';

const MESSAGES = [
  { icon: Truck, text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি',  link: '/shop'     },
  { icon: Tag,   text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',  link: '/shop'     },
  { icon: Gift,  text: 'ক্যাশ অন ডেলিভারি | bKash | Nagad সুবিধা', link: '/checkout' },
  { icon: Zap,   text: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে',  link: '/shop'     },
];

const INTERVAL = 3800; // ms between slides

export function AnnouncementBar() {
  const [current,   setCurrent]   = useState(0);
  const [isVisible, setIsVisible] = useState(true);   // true = visible, false = sliding out
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    // 1. slide out
    setIsVisible(false);
    // 2. after slide-out duration (250ms), change message and slide in
    setTimeout(() => {
      setCurrent(c => (c + 1) % MESSAGES.length);
      setIsVisible(true);
    }, 270);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(advance, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  if (dismissed) return null;

  const { icon: Icon, text, link } = MESSAGES[current];

  return (
    <div
      className="relative bg-[#111827] text-white select-none overflow-hidden"
      style={{ height: '34px' }}
    >
      {/* Subtle top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 h-full flex items-center gap-2 overflow-hidden">

        {/* Sliding message area */}
        <div className="flex-1 flex items-center justify-center overflow-hidden min-w-0">
          <Link
            href={link}
            className={`flex items-center gap-2 group transition-all duration-250 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
            style={{ transition: 'opacity 250ms ease, transform 250ms ease' }}
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/15 flex items-center justify-center">
              <Icon className="w-3 h-3 text-white" />
            </span>
            <p
              className="text-[12px] font-semibold tracking-wide text-white truncate group-hover:text-yellow-100 transition-colors"
              style={{ fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}
            >
              {text}
            </p>
            <span className="hidden sm:inline text-white/40 text-[11px] group-hover:text-white/70 transition-colors flex-shrink-0">›</span>
          </Link>
        </div>

        {/* Dot indicators */}
        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
          {MESSAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setIsVisible(true); }}
              aria-label={`Message ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/55'
              }`}
            />
          ))}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-white/35 hover:text-white hover:bg-white/10 transition-all"
          aria-label="বন্ধ করুন"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
