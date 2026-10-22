'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star, Loader2, Edit3, Trash2, AlertCircle,
  CheckCircle, Clock, X,
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { StarRating } from '@/components/ui/StarRating';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
  APPROVED: { label: 'অনুমোদিত',   cls: 'bg-green-50 text-green-700 border-green-200',   icon: CheckCircle },
  PENDING:  { label: 'অপেক্ষারত',   cls: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock       },
  REJECTED: { label: 'প্রত্যাখ্যাত', cls: 'bg-red-50 text-red-600 border-red-200',         icon: AlertCircle },
};

const STAR_LABELS = ['', 'খুব খারাপ', 'খারাপ', 'ঠিক আছে', 'ভালো', 'চমৎকার'];

// ─── Inline Edit Form ─────────────────────────────────────
function EditForm({ review, onDone }: { review: any; onDone: () => void }) {
  const qc = useQueryClient();
  const [rating,  setRating]  = useState<number>(review.rating);
  const [hovered, setHovered] = useState(0);
  const [title,   setTitle]   = useState(review.title  ?? '');
  const [comment, setComment] = useState(review.comment ?? '');
  const [error,   setError]   = useState('');

  const mutation = useMutation({
    mutationFn: () => api.patch(`/reviews/${review.id}`, { rating, title, comment }),
    onSuccess: (res) => {
      toast.success(res.data.message ?? 'রিভিউ আপডেট হয়েছে');
      qc.invalidateQueries({ queryKey: ['my-reviews'] });
      onDone();
    },
    onError: (e: any) => setError(e.response?.data?.message ?? 'সমস্যা হয়েছে'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!rating)         { setError('রেটিং দিন'); return; }
    if (!comment.trim()) { setError('রিভিউ লিখুন'); return; }
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-gray-50 rounded-xl p-4">
      {/* Stars */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">রেটিং</p>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              className="p-0.5 hover:scale-110 transition-transform">
              <Star className={cn('w-7 h-7 transition-colors',
                s <= (hovered || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200')} />
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="text-xs text-amber-600 font-semibold ml-1">{STAR_LABELS[hovered || rating]}</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">শিরোনাম (ঐচ্ছিক)</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          maxLength={200} placeholder="শিরোনাম..." className="input-base text-sm" />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
          রিভিউ <span className="text-red-500">*</span>
        </label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)}
          rows={3} maxLength={2000} placeholder="আপনার অভিজ্ঞতা লিখুন..."
          className="input-base resize-none text-sm" />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={onDone}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-white transition-colors">
          বাতিল
        </button>
        <button type="submit" disabled={mutation.isPending}
          className="flex-1 flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-xl text-sm transition-all disabled:opacity-60">
          {mutation.isPending
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> হচ্ছে...</>
            : <><CheckCircle className="w-3.5 h-3.5" /> সংরক্ষণ</>
          }
        </button>
      </div>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────
export default function ReviewsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const r = await api.get('/users/me/reviews');
      return r.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      toast.success('রিভিউ মুছে ফেলা হয়েছে');
      qc.invalidateQueries({ queryKey: ['my-reviews'] });
    },
    onError: (e: any) => toast.error(e.response?.data?.message ?? 'মুছতে সমস্যা হয়েছে'),
  });

  function handleDelete(id: string) {
    if (!confirm('এই রিভিউটি স্থায়ীভাবে মুছে ফেলবেন?')) return;
    deleteMutation.mutate(id);
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          আমার রিভিউ
        </h2>
        {data?.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {data.length} টি রিভিউ
          </span>
        )}
      </div>

      {!data?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center">
          <Star className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-700 font-bold text-lg mb-1">কোনো রিভিউ নেই</p>
          <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
            ডেলিভারি পাওয়া পণ্যের পেজে গিয়ে রিভিউ দিন।
          </p>
          <Link href="/account/orders" className="btn-primary px-6 text-sm">
            আমার অর্ডার দেখুন
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((review: any) => {
            const sc    = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;
            const Icon  = sc.icon;
            const isEd  = editing === review.id;
            const canEd = review.status !== 'REJECTED';

            return (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:border-gray-200 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Product image */}
                  <Link href={`/product/${review.product?.slug}`}
                    className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 hover:border-forest-200 transition-colors">
                    {review.product?.images?.[0]?.url ? (
                      <Image src={review.product.images[0].url} alt={review.product.name}
                        width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🌶️</span>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    {/* Product name + status */}
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <Link href={`/product/${review.product?.slug}`}
                        className="font-bold text-gray-800 text-sm hover:text-orange-600 transition-colors">
                        {review.product?.name}
                      </Link>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border', sc.cls)}>
                          <Icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                        {/* Edit + Delete buttons */}
                        <div className="flex items-center gap-1 ml-1">
                          {canEd && !isEd && (
                            <button onClick={() => setEditing(review.id)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-forest-50 rounded-lg transition-colors"
                              title="সম্পাদনা">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {isEd && (
                            <button onClick={() => setEditing(null)}
                              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(review.id)}
                            disabled={deleteMutation.isPending}
                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="মুছুন">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stars + date */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <StarRating rating={review.rating} showCount={false} size="sm" />
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Review text */}
                    {!isEd && (
                      <>
                        {review.title && (
                          <p className="font-semibold text-gray-800 text-sm mt-2">{review.title}</p>
                        )}
                        {review.comment && (
                          <p className="text-gray-600 text-sm mt-1 leading-relaxed">{review.comment}</p>
                        )}
                        {/* Review images */}
                        {review.images?.length > 0 && (
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {review.images.map((img: string, i: number) => (
                              <div key={i} className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
                                <Image src={img} alt="" width={56} height={56} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Admin note if rejected */}
                        {review.status === 'REJECTED' && review.adminNote && (
                          <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2 flex items-start gap-2">
                            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600">{review.adminNote}</p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Inline edit form */}
                    {isEd && (
                      <EditForm review={review} onDone={() => setEditing(null)} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
