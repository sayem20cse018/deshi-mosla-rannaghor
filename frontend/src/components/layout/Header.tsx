'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X,
  ChevronDown, Phone, LayoutDashboard,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn, formatPriceEn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

const NAV_LINKS = [
  { href: '/',           label: 'হোম' },
  { href: '/shop',       label: 'শপ' },
  {
    href: '/categories', label: 'ক্যাটাগরি',
    children: [
      { href: '/category/mosla',         label: '🌶️ মসলা' },
      { href: '/category/tel',           label: '🫙 তেল' },
      { href: '/category/chal',          label: '🍚 চাল' },
      { href: '/category/dal',           label: '🫘 ডাল' },
      { href: '/category/ata-maida',     label: '🌾 আটা ও ময়দা' },
      { href: '/category/chini-gur',     label: '🍯 চিনি ও গুড়' },
      { href: '/category/cha-kofi',      label: '☕ চা ও কফি' },
      { href: '/category/modhu',         label: '🍯 মধু' },
      { href: '/category/sauce-achar',   label: '🥫 সস ও আচার' },
      { href: '/category/cooking-items', label: '🥘 রান্নার পণ্য' },
    ],
  },
  { href: '/offers',   label: 'অফার' },
  { href: '/recipes',  label: 'রেসিপি' },
  { href: '/about',    label: 'আমাদের পরিচয়' },
];

export function Header() {
  const pathname = usePathname();
  const { getItemCount, getTotals, openCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const itemCount = getItemCount();
  const cartTotal = getTotals().grandTotal;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          'sticky top-0 z-50 bg-white transition-shadow duration-300',
          scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100',
        )}
      >
        {/* Main header row */}
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-3 md:gap-6">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm leading-none">দম</span>
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-brand-800 font-bold text-sm">দেশি মসলার</p>
                <p className="text-brand-500 text-xs font-medium">রান্নাঘর</p>
              </div>
            </Link>

            {/* ── Desktop Search ── */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar className="w-full" />
            </div>

            {/* ── Right icons ── */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">

              {/* Phone (desktop) */}
              <a
                href="tel:+8801700000000"
                className="hidden lg:flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-700 transition-colors mr-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="font-medium">01700-000000</span>
              </a>

              {/* Wishlist */}
              <Link href="/account/wishlist" className="btn-icon relative" aria-label="উইশলিস্ট">
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="btn-icon relative"
                aria-label="কার্ট"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </button>

              {/* Cart total pill (desktop) */}
              {itemCount > 0 && (
                <button
                  onClick={openCart}
                  className="hidden lg:flex items-center gap-1 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {formatPriceEn(cartTotal)}
                </button>
              )}

              {/* Account */}
              {isAuthenticated ? (
                <Link href="/account" className="btn-icon" aria-label="অ্যাকাউন্ট">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-brand-700 text-xs font-bold">
                        {user?.name?.charAt(0) ?? 'গ'}
                      </span>
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex btn-primary py-1.5 px-3 text-xs"
                >
                  <User className="w-3.5 h-3.5" /> লগইন
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="btn-icon md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="মেনু"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Desktop Nav bar ── */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center h-10 gap-1">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 px-3 h-10 text-sm font-medium transition-colors',
                        pathname.startsWith('/category')
                          ? 'text-brand-700'
                          : 'text-gray-700 hover:text-brand-700',
                      )}
                    >
                      {link.label}
                      <ChevronDown
                        className={cn('w-3.5 h-3.5 transition-transform duration-200', catOpen && 'rotate-180')}
                      />
                    </button>

                    {catOpen && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-up">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2 mx-3">
                          <Link
                            href="/categories"
                            className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-800 font-medium px-1"
                          >
                            সব ক্যাটাগরি দেখুন →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3 h-10 flex items-center text-sm font-medium transition-colors',
                      pathname === link.href
                        ? 'text-brand-700 border-b-2 border-brand-600'
                        : 'text-gray-700 hover:text-brand-700',
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}

              {/* Admin link for admins */}
              {isAuthenticated && (user as any)?.role !== 'CUSTOMER' && (
                <Link
                  href="/admin"
                  className="ml-auto flex items-center gap-1.5 text-xs text-spice-600 hover:text-spice-700 font-semibold px-3"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* ── Mobile Search ── */}
        <div className="md:hidden border-t border-gray-100 bg-gray-50 px-4 py-2">
          <SearchBar mobile className="w-full" />
        </div>

        {/* ── Mobile Menu ── */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <nav className="container mx-auto px-4 py-3 flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors',
                    pathname === link.href ? 'text-brand-700' : 'text-gray-700',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-3 flex gap-2">
                  <Link href="/login" className="btn-primary flex-1 justify-center">লগইন</Link>
                  <Link href="/register" className="btn-secondary flex-1 justify-center">নিবন্ধন</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
