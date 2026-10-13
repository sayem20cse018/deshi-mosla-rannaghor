'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Star } from 'lucide-react';
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
  ['ata', '🌾'],   ['lobon', '🧂'], ['chini', '🍯'], ['cha', '☕'],
  ['modhu', '🍯'], ['snacks', '🍿'], ['noodles', '🍜'], ['sauce', '🥫'],
  ['gur', '🍯'],   ['biryani', '🍛'], ['morich', '🌶️'],
];

function getEmoji(slug: string) {
  const found = EMOJI_MAP.find(([k]) => slug.toLowerCase().includes(k));
  return found ? found[1] : '🌿';
}

export function ProductCard({ product, className, variant = 'default' }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding,     setAdding]     = useState(false);

  const isOOS       = product.stockStatus === 'OUT_OF_STOCK';
  const isLow       = product.stockStatus === 'LOW_STOCK';
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const price       = hasDiscount ? product.discountPrice! : product.price;
  const savings     = hasDiscount ? product.price - product.discountPrice! : 0;

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
    setWishlisted((w) => !w);
    toast(wishlisted ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'উইশলিস্টে যোগ হয়েছে', {
      icon: wishlisted ? '💔' : '❤️',
    });
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-xl border border-gray-100 overflow-hidden',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/80 hover:border-spice-200',
        isOOS && 'opacity-70',
        className,
      )}
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className={cn('relative w-full', variant === 'compact' ? 'aspect-square' : 'aspect-[1/1]')}>
          {product.primaryImage ? (
            <Image src={product.primaryImage} alt={product.name} fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,22vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
              <span className="text-5xl md:text-6xl transition-transform duration-500 group-hover:scale-110">
                {getEmoji(product.slug)}
              </span>
            </div>
          )}

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && product.discountPercent && (
              <span className="bg-spice-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                -{product.discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                নতুন
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                🔥 হট
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className={cn(
              'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200',
              'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0',
              wishlisted ? 'bg-red-500 text-white' : 'bg-white shadow-sm text-gray-400 hover:text-red-500',
            )}
            aria-label="উইশলিস্ট">
            <Heart className={cn('w-3.5 h-3.5', wishlisted && 'fill-current')} />
          </button>

          {/* OOS overlay */}
          {isOOS && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">স্টক শেষ</span>
            </div>
          )}

          {/* Low stock */}
          {isLow && !isOOS && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">⚡ সীমিত</span>
            </div>
          )}

          {/* Quick add (desktop hover) */}
          {!isOOS && (
            <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={handleCart} disabled={adding}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-spice-600/95 text-white text-xs font-bold hover:bg-spice-700 transition-colors">
                {adding
                  ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ShoppingCart className="w-3.5 h-3.5" />
                }
                {adding ? 'যোগ হচ্ছে...' : 'কার্টে যোগ করুন'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-[13px] leading-snug line-clamp-2 group-hover:text-spice-700 transition-colors flex-1">
          {product.name}
        </h3>

        {/* Weight */}
        {product.weight && (
          <p className="text-gray-400 text-[11px]">{product.weight}</p>
        )}

        {/* Stars */}
        {product.avgRating !== undefined && product.avgRating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={cn('w-2.5 h-2.5',
                  s <= Math.round(product.avgRating!)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200')} />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.reviewCount ?? 0})</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-spice-700 font-black text-base leading-none">{formatPriceEn(price)}</span>
          {hasDiscount && (
            <span className="text-gray-400 line-through text-[11px]">{formatPriceEn(product.price)}</span>
          )}
          {savings > 0 && (
            <span className="ml-auto text-[10px] text-green-700 font-bold bg-green-50 px-1.5 py-0.5 rounded-md flex-shrink-0">
              -{savings.toFixed(0)}৳
            </span>
          )}
        </div>

        {/* Mobile-only CTA (always visible, hidden on desktop via group-hover) */}
        <button onClick={handleCart} disabled={isOOS || adding}
          className={cn(
            'group-hover:hidden w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all mt-1',
            isOOS ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : adding ? 'bg-spice-100 text-spice-700'
                  : 'bg-spice-600 hover:bg-spice-700 text-white',
          )}>
          {isOOS ? 'স্টক নেই'
            : adding ? <><span className="w-3 h-3 border-2 border-spice-300 border-t-spice-700 rounded-full animate-spin" /> হচ্ছে...</>
            : <><ShoppingCart className="w-3.5 h-3.5" /> কার্টে যোগ করুন</>
          }
        </button>
      </div>
    </Link>
  );
}
