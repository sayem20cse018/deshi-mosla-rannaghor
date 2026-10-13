'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Grid2X2, Heart, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

const NAV = [
  { href: '/', icon: Home, label: 'হোম' },
  { href: '/shop', icon: ShoppingBag, label: 'শপ' },
  { href: '/categories', icon: Grid2X2, label: 'ক্যাটাগরি' },
  { href: '/account/wishlist', icon: Heart, label: 'উইশলিস্ট' },
  { href: '/account', icon: User, label: 'অ্যাকাউন্ট' },
];

export function MobileNav() {
  const pathname = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 pb-safe"
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="flex items-center h-14">
        {NAV.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-colors',
                active ? 'text-brand-700' : 'text-gray-500 hover:text-brand-600',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Center cart button */}
        <button
          onClick={openCart}
          className="flex flex-col items-center gap-0.5 flex-1 py-1.5 relative"
          aria-label="কার্ট"
        >
          <div className="relative">
            <div className="w-10 h-10 -mt-5 bg-brand-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-spice-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium text-brand-700">কার্ট</span>
        </button>

        {NAV.slice(3).map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-colors',
                active ? 'text-brand-700' : 'text-gray-500 hover:text-brand-600',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
