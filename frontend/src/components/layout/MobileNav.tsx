'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, User, ShoppingCart, Grid2X2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

export function MobileNav() {
  const pathname = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const itemCount = getItemCount();

  const LEFT_NAV = [
    { href: '/',     icon: Home,    label: 'হোম'  },
    { href: '/shop', icon: Grid2X2, label: 'মেনু' },
  ];

  const RIGHT_NAV = [
    { href: '/blog',    icon: BookOpen, label: 'ব্লগ'       },
    { href: '/account', icon: User,     label: 'অ্যাকাউন্ট' },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 pb-safe"
      style={{ boxShadow: '0 -1px 0 0 #f3f4f6, 0 -4px 16px rgba(0,0,0,0.06)' }}
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="flex items-center h-16">
        {/* Left: Home + Menu */}
        {LEFT_NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
              isActive(href) ? 'text-forest-700' : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <Icon className={cn('w-[22px] h-[22px]', isActive(href) && 'stroke-[2.5px]')} />
            <span className={cn('text-[10px] font-semibold leading-none',
              isActive(href) ? 'text-forest-700' : 'text-gray-400')}>
              {label}
            </span>
          </Link>
        ))}

        {/* Center: Cart FAB */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center flex-1 h-full relative"
          aria-label="কার্ট"
        >
          <div className="relative -mt-5">
            <div className="w-[52px] h-[52px] rounded-full bg-forest-700 flex items-center justify-center shadow-lg shadow-forest-700/40 border-[3px] border-white">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-0.5 bg-spice-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-forest-700 leading-none mt-1">কার্ট</span>
        </button>

        {/* Right: Blog + Account */}
        {RIGHT_NAV.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
              isActive(href) ? 'text-forest-700' : 'text-gray-400 hover:text-gray-600',
            )}
          >
            <Icon className={cn('w-[22px] h-[22px]', isActive(href) && 'stroke-[2.5px]')} />
            <span className={cn('text-[10px] font-semibold leading-none',
              isActive(href) ? 'text-forest-700' : 'text-gray-400')}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
