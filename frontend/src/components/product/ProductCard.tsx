'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useState } from 'react';
import toast from 'react-hot-toast';

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number | null;
  discountPercent?: number | null;
  weight?: string | null;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  primaryImage?: string | null;
  avgRating?: number;
  reviewCount?: number;
  availableStock?: number;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  variant?: 'default' | 'compact';
}

const EMOJI_MAP: [string, string][] = [
  ['mosla', '🌶️'], ['tel', '🫙'], ['chal', '🍚'], ['dal', '🫘'],
  ['ata', '🌾'], ['lobon', '🧂'], ['chini', '🍯'], ['cha', '☕'],
  ['modhu', '🍯'], ['snacks', '🍿'], ['noodles', '🍜'], ['sauce', '🥫'],
];

function getEmoji(slug: string) {
  const found = EMOJI_MAP.find(([k]) => slug.toLowerCase().includes(k));
  return found ? found[1] : '🌿';
}

export function ProductCard({ product, className, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [wishlisted,  setWishlisted]  = useState(false);
  const [addingCart,  setAddingCart]  = useState(false);

  const isOOS        = product.stockStatus === 'OUT_OF_STOCK';
  const isLow        = product.stockStatus === 'LOW_STOCK';
  const hasDiscount  = product.discountPrice && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;
  const savings        = hasDiscount ? product.price - product.discountPrice! : 0;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS || addingCart) return;
    setAddingCart(true);
    await addItem(
      {
        id:              product.id,
        name:            product.name,
        slug:            product.slug,
        price:           product.price,
        discountPrice:   product.discountPrice ?? null,
        discountPercent: product.discountPercent ?? null,
        weight:          product.weight ?? null,
        stockStatus:     product.stockStatus,
        primaryImage:    product.primaryImage ?? null,
        availableStock:  product.availableStock ?? 99,
      },
      1,
    );
    setAddingCart(false);
    toast.success('কার্টে যোগ হয়েছে', { icon: '🛒' });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted((w) => !w);
    toast(wishlisted ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'উইশলিস্টে যোগ হয়েছে', {
      icon: wishlisted ? '💔' : '❤️',
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group relative bg-white rounded-2xl border border-gray-100/80 overflow-hidden flex flex-col',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/8 hover:border-brand-200/60',
        isOOS && 'opacity-75',
        className,
      )}
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-brand-50/30">
        <div className={cn(
          'relative w-full',
          variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]',
        )}>
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,22vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl
                            transition-transform duration-500 group-hover:scale-110">
              {getEmoji(product.slug)}
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* ── BADGES ── */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {hasDiscount && product.discountPercent && (
              <span className="inline-flex items-center gap-0.5 bg-spice-500 text-white text-[10px] font-black
                               px-2 py-0.5 rounded-lg shadow-sm shadow-spice-500/40">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="inline-flex items-center bg-brand-600 text-white text-[10px] font-bold
                               px-2 py-0.5 rounded-lg shadow-sm shadow-brand-600/40">
                নতুন
              </span>
            )}
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white text-[10px] font-bold
                               px-2 py-0.5 rounded-lg shadow-sm shadow-amber-500/40">
                🔥 হট
              </span>
            )}
            {product.isFeatured && !product.isBestSeller && (
              <span className="inline-flex items-center gap-0.5 bg-purple-500 text-white text-[10px] font-bold
                               px-2 py-0.5 rounded-lg shadow-sm">
                ⭐ বিশেষ
              </span>
            )}
          </div>

          {/* ── WISHLIST BTN ── */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center',
              'transition-all duration-200 shadow-sm',
              'translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
              wishlisted
                ? 'bg-red-500 text-white shadow-red-500/30'
                : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white',
            )}
            aria-label="উইশলিস্ট"
          >
            <Heart className={cn('w-3.5 h-3.5 transition-transform', wishlisted && 'fill-current scale-110')} />
          </button>

          {/* ── OUT OF STOCK OVERLAY ── */}
          {isOOS && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-800/90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
                স্টক শেষ
              </span>
            </div>
          )}

          {/* ── LOW STOCK BADGE ── */}
          {isLow && !isOOS && (
            <div className="absolute bottom-2 left-2.5">
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold
                               px-2 py-0.5 rounded-lg animate-pulse">
                ⚡ সীমিত স্টক
              </span>
            </div>
          )}

          {/* Quick add overlay (shows on hover for desktop) */}
          {!isOOS && (
            <div className="absolute inset-x-0 bottom-0 p-2.5
                            translate-y-full group-hover:translate-y-0
                            transition-transform duration-300 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={addingCart}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-brand-700/95 backdrop-blur-sm text-white text-xs font-bold
                           hover:bg-brand-800 transition-colors shadow-lg"
              >
                {addingCart ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-3.5 h-3.5" />
                )}
                {addingCart ? 'যোগ হচ্ছে...' : 'কার্টে যোগ করুন'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT INFO ── */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">

        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-[13px] leading-snug line-clamp-2
                       group-hover:text-brand-700 transition-colors duration-200 flex-1">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-gray-400 text-[11px] font-medium">{product.weight}</p>
        )}

        {/* Rating */}
        {product.avgRating !== undefined && product.avgRating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'w-2.5 h-2.5 transition-colors',
                    s <= Math.round(product.avgRating!)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200 fill-gray-200',
                  )}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {product.avgRating.toFixed(1)}
              {product.reviewCount ? ` (${product.reviewCount})` : ''}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-brand-700 font-black text-[15px] leading-none">
              {formatPriceEn(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through text-[11px] leading-none">
                {formatPriceEn(product.price)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <span className="text-[10px] text-spice-600 font-bold bg-spice-50 px-1.5 py-0.5 rounded-lg flex-shrink-0">
              ৳{savings.toFixed(0)} সাশ্রয়
            </span>
          )}
        </div>

        {/* CTA button (shown always on mobile, hidden on desktop where overlay shows) */}
        <button
          onClick={handleAddToCart}
          disabled={isOOS || addingCart}
          className={cn(
            'group-hover:hidden w-full flex items-center justify-center gap-1.5',
            'rounded-xl py-2.5 text-[12px] font-bold transition-all duration-200 mt-1',
            isOOS
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : addingCart
                ? 'bg-brand-100 text-brand-700'
                : 'bg-brand-700 hover:bg-brand-800 active:scale-[0.97] text-white shadow-sm shadow-brand-700/20',
          )}
        >
          {addingCart ? (
            <><span className="w-3.5 h-3.5 border-2 border-brand-300 border-t-brand-700 rounded-full animate-spin" /> যোগ হচ্ছে...</>
          ) : isOOS ? (
            'স্টক নেই'
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" /> কার্টে যোগ করুন</>
          )}
        </button>

        {/* Buy now (mobile only) */}
        {!isOOS && (
          <Link
            href={`/product/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="group-hover:hidden w-full flex items-center justify-center gap-1.5
                       rounded-xl py-2 text-[11px] font-semibold
                       border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors"
          >
            <Zap className="w-3 h-3" /> এখনই কিনুন
          </Link>
        )}
      </div>
    </Link>
  );
}
