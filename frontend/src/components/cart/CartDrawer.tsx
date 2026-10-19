'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  X,
  ShoppingCart,
  ShoppingBag,
  ArrowRight,
  Tag,
  Check,
  AlertCircle,
  Truck,
  Loader2,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { CartItemRow } from './CartItem';

const FREE_DELIVERY_THRESHOLD = 1000;

export function CartDrawer() {
  const {
    items,
    isOpen,
    isLoading,
    closeCart,
    clearCart,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    getTotals,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [showCouponBox, setShowCouponBox] = useState(false);
  const [applying, setApplying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totals = getTotals();

  // ESC key close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

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
      {/* -- Backdrop (click outside to close) -- */}
      {isOpen && (
        <div
          onClick={closeCart}
          aria-hidden="true"
          className="fixed inset-0 z-[55] bg-black/30 backdrop-blur-[1px]"
        />
      )}

      {/*
       * -- Cart Panel --
       * Positioned below the sticky header using `top-[146px]` (96px header + 50px category bar).
       * On mobile it anchors below the 72px header.
       * Uses `fixed` + right-aligned so it appears inline below the cart button.
       * max-h + overflow-y-auto keeps it scrollable when full.
       */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={cn(
          // positioning
          'fixed z-[60] right-4',
          // desktop: below header+category bar (96+50=146px); mobile: below 72px header
          'top-[148px] lg:top-[148px]',
          // sizing
          'w-[calc(100vw-2rem)] max-w-[420px]',
          // appearance
          'bg-white rounded-2xl shadow-2xl border border-gray-100',
          // max height with scroll
          'max-h-[calc(100vh-170px)] flex flex-col',
          // animation
          'transition-all duration-300 ease-out origin-top-right',
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none',
        )}
      >
        {/* -- Header -- */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0f4c2a] rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                Cart
              </h2>
              {totals.itemCount > 0 && (
                <p className="text-gray-400 text-xs">{totals.itemCount} items</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* -- Free delivery progress -- */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-gradient-to-r from-[#f0fdf4] to-emerald-50 border-b border-green-100 flex-shrink-0">
            {totals.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-[#0f4c2a]">
                <div className="w-5 h-5 bg-[#0f4c2a] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <p className="text-xs font-semibold">Free delivery unlocked!</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[#0f4c2a] mb-1.5 flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Add <strong className="font-bold">{formatPriceEn(remaining)}</strong> more for free delivery
                </p>
                <div className="w-full h-1.5 bg-green-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#0f4c2a] to-[#1a6b3c] rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* -- Cart items -- */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-7 h-7 animate-spin text-[#0f4c2a]" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12 px-6 text-center">
              <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <div>
                <p className="font-bold text-gray-700 text-base" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  Cart is empty
                </p>
                <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  Add products to order
                </p>
              </div>
              <button onClick={closeCart} className="btn-primary px-6 py-2.5">
                Start shopping
              </button>
            </div>
          ) : (
            <ul className="px-5 py-4 space-y-2.5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} compact onLinkClick={closeCart} />
              ))}
            </ul>
          )}
        </div>

        {/* -- Footer (only when items exist) -- */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white flex-shrink-0 rounded-b-2xl">
            {/* Coupon section */}
            <div className="px-5 pt-4 pb-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#0f4c2a] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0f4c2a]">{appliedCoupon.code}</p>
                      <p className="text-[11px] text-green-600">
                        {formatPriceEn(appliedCoupon.discountAmount)} saved
                      </p>
                    </div>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors" aria-label="Remove coupon">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : showCouponBox ? (
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Coupon code"
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
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}
                  <button onClick={() => { setShowCouponBox(false); setCouponInput(''); }} className="text-xs text-gray-400 hover:text-gray-600">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCouponBox(true)}
                  className="w-full flex items-center gap-2 text-sm text-[#0f4c2a] hover:text-[#0a3d22] font-medium py-1.5 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  Have a coupon?
                </button>
              )}
            </div>

            {/* Order summary */}
            <div className="px-5 py-3 space-y-2 border-t border-gray-50">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({totals.itemCount} items)</span>
                <span className="font-medium text-gray-800">{formatPriceEn(totals.subtotal)}</span>
              </div>
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-{formatPriceEn(totals.itemDiscount)}</span>
                </div>
              )}
              {appliedCoupon && totals.couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-[#0f4c2a]">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {appliedCoupon.code}</span>
                  <span className="font-medium">-{formatPriceEn(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Delivery</span>
                <span className={cn('font-medium', totals.isFreeDelivery && 'text-[#0f4c2a]')}>
                  {totals.isFreeDelivery ? 'FREE' : formatPriceEn(totals.deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-black text-[#0f4c2a]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {formatPriceEn(totals.grandTotal)}
                </span>
              </div>
              {totals.itemDiscount + totals.couponDiscount > 0 && (
                <p className="text-xs text-center text-green-600 font-semibold bg-green-50 rounded-lg py-1.5">
                  You save: {formatPriceEn(totals.itemDiscount + totals.couponDiscount)}
                </p>
              )}
            </div>

            {/* CTA buttons */}
            <div className="px-5 pb-5 pt-1 space-y-2.5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl text-base transition-all active:scale-[0.98] shadow-lg"
                style={{ background: 'linear-gradient(135deg,#0f4c2a,#1a6b3c)', boxShadow: '0 4px 14px rgba(15,76,42,0.3)' }}
              >
                Checkout - {formatPriceEn(totals.grandTotal)}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-[#0f4c2a]/30 hover:bg-[#f0fdf4] text-gray-700 hover:text-[#0f4c2a] font-medium py-2.5 rounded-xl text-sm transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                View full cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
