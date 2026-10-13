'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
  Check,
  Info,
} from 'lucide-react';
import { cn, formatPriceEn, calcDiscount } from '@/lib/utils';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart.store';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ReviewSection } from '@/components/product/ReviewSection';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { StarRating } from '@/components/ui/StarRating';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import toast from 'react-hot-toast';

const TABS = ['বিবরণ', 'উপাদান', 'ব্যবহার', 'সংরক্ষণ'];

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useProduct(slug);
  const product = data?.data as any;
  const { addItem, openCart } = useCartStore();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addingCart, setAddingCart] = useState(false);

  function buildProductArg() {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
      discountPercent: product.discountPercent ?? null,
      weight: product.weight ?? null,
      stockStatus: product.stockStatus,
      primaryImage: product.images?.[0]?.url ?? null,
      availableStock: product.inventory?.availableStock ?? 99,
    };
  }

  async function handleAddToCart() {
    if (!product) return;
    setAddingCart(true);
    await addItem(buildProductArg(), qty);
    setAddingCart(false);
  }

  async function handleBuyNow() {
    if (!product) return;
    setAddingCart(true);
    await addItem(buildProductArg(), qty);
    setAddingCart(false);
    openCart();
  }

  // ── Loading ────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <SkeletonCard className="aspect-square" />
          <div className="space-y-4">
            {[200, 120, 80, 160, 40, 120, 48].map((w, i) => (
              <div key={i} className={`shimmer-bg h-5 rounded-lg`} style={{ width: `${w}px` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">পণ্যটি পাওয়া যায়নি।</p>
        <Link href="/shop" className="btn-primary mt-4 inline-flex">
          শপে ফিরুন
        </Link>
      </div>
    );
  }

  const isOOS = product.stockStatus === 'OUT_OF_STOCK';
  const isLow = product.stockStatus === 'LOW_STOCK';
  const price = Number(product.price);
  const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
  const effectivePrice = discountPrice ?? price;
  const discountPct = discountPrice ? calcDiscount(price, discountPrice) : 0;
  const maxQty = Math.min(product.inventory?.availableStock ?? 99, product.maxOrderQty ?? 99);

  const tabContent = [product.description, product.ingredients, product.usage, product.storageInfo];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-brand-600">
              হোম
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-brand-600">
              শপ
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${product.category.slug}`} className="hover:text-brand-600">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Left: Gallery ── */}
          <div className="md:sticky md:top-24 self-start">
            <ProductGallery images={product.images ?? []} productName={product.name} />
          </div>

          {/* ── Right: Details ── */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isBestSeller && (
                <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-1 rounded-full">
                  🔥 বেস্টসেলার
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-brand-50 text-brand-700 border border-brand-100 text-xs font-bold px-2.5 py-1 rounded-full">
                  ✨ নতুন
                </span>
              )}
              {isLow && (
                <span className="bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold px-2.5 py-1 rounded-full">
                  ⚠️ সীমিত স্টক
                </span>
              )}
              {isOOS && (
                <span className="bg-gray-100 text-gray-500 border border-gray-200 text-xs font-bold px-2.5 py-1 rounded-full">
                  স্টক শেষ
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              {product.nameEn && <p className="text-gray-400 text-sm mt-1">{product.nameEn}</p>}
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.avgRating} count={product.reviewCount} size="md" />
                <a href="#reviews" className="text-sm text-brand-600 hover:underline">
                  {product.reviewCount} টি রিভিউ
                </a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-brand-700">
                {formatPriceEn(effectivePrice)}
              </span>
              {discountPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPriceEn(price)}</span>
                  <span className="bg-spice-500 text-white text-sm font-bold px-2.5 py-1 rounded-xl">
                    {discountPct}% ছাড়
                  </span>
                </>
              )}
            </div>

            {/* Weight / Origin / SKU */}
            <div className="flex flex-wrap gap-3 text-sm">
              {product.weight && (
                <span className="chip">
                  <Package className="w-3 h-3" /> {product.weight}
                </span>
              )}
              {product.origin && <span className="chip">📍 {product.origin}</span>}
              {product.brand && <span className="chip">🏷️ {product.brand.name}</span>}
              <span className="chip text-gray-400">SKU: {product.sku}</span>
            </div>

            {/* Quantity selector */}
            {!isOOS && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">পরিমাণ</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(product.minOrderQty ?? 1, q - 1))}
                      disabled={qty <= (product.minOrderQty ?? 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                      disabled={qty >= maxQty}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    মোট:{' '}
                    <strong className="text-brand-700">
                      {formatPriceEn(effectivePrice * qty)}
                    </strong>
                  </span>
                </div>
                {product.minOrderQty > 1 && (
                  <p className="text-xs text-gray-400 mt-1">
                    সর্বনিম্ন অর্ডার: {product.minOrderQty} টি
                  </p>
                )}
              </div>
            )}

            {/* CTA buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOOS || addingCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all',
                  isOOS
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-brand-700 hover:bg-brand-800 text-white active:scale-95',
                )}
              >
                {addingCart ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
                {isOOS ? 'স্টক নেই' : 'কার্টে যোগ করুন'}
              </button>

              {!isOOS && (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-spice-500 hover:bg-spice-600 text-white active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4" /> এখনই কিনুন
                </button>
              )}

              <button
                onClick={() => {
                  setWishlisted((w) => !w);
                  toast(wishlisted ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'উইশলিস্টে যোগ হয়েছে', {
                    icon: wishlisted ? '💔' : '❤️',
                  });
                }}
                className={cn(
                  'w-12 h-12 flex-shrink-0 rounded-xl border flex items-center justify-center transition-all',
                  wishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400',
                )}
                aria-label="উইশলিস্ট"
              >
                <Heart className={cn('w-5 h-5', wishlisted && 'fill-current')} />
              </button>

              <button
                onClick={() =>
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => toast.success('লিংক কপি হয়েছে'))
                }
                className="w-12 h-12 flex-shrink-0 rounded-xl border border-gray-200 text-gray-500 flex items-center justify-center hover:border-brand-200 hover:text-brand-600 transition-colors"
                aria-label="শেয়ার"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { icon: Truck, label: 'দ্রুত ডেলিভারি', sub: '২-৩ কার্যদিবসে' },
                { icon: RotateCcw, label: 'সহজ রিটার্ন', sub: '৭ দিনের মধ্যে' },
                { icon: Shield, label: '১০০% খাঁটি', sub: 'গুণমান নিশ্চিত' },
                { icon: Check, label: 'ক্যাশ অন ডেলিভারি', sub: 'সারাদেশে' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-brand-700" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{label}</p>
                    <p className="text-[11px] text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Product Info Tabs ── */}
        <div className="mt-12">
          {/* Tab nav */}
          <div className="flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                  activeTab === i
                    ? 'text-brand-700 border-brand-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700',
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-6">
            {tabContent[activeTab] ? (
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {tabContent[activeTab]}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">তথ্য পাওয়া যায়নি</p>
            )}
          </div>

          {/* Extra metadata */}
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {[
              { label: 'পণ্যের উৎস', value: product.origin },
              { label: 'ওজন/সাইজ', value: product.weight },
              { label: 'ব্র্যান্ড', value: product.brand?.name },
              { label: 'ক্যাটাগরি', value: product.category?.name },
              { label: 'SKU', value: product.sku },
              {
                label: 'স্টক অবস্থা',
                value: isOOS ? 'স্টক শেষ' : isLow ? 'সীমিত স্টক' : 'স্টকে আছে',
              },
            ]
              .filter((r) => r.value)
              .map((row) => (
                <div key={row.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-500 text-xs font-medium w-28 flex-shrink-0">
                    {row.label}
                  </span>
                  <span className="text-gray-800 text-xs font-semibold">{row.value}</span>
                </div>
              ))}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div id="reviews">
          <ReviewSection
            reviews={product.reviews ?? []}
            avgRating={product.avgRating ?? 0}
            reviewCount={product.reviewCount ?? 0}
            ratingDistribution={product.ratingDistribution ?? []}
            productId={product.id}
          />
        </div>

        {/* ── Related ── */}
        <RelatedProducts slug={slug} />
      </div>
    </div>
  );
}
