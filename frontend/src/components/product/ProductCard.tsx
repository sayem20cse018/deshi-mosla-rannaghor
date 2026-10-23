'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star, Zap } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  ['mosla', '🌶️'], ['tel', '🫙'],  ['chal', '🍚'],  ['dal', '🫘'],
  ['ata', '🌾'],   ['lobon', '🧂'], ['chini', '🍯'], ['cha', '☕'],
  ['modhu', '🍯'], ['snacks', '🍿'],['noodles', '🍜'],['sauce', '🥫'],
  ['gur', '🍯'],   ['biryani', '🍛'],['morich', '🌶️'],
];

function getEmoji(slug: string) {
  const match = EMOJI_MAP.find(([k]) => slug.toLowerCase().includes(k));
  return match ? match[1] : '🌿';
}

// ── Star Rating sub-component ─────────────────────────────
function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-[1px]">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s}
            className={cn('w-[11px] h-[11px]',
              s <= Math.round(rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 fill-gray-200')}
          />
        ))}
      </div>
      {count !== undefined && count > 0 && (
        <span className="text-[10px] text-gray-400 leading-none">({count})</span>
      )}
    </div>
  );
}

export function ProductCard({ product, className, variant = 'default' }: ProductCardProps) {
  const { addItem }                                           = useCartStore();
  const { isWishlisted, addToWishlist, removeFromWishlist }  = useWishlistStore();
  const { isAuthenticated }                                  = useAuthStore();
  const router                                               = useRouter();
  const [adding,   setAdding]   = useState(false);
  const [wishBusy, setWishBusy] = useState(false);

  const isOOS       = product.stockStatus === 'OUT_OF_STOCK';
  const isLow       = product.stockStatus === 'LOW_STOCK';
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const price       = hasDiscount ? product.discountPrice! : product.price;
  const originalPx  = product.price;
  const savings     = hasDiscount ? originalPx - price : 0;
  const wishlisted  = isWishlisted(product.id);

  async function handleCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOOS || adding) return;
    setAdding(true);
    await addItem({
      id: product.id, name: product.name, slug: product.slug,
      price: product.price, discountPrice: product.discountPrice ?? null,
      discountPercent: product.discountPercent ?? null,
      weight: product.weight ?? null, stockStatus: product.stockStatus,
      primaryImage: product.primaryImage ?? null,
      availableStock: product.availableStock ?? 99,
    }, 1);
    setAdding(false);
    toast.success('কার্টে যোগ হয়েছে', { icon: '🛒' });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast('উইশলিস্টে যোগ করতে লগইন করুন', { icon: '🔐' });
      return;
    }
    if (wishBusy) return;
    setWishBusy(true);
    (wishlisted ? removeFromWishlist : addToWishlist)(product.id)
      .then(() => toast(wishlisted ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'উইশলিস্টে যোগ হয়েছে', { icon: wishlisted ? '💔' : '❤️' }))
      .catch(() => toast.error('কিছু একটা সমস্যা হয়েছে'))
      .finally(() => setWishBusy(false));
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group relative flex flex-col bg-white overflow-hidden',
        'rounded-2xl border border-gray-100/90',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-900/8 hover:border-orange-200/70',
        isOOS && 'opacity-60',
        className,
      )}
    >
      {/* ── IMAGE ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className={cn('relative w-full', variant === 'compact' ? 'aspect-[4/3]' : 'aspect-square')}>
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,22vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream-50 to-orange-50/20">
              <span className="text-[3.5rem] transition-transform duration-500 group-hover:scale-110 select-none">
                {getEmoji(product.slug)}
              </span>
            </div>
          )}

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* ── TOP LEFT BADGES ── */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            {hasDiscount && product.discountPercent && (
              <span className="inline-flex items-center bg-spice-600 text-white text-[10px] font-black px-2 py-[3px] rounded-lg shadow-sm leading-none">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="inline-flex items-center bg-emerald-500 text-white text-[10px] font-bold px-2 py-[3px] rounded-lg shadow-sm leading-none">
                নতুন
              </span>
            )}
            {product.isBestSeller && (
              <span className="inline-flex items-center gap-0.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-[3px] rounded-lg shadow-sm leading-none">
                🔥 হট
              </span>
            )}
            {product.isFeatured && !product.isBestSeller && (
              <span className="inline-flex items-center gap-0.5 bg-violet-500 text-white text-[10px] font-bold px-2 py-[3px] rounded-lg shadow-sm leading-none">
                ⭐
              </span>
            )}
          </div>

          {/* ── WISHLIST (top-right, appears on hover) ── */}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={wishlisted ? 'উইশলিস্ট থেকে সরান' : 'উইশলিস্টে যোগ করুন'}
            className={cn(
              'absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center',
              'transition-all duration-200 shadow-sm',
              // Show always if wishlisted, hover-show otherwise
              wishlisted
                ? 'opacity-100 bg-red-500 text-white'
                : 'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50',
              wishBusy && 'animate-pulse',
            )}
          >
            <Heart className={cn('w-[15px] h-[15px]', wishlisted && 'fill-current')} strokeWidth={2} />
          </button>

          {/* ── OUT OF STOCK ── */}
          {isOOS && (
            <div className="absolute inset-0 bg-white/65 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-gray-800/90 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg">
                স্টক শেষ
              </span>
            </div>
          )}

          {/* ── LOW STOCK ── */}
          {isLow && !isOOS && (
            <div className="absolute bottom-2 left-2">
              <span className="inline-flex items-center gap-0.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-[3px] rounded-md shadow-sm">
                <Zap className="w-2.5 h-2.5" /> সীমিত
              </span>
            </div>
          )}

          {/* ── QUICK ADD (slides up on hover) ── */}
          {!isOOS && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out px-2 pb-2">
              <button
                type="button"
                onClick={handleCart}
                disabled={adding}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500/95 backdrop-blur-sm text-white text-xs font-bold hover:bg-orange-600 active:bg-orange-700 transition-colors shadow-lg"
              >
                {adding
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ShoppingCart className="w-3.5 h-3.5" strokeWidth={2.5} />
                }
                {adding ? 'যোগ হচ্ছে...' : 'কার্টে যোগ করুন'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── INFO ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-1.5">

        {/* Product name */}
        <h3
          className="text-gray-800 font-semibold text-[13px] leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors duration-200 flex-1"
          style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}
        >
          {product.name}
        </h3>

        {/* Weight tag */}
        {product.weight && (
          <span className="inline-flex self-start text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md font-medium leading-none">
            {product.weight}
          </span>
        )}

        {/* Rating */}
        {product.avgRating !== undefined && product.avgRating > 0 && (
          <Stars rating={product.avgRating} count={product.reviewCount} />
        )}

        {/* Price block */}
        <div className="flex items-center justify-between gap-1 mt-auto pt-0.5">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-orange-600 font-black text-[16px] leading-none" style={{ fontFamily: 'Inter, Noto Sans Bengali, sans-serif' }}>
              {formatPriceEn(price)}
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through text-[11px] leading-none">
                {formatPriceEn(originalPx)}
              </span>
            )}
          </div>
          {savings > 0 && (
            <span className="flex-shrink-0 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-md leading-none">
              -{savings.toFixed(0)}৳
            </span>
          )}
        </div>

        {/* Add to Cart button — visible always on mobile, hidden on desktop (quick-add overlay handles it) */}
        <button
          type="button"
          onClick={handleCart}
          disabled={isOOS || adding}
          className={cn(
            'group-hover:hidden w-full flex items-center justify-center gap-1.5 rounded-xl py-[9px] text-[12px] font-bold transition-all mt-0.5',
            isOOS
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : adding
                ? 'bg-orange-100 text-orange-600'
                : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-sm shadow-orange-500/20',
          )}
        >
          {isOOS ? (
            'স্টক নেই'
          ) : adding ? (
            <><span className="w-3 h-3 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" /> যোগ হচ্ছে...</>
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5" strokeWidth={2.5} /> কার্টে যোগ করুন</>
          )}
        </button>
      </div>
    </Link>
  );
}
