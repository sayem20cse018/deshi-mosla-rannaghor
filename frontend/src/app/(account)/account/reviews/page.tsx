'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Star, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { StarRating } from '@/components/ui/StarRating';

const STATUS_COLOR: Record<string, string> = {
  APPROVED: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};
const STATUS_LABEL: Record<string, string> = {
  APPROVED: 'অনুমোদিত',
  PENDING: 'অপেক্ষারত',
  REJECTED: 'প্রত্যাখ্যাত',
};

export default function ReviewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const r = await api.get('/users/me/reviews');
      return r.data.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );

  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-5">আমার রিভিউ</h2>
      {!data?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Star className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold mb-1">কোনো রিভিউ নেই</p>
          <p className="text-gray-400 text-sm mb-5">পণ্য ক্রয়ের পর পণ্যের পেজ থেকে রিভিউ দিন।</p>
          <Link href="/shop" className="btn-primary px-6 text-sm">
            পণ্য দেখুন
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((review: any) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                {/* Product image */}
                <Link
                  href={`/product/${review.product?.slug}`}
                  className="w-14 h-14 rounded-xl overflow-hidden bg-brand-50 flex items-center justify-center flex-shrink-0 border border-gray-100 hover:border-brand-200 transition-colors"
                >
                  {review.product?.images?.[0]?.url ? (
                    <Image
                      src={review.product.images[0].url}
                      alt={review.product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🌶️</span>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <Link
                      href={`/product/${review.product?.slug}`}
                      className="font-semibold text-gray-800 text-sm hover:text-brand-700 transition-colors"
                    >
                      {review.product?.name}
                    </Link>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLOR[review.status]}`}
                    >
                      {STATUS_LABEL[review.status]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <StarRating rating={review.rating} showCount={false} size="sm" />
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>

                  {review.title && (
                    <p className="font-semibold text-gray-800 text-sm mt-2">{review.title}</p>
                  )}
                  {review.comment && (
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
