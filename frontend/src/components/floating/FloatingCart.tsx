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

  useEffect(() => {
    if (itemCount > prevCount) {
      setPulse(true);
      setDismissed(false);
      const t = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(t);
    }
    setPrevCount(itemCount);
  }, [itemCount, prevCount]);

  useEffect(() => {
    if (itemCount > 0 && !dismissed) {
      const t = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(t);
    } else {
      setShow(false);
    }
  }, [itemCount, dismissed]);

  if (itemCount === 0 || dismissed) return null;

  return (
    <div
      className={[
        // desktop only, above WhatsApp button
        // WhatsApp is at bottom-20 (80px), cart sits higher to avoid overlap
        'hidden md:block fixed right-4 z-40',
        'transition-all duration-500 ease-out',
        show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      ].join(' ')}
      style={{ bottom: '148px' }}
    >
      {/* Dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md z-10 border-2 border-white"
        aria-label="Close"
      >
        <X className="w-2.5 h-2.5" />
      </button>

      {/* Card */}
      <button
        onClick={openCart}
        aria-label={itemCount + ' items in cart'}
        className={[
          'flex flex-col items-center overflow-hidden rounded-2xl shadow-2xl border border-white/10',
          'transition-transform duration-200 active:scale-95',
          pulse ? 'scale-105' : 'scale-100 hover:scale-105',
        ].join(' ')}
        style={{ width: '76px' }}
      >
        {/* Top: orange — bag icon + count */}
        <div
          className="w-full flex flex-col items-center justify-center gap-1 pt-3 pb-2.5"
          style={{ background: 'linear-gradient(160deg,#ea580c,#c2410c)' }}
        >
          {/* Shopping bag SVG — clean outline style */}
          <svg
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="white" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round"
            className={pulse ? 'scale-125 transition-transform' : 'transition-transform'}
          >
            <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="text-white font-black text-[11px] leading-none tracking-tight" style={{ fontFamily: 'Manrope,sans-serif' }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Bottom: dark — price */}
        <div
          className="w-full flex items-center justify-center py-2"
          style={{ background: '#1c1c1e' }}
        >
          <span className="text-white font-black text-[12px] leading-none" style={{ fontFamily: 'Manrope,sans-serif' }}>
            {formatPriceEn(totals.grandTotal)}
          </span>
        </div>
      </button>
    </div>
  );
}
