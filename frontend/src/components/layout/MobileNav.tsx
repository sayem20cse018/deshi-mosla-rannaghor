'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';

const NAV = [
  { href: '/',                 icon: Home,        label: 'হোম'        },
  { href: '/shop',             icon: ShoppingBag, label: 'শপ'         },
  { href: '/account/wishlist', icon: Heart,       label: 'উইশলিস্ট'  },
  { href: '/account',          icon: User,        label: 'অ্যাকাউন্ট' },
];

export function MobileNav() {
  const pathname              = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const wishCount             = useWishlistStore((s) => s.items.length);
  const itemCount             = getItemCount();

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 pb-safe shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="flex items-center h-14">
        {/* Home + Shop */}
        {NAV.slice(0, 2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-colors',
                active ? 'text-forest-700' : 'text-gray-400 hover:text-forest-600',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}

        {/* Center Cart FAB */}
        <button
          onClick={openCart}
          className="flex flex-col items-center gap-0.5 flex-1 py-1.5 relative"
          aria-label="কার্ট"
        >
          <div className="relative">
            <div className="w-12 h-12 -mt-6 bg-gradient-to-br from-forest-600 to-forest-800 rounded-full flex items-center justify-center shadow-lg shadow-forest-700/40 border-[3px] border-white">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-0.5 min-w-[18px] h-[18px] px-0.5 bg-spice-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-forest-700 mt-0.5">কার্ট</span>
        </button>

        {/* Wishlist + Account */}
        {NAV.slice(2).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const isWish = href.includes('wishlist');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-1.5 transition-colors relative',
                active ? 'text-forest-700' : 'text-gray-400 hover:text-forest-600',
              )}
            >
              <div className="relative">
                <Icon className={cn('w-5 h-5', active && isWish && 'fill-red-500 text-red-500')} />
                {isWish && wishCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
