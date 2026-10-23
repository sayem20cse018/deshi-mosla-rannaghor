'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Star, CheckCircle, XCircle, Clock, Trash2, RefreshCw, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminReviews, useUpdateReviewStatus, useDeleteReview, AdminReview,
} from '@/hooks/useAdminCustomers';
import {
  PageHeader, AdminBtn, Pagination,
  FilterBar, LoadingState, ErrorState, EmptyState, ConfirmDialog, Modal,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

const STATUS_TABS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const;

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  PENDING:  { label: 'Pending',  dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200'  },
  APPROVED: { label: 'Approved', dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700 border-green-200'  },
  REJECTED: { label: 'Rejected', dot: 'bg-red-400',    badge: 'bg-red-50 text-red-600 border-red-200'         },
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn('w-3.5 h-3.5', i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
      ))}
    </div>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Review Row ──────────────────────────────────────────────────────────────
function ReviewRow({
  review, onApprove, onReject, onDelete, loading,
}: {
  review: AdminReview;
  onApprove: () => void;
  onReject:  (note: string) => void;
  onDelete:  () => void;
  loading:   boolean;
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const cfg = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;

  const productImage = review.product?.images?.[0]?.url ?? null;

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors align-top">
        {/* Product */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
              {productImage
                ? <Image src={productImage} alt={review.product.name} width={40} height={40} className="object-cover w-full h-full" />
                : <div className="w-full h-full flex items-center justify-center text-lg">🌶️</div>
              }
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-900 line-clamp-1">{review.product.name}</p>
              <Stars rating={review.rating} />
            </div>
          </div>
        </td>

        {/* Customer */}
        <td className="px-4 py-4 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {review.user.avatar
                ? <Image src={review.user.avatar} alt={review.user.name} width={28} height={28} className="object-cover w-full h-full" />
                : <span className="text-[10px] font-black text-orange-500">{review.user.name[0]}</span>
              }
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{review.user.name}</p>
              <p className="text-[10px] text-gray-400">{review.user.email}</p>
            </div>
          </div>
        </td>

        {/* Review content */}
        <td className="px-4 py-4">
          {review.title && <p className="text-xs font-bold text-gray-900 mb-0.5">{review.title}</p>}
          {review.comment && (
            <p className="text-xs text-gray-600 line-clamp-3 max-w-xs leading-relaxed">{review.comment}</p>
          )}
          {!review.title && !review.comment && (
            <span className="text-xs text-gray-300 italic">No text</span>
          )}
          {review.images?.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {review.images.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                  <Image src={img} alt="" width={28} height={28} className="w-7 h-7 rounded-lg object-cover border border-gray-100" />
                </a>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <span className={cn('text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 w-fit', cfg.badge)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
          {review.adminNote && (
            <p className="text-[10px] text-gray-400 mt-1 max-w-[120px] line-clamp-2">{review.adminNote}</p>
          )}
        </td>

        {/* Actions */}
        <td className="px-4 py-4">
          <div className="flex flex-col gap-1.5">
            {review.status !== 'APPROVED' && (
              <button
                onClick={onApprove}
                disabled={loading}
                className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <CheckCircle className="w-3 h-3" /> Approve
              </button>
            )}
            {review.status !== 'REJECTED' && (
              <button
                onClick={() => { setRejectNote(''); setShowRejectModal(true); }}
                disabled={loading}
                className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                <XCircle className="w-3 h-3" /> Reject
              </button>
            )}
            <button
              onClick={onDelete}
              disabled={loading}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </td>
      </tr>

      {/* Reject note modal */}
      <Modal open={showRejectModal} onClose={() => setShowRejectModal(false)} title="Reject Review" size="sm">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Optionally add a note explaining why this review is rejected.</p>
          <textarea
            value={rejectNote}
            onChange={(e) => setRejectNote(e.target.value)}
            rows={3}
            placeholder="Rejection reason (optional)..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
          <div className="flex gap-2">
            <AdminBtn variant="secondary" onClick={() => setShowRejectModal(false)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn
              variant="primary"
              loading={loading}
              onClick={() => { onReject(rejectNote); setShowRejectModal(false); }}
              className="flex-1"
            >
              Confirm Reject
            </AdminBtn>
          </div>
        </div>
      </Modal>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState('');
  const [activeTab,   setActiveTab]   = useState<string>('ALL');
  const [ratingFilter,setRatingFilter]= useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId,    setDeleteId]    = useState<string | null>(null);

  const filters = {
    page, limit: 20,
    search:  search  || undefined,
    status:  activeTab !== 'ALL' ? activeTab : undefined,
    rating:  ratingFilter ? Number(ratingFilter) : undefined,
    sortOrder: 'desc' as const,
  };

  const { data, isLoading, isError, refetch } = useAdminReviews(filters);
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();

  const reviews = data?.data ?? [];
  const meta    = data?.meta;

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  async function approve(id: string) {
    try {
      await updateStatus.mutateAsync({ id, status: 'APPROVED' });
      toast.success('Review approved.');
    } catch { toast.error('Failed.'); }
  }

  async function reject(id: string, note: string) {
    try {
      await updateStatus.mutateAsync({ id, status: 'REJECTED', adminNote: note || undefined });
      toast.success('Review rejected.');
    } catch { toast.error('Failed.'); }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await deleteReview.mutateAsync(deleteId);
      toast.success('Review deleted.');
    } catch { toast.error('Delete failed.'); }
    setDeleteId(null);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customer Reviews"
        description="Moderate product reviews before they go live."
        action={
          <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
            Refresh
          </AdminBtn>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Status tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          {STATUS_TABS.map((s) => {
            const cfg = s === 'ALL' ? null : STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => { setActiveTab(s); setPage(1); }}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex-shrink-0',
                  activeTab === s
                    ? 'border-orange-500 text-orange-600 bg-orange-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                )}
              >
                {cfg && <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />}
                {s === 'ALL' ? 'All Reviews' : cfg!.label}
                {activeTab === s && meta && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black bg-orange-500 text-white">
                    {meta.total > 99 ? '99+' : meta.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + filter bar */}
        <div className="p-4 border-b border-gray-50">
          <FilterBar
            search={search}
            onSearch={handleSearch}
            placeholder="Search by product, customer, comment..."
            onFilterToggle={() => setShowFilters(v => !v)}
          />
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Rating</label>
                <select value={ratingFilter} onChange={e => { setRatingFilter(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading && <LoadingState message="Loading reviews..." />}
        {isError   && <ErrorState message="Failed to load reviews." onRetry={refetch} />}
        {!isLoading && !isError && reviews.length === 0 && (
          <EmptyState
            title="No reviews found"
            description={activeTab === 'PENDING' ? 'No reviews awaiting moderation.' : 'Try adjusting filters.'}
            icon={<MessageSquare className="w-7 h-7 text-gray-300" />}
          />
        )}

        {!isLoading && !isError && reviews.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Review</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((review) => (
                  <ReviewRow
                    key={review.id}
                    review={review}
                    loading={updateStatus.isPending || deleteReview.isPending}
                    onApprove={() => approve(review.id)}
                    onReject={(note) => reject(review.id, note)}
                    onDelete={() => setDeleteId(review.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        loading={deleteReview.isPending}
        title="Delete Review"
        message="This will permanently delete the review. This cannot be undone."
      />
    </div>
  );
}
