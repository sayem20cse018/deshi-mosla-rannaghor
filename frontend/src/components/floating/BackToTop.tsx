'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 400);
      setScrollPct(docH > 0 ? Math.min(100, (scrollY / docH) * 100) : 0);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // SVG circle progress
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scrollPct / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="উপরে যান"
      className={cn(
        'fixed right-4 bottom-4 z-40',
        'w-11 h-11 flex items-center justify-center',
        'rounded-full bg-white border border-gray-200',
        'shadow-lg hover:shadow-xl',
        'hover:border-brand-400 hover:bg-brand-50',
        'transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        // Mobile: sit above mobile nav bar
        'mb-safe',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6 pointer-events-none',
      )}
    >
      {/* SVG circular progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 38 38"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="19" cy="19" r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        {/* Progress */}
        <circle
          cx="19" cy="19" r={radius}
          fill="none"
          stroke="#15803d"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-300"
        />
      </svg>

      {/* Arrow icon */}
      <ChevronUp className="w-4 h-4 text-brand-700 relative z-10 group-hover:text-brand-900 transition-colors" />
    </button>
  );
}
