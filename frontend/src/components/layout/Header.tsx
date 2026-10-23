'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Heart, User, Menu, X, ChevronDown,
  Package, Loader2, Search,
  LogOut, Settings, ChevronRight, Home, BookOpen,
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

const NAV_VISIBLE = 11;

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
  const [morePos,      setMorePos]      = useState({ top: 0, left: 0 });
  const [langPos,      setLangPos]      = useState({ top: 0, right: 0 });

  const moreRef    = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef    = useRef<HTMLDivElement>(null);
  const langBtnRef = useRef<HTMLButtonElement>(null);

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

  const mainHidden = scrollY > 96;
  const annHide    = scrollY > 130;
  const mbAnnHide  = scrollY > 56;

  return (
    <>
      {/* ══════════════════════════════════
          DESKTOP ≥ lg
      ══════════════════════════════════ */}
      <div className="hidden lg:block">
        {/* Sticky wrapper — z-[60] ensures More dropdown appears above hero */}
        <div className="sticky top-0 z-[60]">

          {/* ── Main Header 96px ── */}
          <div
            className={cn(
              'bg-white transition-all duration-350 ease-in-out will-change-transform',
              mainHidden
                ? '-translate-y-full shadow-none'
                : 'translate-y-0',
              !mainHidden && scrollY > 0 && 'shadow-sm shadow-black/[0.08]',
            )}
            style={{ height: '96px', borderBottom: mainHidden ? 'none' : '1px solid #f3f4f6' }}
          >
            <div className="container mx-auto px-4 xl:px-6 h-full flex items-center gap-4 xl:gap-6">

              {/* ── LEFT: Logo + Home + Blog ── */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link href="/" className="flex items-center gap-3 mr-3 group">
                  <div className="relative w-[46px] h-[46px] flex-shrink-0">
                    <div className="absolute inset-0 rounded-[14px] bg-gradient-to-br from-[#0f4c2a] via-[#0f4c2a] to-[#072d18] shadow-lg shadow-[#0f4c2a]/30 transition-transform duration-200 group-hover:scale-105" />
                    <div className="absolute inset-[3px] rounded-[11px] border border-white/15 flex items-center justify-center">
                      <span className="text-white font-black text-[15px] leading-none" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>দম</span>
                    </div>
                    <div className="absolute top-[6px] right-[6px] w-[5px] h-[5px] rounded-full bg-white/40" />
                  </div>
                  <div className="leading-none hidden xl:block">
                    <p className="text-gray-900 font-black text-[17px] leading-snug" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>দেশি মসলার রান্নাঘর</p>
                    <p className="text-orange-600 text-[10.5px] font-bold tracking-[0.2em] uppercase mt-1" style={{fontFamily:'Manrope,sans-serif'}}>
                      Deshi Moslar Rannaghar
                    </p>
                  </div>
                </Link>

                {/* Home */}
                <Link href="/" className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150',
                  pathname === '/' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100',
                )} style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                  <Home className="w-[17px] h-[17px]" strokeWidth={2} />
                  <span>{T('home')}</span>
                </Link>

                {/* Blog */}
                <Link href="/blog" className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] font-semibold transition-all duration-150',
                  pathname === '/blog' ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100',
                )} style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                  <BookOpen className="w-[17px] h-[17px]" strokeWidth={2} />
                  <span>{T('blog')}</span>
                </Link>
              </div>

              {/* ── CENTER: Search ── */}
              <div className="flex-1 min-w-0 max-w-[560px] mx-2">
                <SearchBar className="w-full" lang={lang} />
              </div>

              {/* ── RIGHT: Actions ── */}
              <div className="flex items-center gap-1 xl:gap-2 ml-auto flex-shrink-0">

                {/* Track Order */}
                <Link href="/order-tracking"
                  className={cn('hdr-action', pathname === '/order-tracking' && 'text-orange-600 bg-orange-50')}
                  style={{minWidth:'64px'}}>
                  <span className="icon-wrap"><Package className="w-[22px] h-[22px]" strokeWidth={1.75} /></span>
                  <span className="lbl" style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>{T('trackOrder')}</span>
                </Link>

                {/* Language — subtle */}
                <div ref={langRef} className="relative">
                  <button ref={langBtnRef} type="button" onClick={() => {
                    const btn = langBtnRef.current;
                    if (btn) {
                      const r = btn.getBoundingClientRect();
                      setLangPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
                    }
                    setLangOpen(o => !o);
                  }}
                    className="hdr-action" style={{minWidth:'52px'}}>
                    <span className="icon-wrap text-lg leading-none">{lang === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                    <span className="lbl" style={{fontFamily:'Manrope,sans-serif'}}>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
                  </button>
                  {langOpen && (
                    <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 w-[150px] py-1.5 animate-fade-down overflow-hidden" style={{ position: 'fixed', top: langPos.top, right: langPos.right, zIndex: 99999 }}>
                      {(['bn','en'] as Lang[]).map(l => (
                        <button key={l} type="button" onClick={() => { setLang(l); setLangOpen(false); }}
                          className={cn('w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors',
                            lang === l ? 'text-orange-600 bg-orange-50 font-bold' : 'text-gray-700 hover:bg-gray-50')}>
                          <span className="text-base">{l === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
                          <span style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>{l === 'bn' ? 'বাংলা' : 'English'}</span>
                          {lang === l && <span className="ml-auto text-[#0f4c2a] text-xs font-black">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* My Account */}
                <div ref={accountRef} className="relative">
                  {isAuthenticated ? (
                    <>
                      <button type="button" onClick={() => setAccountOpen(o => !o)}
                        className={cn('hdr-action', accountOpen && 'bg-gray-50 text-gray-900')}
                        style={{minWidth:'64px'}}>
                        <span className="icon-wrap">
                          {user?.avatar ? (
                            <Image src={user.avatar} alt={user.name ?? ''} width={26} height={26}
                              className="w-[26px] h-[26px] rounded-full object-cover border-2 border-[#0f4c2a]/20" />
                          ) : (
                            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#ea580c] to-[#c2410c] flex items-center justify-center">
                              <span className="text-white text-[11px] font-black">{user?.name?.charAt(0) ?? 'গ'}</span>
                            </div>
                          )}
                        </span>
                        <span className="lbl truncate max-w-[60px]" style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                          {T('myAccount')}
                        </span>
                      </button>
                      {accountOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-black/12 border border-gray-100 z-50 w-[224px] overflow-hidden animate-fade-down">
                          <div className="px-4 py-3.5 bg-gradient-to-br from-[#ea580c] to-[#c2410c]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-black text-base">{user?.name?.charAt(0)}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{user?.name}</p>
                                <p className="text-[11px] text-white/50 truncate" style={{fontFamily:'Manrope,sans-serif'}}>{user?.email}</p>
                              </div>
                            </div>
                          </div>
                          <div className="py-1">
                            {[
                              {href:'/account', label:T('myAccount'), icon:User},
                              {href:'/account/orders', label:T('myOrders'), icon:Package},
                              {href:'/account/wishlist', label:T('wishlist'), icon:Heart},
                              {href:'/account/settings', label:'সেটিংস', icon:Settings},
                            ].map(({href,label,icon:Icon}) => (
                              <Link key={href} href={href} onClick={() => setAccountOpen(false)}
                                className={cn('flex items-center gap-3 px-4 py-2.5 text-[13.5px] transition-colors',
                                  pathname === href ? 'text-orange-600 bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}>
                                <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" strokeWidth={1.75} />
                                <span style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{label}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-gray-100">
                            <button type="button" onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-red-500 hover:bg-red-50 transition-colors">
                              <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                              <span style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{T('logout')}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/login" className="hdr-action" style={{minWidth:'64px'}}>
                      <span className="icon-wrap"><User className="w-[22px] h-[22px]" strokeWidth={1.75} /></span>
                      <span className="lbl" style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>{T('login')}</span>
                    </Link>
                  )}
                </div>

                {/* Wishlist */}
                <Link href="/account/wishlist"
                  className={cn('hdr-action', pathname.startsWith('/account/wishlist') && 'text-red-500 bg-red-50')}
                  style={{minWidth:'64px'}}>
                  <span className="icon-wrap relative">
                    <Heart className="w-[22px] h-[22px]" strokeWidth={1.75} />
                    {wishCount > 0 && (
                      <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-red-500 rounded-full border border-white leading-none">
                        {wishCount > 9 ? '9+' : wishCount}
                      </span>
                    )}
                  </span>
                  <span className="lbl" style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>{T('wishlist')}</span>
                </Link>

                {/* Cart */}
                <button type="button" onClick={openCart}
                  className="relative flex items-center gap-2.5 h-[48px] px-5 ml-1 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white transition-all duration-150 shadow-md shadow-orange-500/25 hover:shadow-lg">
                  <div className="relative">
                    <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={2} />
                    {itemCount > 0 && (
                      <span className="absolute -top-[7px] -right-[7px] min-w-[17px] h-[17px] px-0.5 flex items-center justify-center text-[9px] font-black text-white bg-white rounded-full border border-orange-500 leading-none text-orange-600">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </div>
                  <div className="leading-none hidden xl:block">
                    <div className="text-[11px] font-semibold opacity-75" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{T('cart')}</div>
                    <div className="text-[14px] font-black" style={{fontFamily:'Manrope,sans-serif'}}>
                      {itemCount > 0 ? formatPriceEn(cartTotal) : '৳ ০.০০'}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* ── Category Nav 50px — ORANGE — always visible ── */}
          <div className="bg-[#ea580c] shadow-sm shadow-[#c2410c]/30"
               style={{height:'50px'}}>
            <div className="container mx-auto px-4 xl:px-6 h-full flex items-stretch overflow-x-auto scrollbar-hide">

              {/* All products — 3-bar */}
              <Link href="/shop"
                className={cn(
                  'flex items-center gap-2 px-5 h-full text-[14px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-[3px]',
                  pathname === '/shop'
                    ? 'text-white border-white bg-white/15'
                    : 'text-white/95 border-transparent hover:text-white hover:bg-white/10',
                )}
                style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="5" x2="21" y2="5"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="19" x2="21" y2="19"/>
                </svg>
                <span>{T('allProducts')}</span>
              </Link>

              <div className="w-px bg-white/20 my-[10px] mx-0.5 flex-shrink-0" />

              {/* CMS-controlled categories */}
              {catsLoading ? (
                <div className="flex items-center px-4 text-white/50">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : visibleCats.map(cat => {
                const active = pathname === `/category/${cat.slug}` || pathname.startsWith(`/category/${cat.slug}/`);
                return (
                  <Link key={cat.slug} href={`/category/${cat.slug}`}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 h-full text-[13.5px] font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150 border-b-[3px]',
                      active ? 'text-white border-white bg-white/15' : 'text-white/90 border-transparent hover:text-white hover:bg-white/10',
                    )}
                    style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                    {cat.icon && <span className="text-[14px] leading-none">{cat.icon}</span>}
                    <span>{catName(cat, lang)}</span>
                  </Link>
                );
              })}

              {/* More dropdown */}
              {overflowCats.length > 0 && (
                <div ref={moreRef} className="relative flex items-center flex-shrink-0">
                  <button ref={moreBtnRef} type="button" onClick={() => {
                    const btn = moreBtnRef.current;
                    if (btn) {
                      const r = btn.getBoundingClientRect();
                      setMorePos({ top: r.bottom + 4, left: r.left });
                    }
                    setMoreOpen(o => !o);
                  }}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 h-full text-[13.5px] font-semibold whitespace-nowrap border-b-[3px] transition-all duration-150',
                      moreOpen ? 'text-white border-white bg-white/15' : 'text-white/90 border-transparent hover:text-white hover:bg-white/10',
                    )}
                    style={{fontFamily:'Manrope,Noto Sans Bengali,sans-serif'}}>
                    <span>{T('more')}</span>
                    <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', moreOpen && 'rotate-180')} />
                  </button>
                  {moreOpen && (
                    <div className="bg-white rounded-xl shadow-2xl shadow-black/15 border border-gray-100 py-1.5 w-[204px] animate-fade-down" style={{ position: 'fixed', top: morePos.top, left: morePos.left, zIndex: 99999 }}>
                      {overflowCats.map(cat => (
                        <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMoreOpen(false)}
                          className={cn('flex items-center gap-3 px-4 py-2.5 text-[13.5px] transition-colors',
                            pathname.startsWith(`/category/${cat.slug}`) ? 'text-[#0f4c2a] bg-[#f0fdf4] font-semibold' : 'text-gray-700 hover:bg-gray-50')}>
                          {cat.icon && <span className="text-base w-5 text-center flex-shrink-0">{cat.icon}</span>}
                          <span style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{catName(cat, lang)}</span>
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 mt-1 pt-1 mx-2">
                        <Link href="/categories" onClick={() => setMoreOpen(false)}
                          className="flex items-center gap-1.5 px-2 py-1.5 text-[12px] text-[#ea580c] font-semibold hover:text-[#c2410c] transition-colors">
                          {T('viewAllCats')} <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Announcement Bar 34px — BELOW nav ── */}
          <div className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
            annHide ? 'max-h-0 opacity-0' : 'max-h-[40px] opacity-100',
          )}>
            <AnnouncementBar />
          </div>
        </div>
      </div>


      {/* ══ MOBILE < lg ════════════════════════════════ */}
      <div className="lg:hidden sticky top-0 z-[60]">

        {/* ── 1. Announcement Bar — ALWAYS TOP on mobile ── */}
        <AnnouncementBar />

        {/* ── 2. Main Header ── */}
        <div className="bg-white border-b border-gray-100/80" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center px-3 sm:px-4" style={{ height: '72px', gap: '6px' }}>
            <button type="button" onClick={() => setDrawerOpen(o => !o)}
              className="flex items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
              style={{ width: '48px', height: '48px' }}>
              {drawerOpen
                ? <X className="w-[24px] h-[24px]" strokeWidth={2} />
                : <Menu className="w-[24px] h-[24px]" strokeWidth={2} />
              }
            </button>

            <Link href="/" className="flex-1 flex flex-col items-center justify-center gap-[3px] min-w-0">
              <span className="text-orange-600 font-black leading-tight tracking-tight truncate"
                    style={{ fontSize: '17px', fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                দেশি মসলার রান্নাঘর
              </span>
              <span className="text-gray-400 font-semibold uppercase leading-none"
                    style={{ fontSize: '9px', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.14em' }}>
                Deshi Moslar Rannaghar
              </span>
            </Link>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Search */}
              <button type="button" onClick={() => setMobileSearch(o => !o)}
                className="flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                style={{ width: '48px', height: '48px' }}>
                <Search className="w-[24px] h-[24px]" strokeWidth={2} />
              </button>
              {/* Cart */}
              <button type="button" onClick={openCart}
                className="relative flex items-center justify-center rounded-xl text-white hover:opacity-90 active:opacity-80 transition-all"
                style={{ width: '48px', height: '48px', backgroundColor: '#ea580c' }}>
                <ShoppingCart className="w-[24px] h-[24px]" strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-[5px] -right-[5px] min-w-[19px] h-[19px] px-0.5 flex items-center justify-center text-[9px] font-black text-white rounded-full border-[1.5px] border-white leading-none"
                        style={{ backgroundColor: '#ea580c' }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className={cn('overflow-hidden transition-all duration-300', mobileSearch ? 'max-h-[60px] opacity-100' : 'max-h-0 opacity-0')}>
            <div className="px-3 pt-1 pb-2.5">
              <SearchBar mobile className="w-full" lang={lang} />
            </div>
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════ */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[82vw] max-w-[300px] bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            <div className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] px-5 pt-11 pb-5">
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
                    <p className="text-white font-bold text-sm truncate" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>{user?.name}</p>
                    <p className="text-white/50 text-xs truncate" style={{fontFamily:'Manrope,sans-serif'}}>{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 text-sm mb-2.5" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>স্বাগতম!</p>
                  <div className="flex gap-2">
                    <Link href="/login" onClick={() => setDrawerOpen(false)} className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white text-orange-600" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>লগইন</Link>
                    <Link href="/register" onClick={() => setDrawerOpen(false)} className="flex-1 py-2 text-center text-sm font-bold rounded-xl bg-white/15 text-white border border-white/25" style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>নিবন্ধন</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex border-b border-gray-100">
              {(['bn','en'] as Lang[]).map(l => (
                <button key={l} type="button" onClick={() => setLang(l)}
                  className={cn('flex-1 py-2.5 text-sm font-semibold transition-colors',
                    lang === l ? 'text-orange-600 bg-orange-50' : 'text-gray-400 hover:bg-gray-50')}
                  style={{fontFamily:'Noto Sans Bengali,Manrope,sans-serif'}}>
                  {l === 'bn' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
                </button>
              ))}
            </div>

            <nav className="flex-1 overflow-y-auto">
              {[
                {href:'/', label:T('home'), emoji:'🏠'},
                {href:'/shop', label:T('allProducts'), emoji:'🛒'},
                {href:'/blog', label:T('blog'), emoji:'📖'},
                {href:'/order-tracking', label:T('trackOrder'), emoji:'📦'},
              ].map(({href,label,emoji}) => (
                <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                  className={cn('flex items-center gap-3 px-4 py-3 text-[13.5px] font-medium border-b border-gray-50 transition-colors',
                    pathname === href ? 'text-orange-600 bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}
                  style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                  <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                </Link>
              ))}

              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[9.5px] font-black text-gray-400 uppercase tracking-[0.15em]" style={{fontFamily:'Manrope,sans-serif'}}>ক্যাটাগরি</p>
              </div>
              {navCats.map(cat => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setDrawerOpen(false)}
                  className={cn('flex items-center gap-3 px-4 py-2.5 text-[13.5px] border-b border-gray-50 transition-colors',
                    pathname.startsWith(`/category/${cat.slug}`) ? 'text-[#0f4c2a] bg-[#f0fdf4] font-semibold' : 'text-gray-700 hover:bg-gray-50')}
                  style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                  <span className="text-base w-6 text-center flex-shrink-0">{cat.icon ?? '🛒'}</span>
                  <span className="flex-1">{catName(cat, lang)}</span>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="px-4 pt-3 pb-1.5 mt-1 border-t border-gray-100">
                    <p className="text-[9.5px] font-black text-gray-400 uppercase tracking-[0.15em]" style={{fontFamily:'Manrope,sans-serif'}}>অ্যাকাউন্ট</p>
                  </div>
                  {[
                    {href:'/account', label:T('myAccount'), emoji:'👤'},
                    {href:'/account/orders', label:T('myOrders'), emoji:'📋'},
                    {href:'/account/wishlist', label:T('wishlist'), emoji:'❤️'},
                    {href:'/account/settings', label:'সেটিংস', emoji:'⚙️'},
                  ].map(({href,label,emoji}) => (
                    <Link key={href} href={href} onClick={() => setDrawerOpen(false)}
                      className={cn('flex items-center gap-3 px-4 py-2.5 text-[13.5px] border-b border-gray-50 transition-colors',
                        pathname === href ? 'text-orange-600 bg-orange-50 font-semibold' : 'text-gray-700 hover:bg-gray-50')}
                      style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
                      <span className="text-base w-6 text-center flex-shrink-0">{emoji}</span>
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                    </Link>
                  ))}
                  <button type="button" onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[13.5px] text-red-500 hover:bg-red-50 transition-colors"
                    style={{fontFamily:'Noto Sans Bengali,sans-serif'}}>
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
