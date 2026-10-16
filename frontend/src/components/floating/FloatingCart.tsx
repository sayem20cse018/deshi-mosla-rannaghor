'use client';

import { ShoppingBag, X } from 'lucide-react';
import { formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useState, useEffect } from 'react';

export function FloatingCart() {
  const { getItemCount, getTotals, openCart } = useCartStore();
  const itemCount = getItemCount();
  const totals    = getTotals();

  const [dismissed, setDismissed] = useState(false);
  const [pulse,     setPulse]     = useState(false);
  const [prevCount, setPrevCount] = useState(itemCount);
  const [show,      setShow]      = useState(false);

  // Pulse animation on item add
  useEffect(() => {
    if (itemCount > prevCount) {
      setPulse(true);
      setDismissed(false);
      const t = setTimeout(() => setPulse(false), 700);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  // Smooth entrance
  useEffect(() => {
    if (itemCount > 0 && !dismissed) {
      const t = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [itemCount, dismissed]);

  if (itemCount === 0 || dismissed) return null;

  const FREE_THRESHOLD = 1000;
  const progressPct   = Math.min(100, (totals.subtotal / FREE_THRESHOLD) * 100);
  const remaining     = Math.max(0, FREE_THRESHOLD - totals.subtotal);

  return (
    <div
      className={`hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      {/* Dismiss X above the tab */}
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); setShow(false); }}
        className="absolute -top-2.5 right-0 w-5 h-5 bg-gray-500 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow z-10 border border-white/30"
        aria-label="Close"
      >
        <X className="w-2.5 h-2.5" />
      </button>

      {/* Main tab */}
      <button
        onClick={openCart}
        className={`group relative flex flex-col items-center gap-2 pl-3.5 pr-2.5 py-5 rounded-l-3xl bg-[#0f4c2a] hover:bg-[#0a3d22] active:bg-[#072d18] text-white transition-all duration-200 hover:pl-5 border border-r-0 border-[#072d18] shadow-xl shadow-[#0f4c2a]/40 ${
          pulse ? 'scale-110' : 'scale-100'
        }`}
        style={{ transition: 'transform 200ms ease, padding 200ms ease' }}
        aria-label={`কার্ট — ${itemCount} পণ্য`}
      >
        {/* Shopping bag icon */}
        <div className="relative">
          <ShoppingBag
            className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${pulse ? 'scale-125' : ''}`}
            strokeWidth={1.75}
          />
          {/* Item count badge */}
          <span
            className={`absolute -top-2.5 -right-2.5 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-[#ea580c] rounded-full border-[1.5px] border-white leading-none shadow-sm transition-transform duration-200 ${
              pulse ? 'scale-125' : ''
            }`}
          >
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        </div>

        {/* Price */}
        <div className="text-center leading-none">
          <p className="text-[12px] font-black tracking-tight whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {formatPriceEn(totals.grandTotal)}
          </p>
        </div>

        {/* Free delivery progress bar */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-2 h-12 bg-[#072d18] rounded-full overflow-hidden">
            <div
              className="w-full rounded-full transition-all duration-700 ease-out"
              style={{
                height:    `${progressPct}%`,
                marginTop: `${100 - progressPct}%`,
                background: progressPct >= 100 ? '#34d399' : '#6ee7b7',
              }}
            />
          </div>
          {progressPct < 100 && (
            <span
              className="text-[8px] text-white/50 writing-mode-vertical leading-none rotate-180"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'Manrope, sans-serif' }}
            >
              -{formatPriceEn(remaining)}
            </span>
          )}
          {progressPct >= 100 && (
            <span
              className="text-[8px] text-emerald-300 leading-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'Manrope, sans-serif' }}
            >
              FREE
            </span>
          )}
        </div>

        {/* কার্ট label */}
        <span
          className="text-[9.5px] font-bold opacity-60 leading-none tracking-wide"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'Noto Sans Bengali, sans-serif' }}
        >
          কার্ট
        </span>
      </button>
    </div>
  );
}
