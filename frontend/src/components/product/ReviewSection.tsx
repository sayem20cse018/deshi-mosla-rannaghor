'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Star, ThumbsUp, Camera, Loader2, CheckCircle,
  ChevronDown, ChevronUp, Edit3, Trash2, AlertCircle, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import { useAuthStore } from '@/store/auth.store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { Review } from '@/types';

interface RatingDist { star: number; count: number; }

interface ReviewSectionProps {
  reviews:            Review[];
  avgRating:          number;
  reviewCount:        number;
  ratingDistribution: RatingDist[];
  productId:          string;
  productName?:       string;
}

// ─── Star picker ──────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const LABELS = ['', 'খুব খারাপ', 'খারাপ', 'ঠিক আছে', 'ভালো', 'চমৎকার'];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star className={cn(
              'w-8 h-8 transition-colors',
              s <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-100 text-gray-300',
            )} />
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="text-sm font-semibold text-amber-600">
          {LABELS[hovered || value]}
        </p>
      )}
    </div>
  );
}

// ─── Submit / Edit form ───────────────────────────────────
function ReviewForm({
  productId,
  productName,
  existing,
  onSuccess,
  onCancel,
}: {
  productId:   string;
  productName?: string;
  existing?:   any;
  onSuccess:   () => void;
  onCancel?:   () => void;
}) {
  const qc = useQueryClient();
  const [rating,  setRating]  = useState(existing?.rating  ?? 0);
  const [title,   setTitle]   = useState(existing?.title   ?? '');
  const [comment, setComment] = useState(existing?.comment ?? '');
  const [error,   setError]   = useState('');

  const isEdit = !!existing;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!rating) throw new Error('রেটিং দিন');
      if (!comment.trim()) throw new Error('রিভিউ লিখুন');

      if (isEdit) {
        const r = await api.patch(`/reviews/${existing.id}`, { rating, title, comment });
        return r.data;
      } else {
        const r = await api.post('/reviews', { productId, rating, title, comment });
        return r.data;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message ?? (isEdit ? 'রিভিউ আপডেট হয়েছে' : 'রিভিউ জমা হয়েছে'));
      qc.invalidateQueries({ queryKey: ['product'] });
      qc.invalidateQueries({ queryKey: ['my-reviews'] });
      qc.invalidateQueries({ queryKey: ['can-review', productId] });
      onSuccess();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message ?? err.message ?? 'কিছু একটা সমস্যা হয়েছে';
      setError(msg);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!rating) { setError('অনুগ্রহ করে রেটিং দিন'); return; }
    if (!comment.trim()) { setError('রিভিউ লিখুন'); return; }
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star picker */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-2 text-center">রেটিং দিন</p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          শিরোনাম (ঐচ্ছিক)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          placeholder="যেমন: চমৎকার মান, সত্যিই খাঁটি..."
          className="input-base"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          রিভিউ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="এই পণ্য সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
          className="input-base resize-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/2000</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-3 py-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2.5">
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            বাতিল
          </button>
        )}
        <button
          type="submit"
          disabled={mutation.isPending || !rating}
          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
        >
          {mutation.isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> জমা হচ্ছে...</>
            : isEdit ? <><Edit3 className="w-4 h-4" /> আপডেট করুন</>
            : <><CheckCircle className="w-4 h-4" /> রিভিউ দিন</>
          }
        </button>
      </div>
    </form>
  );
}

