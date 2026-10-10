import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

const NEW_ARRIVALS = [
  { id: '11', name: 'মধু (খাঁটি)', slug: 'modhu-khati', price: 350, discountPrice: null, weight: '৪০০মিলি', avgRating: 4.8, reviewCount: 97, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: false, isNewArrival: true },
  { id: '12', name: 'আচার (কামরাঙা)', slug: 'achar-kamranga', price: 120, discountPrice: null, weight: '৩০০গ্রাম', avgRating: 4.6, reviewCount: 23, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: false, isNewArrival: true },
  { id: '13', name: 'নুডলস', slug: 'noodles', price: 35, discountPrice: null, weight: '৭৫গ্রাম', avgRating: 4.3, reviewCount: 66, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: false, isNewArrival: true },
  { id: '14', name: 'কফি (ইন্সট্যান্ট)', slug: 'coffee-instant', price: 280, discountPrice: null, weight: '১৫০গ্রাম', avgRating: 4.7, reviewCount: 30, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: false, isNewArrival: true },
  { id: '15', name: 'চিড়া', slug: 'chira', price: 70, discountPrice: null, weight: '৫০০গ্রাম', avgRating: 4.1, reviewCount: 12, stockStatus: 'IN_STOCK' as const, primaryImage: null, isBestSeller: false, isFeatured: false, isNewArrival: true },
];

export function NewArrivalsSection() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">নতুন পণ্য</h2>
            <p className="section-subtitle">সদ্য যোগ হওয়া পণ্যগুলো দেখুন</p>
          </div>
          <Link href="/shop?sort=newest" className="flex items-center gap-1 text-brand-700 hover:text-brand-800 text-sm font-medium">
            সব দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {NEW_ARRIVALS.map((p) => <ProductCard key={p.id} product={p as any} />)}
        </div>
      </div>
    </section>
  );
}
