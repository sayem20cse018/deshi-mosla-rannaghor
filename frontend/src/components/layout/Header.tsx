'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Package, LayoutDashboard, Loader2, Search,
  LogOut, Settings, ChevronRight, Globe,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn, formatPriceEn } from '@/lib/utils';
import { t, catName } from '@/lib/translations';
import { useLanguageStore, type Lang } from '@/store/language.store';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { useNavCategories } from '@/hooks/useCategories';
import { SearchBar } from './SearchBar';
import { AnnouncementBar } from '@/components/home/AnnouncementBar';
import toast from 'react-hot-toast';

const NAV_VISIBLE = 11;

export function Header() {
  const pathname = usePathname();
  const router   = useRouter();
  const { lang, setLang }                          = useLanguageStore();
  const { getItemCount, getTotals, openCart }      = useCartStore();
  const { user, isAuthenticated, logout }          = useAuthStore();
  const { data: navCats = [], isLoading: catsLoading } = useNavCategories();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [moreOpen,    setMoreOpen]    = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [langOpen,    setLangOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);

  // Scroll state — how far user has scrolled
  const [scrollY, setScrollY] = useState(0);

  const moreRef    = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef    = useRef<HTMLDivElement>(null);

  const itemCount = getItemCount();
  const cartTotal = getTotals().grandTotal;
  const visibleCats  = navCats.slice(0, NAV_VISIBLE);
  const overflowCats = navCats.slice(NAV_VISIBLE);
  const T = (key: Parameters<typeof t>[0]) => t(key, lang);

  // Track scroll position
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

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

  // Scrolled past threshold — hide main header + ann bar
  const isScrolled = scrollY > 60;

  return (
    <div className="sticky top-0 z-50">

      {/* ════════════════════════════════════════════════════
          1. MAIN HEADER — hides on scroll
          ════════════════════════════════════════════════════ */}
      <div
        className={cn(
          'bg-white border-b border-gray-100 transition-all duration-300 ease-in-out overflow-hidden',
          isScrolled ? 'max-h-0 opacity-0 border-transparent' : 'max-h-24 opacity-100 shadow-sm',
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-[64px] gap-3 lg:gap-4">

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-10 h-10 lg:w-11 lg:h-11">
                <div className="absolute inset-0 bg-gradient-to-br from-spice-500 to-spice-700 rounded-2xl shadow-md shadow-spice-600/30 transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-[15px] leading-none">দম</span>
                </div>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/40 rounded-full" />
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-gray-900 font-black text-[16px] leading-tight">দেশি মসলার</p>
                <p className="text-spice-500 text-[11px] font-bold tracking-[0.15em] uppercase mt-0.5">রান্নাঘর</p>
              </div>
            </Link>

            {/* SEARCH (desktop) */}
            <div className="hidden md:flex flex-1 min-w-0 max-w-2xl mx-2">
              <SearchBar className="w-full" lang={lang} />
            </div>

            {/* Mobile search btn */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setSearchOpen((o) => !o)}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* RIGHT ACTIONS */}
            <div className="hidden sm:flex items-center gap-0.5 lg:gap-1 ml-auto md:ml-0 flex-shrink-0">

              {/* Language */}
              <div ref={langRef} className="relative hidden lg:block">
                <button
                  onClick={() => setLangOpen((o) => !o)}
                  className="flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <Globe className="w-5 h-5 text-gray-500 group-hover:text-spice-600 transition-colors" />
                  <span className="text-[10px] text-gray-400 group-hover:text-spice-600 mt-0.5 font-medium transition-colors">
                    {lang === 'bn' ? 'বাংলা' : 'EN'}
                  </span>
                </button>
                {langOpen && (
                  <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl z-50 w-32 py-1 animate-fade-down">
                    {(['bn', 'en'] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors',
                          lang === l ? 'text-spice-600 bg-spice-50 font-semibold' : 'text-gray-600 hover:bg-gray-50',
                        )}
                      >
                        <span>{l === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                        {l === 'bn' ? 'বাংলা' : 'English'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Track Order */}
              <Link
                href="/order-tracking"
                className="hidden xl:flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <Package className="w-5 h-5 text-gray-500 group-hover:text-spice-600 transition-colors" />
                <span className="text-[10px] text-gray-400 group-hover:text-spice-600 mt-0.5 font-medium transition-colors">{T('trackOrder')}</span>
              </Link>

              {/* Account */}
              <div ref={accountRef} className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setAccountOpen((o) => !o)}
                      className="flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      {user?.avatar ? (
                        <Image src={user.avatar} alt={user.name ?? ''} width={24} height={24}
                          className="w-6 h-6 rounded-full object-cover border-2 border-spice-200" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spice-400 to-spice-600 flex items-center justify-center">
                          <span className="text-white text-[11px] font-black">{user?.name?.charAt(0) ?? 'গ'}</span>
                        </div>
                      )}
                      <span className="text-[10px] text-gray-400 group-hover:text-spice-600 mt-0.5 font-medium transition-colors hidden xl:block">
                        {user?.name?.split(' ')[0]}
                      </span>
                    </button>

                    {accountOpen && (
                      <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-56 overflow-hidden animate-fade-down">
                        <div className="px-4 py-3 bg-gradient-to-br from-spice-50 to-orange-50 border-b border-spice-100">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-spice-400 to-spice-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-black">{user?.name?.charAt(0)}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                              <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>
                        {[
                          { href: '/account',          label: T('myAccount'), icon: User },
                          { href: '/account/orders',   label: T('myOrders'),  icon: Package },
                          { href: '/account/wishlist', label: T('wishlist'),  icon: Heart },
                          { href: '/account/settings', label: 'সেটিংস',      icon: Settings },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link key={href} href={href} onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-spice-50 hover:text-spice-700 transition-colors">
                            <Icon className="w-4 h-4 text-gray-400" />
                            {label}
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                          </Link>
                        ))}
                        {(user as any)?.role !== 'CUSTOMER' && (
                          <Link href="/admin" onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-spice-600 hover:bg-spice-50 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> {T('adminPanel')}
                          </Link>
                        )}
                        <div className="border-t border-gray-100">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> {T('logout')}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Link href="/login"
                      className="flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group">
                      <User className="w-5 h-5 text-gray-500 group-hover:text-spice-600 transition-colors" />
                      <span className="text-[10px] text-gray-400 group-hover:text-spice-600 mt-0.5 font-medium transition-colors hidden xl:block">{T('myAccount')}</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/account/wishlist"
                className="flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors group">
                <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                <span className="text-[10px] text-gray-400 group-hover:text-red-500 mt-0.5 font-medium transition-colors hidden xl:block">{T('wishlist')}</span>
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative flex flex-col items-center px-2.5 py-1.5 rounded-xl hover:bg-spice-50 transition-colors group"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-gray-500 group-hover:text-spice-600 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-spice-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-400 group-hover:text-spice-600 mt-0.5 font-medium transition-colors hidden xl:block">
                  {itemCount > 0 ? formatPriceEn(cartTotal) : T('cart')}
                </span>
              </button>
            </div>

            {/* Mobile cart */}
            <button onClick={openCart}
              className="sm:hidden relative flex items-center justify-center w-9 h-9 rounded-xl bg-spice-600 text-white flex-shrink-0">
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-spice-600 text-[9px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-2.5 bg-gray-50">
            <SearchBar mobile className="w-full" lang={lang} />
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════
          2. CATEGORY NAVIGATION BAR — always sticky
          ════════════════════════════════════════════════════ */}
      <div className={cn(
        'bg-gradient-to-r from-spice-700 via-spice-600 to-spice-700 transition-shadow duration-300',
        isScrolled ? 'shadow-lg shadow-spice-900/30' : '',
      )}>
        <div className="container mx-auto px-4">

          {/* Desktop nav */}
          <div className="hidden md:flex items-stretch h-[46px] overflow-x-auto scrollbar-hide">

            {/* Hamburger + All Products */}
            <Link
              href="/shop"
              className={cn(
                'flex items-center gap-2 px-4 h-full text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-200 border-b-2',
                pathname === '/shop'
                  ? 'text-white border-white bg-white/10'
                  : 'text-white/90 border-transparent hover:text-white hover:bg-white/10 hover:border-white/50',
              )}
            >
              <Menu className="w-4 h-4" />
              {T('allProducts')}
            </Link>

            {/* Divider */}
            <div className="w-px bg-white/20 my-2.5 mx-1 flex-shrink-0" />

            {/* Categories from API */}
            {catsLoading ? (
              <div className="flex items-center gap-2 px-4 text-white/50 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                লোড হচ্ছে...
              </div>
            ) : (
              visibleCats.map((cat) => {
                const active =
                  pathname === `/category/${cat.slug}` ||
                  pathname.startsWith(`/category/${cat.slug}/`);
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-1.5 px-3 h-full text-[13px] font-medium whitespace-nowrap flex-shrink-0',
                      'transition-all duration-200 border-b-2',
                      active
                        ? 'text-white border-white bg-white/10'
                        : 'text-white/85 border-transparent hover:text-white hover:bg-white/10 hover:border-white/40',
                    )}
                  >
                    {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                    {catName(cat, lang)}
                  </Link>
                );
              })
            )}

            {/* More dropdown */}
            {overflowCats.length > 0 && (
              <div ref={moreRef} className="relative flex items-center flex-shrink-0">
                <button
                  onClick={() => setMoreOpen((o) => !o)}
                  className={cn(
                    'flex items-center gap-1 px-3 h-full text-[13px] font-medium whitespace-nowrap border-b-2 transition-all duration-200',
                    moreOpen
                      ? 'text-white border-white bg-white/10'
                      : 'text-white/85 border-transparent hover:text-white hover:bg-white/10',
                  )}
                >
                  {T('more')}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', moreOpen && 'rotate-180')} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 w-52 animate-fade-down">
                    {overflowCats.map((cat) => (
                      <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-spice-50 hover:text-spice-700 transition-colors">
                        {cat.icon && <span className="text-base w-5 text-center">{cat.icon}</span>}
                        {catName(cat, lang)}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-1 pt-1 px-3">
                      <Link href="/categories" onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-1 px-1 py-1.5 text-xs text-spice-600 font-semibold hover:text-spice-800">
                        {T('viewAllCats')} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile pills */}
          <div className="md:hidden flex items-center gap-1.5 h-10 overflow-x-auto scrollbar-hide py-1">
            <Link href="/shop"
              className={cn(
                'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-all',
                pathname === '/shop' ? 'bg-white text-spice-600 shadow-sm' : 'text-white/85 bg-white/15 hover:bg-white/25',
              )}>
              🛒 {T('allProducts')}
            </Link>
            {navCats.map((cat) => {
              const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
              return (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  className={cn(
                    'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all',
                    active ? 'bg-white text-spice-600 shadow-sm' : 'text-white/85 bg-white/15 hover:bg-white/25',
                  )}>
                  {cat.icon && <span className="text-sm leading-none">{cat.icon}</span>}
                  {catName(cat, lang)}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          3. ANNOUNCEMENT BAR — hides on scroll
          ════════════════════════════════════════════════════ */}
      <div className={cn(
        'transition-all duration-300 ease-in-out overflow-hidden',
        isScrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100',
      )}>
        <AnnouncementBar />
      </div>

      {/* ════════════════════════════════════════════════════
          MOBILE FULL MENU DRAWER
          ════════════════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-[82vw] max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">

            {/* Drawer header */}
            <div className="bg-gradient-to-br from-spice-600 to-spice-800 px-5 pt-14 pb-6">
              <button onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white">
                <X className="w-4 h-4" />
              </button>
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-white font-black text-xl">{user?.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{user?.name}</p>
                    <p className="text-spice-200 text-xs">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 text-sm mb-3">স্বাগতম!</p>
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white text-spice-600">লগইন</Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}
                      className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white/20 text-white border border-white/30">নিবন্ধন</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="flex border-b border-gray-100">
              {(['bn', 'en'] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={cn('flex-1 py-2.5 text-sm font-semibold transition-colors',
                    lang === l ? 'text-spice-600 bg-spice-50' : 'text-gray-500 hover:bg-gray-50')}>
                  {l === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto py-2">
              {[
                { href: '/', label: T('home') },
                { href: '/shop', label: T('allProducts') },
                { href: '/blog', label: T('blog') },
                { href: '/order-tracking', label: T('trackOrder') },
              ].map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  className={cn('flex items-center justify-between px-5 py-3 text-sm font-medium border-b border-gray-50 transition-colors',
                    pathname === href ? 'text-spice-600 bg-spice-50' : 'text-gray-700 hover:bg-gray-50')}>
                  {label} <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>
              ))}

              <div className="px-5 pt-3 pb-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ক্যাটাগরি</p>
              </div>
              {navCats.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                  {cat.icon && <span className="text-base w-6 text-center">{cat.icon}</span>}
                  {catName(cat, lang)}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="px-5 pt-3 pb-1 mt-1 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">অ্যাকাউন্ট</p>
                  </div>
                  {[
                    { href: '/account',          label: T('myAccount') },
                    { href: '/account/orders',   label: T('myOrders') },
                    { href: '/account/wishlist', label: T('wishlist') },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 transition-colors">
                      {label} <ChevronRight className="w-4 h-4 text-gray-300" />
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut className="w-4 h-4" /> {T('logout')}
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