// ─── Single review card ───────────────────────────────────
function ReviewCard({ review, currentUserId, onEdit, onDelete }: {
  review: any;
  currentUserId?: string;
  onEdit:   (r: any) => void;
  onDelete: (id: string) => void;
}) {
  const isOwn = currentUserId && review.user?.id === currentUserId;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* User */}
        <div className="flex items-center gap-2.5">
          {review.user?.avatar ? (
            <Image src={review.user.avatar} alt={review.user.name}
              width={36} height={36} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-forest-100 flex items-center justify-center flex-shrink-0">
              <span className="text-orange-600 font-bold text-sm">
                {review.user?.name?.charAt(0) ?? '?'}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-gray-900 text-sm">{review.user?.name}</p>
              {isOwn && (
                <span className="text-[9px] font-bold bg-forest-50 text-orange-500 border border-forest-200 px-1.5 py-0.5 rounded-full">
                  আপনার রিভিউ
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs">
              {new Date(review.createdAt).toLocaleDateString('bn-BD', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: stars + owner actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <StarRating rating={review.rating} showCount={false} />
          {isOwn && (
            <div className="flex items-center gap-1 ml-1">
              <button onClick={() => onEdit(review)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-forest-50 rounded-lg transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(review.id)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {review.title && (
        <p className="font-bold text-gray-800 text-sm mb-1">{review.title}</p>
      )}
      {review.comment && (
        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
      )}

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {review.images.map((img: string, i: number) => (
            <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
              <Image src={img} alt={`রিভিউ ছবি ${i + 1}`} width={64} height={64}
                className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────
export function ReviewSection({
  reviews: initialReviews,
  avgRating,
  reviewCount,
  ratingDistribution,
  productId,
  productName,
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const qc = useQueryClient();

  const [showAll,    setShowAll]    = useState(false);
  const [showForm,   setShowForm]   = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [sort,       setSort]       = useState<'latest' | 'rating_high' | 'rating_low'>('latest');

  // Check if user can review this product
  const { data: canReviewData } = useQuery({
    queryKey: ['can-review', productId],
    queryFn: async () => {
      const r = await api.get(`/reviews/can-review/${productId}`);
      return r.data.data;
    },
    enabled: isAuthenticated,
  });

  // Paginated reviews
  const { data: reviewsData, refetch } = useQuery({
    queryKey: ['product-reviews', productId, sort],
    queryFn: async () => {
      const r = await api.get(`/reviews/product/${productId}?limit=50&sort=${sort}`);
      return r.data;
    },
    staleTime: 60_000,
  });

  const reviews = reviewsData?.data ?? initialReviews;
  const visible  = showAll ? reviews : reviews.slice(0, 5);
  const total    = reviewsData?.meta?.reviewCount ?? reviewCount;
  const avg      = reviewsData?.meta?.avgRating   ?? avgRating;
  const dist     = reviewsData?.meta?.distribution ?? ratingDistribution;

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      toast.success('রিভিউ মুছে ফেলা হয়েছে');
      qc.invalidateQueries({ queryKey: ['product-reviews', productId] });
      qc.invalidateQueries({ queryKey: ['can-review', productId] });
      qc.invalidateQueries({ queryKey: ['my-reviews'] });
      refetch();
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'মুছতে সমস্যা হয়েছে'),
  });

  function handleDelete(id: string) {
    if (!confirm('এই রিভিউটি মুছে ফেলবেন?')) return;
    deleteMutation.mutate(id);
  }

  function handleEdit(review: any) {
    setEditTarget(review);
    setShowForm(true);
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <section className="mt-10" id="reviews">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">গ্রাহকদের রিভিউ</h2>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value as any)}
              className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-forest-500">
              <option value="latest">সর্বশেষ</option>
              <option value="rating_high">সর্বোচ্চ রেটিং</option>
              <option value="rating_low">সর্বনিম্ন রেটিং</option>
            </select>
          </div>
        )}
      </div>

      {/* Empty state */}
      {total === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-10 text-center mb-6">
          <div className="text-5xl mb-3">⭐</div>
          <p className="text-gray-700 font-bold mb-1">এখনো কোনো রিভিউ নেই</p>
          <p className="text-gray-400 text-sm">প্রথম রিভিউ দিন!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Rating summary */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200/60 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="text-7xl font-black text-gray-900 leading-none">{avg}</div>
            <StarRating rating={avg} showCount={false} size="md" className="my-2 justify-center" />
            <p className="text-gray-500 text-sm font-medium">{total} টি রিভিউ</p>

            <div className="w-full mt-5 space-y-2">
              {dist.map(({ star, count }: RatingDist) => {
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3 text-right">{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden shadow-sm">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-400 w-5 text-right font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review list */}
          <div className="md:col-span-2 space-y-3">
            {visible.map((review: any) => (
              <ReviewCard
                key={review.id}
                review={review}
                currentUserId={user?.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

            {reviews.length > 5 && (
              <button onClick={() => setShowAll((s) => !s)}
                className="w-full py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:border-forest-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-1.5">
                {showAll
                  ? <><ChevronUp className="w-4 h-4" /> কম দেখুন</>
                  : <><ChevronDown className="w-4 h-4" /> আরও {reviews.length - 5} টি রিভিউ</>
                }
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Write / Edit Review ── */}
      <div id="review-form" className="bg-gradient-to-b from-white to-gray-50/50 rounded-2xl border border-gray-200 shadow-sm p-6">
        {!isAuthenticated ? (
          <div className="text-center py-4">
            <Star className="w-10 h-10 text-amber-300 mx-auto mb-3 fill-amber-300" />
            <p className="font-bold text-gray-800 mb-1">রিভিউ দিতে লগইন করুন</p>
            <p className="text-gray-400 text-sm mb-4">ক্রয় করা পণ্যে আপনার মতামত জানান।</p>
            <Link href="/login" className="btn-primary px-6 text-sm">লগইন করুন</Link>
          </div>
        ) : canReviewData && !canReviewData.hasPurchased ? (
          <div className="text-center py-4">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700 mb-1">রিভিউ দিতে পারবেন না</p>
            <p className="text-gray-400 text-sm">শুধুমাত্র ক্রয় ও ডেলিভারি পাওয়ার পর রিভিউ দিতে পারবেন।</p>
          </div>
        ) : canReviewData && canReviewData.hasReviewed && !showForm ? (
          <div className="text-center py-4">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
            <p className="font-bold text-gray-800 mb-1">আপনি রিভিউ দিয়েছেন</p>
            <p className="text-gray-400 text-sm mb-4">
              স্ট্যাটাস: {canReviewData.existingStatus === 'PENDING' ? '⏳ অপেক্ষারত' : canReviewData.existingStatus === 'APPROVED' ? '✅ অনুমোদিত' : '❌ প্রত্যাখ্যাত'}
            </p>
            <button onClick={() => setShowForm(true)}
              className="btn-secondary px-5 text-sm">
              <Edit3 className="w-4 h-4 inline mr-1" /> রিভিউ সম্পাদনা করুন
            </button>
          </div>
        ) : canReviewData?.canReview || showForm ? (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {editTarget ? 'রিভিউ সম্পাদনা করুন' : 'রিভিউ লিখুন'}
              </h3>
              {showForm && canReviewData?.hasReviewed && (
                <button onClick={() => { setShowForm(false); setEditTarget(null); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <ReviewForm
              productId={productId}
              productName={productName}
              existing={editTarget}
              onSuccess={() => { setShowForm(false); setEditTarget(null); refetch(); }}
              onCancel={editTarget ? () => { setShowForm(false); setEditTarget(null); } : undefined}
            />
          </div>
        ) : (
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-300 mx-auto" />
          </div>
        )}
      </div>
    </section>
  );
}
