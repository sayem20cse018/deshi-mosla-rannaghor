'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cart.store';
import { formatPriceEn } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function FloatingCart() {
  const { getItemCount, getTotal, openCart } = useCartStore();
  const itemCount = getItemCount();
  const total = getTotal();

  return (
    // Hidden on mobile — compact on tablet+ (SRS §5.10)
    <div className="floating-cart hidden md:flex">
      <button
        onClick={openCart}
        className={cn(
          'group flex flex-col items-center gap-1 bg-brand-700 text-white',
          'px-3 py-3 rounded-l-xl shadow-lg hover:bg-brand-800 transition-all duration-300',
          'border border-r-0 border-brand-600',
        )}
        aria-label="ফ্লোটিং কার্ট"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-spice-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </div>
        {itemCount > 0 && (
          <div className="text-center leading-none">
            <p className="text-xs font-bold">{formatPriceEn(total)}</p>
          </div>
        )}
        <span className="text-xs font-medium opacity-80">কার্ট</span>
      </button>
    </div>
  );
}
