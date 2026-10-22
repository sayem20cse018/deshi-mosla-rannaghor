'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Plus, GripVertical, Edit2, Trash2, Eye, EyeOff,
  ChevronUp, ChevronDown, Loader2, ImageIcon, Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminHeroSlides, useCreateHeroSlide, useUpdateHeroSlide,
  useDeleteHeroSlide, useReorderHeroSlides, HeroSlide,
} from '@/hooks/useHomepageCms';
import {
  PageHeader, AdminBtn, Modal, ConfirmDialog,
  LoadingState, ErrorState, EmptyState, Badge,
} from '@/components/admin/ui';
import { UploadButton } from '@/components/admin/media/UploadButton';

// ── Slide Form ────────────────────────────────────────────────────────────────

const BLANK: Partial<HeroSlide> = {
  title: '', titleEn: '', subtitle: '', subtitleEn: '',
  tag: '', tagEn: '', badge: '', badgeEn: '',
  image: '', imageMobile: '',
  ctaLabel: '', ctaLabelEn: '', ctaUrl: '/shop',
  cta2Label: '', cta2LabelEn: '', cta2Url: '/shop',
  bgColor: 'from-[#0f4c2a] to-[#1a6b3c]', emoji: '',
  isActive: true, sortOrder: 0,
  startDate: '', endDate: '',
};

interface SlideFormProps {
  initial?: Partial<HeroSlide>;
  onSave:   (dto: Partial<HeroSlide>) => Promise<void>;
  onClose:  () => void;
  loading:  boolean;
}

