'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid2X2, BookOpen, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

// Home | Menu | Cart | Blog | Account — exact items kept
const LEFT_ITEMS = [
  { href: '/',           icon: Home,     label: 'Home'    },
  { href: '/categories', icon: Grid2X2,  label: 'Menu'    },
];
const RIGHT_ITEMS = [
  { href: '/blog',    icon: BookOpen, label: 'Blog'    },
  { href: '/account', icon: User,     label: 'Account' },
];

export function MobileNav() {
  const pathname  = usePathname();
  const { getItemCount, openCart } = useCartStore();
  const cartCount = getItemCount();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40"
      style={{
        background: 'linear-gradient(180deg, #c2410c 0%, #ea580c 60%, #d85a0b 100%)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -4px 24px rgba(194,65,12,0.4), 0 -1px 0 rgba(255,255,255,0.08) inset',
      }}
      aria-label="মোবাইল নেভিগেশন"
    >
      <div className="flex items-center" style={{ height: '72px' }}>

        {/* LEFT: Home + Menu */}
        {LEFT_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-[5px] transition-all duration-200 active:opacity-70 relative"
            >
              {/* Active indicator — top pill */}
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '32px',
                    height: '3px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '0 0 6px 6px',
                    boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                  }}
                />
              )}
              <div
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: '40px',
                  height: '32px',
                  borderRadius: '10px',
                  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
              >
                <Icon
                  style={{
                    width: '25px',
                    height: '25px',
                    color: active ? 'white' : 'rgba(255,255,255,0.58)',
                    strokeWidth: active ? 2.5 : 1.75,
                    transition: 'all 0.2s',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'white' : 'rgba(255,255,255,0.58)',
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}

        {/* CENTER: Cart FAB */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center flex-1 h-full gap-[5px] relative active:opacity-80 transition-opacity"
          aria-label="Cart"
        >
          {/* Raised pill */}
          <div
            className="relative flex items-center justify-center transition-transform duration-150 active:scale-95"
            style={{
              width: '58px',
              height: '42px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.24)',
              border: '1.5px solid rgba(255,255,255,0.38)',
              marginTop: '-12px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.22), 0 1px 0 rgba(255,255,255,0.15) inset',
            }}
          >
            <ShoppingCart
              style={{ width: '24px', height: '24px', color: 'white', strokeWidth: 2.5 }}
            />
            {cartCount > 0 && (
              <span
                className="absolute flex items-center justify-center text-white font-black leading-none"
                style={{
                  top: '-7px',
                  right: '-7px',
                  minWidth: '19px',
                  height: '19px',
                  padding: '0 3px',
                  background: '#fff',
                  color: '#ea580c',
                  borderRadius: '10px',
                  fontSize: '9.5px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 900,
                }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.01em',
              lineHeight: 1,
            }}
          >
            Cart
          </span>
        </button>

        {/* RIGHT: Blog + Account */}
        {RIGHT_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-[5px] transition-all duration-200 active:opacity-70 relative"
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '32px',
                    height: '3px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '0 0 6px 6px',
                    boxShadow: '0 0 8px rgba(255,255,255,0.6)',
                  }}
                />
              )}
              <div
                className="flex items-center justify-center transition-all duration-200"
                style={{
                  width: '40px',
                  height: '32px',
                  borderRadius: '10px',
                  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
              >
                <Icon
                  style={{
                    width: '25px',
                    height: '25px',
                    color: active ? 'white' : 'rgba(255,255,255,0.58)',
                    strokeWidth: active ? 2.5 : 1.75,
                    transition: 'all 0.2s',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: active ? 700 : 500,
                  color: active ? 'white' : 'rgba(255,255,255,0.58)',
                  letterSpacing: '0.01em',
                  lineHeight: 1,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
