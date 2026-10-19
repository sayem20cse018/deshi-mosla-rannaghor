'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Minus,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

const FREE_DELIVERY_THRESHOLD = 1000;
const ORANGE = '#ea580c';
const ORANGE_DARK = '#c2410c';
const ORANGE_LIGHT = '#fff7ed';
const ORANGE_BORDER = '#fed7aa';

// Inline cart item for drawer
function DrawerItem({ item, onClose }: { item: any; onClose: () => void }) {
  const { updateItem, removeItem } = useCartStore();
  const [removing, setRemoving] = useState(false);
  const p = item.product;
  const price = p.discountPrice ?? p.price;
  const maxQty = Math.min(p.availableStock || 99, 20);

  function handleRemove() {
    setRemoving(true);
    setTimeout(() => removeItem(p.id), 200);
  }

  return (
    <div
      className={cn(
        'flex gap-3 py-4 border-b border-gray-100 transition-all duration-200',
        removing && 'opacity-0 scale-95',
      )}
    >
      {/* Image */}
      <Link href={'/product/' + p.slug} onClick={onClose} className="flex-shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
          {p.primaryImage ? (
            <Image src={p.primaryImage} alt={p.name} width={64} height={64} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">*</div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link href={'/product/' + p.slug} onClick={onClose}
          className="text-sm font-semibold text-gray-800 hover:text-[#c2410c] transition-colors line-clamp-2 leading-snug block">
          {p.name}
        </Link>
        {p.weight && <p className="text-gray-400 text-[11px] mt-0.5">{p.weight}</p>}

        <div className="flex items-center justify-between mt-2.5">
          {/* Qty stepper */}
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
              disabled={item.quantity >= maxQty}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#ea580c] disabled:opacity-30 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price + delete */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-black" style={{ color: ORANGE, fontFamily: 'Manrope,sans-serif' }}>
              {formatPriceEn(price * item.quantity)}
            </span>
            <button
              onClick={handleRemove}
              className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items, isOpen, isLoading, closeCart, clearCart,
    appliedCoupon, couponError, applyCoupon, removeCoupon, getTotals,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const totals = getTotals();

  const progressPct = Math.min(100, (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - totals.subtotal);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (appliedCoupon) setCouponInput(appliedCoupon.code);
  }, [appliedCoupon]);

  async function handleApplyCoupon() {
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

      {/* Drawer panel -- right-side fixed, full height, scrollable */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
        className={cn(
          'fixed top-0 right-0 h-full z-[60] flex flex-col',
          'w-full max-w-[420px] bg-white shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* -- STICKY HEADER -- */}
        <div className="flex-shrink-0 px-5 py-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-gray-900 text-base tracking-wide uppercase" style={{ fontFamily: 'Manrope,sans-serif', letterSpacing: '0.04em' }}>
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
        </div>

        {/* -- SCROLLABLE CONTENT -- */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-7 h-7 animate-spin" style={{ color: ORANGE }} />
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
              <div className="w-24 h-24 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-orange-200" />
              </div>
              <p className="font-bold text-gray-700 text-lg" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                Cart is empty
              </p>
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>
                Add products to order
              </p>
              <button onClick={closeCart}
                className="mt-2 px-8 py-2.5 rounded-xl text-white font-bold text-sm transition-all active:scale-95"
                style={{ background: ORANGE }}>
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Free delivery progress card */}
              <div className="mx-4 mt-4 rounded-2xl border p-4" style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: ORANGE_BORDER, background: ORANGE_LIGHT }}>
                    <ShoppingCart className="w-5 h-5" style={{ color: ORANGE }} />
                  </div>
                  <div>
                    {totals.isFreeDelivery ? (
                      <p className="font-bold text-sm text-gray-900">Free delivery unlocked!</p>
                    ) : (
                      <p className="font-bold text-sm text-gray-900">
                        Add just <span style={{ color: ORANGE }}>{formatPriceEn(remaining)}</span> more
                      </p>
                    )}
                    <p className="text-xs text-gray-400">Unlock Get Free Delivery</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2.5 bg-gray-200 rounded-full overflow-visible mb-3">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                    style={{ width: progressPct + '%', background: 'linear-gradient(to right, ' + ORANGE + ', ' + ORANGE_DARK + ')' }}
                  />
                  {/* Lock icon on bar end */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-[8px]">
                    
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{totals.itemCount} product(s) added</span>
                  {totals.isFreeDelivery ? (
                    <span className="font-bold" style={{ color: ORANGE }}>Free Delivery!</span>
                  ) : (
                    <span className="font-bold" style={{ color: ORANGE }}>
                      {formatPriceEn(remaining)} more to go
                    </span>
                  )}
                </div>

                {!totals.isFreeDelivery && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span style={{ color: ORANGE }}></span>
                      Add {formatPriceEn(remaining)} more product(s) to get the offer!
                    </p>
                  </div>
                )}
              </div>

              {/* Cart items */}
              <div className="px-4 mt-2">
                {items.map((item) => (
                  <DrawerItem key={item.id} item={item} onClose={closeCart} />
                ))}
              </div>

              {/* Coupon section */}
              <div className="px-4 mt-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl px-4 py-3 border" style={{ background: ORANGE_LIGHT, borderColor: ORANGE_BORDER }}>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" style={{ color: ORANGE }} />
                      <div>
                        <p className="text-xs font-bold" style={{ color: ORANGE }}>{appliedCoupon.code}</p>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#ea580c]"
                      style={{ focusRingColor: ORANGE } as any}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={applying || !couponInput.trim()}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all disabled:opacity-50"
                      style={{ borderColor: ORANGE, color: ORANGE, background: 'white' }}
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

              {/* You may also like (static placeholder) */}
              <div className="px-4 mt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Manrope,sans-serif' }}>
                    You May Also Like
                  </h3>
                  <div className="flex gap-1">
                    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300">
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <Link href="/shop" onClick={closeCart}
                  className="block text-center py-2 text-xs border border-dashed rounded-xl transition-colors"
                  style={{ borderColor: ORANGE_BORDER, color: ORANGE }}>
                  Browse all products
                </Link>
              </div>
            </>
          )}
        </div>

        {/* -- STICKY FOOTER -- */}
        {items.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-100 bg-white">
            {/* Order summary */}
            <div className="px-5 py-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Subtotal</span>
                <span className="text-lg font-black" style={{ color: ORANGE, fontFamily: 'Manrope,sans-serif' }}>
                  {formatPriceEn(totals.grandTotal)}
                </span>
              </div>
              {totals.itemDiscount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Item discount</span>
                  <span className="font-semibold">-{formatPriceEn(totals.itemDiscount)}</span>
                </div>
              )}
              {appliedCoupon && totals.couponDiscount > 0 && (
                <div className="flex justify-between text-xs" style={{ color: ORANGE }}>
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {appliedCoupon.code}</span>
                  <span className="font-semibold">-{formatPriceEn(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Delivery</span>
                <span className={cn('font-semibold', totals.isFreeDelivery ? 'text-green-600' : 'text-gray-700')}>
                  {totals.isFreeDelivery ? 'FREE' : formatPriceEn(totals.deliveryCharge)}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <div className="px-4 pb-5">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center py-4 rounded-xl text-white font-black text-base transition-all active:scale-[0.98] shadow-lg"
                style={{ background: 'linear-gradient(135deg,' + ORANGE + ',' + ORANGE_DARK + ')', boxShadow: '0 4px 16px rgba(234,88,12,0.35)', fontFamily: 'Manrope,sans-serif' }}
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
