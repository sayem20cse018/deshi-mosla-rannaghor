'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Star, User, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminTestimonials, useCreateTestimonial,
  useUpdateTestimonial, useDeleteTestimonial,
  Testimonial,
} from '@/hooks/useHomepageCms';
import {
  PageHeader, AdminBtn, Modal, ConfirmDialog,
  FilterBar, Pagination, LoadingState, ErrorState, EmptyState, Badge,
} from '@/components/admin/ui';

// ── Form ──────────────────────────────────────────────────────────────────────

const BLANK: Partial<Testimonial> = {
  name: '', role: '', avatar: '', rating: 5, comment: '', isActive: true, sortOrder: 0,
};

interface FormProps {
  initial?: Partial<Testimonial>;
  onSave:   (dto: Partial<Testimonial>) => Promise<void>;
  onClose:  () => void;
  loading:  boolean;
}

function TestimonialForm({ initial = BLANK, onSave, onClose, loading }: FormProps) {
  const [form, setForm] = useState<Partial<Testimonial>>({ ...BLANK, ...initial });
  const set = (k: keyof Testimonial, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const field = (label: string, key: keyof Testimonial, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        onChange={(e) => set(key, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Active toggle */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <button
          type="button"
          onClick={() => set('isActive', !form.isActive)}
          className={cn('w-10 h-5 rounded-full transition-colors relative', form.isActive ? 'bg-orange-500' : 'bg-gray-300')}
        >
          <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
        </button>
        <span className="text-sm font-semibold text-gray-700">{form.isActive ? 'Active' : 'Inactive'}</span>
        <div className="flex-1" />
        {field('Sort Order', 'sortOrder', 'number')}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {field('Name', 'name', 'text', 'Customer name')}
        {field('Role / Location', 'role', 'text', 'e.g. Dhaka, Customer')}
      </div>

      {field('Avatar URL', 'avatar', 'text', 'https://res.cloudinary.com/...')}

      {/* Preview avatar */}
      {form.avatar && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image src={form.avatar} alt={form.name ?? ''} width={48} height={48} className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-gray-600">Avatar preview</p>
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => set('rating', star)}
              className="transition-transform hover:scale-110"
            >
              <Star className={cn('w-6 h-6', (form.rating ?? 0) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300')} />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-gray-600">{form.rating}/5</span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
        <textarea
          value={form.comment ?? ''}
          onChange={(e) => set('comment', e.target.value)}
          rows={4}
          placeholder="Customer review text..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={() => onSave(form)} className="flex-1">
          Save Testimonial
        </AdminBtn>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem]       = useState<Testimonial | null>(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);

  const { data, isLoading, isError, refetch } = useAdminTestimonials({ page, limit: 20, search: search || undefined });
  const createT = useCreateTestimonial();
  const updateT = useUpdateTestimonial();
  const deleteT = useDeleteTestimonial();

  const items = data?.data ?? [];
  const meta  = data?.meta;

  async function handleCreate(dto: Partial<Testimonial>) {
    await createT.mutateAsync(dto);
    setShowCreate(false);
  }

  async function handleUpdate(dto: Partial<Testimonial>) {
    if (!editItem) return;
    await updateT.mutateAsync({ id: editItem.id, ...dto });
    setEditItem(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage customer reviews shown on the homepage."
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Testimonial</AdminBtn>}
      />

      <FilterBar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or comment..." />

      {isLoading && <LoadingState message="Loading testimonials..." />}
      {isError   && <ErrorState message="Failed to load." onRetry={refetch} />}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          title="No testimonials"
          description="Add customer testimonials to display on the homepage."
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Testimonial</AdminBtn>}
        />
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((t) => (
            <div key={t.id} className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3', !t.isActive && 'opacity-60')}>
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                  {t.avatar
                    ? <Image src={t.avatar} alt={t.name} width={44} height={44} className="w-full h-full object-cover" />
                    : <User className="w-5 h-5 text-gray-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  {t.role && <p className="text-xs text-gray-500">{t.role}</p>}
                </div>
                <Badge variant={t.isActive ? 'success' : 'default'}>{t.isActive ? 'Active' : 'Off'}</Badge>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={cn('w-3.5 h-3.5', t.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                ))}
                <span className="ml-1.5 text-xs text-gray-500">{t.rating}/5</span>
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">"{t.comment}"</p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => setEditItem(t)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteTarget(t)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Testimonial" size="md">
        <TestimonialForm onSave={handleCreate} onClose={() => setShowCreate(false)} loading={createT.isPending} />
      </Modal>

      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Testimonial" size="md">
        <TestimonialForm initial={editItem ?? undefined} onSave={handleUpdate} onClose={() => setEditItem(null)} loading={updateT.isPending} />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteT.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Testimonial"
        message={`Delete testimonial from "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleteT.isPending}
        danger
      />
    </div>
  );
}
