'use client';

import { ShoppingCart } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

export function FloatingCart() {
  const { getItemCount, getTotal, openCart } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  // Only show when cart has items, hidden on mobile (mobile uses MobileNav cart button)
  if (itemCount === 0) return null;

  return (
    <div className="floating-cart">
      <button
        onClick={openCart}
        className={cn(
          'flex flex-col items-center gap-1.5',
          'bg-brand-700 hover:bg-brand-800 text-white',
          'px-3 py-4 rounded-l-2xl shadow-xl',
          'border-l-0 border border-brand-600',
          'transition-all duration-200 group',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        )}
        aria-label="ফ্লোটিং কার্ট খুলুন"
      >
        {/* Icon + badge */}
        <div className="relative">
          <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-spice-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        </div>

        {/* Total */}
        <div className="text-center leading-none">
          <p className="text-[11px] font-bold">{formatPriceEn(total)}</p>
        </div>

        {/* Label */}
        <span className="text-[10px] font-medium opacity-80 writing-mode-vertical rotate-0">
          কার্ট
        </span>
      </button>
    </div>
  );
}
