'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Package, LayoutDashboard, Loader2, Search,
  LogOut, Settings, ChevronRight, Globe, Bell,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn, formatPriceEn } from '@/lib/utils';
import { t, catName } from '@/lib/translations';
import { useLanguageStore, type Lang } from '@/store/language.store';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useNavCategories } from '@/hooks/useCategories';
import { SearchBar } from './SearchBar';
import { useWishlistStore } from '@/store/wishlist.store';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import toast from 'react-hot-toast';

const NAV_VISIBLE = 12;

// ── Action button — icon + label stacked ──────────────────
function ActionBtn({
  onClick, href, icon: Icon, label, badge, active, className,
}: {
  onClick?: () => void;
  href?: string;
  icon: React.ElementType;
  label: string;
  badge?: number | null;
  active?: boolean;
  className?: string;
}) {
  const cls = cn(
    'relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer select-none',
    'hover:bg-gray-50 active:bg-gray-100',
    active && 'text-forest-700',
    !active && 'text-gray-500 hover:text-gray-800',
    className,
  );
  const inner = (
    <>
      <div className="relative flex-shrink-0">
        <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.5 : 2} />
        {badge !== undefined && badge !== null && badge > 0 && (
          <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-spice-500 rounded-full border border-white leading-none shadow-sm">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-semibold leading-none whitespace-nowrap tracking-tight">
        {label}
      </span>
    </>
  );
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls} type="button">{inner}</button>;
}

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { lang, setLang }                              = useLanguageStore();
  const { getItemCount, getTotals, openCart }          = useCartStore();
  const { user, isAuthenticated, logout }              = useAuthStore();
  const { data: navCats = [], isLoading: catsLoading } = useNavCategories();
  const wishCount = useWishlistStore((s) => s.items.length);

  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [scrollY,     setScrollY]     = useState(0);

  const moreRef    = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef    = useRef<HTMLDivElement>(null);

  const itemCount    = getItemCount();
  const cartTotal    = getTotals().grandTotal;
  const visibleCats  = navCats.slice(0, NAV_VISIBLE);
  const overflowCats = navCats.slice(NAV_VISIBLE);
  const T = (key: Parameters<typeof t>[0]) => t(key, lang);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setDrawerOpen(false); setMobileSearch(false); }, [pathname]);

  useEffect(() => {
    function h(e: MouseEvent) {
      if (moreRef.current    && !moreRef.current.contains(e.target as Node))    setMoreOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
      if (langRef.current    && !langRef.current.contains(e.target as Node))    setLangOpen(false);
    }
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  async function handleLogout() {
    setAccountOpen(false);
    await logout();
    toast.success(lang === 'bn' ? 'লগআউট হয়েছে' : 'Logged out');
    router.push('/');
  }

  // Scroll thresholds
  const dtScrolled    = scrollY > 34;          // after ann bar height
  const dtAnnHidden   = scrollY > 34;          // announcement hides
  const mbAnnHidden   = scrollY > 56;          // mobile: hide ann after main header

  return (
    <>
      {/* ══════════════════════════════════════════════════
          DESKTOP  (≥ lg)
      ══════════════════════════════════════════════════ */}
      <div className="hidden lg:block sticky top-0 z-50">

        {/* Layer 1 — Announcement Bar — h-[34px] — hides on scroll */}
        <div className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
          dtAnnHidden ? 'max-h-0 opacity-0' : 'max-h-[34px] opacity-100',
        )}>
          <AnnouncementBar />
        </div>

        {/* Layer 2 — Main Header — h-[72px] */}
        <div className={cn(
          'bg-white transition-shadow duration-300',
          dtScrolled ? 'shadow-md shadow-black/[0.06]' : 'border-b border-gray-100',
        )}>
          <div className="container mx-auto px-4 xl:px-6">
            <div className="flex items-center h-[72px] gap-3 xl:gap-5">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group mr-1">
                <div className="relative w-10 h-10 xl:w-11 xl:h-11">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-forest-900 rounded-[14px] shadow-sm shadow-forest-900/20 transition-transform duration-200 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-[14px] leading-none tracking-tight">দম</span>
                  </div>
                  <div className="absolute top-[5px] right-[5px] w-[5px] h-[5px] bg-white/50 rounded-full" />
                </div>
                <div className="leading-none hidden xl:block">
                  <p className="text-gray-900 font-black text-[15px] leading-snug tracking-tight">দেশি মসলার</p>
                  <p className="text-forest-700 text-[10px] font-bold tracking-[0.18em] uppercase mt-0.5">রান্নাঘর</p>
                </div>
              </Link>

              {/* Search — takes remaining space */}
              <div className="flex-1 min-w-0 max-w-[560px]">
                <SearchBar className="w-full" lang={lang} />
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-0.5 xl:gap-1 ml-auto flex-shrink-0">

                {/* Language */}
                <div ref={langRef} className="relative">
                  <button
                    onClick={() => setLangOpen(o => !o)}
                    className={cn(
                      'flex flex-col items-center justify-center gap-0.5 px-2.5 py-2 rounded-xl transition-all duration-150',
                      'text-gray-500 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100',
                    )}
                  >
                    <Globe className="w-[22px] h-[22px]" strokeWidth={2} />
                    <span className="text-[10px] font-semibold leading-none">
                      {lang === 'bn' ? 'বাংলা' : 'EN'}
                    </span>
                  </button>
                  {langOpen && (
                    <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl shadow-black/10 z-50 w-[130px] py-1 animate-fade-down">
                      {(['bn', 'en'] as Lang[]).map(l => (
                        <button key={l} onClick={() => { setLang(l); setLangOpen(false); }}
                          className={cn(
                            'w-full text-left px-3 py-2.5 text-sm flex items-center gap-2.5 transition-colors',
                            lang === l ? 'text-forest-700 bg-forest-50 font-bold' : 'text-gray-600 hover:bg-gray-50',
                          )}>
                          <span className="text-base">{l === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                          <span className="font-medium">{l === 'bn' ? 'বাংলা' : 'English'}</span>
                          {lang === l && <span className="ml-auto text-forest-600 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Track Order */}
                <ActionBtn
                  href="/order-tracking"
                  icon={Package}
                  label={T('trackOrder')}
                  active={pathname === '/order-tracking'}
                />

                {/* Account */}
                <div ref={accountRef} className="relative">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setAccountOpen(o => !o)}
                        className={cn(
                          'relative flex flex-col items-center justify-center gap-0.5 px-2.5 py-2 rounded-xl',
                          'transition-all duration-150 hover:bg-gray-50 active:bg-gray-100',
                          accountOpen ? 'bg-gray-50' : '',
                        )}
                      >
                        {user?.avatar ? (
                          <Image src={user.avatar} alt={user.name ?? ''} width={26} height={26}
                            className="w-[26px] h-[26px] rounded-full object-cover border-2 border-forest-200" />
                        ) : (
                          <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-spice-400 to-spice-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-black">{user?.name?.charAt(0) ?? 'গ'}</span>
                          </div>
                        )}
                        <span className="text-[10px] font-semibold leading-none text-gray-600 whitespace-nowrap">
                          {user?.name?.split(' ')[0] ?? T('myAccount')}
                        </span>
                      </button>

                      {/* Account dropdown */}
                      {accountOpen && (
                        <div className="absolute top-full right-0 mt-1.5 bg-white rounded-2xl shadow-2xl shadow-black/12 border border-gray-100/80 z-50 w-[220px] overflow-hidden animate-fade-down">
                          {/* User card */}
                          <div className="px-4 py-3 bg-gradient-to-br from-forest-700 to-forest-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-black text-sm">{user?.name?.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>
                          {/* Links */}
                          <div className="py-1">
                            {[
                              { href: '/account',          label: T('myAccount'), icon: User },
                              { href: '/account/orders',   label: T('myOrders'),  icon: Package },
                              { href: '/account/wishlist', label: T('wishlist'),  icon: Heart },
                              { href: '/account/settings', label: 'সেটিংস',      icon: Settings },
                            ].map(({ href, label, icon: Icon }) => (
                              <Link key={href} href={href} onClick={() => setAccountOpen(false)}
                                className={cn(
                                  'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                                  pathname === href ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                                )}>
                                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                {label}
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                              </Link>
                            ))}
                            {(user as any)?.role !== 'CUSTOMER' && (
                              <Link href="/admin" onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-spice-600 hover:bg-spice-50 transition-colors">
                                <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> {T('adminPanel')}
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-gray-100">
                            <button onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4 flex-shrink-0" /> {T('logout')}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Guest */
                    <div className="flex items-center gap-1">
                      <Link href="/login"
                        className="flex flex-col items-center justify-center gap-0.5 px-2.5 py-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all">
                        <User className="w-[22px] h-[22px]" strokeWidth={2} />
                        <span className="text-[10px] font-semibold leading-none">{T('login')}</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <ActionBtn
                  href="/account/wishlist"
                  icon={Heart}
                  label={T('wishlist')}
                  badge={wishCount}
                  active={pathname.startsWith('/account/wishlist')}
                />

                {/* Cart */}
                <button
                  onClick={openCart}
                  className="relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 ml-1 rounded-xl bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white transition-all duration-150 shadow-sm shadow-forest-800/25 hover:shadow-md"
                >
                  <div className="relative">
                    <ShoppingCart className="w-[22px] h-[22px]" strokeWidth={2} />
                    {itemCount > 0 && (
                      <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-spice-500 rounded-full border border-forest-700 leading-none shadow-sm">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold leading-none whitespace-nowrap">
                    {itemCount > 0 ? formatPriceEn(cartTotal) : T('cart')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layer 3 — Category Nav — h-[46px] — always sticky */}
        <div className={cn(
          'bg-forest-700 transition-shadow duration-300',
          dtScrolled && 'shadow-lg shadow-forest-900/30',
        )}>
          <div className="container mx-auto px-4 xl:px-6">
            <div className="flex items-stretch h-[46px] overflow-x-auto scrollbar-hide">

              {/* All products */}
              <Link href="/shop"
                className={cn(
                  'flex items-center gap-1.5 px-4 h-full text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-2',
                  pathname === '/shop'
                    ? 'text-white border-white bg-white/10'
                    : 'text-white/90 border-transparent hover:text-white hover:bg-white/8 hover:border-white/40',
                )}>
                <Menu className="w-[15px] h-[15px]" strokeWidth={2.5} />
                {T('allProducts')}
              </Link>

              {/* Divider */}
              <div className="w-px bg-white/15 my-[10px] mx-1 flex-shrink-0" />

              {/* Dynamic categories from API/CMS */}
              {catsLoading ? (
                <div className="flex items-center gap-2 px-4 text-white/40 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              ) : visibleCats.map(cat => {
                const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
                return (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-1 px-3 h-full text-[13px] font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-2',
                      active
                        ? 'text-white border-white bg-white/10'
                        : 'text-white/82 border-transparent hover:text-white hover:bg-white/8 hover:border-white/35',
                    )}>
                    {cat.icon && <span className="text-[13px] leading-none">{cat.icon}</span>}
                    {catName(cat, lang)}
                  </Link>
                );
              })}

              {/* More dropdown */}
              {overflowCats.length > 0 && (
                <div ref={moreRef} className="relative flex items-center flex-shrink-0">
                  <button onClick={() => setMoreOpen(o => !o)}
                    className={cn(
                      'flex items-center gap-1 px-3 h-full text-[13px] font-medium whitespace-nowrap border-b-2 transition-all duration-150',
                      moreOpen
                        ? 'text-white border-white bg-white/10'
                        : 'text-white/82 border-transparent hover:text-white hover:bg-white/8',
                    )}>
                    {T('more')}
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', moreOpen && 'rotate-180')} />
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-2xl shadow-black/12 border border-gray-100 py-1.5 z-50 w-[200px] animate-fade-down">
                      {overflowCats.map(cat => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMoreOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            pathname.startsWith(`/category/${cat.slug}`) ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                          )}>
                          {cat.icon && <span className="text-base w-5 text-center flex-shrink-0">{cat.icon}</span>}
                          <span className="truncate">{catName(cat, lang)}</span>
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1 mx-2">
                        <Link href="/categories" onClick={() => setMoreOpen(false)}
                          className="flex items-center gap-1 px-2 py-1.5 text-xs text-forest-700 font-semibold hover:text-forest-900 transition-colors">
                          {T('viewAllCats')} <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
          MOBILE  (< lg)
      ══════════════════════════════════════════════════ */}
      <div className="lg:hidden sticky top-0 z-50">

        {/* Main bar — h-14 (56px) — ☰ | Logo | Wishlist + Cart */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center h-14 px-3 gap-2">

            {/* ☰ Hamburger */}
            <button
              onClick={() => setDrawerOpen(o => !o)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
              aria-label="মেনু খুলুন"
            >
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Center — Logo/Brand */}
            <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0 mx-1">
              <span className="text-forest-800 font-black text-[15px] leading-tight tracking-tight truncate font-bengali">
                দেশি মসলার রান্নাঘর
              </span>
              <span className="text-gray-400 text-[9px] font-medium tracking-[0.15em] uppercase leading-none font-sans">
                Deshi Moslar Rannaghar
              </span>
            </Link>

            {/* Right — Search + Wishlist + Cart */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {/* Search toggle */}
              <button
                onClick={() => setMobileSearch(o => !o)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="সার্চ"
              >
                <Search className="w-[20px] h-[20px]" strokeWidth={2} />
              </button>

              {/* Wishlist */}
              <Link href="/account/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <Heart className="w-[20px] h-[20px]" strokeWidth={2} />
                {wishCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] min-w-[16px] h-[16px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-red-500 rounded-full border border-white leading-none">
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-forest-700 text-white hover:bg-forest-800 active:bg-forest-900 transition-colors ml-0.5"
                aria-label="কার্ট"
              >
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] min-w-[16px] h-[16px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-spice-500 rounded-full border border-forest-700 leading-none shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Full-width Search — slides down */}
          <div className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            mobileSearch ? 'max-h-[60px] opacity-100' : 'max-h-0 opacity-0',
          )}>
            <div className="px-3 pt-1 pb-2.5">
              <SearchBar mobile className="w-full" lang={lang} />
            </div>
          </div>
        </div>

        {/* Announcement — hides on scroll */}
        <div className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          mbAnnHidden ? 'max-h-0 opacity-0' : 'max-h-[36px] opacity-100',
        )}>
          <AnnouncementBar />
        </div>
      </div>


      {/* ══════════════════════════════════════════════════
          MOBILE FULL DRAWER
      ══════════════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-[82vw] max-w-[300px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">

            {/* Header */}
            <div className="bg-gradient-to-br from-forest-700 to-forest-900 px-5 pt-11 pb-5">
              <button onClick={() => setDrawerOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-base">{user?.name?.charAt(0) ?? 'গ'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate">{user?.name}</p>
                    <p className="text-white/55 text-xs truncate">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 text-sm mb-2.5">স্বাগতম!</p>
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setDrawerOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white text-forest-700 hover:bg-forest-50 transition-colors">
                      লগইন
                    </Link>
                    <Link href="/register" onClick={() => setDrawerOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white/15 text-white border border-white/25 hover:bg-white/25 transition-colors">
                      নিবন্ধন
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language toggle */}
            <div className="flex border-b border-gray-100">
              {(['bn', 'en'] as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-semibold transition-colors',
                    lang === l ? 'text-forest-700 bg-forest-50' : 'text-gray-400 hover:bg-gray-50',
                  )}>
                  {l === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto overscroll-contain">
              {/* Main links */}
              {[
                { href: '/',               label: T('home'),        emoji: '🏠' },
                { href: '/shop',           label: T('allProducts'), emoji: '🛒' },
                { href: '/blog',           label: T('blog'),        emoji: '📖' },
                { href: '/order-tracking', label: T('trackOrder'),  emoji: '📦' },
              ].map(({ href, label, emoji }) => (
                <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors',
                    pathname === href ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                  )}>
                  <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                </Link>
              ))}

              {/* Categories — CMS driven */}
              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">ক্যাটাগরি</p>
              </div>
              {navCats.map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setDrawerOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm border-b border-gray-50 transition-colors',
                    pathname.startsWith(`/category/${cat.slug}`) ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                  )}>
                  <span className="text-base w-6 text-center flex-shrink-0">{cat.icon ?? '🛒'}</span>
                  <span className="flex-1">{catName(cat, lang)}</span>
                </Link>
              ))}

              {/* Account */}
              {isAuthenticated && (
                <>
                  <div className="px-4 pt-3 pb-1.5 mt-0.5 border-t border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">অ্যাকাউন্ট</p>
                  </div>
                  {[
                    { href: '/account',          label: T('myAccount'), emoji: '👤' },
                    { href: '/account/orders',   label: T('myOrders'),  emoji: '📋' },
                    { href: '/account/wishlist', label: T('wishlist'),  emoji: '❤️' },
                    { href: '/account/settings', label: 'সেটিংস',      emoji: '⚙️' },
                  ].map(({ href, label, emoji }) => (
                    <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2.5 text-sm border-b border-gray-50 transition-colors',
                        pathname === href ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                      )}>
                      <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <span className="text-base w-6 text-center flex-shrink-0">🚪</span>
                    <span className="flex-1 text-left">{T('logout')}</span>
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
