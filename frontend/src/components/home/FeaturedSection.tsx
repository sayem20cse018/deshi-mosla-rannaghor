import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

const FEATURED = [
  { id: '6', name: 'রসুন (দেশি)', slug: 'rosun-deshi', price: 80, discountPrice: 70, weight: '৫০০গ্রাম', avgRating: 4.3, reviewCount: 476, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: true, isNewArrival: false },
  { id: '7', name: 'কারি মসলা', slug: 'curry-mosla', price: 150, discountPrice: null, weight: '১৫০গ্রাম', avgRating: 4.6, reviewCount: 1670, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: true, isNewArrival: false },
  { id: '8', name: 'হলুদ গুঁড়া (দেশি)', slug: 'holud-gura', price: 90, discountPrice: 75, weight: '৫০০গ্রাম', avgRating: 4.8, reviewCount: 590, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: true, isNewArrival: false },
  { id: '9', name: 'কোরা মসলা', slug: 'kora-mosla', price: 200, discountPrice: 180, weight: '২৫০গ্রাম', avgRating: 4.4, reviewCount: 430, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: true, isNewArrival: false },
  { id: '10', name: 'খেজুর গুড়', slug: 'khejur-gur', price: 380, discountPrice: null, weight: '৬০০গ্রাম', avgRating: 4.8, reviewCount: 97, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: true, isNewArrival: false },
];

export function FeaturedSection() {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">ফিচার্ড পণ্য</h2>
            <p className="section-subtitle">আমাদের বিশেষভাবে নির্বাচিত পণ্য</p>
          </div>
          <Link href="/shop?featured=true" className="flex items-center gap-1 text-brand-700 hover:text-brand-800 text-sm font-medium">
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {FEATURED.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      </div>
    </section>
  );
}
