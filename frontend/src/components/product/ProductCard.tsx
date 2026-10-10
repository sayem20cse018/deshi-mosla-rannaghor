'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
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

const PLACEHOLDER_EMOJIS: Record<string, string> = {
  mosla: '🌶️', tel: '🫙', chal: '🍚', dal: '🫘',
  ata: '🌾', lobon: '🧂', chini: '🍯', cha: '☕',
  snacks: '🍿', noodles: '🍜', sauce: '🥫', modhu: '🍯',
  cooking: '🥘',
};

function getEmoji(slug: string) {
  const key = Object.keys(PLACEHOLDER_EMOJIS).find((k) => slug.includes(k));
  return key ? PLACEHOLDER_EMOJIS[key] : '🛒';
}

export function ProductCard({ product, className, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  const isOOS = product.stockStatus === 'OUT_OF_STOCK';
  const isLow = product.stockStatus === 'LOW_STOCK';
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const effectivePrice = hasDiscount ? product.discountPrice! : product.price;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (isOOS || addingCart) return;
    setAddingCart(true);
    await addItem(product.id);
    setAddingCart(false);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    setWishlisted((w) => !w);
    toast(wishlisted ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'উইশলিস্টে যোগ হয়েছে', {
      icon: wishlisted ? '💔' : '❤️',
    });
  }

  return (
    <Link href={`/product/${product.slug}`} className={cn('product-card block', className)}>
      {/* Image container */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className={cn('relative w-full', variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]')}>
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl bg-gradient-to-br from-brand-50 to-brand-100 transition-transform duration-500 group-hover:scale-105">
              {getEmoji(product.slug)}
            </div>
          )}

          {/* Top-left badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && product.discountPercent && (
              <span className="badge-disc">-{product.discountPercent}%</span>
            )}
            {product.isNewArrival && <span className="badge-new">নতুন</span>}
            {product.isBestSeller && <span className="badge-hot">🔥</span>}
          </div>

          {/* Wishlist btn */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              wishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white/90 text-gray-400 hover:text-red-400',
            )}
            aria-label="উইশলিস্ট"
          >
            <Heart className={cn('w-3.5 h-3.5', wishlisted && 'fill-current')} />
          </button>

          {/* Quick view hover overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
            <span className="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
              <Eye className="w-3 h-3" /> দেখুন
            </span>
          </div>

          {/* Out of stock overlay */}
          {isOOS && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                স্টক শেষ
              </span>
            </div>
          )}

          {/* Low stock */}
          {isLow && !isOOS && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                সীমিত স্টক
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-sm leading-snug line-clamp-2 group-hover:text-brand-700 transition-colors">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-gray-400 text-xs">{product.weight}</p>
        )}

        {/* Rating */}
        {(product.avgRating !== undefined && product.avgRating > 0) && (
          <StarRating
            rating={product.avgRating}
            count={product.reviewCount}
            size="sm"
          />
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-2">
          <span className="price-main text-base">
            {formatPriceEn(effectivePrice)}
          </span>
          {hasDiscount && (
            <span className="price-old">{formatPriceEn(product.price)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={isOOS || addingCart}
          className={cn(
            'w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all duration-200',
            isOOS
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-700 hover:bg-brand-800 active:scale-95 text-white',
          )}
        >
          {addingCart ? (
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              যোগ হচ্ছে...
            </span>
          ) : isOOS ? (
            'স্টক নেই'
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              কার্টে যোগ করুন
            </>
          )}
        </button>

        {/* Buy now */}
        {!isOOS && (
          <Link
            href={`/checkout?buy=${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-medium border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors"
          >
            <Zap className="w-3 h-3" />
            এখনই কিনুন
          </Link>
        )}
      </div>
    </Link>
  );
}
