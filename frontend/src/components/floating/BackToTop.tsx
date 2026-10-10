'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'floating-backtop w-10 h-10 bg-brand-700 text-white rounded-full shadow-lg',
        'flex items-center justify-center',
        'hover:bg-brand-800 transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      )}
      aria-label="উপরে যান"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
