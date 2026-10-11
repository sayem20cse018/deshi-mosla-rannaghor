'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { GuestCartItem, useCartStore } from '@/store/cart.store';
import { useState } from 'react';

interface CartItemProps {
  item: GuestCartItem;
  onLinkClick?: () => void;
  compact?: boolean; // drawer vs full page
}

export function CartItemRow({ item, onLinkClick, compact = false }: CartItemProps) {
  const { updateItem, removeItem } = useCartStore();
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);

  const { product, quantity } = item;
  const effectivePrice = product.discountPrice ?? product.price;
  const lineTotal = effectivePrice * quantity;
  const originalLineTotal = product.price * quantity;
  const hasSaving = product.discountPrice && product.discountPrice < product.price;

  async function handleQtyChange(newQty: number) {
    if (newQty === quantity || updating) return;
    setUpdating(true);
    updateItem(product.id, newQty);
    // small debounce feel
    await new Promise((r) => setTimeout(r, 150));
    setUpdating(false);
  }

  async function handleRemove() {
    setRemoving(true);
    await new Promise((r) => setTimeout(r, 100));
    removeItem(product.id);
  }

  const isLow = product.stockStatus === 'LOW_STOCK';
  const maxQty = Math.min(product.availableStock || 99, 20);

  if (compact) {
    // ── Drawer / compact variant ─────────────────────────
    return (
      <li
        className={cn(
          'flex gap-3 rounded-xl p-3 border transition-all duration-200',
          removing
            ? 'opacity-0 scale-95 border-red-100 bg-red-50'
            : 'border-gray-100 bg-gray-50 hover:border-brand-100 hover:bg-white',
        )}
      >
        {/* Thumbnail */}
        <Link
          href={`/product/${product.slug}`}
          onClick={onLinkClick}
          className="flex-shrink-0 w-[60px] h-[60px] rounded-xl overflow-hidden bg-white border border-gray-100 hover:border-brand-200 transition-colors"
        >
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              width={60}
              height={60}
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
            onClick={onLinkClick}
            className="text-sm font-semibold text-gray-800 hover:text-brand-700 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {product.weight && (
            <p className="text-gray-400 text-xs mt-0.5">{product.weight}</p>
          )}

          {isLow && (
            <p className="text-amber-600 text-[10px] font-semibold mt-0.5">⚠️ সীমিত স্টক</p>
          )}

          <div className="flex items-center justify-between mt-2">
            {/* Qty stepper */}
            <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQtyChange(quantity - 1)}
                disabled={quantity <= 1 || updating}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 transition-colors"
                aria-label="কমান"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className={cn(
                'w-7 text-center text-xs font-bold text-gray-900 select-none',
                updating && 'opacity-50',
              )}>
                {quantity}
              </span>
              <button
                onClick={() => handleQtyChange(quantity + 1)}
                disabled={quantity >= maxQty || updating}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-40 transition-colors"
                aria-label="বাড়ান"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Line total + remove */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-bold text-brand-700">{formatPriceEn(lineTotal)}</p>
                {hasSaving && quantity > 1 && (
                  <p className="text-[10px] text-gray-400 line-through">{formatPriceEn(originalLineTotal)}</p>
                )}
              </div>
              <button
                onClick={handleRemove}
                className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                aria-label="সরান"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }

  // ── Full page variant ────────────────────────────────
  return (
    <div
      className={cn(
        'flex gap-4 bg-white rounded-2xl border p-4 transition-all duration-300',
        removing
          ? 'opacity-0 scale-98 border-red-100'
          : 'border-gray-100 hover:border-brand-200 hover:shadow-sm',
      )}
    >
      {/* Thumbnail */}
      <Link
        href={`/product/${product.slug}`}
        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-100 hover:border-brand-300 transition-colors"
      >
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-brand-50">
            🌶️
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/product/${product.slug}`}
              className="font-semibold text-gray-900 hover:text-brand-700 transition-colors leading-snug line-clamp-2 text-sm sm:text-base"
            >
              {product.name}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {product.weight && (
                <span className="text-gray-400 text-xs bg-gray-50 px-2 py-0.5 rounded-full">{product.weight}</span>
              )}
              {hasSaving && (
                <span className="text-[11px] font-bold text-spice-600 bg-spice-50 px-2 py-0.5 rounded-full">
                  {product.discountPercent}% ছাড়
                </span>
              )}
              {isLow && (
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  ⚠️ সীমিত স্টক
                </span>
              )}
            </div>
          </div>

          {/* Remove btn (top right on full page) */}
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            aria-label="পণ্য সরান"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-3">
          {/* Unit price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-700">
              {formatPriceEn(effectivePrice)}
            </span>
            {hasSaving && (
              <span className="text-sm text-gray-400 line-through">{formatPriceEn(product.price)}</span>
            )}
            <span className="text-gray-400 text-xs">/ পিস</span>
          </div>

          {/* Qty stepper */}
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
            <button
              onClick={() => handleQtyChange(quantity - 1)}
              disabled={quantity <= 1 || updating}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 transition-colors"
              aria-label="কমান"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={cn(
              'w-10 text-center font-bold text-gray-900 text-sm select-none',
              updating && 'opacity-50',
            )}>
              {quantity}
            </span>
            <button
              onClick={() => handleQtyChange(quantity + 1)}
              disabled={quantity >= maxQty || updating}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 transition-colors"
              aria-label="বাড়ান"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Line total */}
          <div className="text-right min-w-[72px]">
            <p className="font-bold text-gray-900 text-base">{formatPriceEn(lineTotal)}</p>
            {hasSaving && (
              <p className="text-xs text-brand-600 font-medium">
                সাশ্রয়: {formatPriceEn((product.price - effectivePrice) * quantity)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
