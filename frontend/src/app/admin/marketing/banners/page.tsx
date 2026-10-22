'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, ImageIcon, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, AdminBanner } from '@/hooks/useMarketing';
import { PageHeader, AdminBtn, Modal, ConfirmDialog, LoadingState, ErrorState, EmptyState, Badge } from '@/components/admin/ui';

const POSITIONS = ['HERO','PROMOTIONAL','CATEGORY_TOP','HOMEPAGE_MIDDLE','SIDEBAR'];
const BLANK: Partial<AdminBanner> = { title:'', titleEn:'', subtitle:'', image:'', imageMobile:'', link:'', buttonText:'', position:'HERO', isActive:true, sortOrder:0, startDate:'', endDate:'' };

function BannerForm({ initial = BLANK, onSave, onClose, loading }: { initial?:Partial<AdminBanner>; onSave:(d:any)=>Promise<void>; onClose:()=>void; loading:boolean }) {
  const [f, setF] = useState<any>({ ...BLANK, ...initial });
  const set = (k:string, v:any) => setF((p:any) => ({ ...p, [k]:v }));

  const field = (label:string, key:string, type='text', ph='') => (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} value={f[key]??''} onChange={e => set(key, e.target.value)} placeholder={ph}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
    </div>
  );

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <button type="button" onClick={() => set('isActive',!f.isActive)}
          className={cn('w-10 h-5 rounded-full relative transition-colors', f.isActive?'bg-orange-500':'bg-gray-300')}>
          <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', f.isActive?'translate-x-5':'translate-x-0.5')} />
        </button>
        <span className="text-sm font-semibold">{f.isActive?'Active':'Inactive'}</span>
        <div className="flex-1" />
        <div>
          <select value={f.position??'HERO'} onChange={e => set('position',e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
            {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <input type="number" value={f.sortOrder??0} onChange={e => set('sortOrder',Number(e.target.value))} placeholder="Order"
            className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Title (BN)', 'title')}
        {field('Title (EN)', 'titleEn')}
      </div>
      {field('Subtitle', 'subtitle')}
      {field('Desktop Image URL *', 'image', 'text', 'https://res.cloudinary.com/...')}
      {f.image && (
        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gray-100">
          <Image src={f.image} alt="preview" fill className="object-cover" sizes="600px" />
        </div>
      )}
      {field('Mobile Image URL', 'imageMobile', 'text', 'Optional mobile version')}
      {field('Link URL', 'link', 'text', '/shop')}
      {field('Button Text', 'buttonText', 'text', 'Shop Now')}
      <div className="grid grid-cols-2 gap-3">
        {field('Start Date', 'startDate', 'datetime-local')}
        {field('End Date', 'endDate', 'datetime-local')}
      </div>
      <div className="flex gap-3 pt-2">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={() => onSave(f)} className="flex-1">Save Banner</AdminBtn>
      </div>
    </div>
  );
}

export default function BannersPage() {
  const [posFilter, setPosFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<AdminBanner|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBanner|null>(null);

  const { data, isLoading, isError, refetch } = useAdminBanners({ position:posFilter||undefined });
  const createMut = useCreateBanner();
  const updateMut = useUpdateBanner();
  const deleteMut = useDeleteBanner();
  const items = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Banners" description="Manage promotional banners across the site."
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Banner</AdminBtn>} />

      <div className="flex gap-2 flex-wrap">
        {['', ...POSITIONS].map(p => (
          <button key={p} onClick={() => setPosFilter(p)}
            className={cn('px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border', posFilter===p ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300')}>
            {p||'All'}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState message="Loading banners..." />}
      {isError && <ErrorState message="Failed to load banners." onRetry={refetch} />}
      {!isLoading && !isError && items.length === 0 && (
        <EmptyState title="No banners" description="Add your first promotional banner." icon={<ImageIcon className="w-7 h-7 text-gray-300" />}
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Banner</AdminBtn>} />
      )}

      {!isLoading && items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(b => (
            <div key={b.id} className={cn('bg-white rounded-2xl border shadow-sm overflow-hidden', !b.isActive && 'opacity-60')}>
              <div className="relative w-full h-32 bg-gray-100">
                {b.image ? (
                  <Image src={b.image} alt={b.title??''} fill className="object-cover" sizes="400px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-300" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full">{b.position}</span>
                  <Badge variant={b.isActive?'success':'default'}>{b.isActive?'Active':'Off'}</Badge>
                </div>
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-900 text-sm truncate">{b.title||b.titleEn||'Untitled'}</p>
                {b.subtitle && <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>}
                {b.link && <p className="text-xs text-orange-500 truncate mt-0.5">{b.link}</p>}
                {(b.startDate||b.endDate) && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" />
                    {b.startDate ? new Date(b.startDate).toLocaleDateString() : ''} - {b.endDate ? new Date(b.endDate).toLocaleDateString() : ''}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditItem(b)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(b)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-red-400 transition-colors border border-gray-100">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Banner" size="lg">
        <BannerForm onSave={async d => { await createMut.mutateAsync(d); setShowCreate(false); }} onClose={() => setShowCreate(false)} loading={createMut.isPending} />
      </Modal>
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Banner" size="lg">
        <BannerForm initial={editItem??undefined} onSave={async d => { await updateMut.mutateAsync({ id:editItem!.id, ...d }); setEditItem(null); }} onClose={() => setEditItem(null)} loading={updateMut.isPending} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteMut.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Banner" message="Delete this banner? Cannot be undone." loading={deleteMut.isPending} danger />
    </div>
  );
}