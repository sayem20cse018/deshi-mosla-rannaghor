// Mock product data — shown when backend API is not available
// Used as fallback in useProducts hooks

import { ProductCardData } from '@/components/product/ProductCard';

export const MOCK_PRODUCTS: ProductCardData[] = [
  {
    id: 'm1', name: 'খাঁটি সরিষার তেল', slug: 'khari-sorisar-tel',
    price: 320, discountPrice: 280, discountPercent: 13, weight: '১ লিটার',
    stockStatus: 'IN_STOCK', isBestSeller: true, primaryImage: null,
    avgRating: 4.8, reviewCount: 342,
  },
  {
    id: 'm2', name: 'দেশি হলুদ গুঁড়া', slug: 'deshi-holud-gura',
    price: 120, discountPrice: 95, discountPercent: 21, weight: '২০০ গ্রাম',
    stockStatus: 'IN_STOCK', isNewArrival: false, primaryImage: null,
    avgRating: 4.9, reviewCount: 215,
  },
  {
    id: 'm3', name: 'সুন্দরবনের খাঁটি মধু', slug: 'sundarban-madhu',
    price: 650, discountPrice: null, discountPercent: null, weight: '৫০০ গ্রাম',
    stockStatus: 'IN_STOCK', isFeatured: true, primaryImage: null,
    avgRating: 4.9, reviewCount: 489,
  },
  {
    id: 'm4', name: 'মিনিকেট চাল', slug: 'miniket-chal',
    price: 480, discountPrice: 440, discountPercent: 8, weight: '৫ কেজি',
    stockStatus: 'IN_STOCK', isBestSeller: true, primaryImage: null,
    avgRating: 4.7, reviewCount: 178,
  },
  {
    id: 'm5', name: 'মসুর ডাল', slug: 'masur-dal',
    price: 160, discountPrice: null, discountPercent: null, weight: '৫০০ গ্রাম',
    stockStatus: 'LOW_STOCK', primaryImage: null,
    avgRating: 4.6, reviewCount: 95,
  },
  {
    id: 'm6', name: 'দেশি আটা', slug: 'deshi-ata',
    price: 95, discountPrice: 85, discountPercent: 11, weight: '১ কেজি',
    stockStatus: 'IN_STOCK', isNewArrival: true, primaryImage: null,
    avgRating: 4.5, reviewCount: 67,
  },
  {
    id: 'm7', name: 'বিরিয়ানি মসলা', slug: 'biryani-mosla',
    price: 85, discountPrice: 70, discountPercent: 18, weight: '১০০ গ্রাম',
    stockStatus: 'IN_STOCK', isFeatured: true, primaryImage: null,
    avgRating: 4.8, reviewCount: 234,
  },
  {
    id: 'm8', name: 'খেজুরের গুড়', slug: 'khejurer-gur',
    price: 280, discountPrice: null, discountPercent: null, weight: '৫০০ গ্রাম',
    stockStatus: 'IN_STOCK', primaryImage: null,
    avgRating: 4.9, reviewCount: 156,
  },
  {
    id: 'm9', name: 'লাল মরিচ গুঁড়া', slug: 'lal-morich-gura',
    price: 110, discountPrice: 90, discountPercent: 18, weight: '২০০ গ্রাম',
    stockStatus: 'IN_STOCK', isBestSeller: true, primaryImage: null,
    avgRating: 4.7, reviewCount: 312,
  },
  {
    id: 'm10', name: 'রাঁধুনি গরম মসলা', slug: 'garam-mosla',
    price: 75, discountPrice: null, discountPercent: null, weight: '৫০ গ্রাম',
    stockStatus: 'IN_STOCK', primaryImage: null,
    avgRating: 4.6, reviewCount: 88,
  },
];

export const MOCK_FEATURED = MOCK_PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller);
export const MOCK_BESTSELLERS = MOCK_PRODUCTS.filter((p) => p.isBestSeller);
export const MOCK_NEW_ARRIVALS = MOCK_PRODUCTS.filter((p) => p.isNewArrival);
