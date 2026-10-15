'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';

const NAV_ITEMS = [
  { href: '/',            icon: Home,        label: 'হোম'      },
  { href: '/categories',  icon: Grid2X2,     label: 'ক্যাটাগরি' },
  { href: '/shop',        icon: ShoppingBag, label: 'শপ'        },
  { href: '/account/wishlist', icon: Heart,  label: 'উইশলিস্ট' },
];

export function MobileNav() {
  const pathname  = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const wishCount = useWishlistStore((s) => s.items.length);
  const cartCount = getItemCount();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white pb-safe"
      style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.06), 0 -4px 12px rgba(0,0,0,0.04)' }}
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="flex items-center h-[58px]">

        {/* Left 4: Home, Categories, Shop, Wishlist */}
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          const isWish = href.includes('wishlist');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-[3px] flex-1 h-full transition-colors',
                active ? 'text-[#0f4c2a]' : 'text-gray-400',
              )}
              style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}
            >
              {/* Icon with optional badge */}
              <div className="relative">
                <Icon
                  className="w-[21px] h-[21px]"
                  strokeWidth={active ? 2.5 : 1.75}
                />
                {isWish && wishCount > 0 && (
                  <span className="absolute -top-[6px] -right-[6px] min-w-[15px] h-[15px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-red-500 rounded-full border border-white leading-none">
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-semibold leading-none',
                active ? 'text-[#0f4c2a]' : 'text-gray-400',
              )}>
                {label}
              </span>
              {/* Active underline dot */}
              <div className={cn(
                'w-1 h-1 rounded-full transition-all duration-200',
                active ? 'bg-[#0f4c2a] opacity-100' : 'opacity-0',
              )} />
            </Link>
          );
        })}

        {/* Cart — rightmost, pill style */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center gap-[3px] flex-1 h-full"
          aria-label="কার্ট"
          style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}
        >
          <div className="relative -mt-1">
            {/* Elevated pill */}
            <div className="w-[46px] h-[32px] rounded-[14px] flex items-center justify-center shadow-md"
                 style={{ backgroundColor: '#0f4c2a', boxShadow: '0 4px 12px rgba(15,76,42,0.35)' }}>
              <ShoppingCart className="w-[17px] h-[17px] text-white" strokeWidth={2.5} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-[5px] -right-[4px] min-w-[16px] h-[16px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-[#ea580c] rounded-full border border-white leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold leading-none" style={{ color: '#0f4c2a' }}>কার্ট</span>
          <div className="w-1 h-1 rounded-full bg-transparent" />
        </button>

      </div>
    </nav>
  );
}
