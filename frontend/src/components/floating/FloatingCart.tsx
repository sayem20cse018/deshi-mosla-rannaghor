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

  // Pulse on item add
  useEffect(() => {
    if (itemCount > prevCount) {
      setPulse(true);
      setDismissed(false);
      const t = setTimeout(() => setPulse(false), 600);
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

  return (
    <div
      className={[
        'hidden md:block fixed right-4 bottom-8 z-40',
        'transition-all duration-500 ease-out',
        show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      ].join(' ')}
    >
      {/* Dismiss button */}
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors shadow-md z-10 border border-white/30"
        aria-label="Close"
      >
        <X className="w-2.5 h-2.5" />
      </button>

      {/* Card button */}
      <button
        onClick={openCart}
        aria-label={itemCount + ' items in cart'}
        className={[
          'flex flex-col items-center overflow-hidden',
          'rounded-2xl shadow-2xl',
          'border border-gray-700/50',
          'transition-transform duration-200 active:scale-95',
          pulse ? 'scale-105' : 'scale-100 hover:scale-105',
        ].join(' ')}
        style={{ width: '80px' }}
      >
        {/* Top  orange/red section */}
        <div
          className="w-full flex flex-col items-center justify-center gap-1 py-3"
          style={{ background: 'linear-gradient(160deg,#ea580c,#c2410c)' }}
        >
          <ShoppingBag
            className={['w-7 h-7 text-white transition-transform duration-200', pulse ? 'scale-125' : ''].join(' ')}
            strokeWidth={1.75}
          />
          <span className="text-white font-black text-[11px] leading-none" style={{ fontFamily: 'Manrope,sans-serif' }}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Bottom  dark section */}
        <div
          className="w-full flex items-center justify-center py-2.5"
          style={{ background: '#1c1c1e' }}
        >
          <span className="text-white font-black text-[13px] leading-none" style={{ fontFamily: 'Manrope,sans-serif' }}>
            {formatPriceEn(totals.grandTotal)}
          </span>
        </div>
      </button>
    </div>
  );
}
