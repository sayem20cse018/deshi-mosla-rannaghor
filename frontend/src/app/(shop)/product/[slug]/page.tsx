'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Phone,
  MessageCircle,
} from 'lucide-react';
import { cn, formatPriceEn, calcDiscount } from '@/lib/utils';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useAuthStore } from '@/store/auth.store';
import { QuickCheckout } from '@/components/shop/QuickCheckout';
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
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [addingCart, setAddingCart] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Load variants
  const [variants, setVariants] = useState<any[]>([]);
  useEffect(() => {
    if (!product?.id) return;
    import('@/lib/api').then(({ default: api }) => {
      api.get('/admin/products/' + product.id + '/variants')
        .then(r => setVariants(r.data.data ?? []))
        .catch(() => {});
    });
  }, [product?.id]);

  const selectedVariant = variants.find(v => v.id === selectedVariantId) ?? null;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '+8801700000000';
  function openWhatsApp() {
    const msg = encodeURIComponent('I am interested in: ' + (product?.name ?? '') + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''));
    window.open('https://wa.me/' + whatsappNumber.replace(/\D/g, '') + '?text=' + msg, '_blank', 'noopener,noreferrer');
  }
  function callNow() {
    window.open('tel:' + whatsappNumber, '_self');
  }

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

  function handleBuyNow() {
    if (!product) return;
    setQuickOpen(true);
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
      <div className="border-b border-gray-200/60 bg-white">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400" style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}>
            <Link href="/" className="hover:text-orange-500">
              হোম
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-orange-500">
              শপ
            </Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${product.category.slug}`} className="hover:text-orange-500">
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
                <span className="bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold px-2.5 py-1 rounded-full">
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
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                {product.name}
              </h1>
              {product.nameEn && <p className="text-gray-400 text-sm mt-1">{product.nameEn}</p>}
            </div>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.avgRating} count={product.reviewCount} size="md" />
                <a href="#reviews" className="text-sm text-orange-500 hover:underline">
                  {product.reviewCount} টি রিভিউ
                </a>
              </div>
            )}

            {/* Price */}
            <div className="bg-gradient-to-r from-orange-50 to-white border border-orange-100/50 rounded-2xl p-4">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-orange-600">
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

            {/* Pack size / variant selector */}
            {variants.length > 0 && (
              <div>
                <p className="text-sm font-bold text-gray-700 mb-2">Select Pack Size</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const sel = selectedVariantId === v.id;
                    const vPrice = Number(v.salePrice ?? v.price);
                    const vOrig  = Number(v.price);
                    const vSave  = vOrig - vPrice;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariantId(sel ? null : v.id)}
                        className={cn(
                          'relative flex flex-col items-start px-3.5 py-2.5 rounded-xl border-2 transition-all min-w-[90px] text-left',
                          sel
                            ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300',
                        )}
                      >
                        {v.isBestSeller && (
                          <span className="absolute -top-2 left-2 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">Best Seller</span>
                        )}
                        <span className={cn('text-xs font-bold', sel ? 'text-white/90' : 'text-gray-500')}>{v.name}</span>
                        <span className={cn('text-base font-black leading-tight mt-0.5', sel ? 'text-white' : 'text-gray-900')}>{formatPriceEn(vPrice)}</span>
                        {vSave > 0 && (
                          <span className={cn('text-[10px] font-semibold mt-0.5', sel ? 'text-white/80' : 'text-orange-500')}>
                            Save {formatPriceEn(vSave)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            {!isOOS && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(product.minOrderQty ?? 1, q - 1))} disabled={qty <= (product.minOrderQty ?? 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-lg text-gray-900 select-none">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} disabled={qty >= maxQty}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Total: <strong className="text-orange-600 font-black">{formatPriceEn((selectedVariant ? Number(selectedVariant.salePrice ?? selectedVariant.price) : effectivePrice) * qty)}</strong>
                </span>
                {/* Wishlist heart */}
                <button
                  onClick={async () => {
                    if (!isAuthenticated) { toast('Login to wishlist', { icon: '🔐' }); return; }
                    const isW = isWishlisted(product.id);
                    if (isW) { await removeFromWishlist(product.id); toast('Removed from wishlist', { icon: '💔' }); }
                    else { await addToWishlist(product.id); toast.success('Added to wishlist'); }
                  }}
                  className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-all ml-auto',
                    isWishlisted(product?.id ?? '') ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                  )}
                >
                  <Heart className={cn('w-5 h-5', isWishlisted(product?.id ?? '') && 'fill-current')} />
                </button>
              </div>
            )}

            {/* ── CTA Buttons — amadere.com style ── */}
            <div className="space-y-2.5">
              {/* Row 1: Add to Cart + Buy Now */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={isOOS || addingCart}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[15px] border-2 transition-all active:scale-[0.98]',
                    isOOS
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-orange-500 bg-white text-orange-500 hover:bg-orange-50 shadow-sm',
                  )}
                >
                  {addingCart
                    ? <span className="w-5 h-5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    : <ShoppingCart className="w-5 h-5" />
                  }
                  {isOOS ? 'Out of Stock' : 'ADD TO CART'}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOOS}
                  className={cn(
                    'flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[15px] transition-all active:scale-[0.98] shadow-lg',
                    isOOS
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30',
                  )}
                >
                  <Zap className="w-5 h-5" /> BUY NOW
                </button>
              </div>

              {/* Row 2: WhatsApp + Call Now */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={openWhatsApp}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[14px] bg-[#25D366] hover:bg-[#1ebe5d] text-white transition-all active:scale-[0.98] shadow-sm shadow-[#25D366]/20"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={callNow}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-[14px] bg-gray-800 hover:bg-gray-900 text-white transition-all active:scale-[0.98] shadow-sm shadow-gray-900/20"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" /> Call Now
                </button>
              </div>
            </div>

            {/* Share */}
            <div className="flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast.success('Link copied'))}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[
                { icon: Truck, label: 'দ্রুত ডেলিভারি', sub: '২-৩ কার্যদিবসে' },
                { icon: RotateCcw, label: 'সহজ রিটার্ন', sub: '৭ দিনের মধ্যে' },
                { icon: Shield, label: '১০০% খাঁটি', sub: 'গুণমান নিশ্চিত' },
                { icon: Check, label: 'ক্যাশ অন ডেলিভারি', sub: 'সারাদেশে' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-orange-600" />
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
                  'px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px',
                  activeTab === i
                    ? 'text-orange-600 border-orange-500 font-bold'
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
                <div key={row.label} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
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
