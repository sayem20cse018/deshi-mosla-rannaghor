'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X,
  ChevronDown, Globe, Package, LayoutDashboard,
  Loader2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn, formatPriceEn } from '@/lib/utils';
import { t, catName } from '@/lib/translations';
import { useLanguageStore, type Lang } from '@/store/language.store';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useNavCategories } from '@/hooks/useCategories';
import { SearchBar } from './SearchBar';
import toast from 'react-hot-toast';

// ── How many categories fit in the desktop nav bar ─────────
const NAV_VISIBLE = 10;

// ── Top nav links (bilingual) ──────────────────────────────
const TOP_NAV: { href: string; bn: string; en: string }[] = [
  { href: '/',     bn: 'হোম',  en: 'Home' },
  { href: '/blog', bn: 'ব্লগ', en: 'Blog' },
];

export function Header() {
  const pathname   = usePathname();
  const router     = useRouter();
  const { lang, setLang } = useLanguageStore();
  const { getItemCount, getTotals, openCart } = useCartStore();
  const { user, isAuthenticated, logout }     = useAuthStore();

  // Nav categories from API
  const { data: navCats = [], isLoading: catsLoading } = useNavCategories();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

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
      if (moreRef.current    && !moreRef.current.contains(e.target as Node))    setMoreOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    setAccountOpen(false);
    await logout();
    toast.success(lang === 'bn' ? 'লগআউট হয়েছে' : 'Logged out');
    router.push('/');
  }

  // Split nav into visible + overflow ("More")
  const visibleCats   = navCats.slice(0, NAV_VISIBLE);
  const overflowCats  = navCats.slice(NAV_VISIBLE);

  const T = (key: Parameters<typeof t>[0]) => t(key, lang);

  return (
    <header className={cn('sticky top-0 z-50 bg-white transition-shadow duration-300', scrolled ? 'shadow-md' : 'shadow-sm')}>

      {/* ════════════════════════════════════════════════
          1. MAIN HEADER ROW
          ════════════════════════════════════════════════ */}
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

            {/* Top nav: Home + Blog (desktop) */}
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
                  {lang === 'bn' ? link.bn : link.en}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden md:flex flex-1 min-w-0 max-w-lg">
              <SearchBar className="w-full" lang={lang} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">

              {/* Language switcher */}
              <div ref={langRef} className="relative hidden lg:block">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    langOpen ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                  aria-label={T('language')}
                >
                  <Globe className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'বাংলা' : 'English'}</span>
                  <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
                </button>

                {langOpen && (
                  <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-50 w-36 py-1 animate-fade-up">
                    {(['bn', 'en'] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={cn(
                          'w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 transition-colors',
                          lang === l
                            ? 'text-brand-700 bg-brand-50 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50',
                        )}
                      >
                        <span className="text-base">{l === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                        {l === 'bn' ? 'বাংলা' : 'English'}
                        {lang === l && <span className="ml-auto text-brand-500 text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Track Order */}
              <Link
                href="/order-tracking"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-brand-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Package className="w-4 h-4" />
                <span>{T('trackOrder')}</span>
              </Link>

              {/* My Account */}
              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setAccountOpen((o) => !o)}
                      className="btn-icon relative"
                      aria-label={T('myAccount')}
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
                      <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-52 py-1.5 animate-fade-up">
                        <div className="px-4 py-2 border-b border-gray-50">
                          <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                        {[
                          { href: '/account',          label: T('myAccount') },
                          { href: '/account/orders',   label: T('myOrders')  },
                          { href: '/account/wishlist', label: T('wishlist')  },
                          { href: '/order-tracking',   label: T('trackOrder')},
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                        {(user as any)?.role !== 'CUSTOMER' && (
                          <Link
                            href="/admin"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-spice-600 hover:bg-spice-50 transition-colors"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5" /> {T('adminPanel')}
                          </Link>
                        )}
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            {T('logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="hidden sm:flex items-center gap-1">
                    <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-700 hover:text-brand-700 hover:bg-gray-50 transition-colors">
                      <User className="w-3.5 h-3.5" /> {T('login')}
                    </Link>
                    <span className="text-gray-200 text-sm">/</span>
                    <Link href="/register" className="px-3 py-1.5 text-xs font-semibold rounded-lg text-white bg-brand-700 hover:bg-brand-800 transition-colors">
                      {T('register')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/account/wishlist" className="btn-icon relative" aria-label={T('wishlist')}>
                <Heart className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button onClick={openCart} className="btn-icon relative" aria-label={T('cart')}>
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </button>

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
                aria-label={T('menu')}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden border-t border-gray-100 bg-gray-50 px-4 py-2">
          <SearchBar mobile className="w-full" lang={lang} />
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          2. CATEGORY NAVIGATION BAR — dynamic from API
          ════════════════════════════════════════════════ */}
      <div className="bg-brand-800 border-b border-brand-700">
        <div className="container mx-auto px-4">

          {/* Desktop */}
          <div className="hidden md:flex items-center h-10 gap-0.5 overflow-x-auto scrollbar-hide">

            {/* "All Products" — always first */}
            <Link
              href="/shop"
              className={cn(
                'flex items-center gap-1.5 px-3 h-10 text-xs font-semibold whitespace-nowrap flex-shrink-0 rounded-lg transition-colors',
                pathname === '/shop'
                  ? 'text-white bg-brand-600'
                  : 'text-brand-200 hover:text-white hover:bg-brand-700',
              )}
            >
              <span className="text-sm leading-none">🛒</span>
              {T('allProducts')}
            </Link>

            {/* API-driven categories */}
            {catsLoading ? (
              <div className="flex items-center gap-1 px-3 text-brand-300 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
            ) : (
              visibleCats.map((cat) => {
                const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-1.5 px-3 h-10 text-xs font-medium whitespace-nowrap flex-shrink-0 rounded-lg transition-colors',
                      active
                        ? 'text-white bg-brand-600'
                        : 'text-brand-200 hover:text-white hover:bg-brand-700',
                    )}
                  >
                    {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                    {catName(cat, lang)}
                  </Link>
                );
              })
            )}

            {/* "More" overflow dropdown */}
            {overflowCats.length > 0 && (
              <div ref={moreRef} className="relative flex-shrink-0">
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className={cn(
                    'flex items-center gap-1 px-3 h-10 text-xs font-medium rounded-lg transition-colors',
                    moreOpen ? 'text-white bg-brand-600' : 'text-brand-200 hover:text-white hover:bg-brand-700',
                  )}
                >
                  {T('more')}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', moreOpen && 'rotate-180')} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 w-52 animate-fade-up">
                    {overflowCats.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                      >
                        {cat.icon && <span className="text-base">{cat.icon}</span>}
                        {catName(cat, lang)}
                      </Link>
                    ))}
                    <div className="border-t border-gray-50 mt-1 pt-1 mx-3">
                      <Link
                        href="/categories"
                        onClick={() => setMoreOpen(false)}
                        className="flex px-1 py-1.5 text-xs text-brand-600 hover:text-brand-800 font-medium"
                      >
                        {T('viewAllCats')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile — horizontally scrollable pills */}
          <div className="md:hidden flex items-center gap-1.5 h-10 overflow-x-auto scrollbar-hide">
            {/* All products */}
            <Link
              href="/shop"
              className={cn(
                'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full transition-colors whitespace-nowrap',
                pathname === '/shop' ? 'bg-white text-brand-700' : 'text-brand-200 bg-brand-700/40 hover:bg-brand-700',
              )}
            >
              🛒 {T('allProducts')}
            </Link>

            {/* API categories */}
            {navCats.map((cat) => {
              const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap',
                    active ? 'bg-white text-brand-700' : 'text-brand-200 bg-brand-700/40 hover:bg-brand-700',
                  )}
                >
                  {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                  {catName(cat, lang)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          3. ANNOUNCEMENT BAR — bilingual, rotating
          ════════════════════════════════════════════════ */}
      <AnnouncementBar lang={lang} />

      {/* ════════════════════════════════════════════════
          MOBILE FULL MENU
          ════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg max-h-[75vh] overflow-y-auto">
          <nav className="container mx-auto px-4 py-3">

            {/* Language toggle at top */}
            <div className="flex gap-2 mb-4 pb-3 border-b border-gray-100">
              {(['bn', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    'flex-1 py-2 text-sm font-semibold rounded-xl border transition-colors flex items-center justify-center gap-1.5',
                    lang === l
                      ? 'bg-brand-700 text-white border-brand-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300',
                  )}
                >
                  {l === 'bn' ? <>🇧🇩 বাংলা</> : <>🇬🇧 English</>}
                </button>
              ))}
            </div>

            {/* Top links */}
            {TOP_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('flex py-2.5 text-sm font-medium border-b border-gray-50 transition-colors', pathname === link.href ? 'text-brand-700' : 'text-gray-700')}
              >
                {lang === 'bn' ? link.bn : link.en}
              </Link>
            ))}

            <Link href="/order-tracking" className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50">
              <Package className="w-4 h-4 text-gray-400" /> {T('trackOrder')}
            </Link>

            {/* Categories */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">
              {lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
            </p>

            <Link
              href="/shop"
              className="flex items-center gap-2 py-2.5 text-sm text-gray-700 border-b border-gray-50"
            >
              🛒 {T('allProducts')}
            </Link>

            {navCats.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2.5 py-2.5 text-sm text-gray-700 border-b border-gray-50 last:border-0"
              >
                {cat.icon && <span className="text-base">{cat.icon}</span>}
                {catName(cat, lang)}
              </Link>
            ))}

            {/* Auth */}
            {!isAuthenticated && (
              <div className="pt-4 flex gap-2">
                <Link href="/login"    className="btn-primary  flex-1 justify-center text-sm py-2.5">{T('login')}</Link>
                <Link href="/register" className="btn-secondary flex-1 justify-center text-sm py-2.5">{T('register')}</Link>
              </div>
            )}
            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-100 mt-2">
                <Link href="/account" className="flex items-center gap-2 py-2.5 text-sm text-gray-700">
                  <User className="w-4 h-4 text-gray-400" /> {T('myAccount')}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 text-sm text-red-500 w-full">
                  {T('logout')}
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// ── Announcement Bar ───────────────────────────────────────
// Separate component so it can be tested independently
import { Truck, Tag, Gift, Zap } from 'lucide-react';

function AnnouncementBar({ lang }: { lang: Lang }) {
  const [idx,       setIdx]       = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const MESSAGES: { icon: React.ElementType; bn: string; en: string }[] = [
    { icon: Truck, bn: '৳১০০০+ অর্ডারে সারাদেশে ফ্রি ডেলিভারি',     en: 'Free delivery on orders over ৳1000 nationwide'        },
    { icon: Tag,   bn: 'কোড WELCOME10 — নতুন গ্রাহকদের ১০% ছাড়',   en: 'Code WELCOME10 — 10% off for new customers'           },
    { icon: Gift,  bn: 'ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ',           en: 'Cash on Delivery available'                           },
    { icon: Zap,   bn: 'ঢাকায় একইদিন ডেলিভারি — সকাল ১১টার আগে', en: 'Same-day delivery in Dhaka — order before 11 AM'       },
  ];

  useEffect(() => {
    const timer = setInterval(() => setIdx((c) => (c + 1) % MESSAGES.length), 3500);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line

  if (dismissed) return null;

  const { icon: Icon, bn, en } = MESSAGES[idx];
  const text = lang === 'en' ? en : bn;

  return (
    <div className="bg-spice-600 text-white text-xs relative overflow-hidden">
      <div className="container mx-auto px-4 h-8 flex items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
          <Icon className="w-3.5 h-3.5 flex-shrink-0 opacity-90" />
          <p key={`${idx}-${lang}`} className="font-medium tracking-wide truncate text-center animate-fade-up">
            {text}
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity ml-2"
          aria-label={lang === 'en' ? 'Close' : 'বন্ধ করুন'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
