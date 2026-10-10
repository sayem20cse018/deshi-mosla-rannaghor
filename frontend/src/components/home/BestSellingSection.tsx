import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

// Static placeholder — replaced with API in Step 2
const PRODUCTS = [
  { id: '1', name: 'ধনে গুঁড়া (দেশি)', slug: 'dhone-gura', price: 120, discountPrice: 100, weight: '500g', avgRating: 4.8, reviewCount: 256, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: true, isFeatured: false, isNewArrival: false, discountPercent: 17 },
  { id: '2', name: 'মরিচ গুঁড়া', slug: 'morich-gura', price: 160, discountPrice: 140, weight: '500g', avgRating: 4.7, reviewCount: 188, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: true, isFeatured: false, isNewArrival: false, discountPercent: 13 },
  { id: '3', name: 'সরিষার তেল', slug: 'shorisha-tel', price: 250, discountPrice: 220, weight: '1 লিটার', avgRating: 4.9, reviewCount: 320, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: true, isFeatured: false, isNewArrival: false, discountPercent: 12 },
  { id: '4', name: 'চাল (মিনিকেট)', slug: 'chal-miniket', price: 320, discountPrice: 280, weight: '৫ কেজি', avgRating: 4.6, reviewCount: 410, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: true, isFeatured: false, isNewArrival: false, discountPercent: 13 },
  { id: '5', name: 'মসুর ডাল', slug: 'mosur-dal', price: 120, discountPrice: 95, weight: '১ কেজি', avgRating: 4.5, reviewCount: 175, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: true, isFeatured: false, isNewArrival: false, discountPercent: 21 },
];

export function BestSellingSection() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">সেরা বিক্রিত পণ্য</h2>
            <p className="section-subtitle">সবচেয়ে বেশি জনপ্রিয় পণ্যগুলো</p>
          </div>
          <Link href="/shop?sort=best_selling" className="flex items-center gap-1 text-brand-700 hover:text-brand-800 text-sm font-medium">
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>
      </div>
    </section>
  );
}
