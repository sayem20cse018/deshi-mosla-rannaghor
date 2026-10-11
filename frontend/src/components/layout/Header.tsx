'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X,
  ChevronDown, Globe, MapPin, LayoutDashboard,
  Package,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn, formatPriceEn } from '@/lib/utils';
import { SearchBar } from './SearchBar';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';

// ── Category nav items ─────────────────────────────────────
const CAT_NAV = [
  { href: '/shop',                     label: 'সব পণ্য',          emoji: '🛒'  },
  { href: '/category/chatu',           label: 'আমাদের ছাতু',      emoji: '🌾'  },
  { href: '/category/tel',             label: 'আমাদের তেল',       emoji: '🫙'  },
  { href: '/category/ata-maida',       label: 'আমাদের আটা',       emoji: '🌾'  },
  { href: '/category/chal',            label: 'আমাদের চাল',       emoji: '🍚'  },
  { href: '/category/modhu',           label: 'আমাদের মধু',       emoji: '🍯'  },
  { href: '/category/nuts-seeds',      label: 'Nuts & Seeds',     emoji: '🥜'  },
  { href: '/category/super-food',      label: 'Super Food',       emoji: '⚡'  },
  { href: '/category/mosla',           label: 'আমাদের মসলা',      emoji: '🌶️' },
  { href: '/category/herbs',           label: 'আমাদের হার্বস',    emoji: '🌿'  },
  { href: '/category/chini-gur',       label: 'আমাদের গুড়',       emoji: '🍬'  },
];

const MORE_ITEMS = [
  { href: '/category/dal',             label: '🫘 ডাল'              },
  { href: '/category/lobon',           label: '🧂 লবণ'              },
  { href: '/category/cha-kofi',        label: '☕ চা ও কফি'         },
  { href: '/category/snacks',          label: '🍿 স্ন্যাকস'          },
  { href: '/category/noodles',         label: '🍜 নুডলস'            },
  { href: '/category/sauce-achar',     label: '🥫 সস ও আচার'       },
  { href: '/category/cooking-items',   label: '🥘 রান্নার পণ্য'     },
];

// ── Top nav links (main header) ────────────────────────────
const TOP_NAV = [
  { href: '/',       label: 'হোম'  },
  { href: '/blog',   label: 'Blog' },
];

