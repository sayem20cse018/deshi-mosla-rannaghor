'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  X, ShoppingCart, ShoppingBag, ArrowRight,
  Tag, Check, AlertCircle, Truck, Loader2,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { CartItemRow } from './CartItem';

const FREE_DELIVERY_THRESHOLD = 1000;

export function CartDrawer() {
  const {
    items, isOpen, isLoading,
    closeCart, clearCart,
    appliedCoupon, couponError,
    applyCoupon, removeCoupon,
    getTotals,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [applying, setApplying] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totals = getTotals();

  // ESC key close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus coupon input when box opens
  useEffect(() => {
    if (showCouponBox) setTimeout(() => inputRef.current?.focus(), 100);
  }, [showCouponBox]);

  // Pre-fill if already applied
  useEffect(() => {
    if (appliedCoupon) setCouponInput(appliedCoupon.code);
  }, [appliedCoupon]);

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  }

  function handleRemoveCoupon() {
    removeCoupon();
    setCouponInput('');
    setShowCouponBox(false);
  }

  const progressPct = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* ── Drawer ── */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="শপিং কার্ট"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-700 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight">আমার কার্ট</h2>
              {totals.itemCount > 0 && (
                <p className="text-gray-400 text-xs">{totals.itemCount} টি পণ্য</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                সব সরান
              </button>
            )}
            <button
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Free delivery progress ── */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-gradient-to-r from-brand-50 to-emerald-50 border-b border-brand-100">
            {totals.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-brand-700">
                <div className="w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-semibold">🎉 আপনি ফ্রি ডেলিভারি পাচ্ছেন!</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-brand-700 mb-1.5 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  ফ্রি ডেলিভারির জন্য আরও{' '}
                  <strong className="font-bold">{formatPriceEn(remaining)}</strong> কিনুন
                </p>
                <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Cart items ── */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center">
              <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-200" />
              </div>
              <div>
                <p className="font-bold text-gray-700 text-lg">কার্ট খালি আছে</p>
                <p className="text-gray-400 text-sm mt-1">
                  পণ্য যোগ করুন এবং আপনার পছন্দের পণ্য অর্ডার করুন
                </p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary px-8 py-2.5"
              >
                কেনাকাটা শুরু করুন
              </button>

              {/* Quick links */}
              <div className="flex flex-wrap gap-2 justify-center mt-1">
                {['মসলা', 'তেল', 'চাল', 'ডাল', 'মধু'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?search=${cat}`}
                    onClick={closeCart}
                    className="chip text-xs"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="px-5 py-4 space-y-2.5">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  compact
                  onLinkClick={closeCart}
                />
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer (only when items exist) ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white">

            {/* ── Coupon section ── */}
            <div className="px-5 pt-4 pb-2">
              {appliedCoupon ? (
                /* Applied coupon chip */
                <div className="flex items-center justify-between bg-brand-50 border border-brand-200 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-700">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-brand-500">
                        {formatPriceEn(appliedCoupon.discountAmount)} সাশ্রয়
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="কুপন সরান"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : showCouponBox ? (
                /* Coupon input */
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="কুপন কোড (যেমন: WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="input-base flex-1 text-sm uppercase font-medium tracking-wide"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applying || !couponInput.trim()}
                      className="btn-primary px-4 py-2 text-sm flex-shrink-0 disabled:opacity-60"
                    >
                      {applying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'প্রয়োগ'
                      )}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}
                  <button
                    onClick={() => { setShowCouponBox(false); setCouponInput(''); }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    বাতিল করুন
                  </button>
                </div>
              ) : (
                /* Show coupon toggle */
                <button
                  onClick={() => setShowCouponBox(true)}
                  className="w-full flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 font-medium py-1.5 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  কুপন কোড আছে?
                </button>
              )}
            </div>

            {/* ── Order summary ── */}
            <div className="px-5 py-3 space-y-2 border-t border-gray-50">
              {/* Subtotal */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>সাবটোটাল ({totals.itemCount} পণ্য)</span>
                <span className="font-medium text-gray-800">{formatPriceEn(totals.subtotal)}</span>
              </div>

              {/* Item discount */}
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>পণ্যে ছাড়</span>
                  <span className="font-medium">−{formatPriceEn(totals.itemDiscount)}</span>
                </div>
              )}

              {/* Coupon discount */}
              {appliedCoupon && totals.couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-brand-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {appliedCoupon.code}
                  </span>
                  <span className="font-medium">−{formatPriceEn(totals.couponDiscount)}</span>
                </div>
              )}

              {/* Delivery */}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> ডেলিভারি চার্জ
                </span>
                <span className={cn('font-medium', totals.isFreeDelivery && 'text-brand-600')}>
                  {totals.isFreeDelivery ? '🎉 ফ্রি' : formatPriceEn(totals.deliveryCharge)}
                </span>
              </div>

              {/* Divider + Grand total */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">সর্বমোট</span>
                <span className="text-xl font-black text-brand-700">
                  {formatPriceEn(totals.grandTotal)}
                </span>
              </div>

              {/* Total savings */}
              {(totals.itemDiscount + totals.couponDiscount) > 0 && (
                <p className="text-xs text-center text-green-600 font-semibold bg-green-50 rounded-lg py-1.5">
                  🎉 মোট সাশ্রয়: {formatPriceEn(totals.itemDiscount + totals.couponDiscount)}
                </p>
              )}
            </div>

            {/* ── CTA buttons ── */}
            <div className="px-5 pb-5 pt-1 space-y-2.5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 rounded-xl text-base transition-all active:scale-[0.98] shadow-lg shadow-brand-700/20"
              >
                অর্ডার করুন — {formatPriceEn(totals.grandTotal)}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 text-gray-700 hover:text-brand-700 font-medium py-2.5 rounded-xl text-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                কার্ট বিস্তারিত দেখুন
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
