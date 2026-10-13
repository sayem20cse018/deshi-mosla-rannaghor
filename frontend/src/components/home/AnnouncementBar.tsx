'use client';

import { useState, useEffect } from 'react';
import { X, Truck, Tag, Gift, Zap } from 'lucide-react';

const MESSAGES = [
  { icon: Truck, text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' },
  { icon: Tag, text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়' },
  { icon: Gift, text: 'ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ' },
  { icon: Zap, text: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে অর্ডার করুন' },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  const { icon: Icon, text } = MESSAGES[current];

  return (
    <div className="bg-brand-900 text-white text-xs relative overflow-hidden">
      <div className="container mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* Left: language toggle */}
        <div className="hidden sm:flex items-center gap-3 text-brand-300 flex-shrink-0">
          <button className="hover:text-white transition-colors">বাংলা</button>
          <span className="text-brand-600">|</span>
          <button className="hover:text-white transition-colors">English</button>
        </div>

        {/* Center: rotating message */}
        <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
          <Icon className="w-3.5 h-3.5 text-spice-400 flex-shrink-0" />
          <p
            className="font-medium tracking-wide truncate text-center animate-fade-up"
            key={current}
          >
            {text}
          </p>
        </div>

        {/* Right: dismiss */}
        <button
          onClick={() => setDismissed(true)}
          className="text-brand-400 hover:text-white transition-colors flex-shrink-0 ml-2"
          aria-label="বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Progress bar — duration via inline style to avoid Tailwind ambiguous-class warning */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-spice-500/40 w-full">
        <div
          className="h-full bg-spice-500 ease-linear"
          style={{
            width: '100%',
            animation: 'progress-bar 3.5s linear infinite',
            transitionDuration: '3500ms',
          }}
        />
      </div>
    </div>
  );
}