export function Header() {
  const pathname = usePathname();
  const { getItemCount, getTotals, openCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [moreOpen,   setMoreOpen]     = useState(false);
  const [langOpen,   setLangOpen]     = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled,   setScrolled]     = useState(false);

  const moreRef    = useRef<HTMLDivElement>(null);
  const langRef    = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();
  const cartTotal = getTotals().grandTotal;

  // Scroll shadow
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Click-outside for dropdowns
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node))    setMoreOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node))    setLangOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-300',
        scrolled ? 'shadow-md' : 'shadow-sm',
      )}
    >
      {/* ══════════════════════════════════════════════════
          1. MAIN HEADER ROW
          ══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-2 md:gap-4">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm leading-none">দম</span>
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-brand-800 font-bold text-sm leading-tight">দেশি মসলার</p>
                <p className="text-brand-500 text-xs font-medium">রান্নাঘর</p>
              </div>
            </Link>

            {/* Top nav: Home + Blog (desktop only) */}
            <nav className="hidden lg:flex items-center gap-1 ml-1">
              {TOP_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                    pathname === link.href
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-gray-700 hover:text-brand-700 hover:bg-gray-50',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search — grows to fill space */}
            <div className="hidden md:flex flex-1 min-w-0 max-w-lg">
              <SearchBar className="w-full" />
            </div>

            {/* ── Right action cluster ── */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">

              {/* Language switcher (desktop) */}
              <div ref={langRef} className="relative hidden lg:block">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    langOpen ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                  aria-label="ভাষা পরিবর্তন"
                >
                  <Globe className="w-4 h-4" />
                  <span>বাংলা</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-50 w-32 py-1 animate-fade-up">
                    <button className="w-full text-left px-3 py-2 text-sm text-brand-700 bg-brand-50 font-semibold">বাংলা</button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">English</button>
                  </div>
                )}
              </div>

              {/* Track Order (desktop) */}
              <Link
                href="/order-tracking"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-brand-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>ট্র্যাক অর্ডার</span>
              </Link>

              {/* My Account dropdown */}
              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setAccountOpen((o) => !o)}
                      className="btn-icon relative"
                      aria-label="অ্যাকাউন্ট"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center">
                          <span className="text-brand-700 text-xs font-bold">{user?.name?.charAt(0) ?? 'গ'}</span>
                        </div>
                      )}
                    </button>

                    {accountOpen && (
                      <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-48 py-1.5 animate-fade-up">
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                        {[
                          { href: '/account',          label: 'আমার অ্যাকাউন্ট' },
                          { href: '/account/orders',   label: 'আমার অর্ডার'      },
                          { href: '/account/wishlist', label: 'উইশলিস্ট'          },
                          { href: '/order-tracking',   label: 'অর্ডার ট্র্যাক'     },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                        {(user as any)?.role !== 'CUSTOMER' && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm text-spice-600 hover:bg-spice-50 transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            লগআউট
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <Link
                      href="/login"
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                        'text-gray-700 hover:text-brand-700 hover:bg-gray-50',
                      )}
                    >
                      <User className="w-3.5 h-3.5" />
                      লগইন
                    </Link>
                    <span className="text-gray-200 text-sm">/</span>
                    <Link
                      href="/register"
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-brand-700 hover:bg-brand-800 transition-colors"
                    >
                      নিবন্ধন
                    </Link>
                  </div>
                )}
              </div>

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

              {/* Cart total pill */}
              {itemCount > 0 && (
                <button
                  onClick={openCart}
                  className="hidden lg:flex items-center gap-1 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {formatPriceEn(cartTotal)}
                </button>
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

        {/* Mobile search */}
        <div className="md:hidden border-t border-gray-100 bg-gray-50 px-4 py-2">
          <SearchBar mobile className="w-full" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. CATEGORY NAVIGATION BAR
          ══════════════════════════════════════════════════ */}
      <div className="bg-brand-800 border-b border-brand-700">
        <div className="container mx-auto px-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center h-10 gap-0.5 overflow-x-auto scrollbar-hide">
            {CAT_NAV.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/shop' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-10 text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0',
                    active
                      ? 'text-white bg-brand-600 rounded-lg'
                      : 'text-brand-200 hover:text-white hover:bg-brand-700 rounded-lg',
                  )}
                >
                  <span className="text-sm leading-none">{item.emoji}</span>
                  {item.label}
                </Link>
              );
            })}

            {/* More dropdown */}
            <div ref={moreRef} className="relative flex-shrink-0">
              <button
                onClick={() => setMoreOpen((o) => !o)}
                className={cn(
                  'flex items-center gap-1 px-3 h-10 text-xs font-medium transition-colors rounded-lg',
                  moreOpen
                    ? 'text-white bg-brand-600'
                    : 'text-brand-200 hover:text-white hover:bg-brand-700',
                )}
              >
                আরও
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', moreOpen && 'rotate-180')} />
              </button>

              {moreOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 w-44 animate-fade-up">
                  {MORE_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-50 mt-1 pt-1 mx-2">
                    <Link
                      href="/categories"
                      onClick={() => setMoreOpen(false)}
                      className="flex px-2 py-1.5 text-xs text-brand-600 hover:text-brand-800 font-medium"
                    >
                      সব ক্যাটাগরি দেখুন →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile — horizontally scrollable pills */}
          <div className="md:hidden flex items-center gap-1.5 h-10 overflow-x-auto scrollbar-hide px-0.5">
            {[...CAT_NAV, ...MORE_ITEMS.slice(0, 3)].map((item) => {
              const emoji = 'emoji' in item ? item.emoji : item.label.split(' ')[0];
              const label = 'emoji' in item ? item.label : item.label.split(' ').slice(1).join(' ');
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap',
                    active
                      ? 'bg-white text-brand-700'
                      : 'text-brand-200 bg-brand-700/40 hover:bg-brand-700',
                  )}
                >
                  <span className="text-sm leading-none">{emoji}</span>
                  <span className="hidden xs:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          3. ANNOUNCEMENT BAR  (below category nav)
          ══════════════════════════════════════════════════ */}
      <AnnouncementBarInline />

      {/* ══════════════════════════════════════════════════
          MOBILE FULL MENU
          ══════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[70vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-3">
            {/* Top links */}
            {TOP_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex py-3 text-sm font-medium border-b border-gray-50 transition-colors',
                  pathname === link.href ? 'text-brand-700' : 'text-gray-700',
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Category items */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-3 mb-2">ক্যাটাগরি</p>
            {[...CAT_NAV, ...MORE_ITEMS].map((item) => {
              const emoji = 'emoji' in item ? item.emoji : item.label.split(' ')[0];
              const label = 'emoji' in item ? item.label : item.label.split(' ').slice(1).join(' ');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50 last:border-0"
                >
                  <span>{emoji}</span> {label}
                </Link>
              );
            })}

            {/* Auth links */}
            {!isAuthenticated && (
              <div className="pt-4 flex gap-2">
                <Link href="/login" className="btn-primary flex-1 justify-center text-sm py-2.5">লগইন</Link>
                <Link href="/register" className="btn-secondary flex-1 justify-center text-sm py-2.5">নিবন্ধন</Link>
              </div>
            )}

            {/* Track order */}
            <Link
              href="/order-tracking"
              className="flex items-center gap-2 mt-3 py-2.5 text-sm text-gray-600 border-t border-gray-100"
            >
              <Package className="w-4 h-4" /> ট্র্যাক অর্ডার
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Inline Announcement Bar ────────────────────────────────
// Kept separate from AnnouncementBar (home section) so it can
// be placed precisely inside the sticky header stack.

import { Truck, Tag, Gift, Zap } from 'lucide-react';

const ANN_MESSAGES = [
  { icon: Truck, text: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি' },
  { icon: Tag,   text: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়' },
  { icon: Gift,  text: 'ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ' },
  { icon: Zap,   text: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে অর্ডার করুন' },
];

function AnnouncementBarInline() {
  const [current, setCurrent]   = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % ANN_MESSAGES.length), 3500);
    return () => clearInterval(t);
  }, []);

  if (dismissed) return null;

  const { icon: Icon, text } = ANN_MESSAGES[current];

  return (
    <div className="bg-spice-600 text-white text-xs relative overflow-hidden">
      <div className="container mx-auto px-4 h-8 flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
          <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-90" />
          <p
            key={current}
            className="font-medium tracking-wide truncate text-center animate-fade-up"
          >
            {text}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-2"
          aria-label="বন্ধ করুন"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
