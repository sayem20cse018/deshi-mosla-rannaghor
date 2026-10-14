'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Loader2, Star, PackageX } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist.store';
import { useCartStore } from '@/store/cart.store';
import { useAuthStore } from '@/store/auth.store';
import { cn, formatPriceEn } from '@/lib/utils';
import toast from 'react-hot-toast';

const EMOJI_MAP: [string, string][] = [
  ['mosla', '🌶️'], ['tel', '🫙'], ['chal', '🍚'], ['dal', '🫘'],
  ['ata', '🌾'], ['modhu', '🍯'], ['gur', '🍯'], ['morich', '🌶️'],
];
function getEmoji(slug: string) {
  const found = EMOJI_MAP.find(([k]) => slug.toLowerCase().includes(k));
  return found ? found[1] : '🌿';
}

const STOCK_LABEL: Record<string, { label: string; cls: string }> = {
  IN_STOCK:    { label: 'স্টক আছে',   cls: 'bg-green-50 text-green-700 border-green-200' },
  LOW_STOCK:   { label: 'সীমিত স্টক', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  OUT_OF_STOCK:{ label: 'স্টক শেষ',   cls: 'bg-red-50 text-red-600 border-red-200' },
};

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, loading, fetched, fetchWishlist, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  // Ensure wishlist is loaded
  useEffect(() => {
    if (isAuthenticated && !fetched) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetched, fetchWishlist]);

  async function handleRemove(productId: string, name: string) {
    try {
      await removeFromWishlist(productId);
      toast(`"${name}" উইশলিস্ট থেকে সরানো হয়েছে`, { icon: '💔' });
    } catch {
      toast.error('সরাতে সমস্যা হয়েছে');
    }
  }

  async function handleAddToCart(item: typeof items[0]) {
    if (item.stockStatus === 'OUT_OF_STOCK') {
      toast.error('এই পণ্যের স্টক শেষ');
      return;
    }
    await addItem({
      id: item.productId, name: item.name, slug: item.slug,
      price: item.price, discountPrice: item.discountPrice,
      discountPercent: item.discountPercent, weight: item.weight,
      stockStatus: item.stockStatus, primaryImage: item.primaryImage,
      availableStock: 99,
    }, 1);
    toast.success('কার্টে যোগ হয়েছে', { icon: '🛒' });
  }

  async function handleClearAll() {
    if (!confirm('সব পণ্য উইশলিস্ট থেকে সরাবেন?')) return;
    try {
      await clearWishlist();
      toast.success('উইশলিস্ট পরিষ্কার হয়েছে');
    } catch {
      toast.error('কিছু একটা সমস্যা হয়েছে');
    }
  }

  // ── Loading state ─────────────────────────────────────
  if (loading && !fetched) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-forest-600" />
      </div>
    );
  }

  // ── Not logged in ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-700 font-bold text-lg mb-2">লগইন করুন</p>
        <p className="text-gray-400 text-sm mb-6">উইশলিস্ট দেখতে লগইন করুন।</p>
        <Link href="/login" className="btn-primary px-6">লগইন করুন</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          আমার উইশলিস্ট
        </h2>
        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {items.length} টি পণ্য
            </span>
            <button
              onClick={handleClearAll}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded-xl transition-colors font-semibold"
            >
              সব সরান
            </button>
          </div>
        )}
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <p className="text-gray-700 font-bold text-lg mb-2">উইশলিস্ট খালি</p>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            পছন্দের পণ্যে ❤️ আইকন ক্লিক করে উইশলিস্টে যোগ করুন।
          </p>
          <Link href="/shop" className="btn-primary px-8">
            পণ্য দেখুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item) => {
            const effectivePrice = item.discountPrice ?? item.price;
            const hasDiscount    = !!item.discountPrice && item.discountPrice < item.price;
            const isOOS          = item.stockStatus === 'OUT_OF_STOCK';
            const stockInfo      = STOCK_LABEL[item.stockStatus];

            return (
              <div
                key={item.productId}
                className={cn(
                  'group bg-white rounded-2xl border border-gray-100 overflow-hidden',
                  'hover:border-forest-200 hover:shadow-md transition-all duration-300',
                  isOOS && 'opacity-75',
                )}
              >
                {/* Image */}
                <Link href={`/product/${item.slug}`} className="block relative">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-green-50/30 relative">
                    {item.primaryImage ? (
                      <Image
                        src={item.primaryImage}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:640px) 50vw,25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {getEmoji(item.slug)}
                      </div>
                    )}

                    {/* Discount badge */}
                    {hasDiscount && item.discountPercent && (
                      <span className="absolute top-2 left-2 bg-spice-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow-sm">
                        -{item.discountPercent}%
                      </span>
                    )}

                    {/* Remove btn (top-right, hover) */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(item.productId, item.name); }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                      aria-label="উইশলিস্ট থেকে সরান"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>

                    {/* OOS overlay */}
                    {isOOS && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="bg-gray-800/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <PackageX className="w-3.5 h-3.5" /> স্টক শেষ
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3 space-y-2">
                  {/* Name */}
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-semibold text-[13px] text-gray-800 hover:text-forest-700 line-clamp-2 leading-snug transition-colors">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Weight */}
                  {item.weight && (
                    <p className="text-gray-400 text-[11px]">{item.weight}</p>
                  )}

                  {/* Stock badge */}
                  <span className={cn('inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border', stockInfo.cls)}>
                    {stockInfo.label}
                  </span>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-forest-700 font-black text-base leading-none">
                      {formatPriceEn(effectivePrice)}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-400 line-through text-xs">
                        {formatPriceEn(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-0.5">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOOS}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all',
                        isOOS
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-forest-700 hover:bg-forest-800 text-white shadow-sm hover:shadow-md',
                      )}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      {isOOS ? 'অনুপলব্ধ' : 'কার্টে যোগ'}
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId, item.name)}
                      className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-100"
                      aria-label="সরান"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add to cart all */}
      {items.length > 0 && items.some((i) => i.stockStatus !== 'OUT_OF_STOCK') && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={async () => {
              let count = 0;
              for (const item of items) {
                if (item.stockStatus !== 'OUT_OF_STOCK') {
                  await addItem({
                    id: item.productId, name: item.name, slug: item.slug,
                    price: item.price, discountPrice: item.discountPrice,
                    discountPercent: item.discountPercent, weight: item.weight,
                    stockStatus: item.stockStatus, primaryImage: item.primaryImage,
                    availableStock: 99,
                  }, 1);
                  count++;
                }
              }
              toast.success(`${count}টি পণ্য কার্টে যোগ হয়েছে`, { icon: '🛒' });
            }}
            className="flex items-center gap-2 bg-spice-600 hover:bg-spice-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-sm transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            সব পণ্য কার্টে যোগ করুন
          </button>
        </div>
      )}
    </div>
  );
}
