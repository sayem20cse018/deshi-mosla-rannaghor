'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Truck, Tag, Gift, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const ICON_MAP: Record<string, React.ElementType> = {
  truck: Truck, tag: Tag, gift: Gift, zap: Zap,
};

const STATIC_FALLBACK = [
  { id: 'f1', text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি', link: '/shop', icon: 'truck', bgColor: '#ea580c', textColor: '#ffffff' },
  { id: 'f2', text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',  link: '/shop', icon: 'tag',   bgColor: '#c2410c', textColor: '#ffffff' },
];

function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements-public'],
    queryFn: async () => {
      const { data } = await api.get('/banners/announcements');
      return (data?.data ?? []) as any[];
    },
    staleTime: 300_000,
    placeholderData: STATIC_FALLBACK,
  });
}

const INTERVAL = 4000;

export function AnnouncementBar() {
  const { data: rawItems = [] } = useAnnouncements();
  const items = rawItems.length > 0 ? rawItems : STATIC_FALLBACK;
  const [idx, setIdx] = useState(0);

  const next = useCallback(() => setIdx(i => (i + 1) % items.length), [items.length]);
  const prev = useCallback(() => setIdx(i => (i - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, INTERVAL);
    return () => clearInterval(t);
  }, [next, items.length]);

  if (!items.length) return null;

  const current = items[idx] ?? items[0];
  const Icon = ICON_MAP[current.icon ?? 'truck'] ?? Truck;

  return (
    <div
      className="w-full py-2 px-4 flex items-center justify-center gap-3 text-sm font-semibold relative overflow-hidden"
      style={{ background: current.bgColor || '#ea580c', color: current.textColor || '#fff' }}
    >
      {items.length > 1 && (
        <button onClick={prev} className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0" aria-label="Previous">
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-2 min-w-0 flex-1 justify-center">
        <Icon className="w-4 h-4 flex-shrink-0" />
        {current.link ? (
          <Link href={current.link} className="truncate hover:underline">
            {current.text}
          </Link>
        ) : (
          <span className="truncate">{current.text}</span>
        )}
      </div>

      {items.length > 1 && (
        <button onClick={next} className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0" aria-label="Next">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {items.length > 1 && (
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-1">
          {items.map((_: unknown, i: number) => (
            <button key={i} onClick={() => setIdx(i)}
              className="w-1 h-1 rounded-full transition-all"
              style={{ background: i === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}