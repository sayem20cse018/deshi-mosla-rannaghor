'use client';

import { ShoppingCart, X } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useState, useEffect } from 'react';

export function FloatingCart() {
  const { getItemCount, getTotals, openCart } = useCartStore();
  const itemCount = getItemCount();
  const totals    = getTotals();
  const [dismissed, setDismissed] = useState(false);
  const [pulse,     setPulse]     = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);

  useEffect(() => {
    if (itemCount > prevCount) {
      setPulse(true);
      setDismissed(false);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  if (itemCount === 0 || dismissed) return null;

  const FREE_THRESHOLD = 1000;
  const progressPct = Math.min(100, (totals.subtotal / FREE_THRESHOLD) * 100);

  return (
    <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col items-end">
      <button
        onClick={openCart}
        className={cn(
          'group relative flex flex-col items-center gap-1.5',
          'bg-[#0f4c2a] hover:bg-[#0a3d22] text-white',
          'pl-3 pr-2 py-4 rounded-l-2xl',
          'border border-r-0 border-[#072d18]',
          'transition-all duration-200 hover:pl-4',
          'shadow-lg shadow-[#0f4c2a]/40',
          'focus:outline-none',
          pulse && 'scale-110',
        )}
        aria-label={`কার্ট খুলুন — ${itemCount} পণ্য`}
      >
        <div className="relative">
          <ShoppingCart className={cn('w-5 h-5 transition-transform duration-200 group-hover:scale-110')} />
          <span className={cn(
            'absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-0.5',
            'bg-[#ea580c] text-white text-[10px] font-black',
            'rounded-full flex items-center justify-center border border-white/30',
            'transition-transform duration-200',
            pulse && 'scale-125',
          )}>
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        </div>

        <div className="text-center leading-none">
          <p className="text-[11px] font-black tracking-tight whitespace-nowrap">
            {formatPriceEn(totals.grandTotal)}
          </p>
        </div>

        <div className="w-1.5 h-10 bg-[#072d18] rounded-full overflow-hidden mt-0.5">
          <div
            className="w-full bg-emerald-300 rounded-full transition-all duration-700"
            style={{ height: `${progressPct}%`, marginTop: `${100 - progressPct}%` }}
          />
        </div>

        <span
          className="text-[10px] font-semibold opacity-70 leading-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          কার্ট
        </span>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        className="absolute -top-2 right-0 w-5 h-5 bg-gray-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow text-[10px] border border-white/20"
        aria-label="ফ্লোটিং কার্ট বন্ধ করুন"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}