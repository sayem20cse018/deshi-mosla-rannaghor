'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X, ShoppingCart, Plus, Minus, Trash2,
  ArrowRight, ShoppingBag, Tag,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart();
    }
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const items = cart?.items ?? [];
  const itemCount = cart?.itemCount ?? 0;
  const total = cart?.total ?? 0;

  // Free delivery threshold
  const FREE_DELIVERY_THRESHOLD = 1000;
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - total);
  const progress = Math.min(100, (total / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={cn(
          'fixed inset-0 bg-black/50 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="শপিং কার্ট"
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-700" />
            <h2 className="font-bold text-gray-900">আমার কার্ট</h2>
            {itemCount > 0 && (
              <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="btn-icon"
            aria-label="কার্ট বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Free delivery progress ── */}
        {total > 0 && (
          <div className="px-5 py-3 bg-brand-50 border-b border-brand-100">
            {remaining > 0 ? (
              <p className="text-xs text-brand-700 mb-1.5">
                আরও <strong>{formatPriceEn(remaining)}</strong> কিনলে{' '}
                <span className="font-bold">ফ্রি ডেলিভারি!</span>
              </p>
            ) : (
              <p className="text-xs text-brand-700 mb-1.5 flex items-center gap-1">
                🎉 <strong>ফ্রি ডেলিভারি</strong> যোগ্য হয়েছেন!
              </p>
            )}
            <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Body — Cart items ── */}
        <div className="flex-1 overflow-y-auto py-3 px-5">
          {items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-semibold">কার্ট খালি আছে</p>
                <p className="text-gray-400 text-sm mt-1">পণ্য যোগ করুন এবং অর্ডার করুন</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-primary px-6"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const product = item.product;
                const unitPrice = product.discountPrice ?? product.price;
                const lineTotal = Number(unitPrice) * item.quantity;

                return (
                  <li
                    key={item.id}
                    className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-100"
                    >
                      {product.primaryImage ? (
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-brand-50">
                          🌶️
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={closeCart}
                        className="text-gray-800 font-medium text-sm leading-snug hover:text-brand-700 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                      {product.weight && (
                        <p className="text-gray-400 text-xs mt-0.5">{product.weight}</p>
                      )}

                      {/* Price + Qty row */}
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateItem(product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="কমান"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(product.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="বাড়ান"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <p className="text-brand-700 font-bold text-sm">{formatPriceEn(lineTotal)}</p>
                          {product.discountPrice && (
                            <p className="text-gray-400 line-through text-[10px]">
                              {formatPriceEn(Number(product.price) * item.quantity)}
                            </p>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(product.id)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors ml-1"
                          aria-label="সরান"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Footer — Summary + Actions ── */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-5 py-4 space-y-3">
            {/* Coupon hint */}
            <button className="w-full flex items-center gap-2 text-sm text-brand-600 hover:text-brand-800 transition-colors py-1">
              <Tag className="w-4 h-4" />
              কুপন কোড প্রয়োগ করুন
            </button>

            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>সাবটোটাল ({itemCount} পণ্য)</span>
                <span className="font-medium text-gray-800">{formatPriceEn(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>ডেলিভারি চার্জ</span>
                <span className={total >= FREE_DELIVERY_THRESHOLD ? 'text-brand-600 font-medium' : 'font-medium text-gray-800'}>
                  {total >= FREE_DELIVERY_THRESHOLD ? 'ফ্রি' : formatPriceEn(60)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2">
                <span>মোট</span>
                <span className="text-brand-700">
                  {formatPriceEn(total >= FREE_DELIVERY_THRESHOLD ? total : total + 60)}
                </span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              অর্ডার করুন
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* View cart */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-secondary w-full justify-center py-2.5 text-sm"
            >
              কার্ট দেখুন
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
