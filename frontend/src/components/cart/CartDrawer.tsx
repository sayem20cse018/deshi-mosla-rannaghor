'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X, ShoppingBag, ArrowRight, Tag, Check, AlertCircle,
  Loader2, Minus, Plus, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

// Brand colors
const OR  = '#ea580c';   // orange primary
const ORD = '#c2410c';   // orange dark
const ORL = '#fff7ed';   // orange light bg
const ORB = '#fed7aa';   // orange border

// ---------------------------------------------------------------------------
// Inline cart item row (used only inside drawer)
// ---------------------------------------------------------------------------
function CartItem({ item, onClose }: { item: any; onClose: () => void }) {
  const { updateItem, removeItem } = useCartStore();
  const p   = item.product;
  const ep  = p.discountPrice ?? p.price;
  const max = Math.min(p.availableStock ?? 99, 20);

  return (
    <div className="flex gap-3 py-3.5 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <Link href={'/product/' + p.slug} onClick={onClose} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
        {p.primaryImage
          ? <Image src={p.primaryImage} alt={p.name} width={64} height={64} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-2xl">*</div>
        }
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={'/product/' + p.slug} onClick={onClose}
          className="text-[13px] font-semibold text-gray-800 hover:text-[#c2410c] line-clamp-2 leading-snug block transition-colors">
          {p.name}
        </Link>
        {p.weight && <p className="text-[11px] text-gray-400 mt-0.5">{p.weight}</p>}

        {/* Qty + price row */}
        <div className="flex items-center justify-between mt-2">
          {/* Stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateItem(p.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#ea580c] disabled:opacity-30 transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-gray-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => updateItem(p.id, item.quantity + 1)}
              disabled={item.quantity >= max}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#ea580c] disabled:opacity-30 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price + delete */}
          <div className="flex items-center gap-2 ml-3">
            <span className="text-[14px] font-black" style={{ color: OR, fontFamily: 'Manrope,sans-serif' }}>
              {formatPriceEn(ep * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(p.id)}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Cart Drawer
// ---------------------------------------------------------------------------
export function CartDrawer() {
  const {
    items, isOpen, isLoading,
    closeCart, clearCart,
    appliedCoupon, couponError,
    applyCoupon, removeCoupon,
    getTotals,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [applying,    setApplying]    = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const totals   = getTotals();

  const FREE_THRESHOLD = 1000;
  const progress  = Math.min(100, (totals.subtotal / FREE_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_THRESHOLD - totals.subtotal);

  // ESC close
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (appliedCoupon) setCouponInput(appliedCoupon.code);
  }, [appliedCoupon]);

  async function handleApply() {
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[59] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={cn(
          'fixed top-0 right-0 h-full z-[60]',
          'w-full max-w-[420px] bg-white shadow-2xl',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ===== STICKY HEADER ===== */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900 text-sm tracking-widest uppercase" style={{ fontFamily: 'Manrope,sans-serif' }}>
            SHOPPING CART
          </h2>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== SCROLLABLE BODY ===== */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: OR }} />
            </div>

          ) : items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-4 py-20 px-6 text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: ORL, border: '2px solid ' + ORB }}>
                <ShoppingBag className="w-12 h-12" style={{ color: ORB }} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-base" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>Cart is empty</p>
                <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>Add products to start shopping</p>
              </div>
              <button onClick={closeCart}
                className="px-8 py-2.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,' + OR + ',' + ORD + ')' }}>
                Shop Now
              </button>
            </div>

          ) : (
            <>
              {/* --- Free delivery progress card --- */}
              <div className="mx-4 mt-4 rounded-2xl border p-4 bg-gray-50 border-gray-200">
                {/* Progress bar */}
                <div className="relative h-2.5 bg-gray-200 rounded-full mb-3">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                    style={{ width: progress + '%', background: 'linear-gradient(to right,' + OR + ',' + ORD + ')' }}
                  />
                  {/* Start circle */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white bg-orange-400 flex items-center justify-center text-white text-[9px] shadow-sm">
                    +
                  </div>
                  {/* End gift circle */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center text-gray-400 text-[9px] shadow-sm">
                    G
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-gray-500">{totals.itemCount} product(s) added</p>
                    <p className="font-bold" style={{ color: OR }}>
                      {totals.isFreeDelivery ? 'FREE Delivery!' : '0% Discount'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">
                      {totals.isFreeDelivery ? 'Unlocked!' : formatPriceEn(remaining) + ' more to go'}
                    </p>
                    <p className="font-bold" style={{ color: OR }}>
                      {totals.isFreeDelivery ? 'Congrats!' : 'Get Free Delivery'}
                    </p>
                  </div>
                </div>

                {!totals.isFreeDelivery && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span style={{ color: OR }}>+</span>
                      Add {formatPriceEn(remaining)} more product(s) to get the offer!
                    </p>
                  </div>
                )}
              </div>

              {/* --- Product items --- */}
              <div className="px-4 mt-2">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} onClose={closeCart} />
                ))}
              </div>

              {/* --- Coupon section --- */}
              <div className="px-4 mt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl px-4 py-3 border" style={{ background: ORL, borderColor: ORB }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: OR }}>
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold" style={{ color: OR }}>{appliedCoupon.code}</p>
                        <p className="text-[11px] text-orange-600">{formatPriceEn(appliedCoupon.discountAmount)} saved</p>
                      </div>
                    </div>
                    <button onClick={() => { removeCoupon(); setCouponInput(''); }}
                      className="text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                    />
                    <button
                      onClick={handleApply}
                      disabled={applying || !couponInput.trim()}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all disabled:opacity-50 bg-white"
                      style={{ borderColor: OR, color: OR }}
                    >
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>

              {/* --- You May Also Like --- */}
              <div className="px-4 mt-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
                      You May Also Like
                    </h3>
                    <div className="h-0.5 w-8 rounded-full mt-0.5" style={{ background: OR }} />
                  </div>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 transition-colors">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Product suggestion tiles */}
                <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                  {[
                    { name: 'Mustard Oil', slug: 'mustard-oil', price: 320 },
                    { name: 'Pure Honey', slug: 'pure-honey', price: 550 },
                    { name: 'Red Chili', slug: 'red-chili', price: 180 },
                  ].map((s) => (
                    <Link key={s.slug} href={'/product/' + s.slug} onClick={closeCart}
                      className="flex-none w-[130px] border border-gray-100 rounded-xl p-2.5 hover:border-orange-200 hover:shadow-sm transition-all">
                      <div className="w-full h-20 bg-gray-50 rounded-lg mb-2 flex items-center justify-center text-3xl">
                        *
                      </div>
                      <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-tight">{s.name}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[12px] font-black" style={{ color: OR, fontFamily: 'Manrope,sans-serif' }}>
                          {formatPriceEn(s.price)}
                        </span>
                        <button
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors"
                          style={{ borderColor: OR, color: OR }}
                          onClick={(e) => e.preventDefault()}
                        >
                          + Add
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== STICKY FOOTER ===== */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white">
            {/* Totals row */}
            <div className="px-5 pt-3.5 pb-2 flex items-center justify-between">
              <span className="font-black text-gray-900 text-base" style={{ fontFamily: 'Manrope,sans-serif' }}>Subtotal</span>
              <span className="font-black text-xl" style={{ color: OR, fontFamily: 'Manrope,sans-serif' }}>
                {formatPriceEn(totals.grandTotal)}
              </span>
            </div>

            {/* Small discount/delivery info */}
            {(totals.itemDiscount > 0 || totals.couponDiscount > 0) && (
              <p className="px-5 pb-2 text-xs text-green-600 font-semibold">
                You save: {formatPriceEn(totals.itemDiscount + totals.couponDiscount)}
              </p>
            )}

            {/* Checkout button */}
            <div className="px-4 pb-5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center py-4 rounded-xl text-white font-black text-[15px] transition-all active:scale-[0.98] shadow-lg"
                style={{
                  background: 'linear-gradient(135deg,' + OR + ',' + ORD + ')',
                  boxShadow: '0 4px 16px rgba(234,88,12,0.35)',
                  fontFamily: 'Manrope,sans-serif',
                }}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
