'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Camera } from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { Review } from '@/types';

interface RatingDist {
  star: number;
  count: number;
}

interface ReviewSectionProps {
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
  ratingDistribution: RatingDist[];
  productId: string;
}

export function ReviewSection({
  reviews,
  avgRating,
  reviewCount,
  ratingDistribution,
}: ReviewSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 5);

  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">গ্রাহকদের রিভিউ</h2>

      {reviewCount === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-3">⭐</div>
          <p className="text-gray-600 font-medium">এখনো কোনো রিভিউ নেই</p>
          <p className="text-gray-400 text-sm mt-1">প্রথম রিভিউ দিন!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Rating summary */}
          <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-black text-gray-900 leading-none">{avgRating}</div>
            <StarRating
              rating={avgRating}
              showCount={false}
              size="md"
              className="my-2 justify-center"
            />
            <p className="text-gray-500 text-sm">{reviewCount} টি রিভিউ</p>

            <div className="w-full mt-4 space-y-1.5">
              {ratingDistribution.map(({ star, count }) => {
                const pct = reviewCount ? Math.round((count / reviewCount) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-4">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="md:col-span-2 space-y-4">
            {visible.map((review) => (
              <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {review.user.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                        <span className="text-brand-700 font-bold text-sm">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.user.name}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(review.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} showCount={false} />
                </div>

                {review.title && (
                  <p className="font-semibold text-gray-800 text-sm mb-1">{review.title}</p>
                )}
                {review.comment && (
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                )}

                {/* Review images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100"
                      >
                        <img
                          src={img}
                          alt={`Review image ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {reviews.length > 5 && (
              <button
                onClick={() => setShowAll((s) => !s)}
                className="w-full py-3 border border-gray-200 rounded-2xl text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-700 transition-colors"
              >
                {showAll ? 'কম দেখুন' : `আরও ${reviews.length - 5} টি রিভিউ দেখুন`}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
