'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Package, LayoutDashboard, Loader2, Search,
  LogOut, Settings, ChevronRight, Globe,
  Home, BookOpen,
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

export function Header() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { lang, setLang }                              = useLanguageStore();
  const { getItemCount, getTotals, openCart }          = useCartStore();
  const { user, isAuthenticated, logout }              = useAuthStore();
  const { data: navCats = [], isLoading: catsLoading } = useNavCategories();
  const wishCount = useWishlistStore((s) => s.items.length);

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [moreOpen,     setMoreOpen]     = useState(false);
  const [accountOpen,  setAccountOpen]  = useState(false);
  const [langOpen,     setLangOpen]     = useState(false);
  const [scrollY,      setScrollY]      = useState(0);

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

  const isScrolled     = scrollY > 34;   // after ann bar
  const annHideDesktop = scrollY > 34;
  const annHideMobile  = scrollY > 56;

  return (
    <>
      {/* ╔═══════════════════════════════════════╗
          ║  DESKTOP  ≥ lg                        ║
          ╚═══════════════════════════════════════╝ */}
      <div className="hidden lg:block sticky top-0 z-50 bg-white">

        {/* ── Layer 1: Announcement 34px ── */}
        <div className={cn(
          'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
          annHideDesktop ? 'max-h-0 opacity-0' : 'max-h-[34px] opacity-100',
        )}>
          <AnnouncementBar />
        </div>

        {/* ── Layer 2: Main Header 72px ── */}
        <div className={cn(
          'border-b border-gray-100 bg-white transition-shadow duration-300',
          isScrolled ? 'shadow-md shadow-black/[0.07]' : 'shadow-none',
        )}>
          <div className="container mx-auto px-4 xl:px-6">
            <div className="flex items-center h-[72px] gap-4">

              {/* ── LEFT: Logo + Home + Blog ── */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mr-2 group">
                  {/* Logo mark */}
                  <div className="relative w-[42px] h-[42px] flex-shrink-0">
                    <div className="absolute inset-0 rounded-[13px] bg-gradient-to-br from-forest-600 via-forest-700 to-forest-900 shadow-md shadow-forest-800/30 transition-transform duration-200 group-hover:scale-105" />
                    {/* Inner ring */}
                    <div className="absolute inset-[3px] rounded-[10px] border border-white/20 flex items-center justify-center">
                      <span className="text-white font-black text-[16px] leading-none" style={{ fontFamily: 'Noto Sans Bengali, serif' }}>
                        দম
                      </span>
                    </div>
                    <div className="absolute top-[6px] right-[6px] w-[5px] h-[5px] rounded-full bg-white/45" />
                  </div>
                  {/* Brand text */}
                  <div className="leading-none hidden xl:block">
                    <p className="text-gray-900 font-black text-[17px] leading-snug tracking-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                      দেশি মসলার রান্নাঘর
                    </p>
                    <p className="text-forest-700 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Deshi Moslar Rannaghar
                    </p>
                  </div>
                </Link>

                {/* Home link */}
                <Link href="/"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                    pathname === '/'
                      ? 'text-forest-700 bg-forest-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  )}>
                  <Home className="w-4 h-4" strokeWidth={2} />
                  <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('home')}</span>
                </Link>

                {/* Blog link */}
                <Link href="/blog"
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all',
                    pathname === '/blog'
                      ? 'text-forest-700 bg-forest-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  )}>
                  <BookOpen className="w-4 h-4" strokeWidth={2} />
                  <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('blog')}</span>
                </Link>
              </div>

              {/* ── CENTER: Search ── */}
              <div className="flex-1 min-w-0 max-w-[520px] mx-4">
                <SearchBar className="w-full" lang={lang} />
              </div>

              {/* ── RIGHT: Actions with spacing ── */}
              <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">

                {/* Language */}
                <div ref={langRef} className="relative">
                  <button
                    onClick={() => setLangOpen(o => !o)}
                    className="flex flex-col items-center justify-center gap-0.5 w-[56px] h-[52px] rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all text-gray-500 hover:text-gray-800"
                  >
                    <Globe className="w-5 h-5" strokeWidth={1.75} />
                    <span className="text-[10px] font-semibold leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {lang === 'bn' ? 'বাংলা' : 'EN'}
                    </span>
                  </button>
                  {langOpen && (
                    <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-2xl shadow-black/10 z-50 w-[140px] py-1 animate-fade-down">
                      {(['bn', 'en'] as Lang[]).map(l => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => { setLang(l); setLangOpen(false); }}
                          className={cn(
                            'w-full text-left px-3.5 py-2.5 text-sm flex items-center gap-2.5 transition-colors',
                            lang === l ? 'text-forest-700 bg-forest-50 font-bold' : 'text-gray-600 hover:bg-gray-50',
                          )}
                        >
                          <span className="text-base">{l === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                          <span className="font-semibold">{l === 'bn' ? 'বাংলা' : 'English'}</span>
                          {lang === l && <span className="ml-auto text-forest-600 text-xs">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Track Order */}
                <Link href="/order-tracking"
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 w-[56px] h-[52px] rounded-xl transition-all',
                    pathname === '/order-tracking' ? 'text-forest-700 bg-forest-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                  )}>
                  <Package className="w-5 h-5" strokeWidth={1.75} />
                  <span className="text-[10px] font-semibold leading-none whitespace-nowrap" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    {T('trackOrder')}
                  </span>
                </Link>

                {/* Account */}
                <div ref={accountRef} className="relative">
                  {isAuthenticated ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setAccountOpen(o => !o)}
                        className={cn(
                          'flex flex-col items-center justify-center gap-0.5 w-[56px] h-[52px] rounded-xl transition-all',
                          accountOpen ? 'bg-gray-50 text-gray-800' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                        )}
                      >
                        {user?.avatar ? (
                          <Image src={user.avatar} alt={user.name ?? ''} width={26} height={26}
                            className="w-[26px] h-[26px] rounded-full object-cover border-2 border-forest-200" />
                        ) : (
                          <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-spice-400 to-spice-600 flex items-center justify-center">
                            <span className="text-white text-[11px] font-black leading-none">{user?.name?.charAt(0) ?? 'গ'}</span>
                          </div>
                        )}
                        <span className="text-[10px] font-semibold leading-none truncate max-w-[52px]" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                          {user?.name?.split(' ')[0] ?? T('myAccount')}
                        </span>
                      </button>

                      {accountOpen && (
                        <div className="absolute top-full right-0 mt-1.5 bg-white rounded-2xl shadow-2xl shadow-black/12 border border-gray-100 z-50 w-[220px] overflow-hidden animate-fade-down">
                          <div className="px-4 py-3 bg-gradient-to-br from-forest-700 to-forest-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-black text-sm">{user?.name?.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[11px] text-white/55 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>
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
                                <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{label}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                              </Link>
                            ))}
                            {(user as any)?.role !== 'CUSTOMER' && (
                              <Link href="/admin" onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-spice-600 hover:bg-spice-50 transition-colors">
                                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                                <span>{T('adminPanel')}</span>
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-gray-100">
                            <button type="button" onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4 flex-shrink-0" />
                              <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('logout')}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login"
                      className={cn(
                        'flex flex-col items-center justify-center gap-0.5 w-[56px] h-[52px] rounded-xl transition-all',
                        'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                      )}>
                      <User className="w-5 h-5" strokeWidth={1.75} />
                      <span className="text-[10px] font-semibold leading-none" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                        {T('login')}
                      </span>
                    </Link>
                  )}
                </div>

                {/* Wishlist */}
                <Link href="/account/wishlist"
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 w-[56px] h-[52px] rounded-xl transition-all',
                    pathname.startsWith('/account/wishlist') ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50',
                  )}>
                  <div className="relative">
                    <Heart className="w-5 h-5" strokeWidth={1.75} />
                    {wishCount > 0 && (
                      <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-red-500 rounded-full border border-white leading-none">
                        {wishCount > 9 ? '9+' : wishCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold leading-none" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    {T('wishlist')}
                  </span>
                </Link>

                {/* Cart — primary CTA */}
                <button type="button" onClick={openCart}
                  className="relative flex items-center gap-2.5 h-[44px] px-4 ml-1 rounded-xl bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white transition-all shadow-sm shadow-forest-800/25 hover:shadow-md">
                  <div className="relative">
                    <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
                    {itemCount > 0 && (
                      <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-spice-500 rounded-full border border-forest-700 leading-none shadow-sm">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </div>
                  <div className="leading-none hidden xl:block">
                    <div className="text-[11px] font-semibold opacity-80" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                      {T('cart')}
                    </div>
                    <div className="text-[13px] font-black" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {itemCount > 0 ? formatPriceEn(cartTotal) : '৳০'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Layer 3: Category Nav 46px — always sticky ── */}
        <div className={cn(
          'bg-gradient-to-r from-[#0f4c2a] via-[#0f4c2a] to-[#0d4425] transition-shadow duration-300',
          isScrolled && 'shadow-lg shadow-forest-900/25',
        )}>
          <div className="container mx-auto px-4 xl:px-6">
            <div className="flex items-stretch h-[46px] overflow-x-auto scrollbar-hide">

              {/* All Products — 3-bar icon */}
              <Link href="/shop"
                className={cn(
                  'flex items-center gap-2 px-4 h-full text-[14px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-2',
                  pathname === '/shop'
                    ? 'text-white border-white bg-white/10'
                    : 'text-white/90 border-transparent hover:text-white hover:bg-white/8 hover:border-white/40',
                )}>
                <svg className="w-[17px] h-[17px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('allProducts')}</span>
              </Link>

              <div className="w-px bg-white/15 my-[9px] mx-0.5 flex-shrink-0" />

              {/* Dynamic categories from CMS/API */}
              {catsLoading ? (
                <div className="flex items-center gap-2 px-4 text-white/40">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              ) : visibleCats.map(cat => {
                const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
                return (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 h-full text-[13.5px] font-medium whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-2',
                      active
                        ? 'text-white border-white bg-white/12 font-semibold'
                        : 'text-white/85 border-transparent hover:text-white hover:bg-white/8 hover:border-white/30',
                    )}>
                    {cat.icon && <span className="text-[14px] leading-none">{cat.icon}</span>}
                    <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{catName(cat, lang)}</span>
                  </Link>
                );
              })}

              {/* More dropdown */}
              {overflowCats.length > 0 && (
                <div ref={moreRef} className="relative flex items-center flex-shrink-0">
                  <button type="button" onClick={() => setMoreOpen(o => !o)}
                    className={cn(
                      'flex items-center gap-1 px-3.5 h-full text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-all duration-150',
                      moreOpen ? 'text-white border-white bg-white/12' : 'text-white/85 border-transparent hover:text-white hover:bg-white/8',
                    )}>
                    <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('more')}</span>
                    <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', moreOpen && 'rotate-180')} />
                  </button>
                  {moreOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl shadow-black/12 border border-gray-100 py-1.5 z-50 w-[200px] animate-fade-down">
                      {overflowCats.map(cat => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMoreOpen(false)}
                          className={cn(
                            'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                            pathname.startsWith(`/category/${cat.slug}`) ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50',
                          )}>
                          {cat.icon && <span className="text-base w-5 text-center flex-shrink-0">{cat.icon}</span>}
                          <span className="truncate" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{catName(cat, lang)}</span>
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


      {/* ╔═══════════════════════════════════════╗
          ║  MOBILE  < lg                         ║
          ╚═══════════════════════════════════════╝ */}
      <div className="lg:hidden sticky top-0 z-50">

        {/* Main bar — h-14 */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center h-14 px-3 gap-2">

            {/* ☰ */}
            <button type="button" onClick={() => setDrawerOpen(o => !o)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0">
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Center logo */}
            <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-0.5 min-w-0">
              <span className="text-forest-800 font-black text-[15px] leading-tight tracking-tight truncate" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                দেশি মসলার রান্নাঘর
              </span>
              <span className="text-gray-400 text-[9px] font-medium tracking-[0.15em] uppercase leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
                Deshi Moslar Rannaghar
              </span>
            </Link>

            {/* Search + Wishlist + Cart */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button type="button" onClick={() => setMobileSearch(o => !o)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <Search className="w-[20px] h-[20px]" strokeWidth={2} />
              </button>
              <Link href="/account/wishlist"
                className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <Heart className="w-[20px] h-[20px]" strokeWidth={2} />
                {wishCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] min-w-[15px] h-[15px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-red-500 rounded-full border border-white leading-none">
                    {wishCount > 9 ? '9+' : wishCount}
                  </span>
                )}
              </Link>
              <button type="button" onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-forest-700 text-white hover:bg-forest-800 active:bg-forest-900 transition-colors ml-0.5">
                <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-[3px] -right-[3px] min-w-[15px] h-[15px] px-0.5 flex items-center justify-center text-[8px] font-black text-white bg-spice-500 rounded-full border border-forest-700 leading-none">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Slide-down search */}
          <div className={cn(
            'overflow-hidden transition-all duration-300',
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
          annHideMobile ? 'max-h-0 opacity-0' : 'max-h-[36px] opacity-100',
        )}>
          <AnnouncementBar />
        </div>
      </div>


      {/* ╔═══════════════════════════════════════╗
          ║  MOBILE DRAWER                        ║
          ╚═══════════════════════════════════════╝ */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[82vw] max-w-[300px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">

            {/* Header */}
            <div className="bg-gradient-to-br from-forest-700 to-forest-900 px-5 pt-11 pb-5">
              <button type="button" onClick={() => setDrawerOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors">
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-base">{user?.name?.charAt(0) ?? 'গ'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm truncate" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{user?.name}</p>
                    <p className="text-white/55 text-xs truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 text-sm mb-2.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>স্বাগতম!</p>
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
                <button key={l} type="button" onClick={() => { setLang(l); }}
                  className={cn('flex-1 py-2.5 text-sm font-semibold transition-colors',
                    lang === l ? 'text-forest-700 bg-forest-50' : 'text-gray-400 hover:bg-gray-50')}>
                  {l === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            <nav className="flex-1 overflow-y-auto overscroll-contain">
              {[
                { href: '/',               label: T('home'),        emoji: '🏠' },
                { href: '/shop',           label: T('allProducts'), emoji: '🛒' },
                { href: '/blog',           label: T('blog'),        emoji: '📖' },
                { href: '/order-tracking', label: T('trackOrder'),  emoji: '📦' },
              ].map(({ href, label, emoji }) => (
                <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                  className={cn('flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors',
                    pathname === href ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}>
                  <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                  <span className="flex-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                </Link>
              ))}

              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]" style={{ fontFamily: 'Inter, sans-serif' }}>ক্যাটাগরি</p>
              </div>
              {navCats.map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setDrawerOpen(false)}
                  className={cn('flex items-center gap-3 px-4 py-2.5 text-sm border-b border-gray-50 transition-colors',
                    pathname.startsWith(`/category/${cat.slug}`) ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}>
                  <span className="text-base w-6 text-center flex-shrink-0">{cat.icon ?? '🛒'}</span>
                  <span className="flex-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{catName(cat, lang)}</span>
                </Link>
              ))}

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
                      className={cn('flex items-center gap-3 px-4 py-2.5 text-sm border-b border-gray-50 transition-colors',
                        pathname === href ? 'text-forest-700 bg-forest-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}>
                      <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                      <span className="flex-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                  <button type="button" onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <span className="text-base w-6 text-center flex-shrink-0">🚪</span>
                    <span className="flex-1 text-left" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{T('logout')}</span>
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