function SlideForm({ initial = BLANK, onSave, onClose, loading }: SlideFormProps) {
  const [form, setForm] = useState<Partial<HeroSlide>>({ ...BLANK, ...initial });

  const set = (k: keyof HeroSlide, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }));

  const field = (label: string, key: keyof HeroSlide, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ''}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
      />
    </div>
  );

  return (
    <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
      {/* Active toggle */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => set('isActive', !form.isActive)}
            className={cn(
              'w-10 h-5 rounded-full transition-colors relative cursor-pointer',
              form.isActive ? 'bg-orange-500' : 'bg-gray-300',
            )}
          >
            <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
          </div>
          <span className="text-sm font-semibold text-gray-700">{form.isActive ? 'Active' : 'Inactive'}</span>
        </label>
        <div className="flex-1" />
        {field('Sort Order', 'sortOrder', 'number')}
      </div>

      {/* Bengali content */}
      <div className="grid grid-cols-2 gap-3">
        {field('Title (BN)', 'title', 'text', 'e.g. আসল স্বাদ')}
        {field('Title (EN)', 'titleEn', 'text', 'e.g. Real Taste')}
        {field('Subtitle (BN)', 'subtitle', 'text', 'e.g. দেশি মসলা')}
        {field('Subtitle (EN)', 'subtitleEn', 'text', 'e.g. Deshi Spices')}
        {field('Tag (BN)', 'tag', 'text', 'e.g. ১০০% খাঁটি')}
        {field('Tag (EN)', 'tagEn', 'text', 'e.g. 100% Pure')}
        {field('Badge (BN)', 'badge', 'text', 'e.g. ৩০% ছাড়')}
        {field('Badge (EN)', 'badgeEn', 'text', 'e.g. 30% Off')}
      </div>

      {/* CTA buttons */}
      <div className="grid grid-cols-2 gap-3">
        {field('CTA Label (BN)', 'ctaLabel', 'text', 'e.g. এখনই কিনুন')}
        {field('CTA Label (EN)', 'ctaLabelEn', 'text', 'e.g. Shop Now')}
      </div>
      {field('CTA URL', 'ctaUrl', 'text', '/shop')}
      <div className="grid grid-cols-2 gap-3">
        {field('CTA2 Label (BN)', 'cta2Label', 'text', 'e.g. রেসিপি দেখুন')}
        {field('CTA2 Label (EN)', 'cta2LabelEn', 'text', 'e.g. View Recipes')}
      </div>
      {field('CTA2 URL', 'cta2Url', 'text', '/recipes')}

      {/* Images — direct upload */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Desktop Image</label>
          <UploadButton
            value={(form.image as string) ?? ''}
            onChange={(url) => set('image', url)}
            folder="banners"
            label="Upload Desktop Image"
            aspectRatio="wide"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Image</label>
          <UploadButton
            value={(form.imageMobile as string) ?? ''}
            onChange={(url) => set('imageMobile', url)}
            folder="banners"
            label="Upload Mobile Image"
            aspectRatio="tall"
          />
        </div>
      </div>

      {/* Styling */}
      <div className="grid grid-cols-2 gap-3">
        {field('BG Gradient Classes', 'bgColor', 'text', 'from-[#0f4c2a] to-[#1a6b3c]')}
        {field('Emoji', 'emoji', 'text', 'e.g. 🌶️')}
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
          <input type="datetime-local" value={(form.startDate as string) ?? ''}
            onChange={(e) => set('startDate', e.target.value || null)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
          <input type="datetime-local" value={(form.endDate as string) ?? ''}
            onChange={(e) => set('endDate', e.target.value || null)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn
          variant="primary"
          loading={loading}
          onClick={() => onSave(form)}
          className="flex-1"
        >
          Save Slide
        </AdminBtn>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HeroSlidesPage() {
  const { data, isLoading, isError, refetch } = useAdminHeroSlides();
  const createSlide  = useCreateHeroSlide();
  const updateSlide  = useUpdateHeroSlide();
  const deleteSlide  = useDeleteHeroSlide();
  const reorderSlides = useReorderHeroSlides();

  const slides = data?.data ?? [];

  const [editSlide,   setEditSlide]   = useState<HeroSlide | null>(null);
  const [showCreate,  setShowCreate]  = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);

  // ── Reorder helpers ──────────────────────────────────────
  function move(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= slides.length) return;
    const items = slides.map((s, i) => ({
      id: s.id,
      sortOrder: i === idx ? next : i === next ? idx : i,
    }));
    reorderSlides.mutate(items);
  }

  // ── Save handlers ────────────────────────────────────────
  async function handleCreate(dto: Partial<HeroSlide>) {
    await createSlide.mutateAsync(dto);
    setShowCreate(false);
  }

  async function handleUpdate(dto: Partial<HeroSlide>) {
    if (!editSlide) return;
    await updateSlide.mutateAsync({ id: editSlide.id, ...dto });
    setEditSlide(null);
  }

  async function handleToggle(slide: HeroSlide) {
    await updateSlide.mutateAsync({ id: slide.id, isActive: !slide.isActive });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Slides"
        description="Manage homepage hero slider. Drag to reorder, schedule start/end dates."
        action={
          <AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
            Add Slide
          </AdminBtn>
        }
      />

      {isLoading && <LoadingState message="Loading slides..." />}
      {isError   && <ErrorState message="Failed to load slides." onRetry={refetch} />}

      {!isLoading && !isError && slides.length === 0 && (
        <EmptyState
          title="No hero slides"
          description="Add your first slide to power the homepage hero banner."
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Slide</AdminBtn>}
        />
      )}

      {!isLoading && slides.length > 0 && (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={cn(
                'bg-white rounded-2xl border shadow-sm overflow-hidden transition-all',
                slide.isActive ? 'border-gray-100' : 'border-gray-100 opacity-60',
              )}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Reorder */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <GripVertical className="w-4 h-4 text-gray-300 mx-auto" />
                  <button onClick={() => move(idx, 1)} disabled={idx === slides.length - 1}
                    className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-24 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {slide.image ? (
                    <Image src={slide.image} alt={slide.title ?? ''} width={96} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">{slide.emoji ?? '🌶️'}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {slide.title || slide.titleEn || 'Untitled slide'}
                    </p>
                    <Badge variant={slide.isActive ? 'success' : 'default'}>
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {(slide.startDate || slide.endDate) && (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        <Calendar className="w-3 h-3" /> Scheduled
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {slide.subtitle || slide.subtitleEn || 'No subtitle'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    CTA: {slide.ctaLabel || slide.ctaLabelEn || '—'} &rarr; {slide.ctaUrl || '—'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(slide)}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center rounded-xl transition-colors',
                      slide.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100',
                    )}
                    title={slide.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditSlide(slide)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-orange-50 text-orange-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(slide)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Hero Slide" size="xl">
        <SlideForm
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
          loading={createSlide.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editSlide} onClose={() => setEditSlide(null)} title="Edit Hero Slide" size="xl">
        <SlideForm
          initial={editSlide ?? undefined}
          onSave={handleUpdate}
          onClose={() => setEditSlide(null)}
          loading={updateSlide.isPending}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteSlide.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Slide"
        message={`Delete "${deleteTarget?.title || deleteTarget?.titleEn || 'this slide'}"? This cannot be undone.`}
        loading={deleteSlide.isPending}
        danger
      />
    </div>
  );
}
