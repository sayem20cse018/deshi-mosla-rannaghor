'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Megaphone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminPromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion, AdminPromotion } from '@/hooks/useMarketing';
import { PageHeader, AdminBtn, Modal, ConfirmDialog, FilterBar, Pagination, LoadingState, ErrorState, EmptyState, Badge } from '@/components/admin/ui';

const BLANK: Partial<AdminPromotion> = { name:'', nameEn:'', description:'', discountType:'PERCENTAGE', discountValue:10, isActive:true, targetType:'ALL', startDate:'', endDate:'' };

function PromoForm({ initial=BLANK, onSave, onClose, loading }: any) {
  const [f, setF] = useState<any>({ ...BLANK, ...initial });
  const set = (k:string, v:any) => setF((p:any) => ({ ...p, [k]:v }));
  const field = (label:string, key:string, type='text') => (
    <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    <input type={type} value={f[key]??''} onChange={e => set(key, type==='number'?Number(e.target.value):e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" /></div>
  );
  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <button type="button" onClick={() => set('isActive',!f.isActive)} className={cn('w-10 h-5 rounded-full relative transition-colors', f.isActive?'bg-orange-500':'bg-gray-300')}>
          <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', f.isActive?'translate-x-5':'translate-x-0.5')} />
        </button>
        <span className="text-sm font-semibold">{f.isActive?'Active':'Inactive'}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">{field('Campaign Name (BN)','name')}{field('Campaign Name (EN)','nameEn')}</div>
      {field('Description','description')}
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Discount Type</label>
          <select value={f.discountType??'PERCENTAGE'} onChange={e => set('discountType',e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            <option value="PERCENTAGE">Percentage</option><option value="FIXED_AMOUNT">Fixed Amount</option>
          </select>
        </div>
        {field('Discount Value','discountValue','number')}
      </div>
      <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Target</label>
        <select value={f.targetType??'ALL'} onChange={e => set('targetType',e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="ALL">All Products</option><option value="CATEGORY">By Category</option><option value="PRODUCT">By Product</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">{field('Start Date','startDate','date')}{field('End Date','endDate','date')}</div>
      <div className="flex gap-3 pt-2">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={() => onSave(f)} className="flex-1">Save Promotion</AdminBtn>
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<AdminPromotion|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPromotion|null>(null);
  const { data, isLoading, isError, refetch } = useAdminPromotions({ page, search:search||undefined });
  const createMut = useCreatePromotion(); const updateMut = useUpdatePromotion(); const deleteMut = useDeletePromotion();
  const items = data?.data ?? []; const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader title="Promotions" description="Manage marketing campaigns and promotions."
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Campaign</AdminBtn>} />
      <FilterBar search={search} onSearch={v => { setSearch(v); setPage(1); }} placeholder="Search campaigns..." />
      {isLoading && <LoadingState message="Loading promotions..." />}
      {isError && <ErrorState message="Failed to load." onRetry={refetch} />}
      {!isLoading && !isError && items.length === 0 && (
        <EmptyState title="No promotions" description="Create your first marketing campaign." icon={<Megaphone className="w-7 h-7 text-gray-300" />}
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Campaign</AdminBtn>} />
      )}
      {!isLoading && items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(p => (
            <div key={p.id} className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-4', !p.isActive && 'opacity-60')}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-bold text-gray-900">{p.name}</p>
                  {p.nameEn && <p className="text-xs text-gray-500">{p.nameEn}</p>}
                </div>
                <Badge variant={p.isActive?'success':'default'}>{p.isActive?'Active':'Off'}</Badge>
              </div>
              {p.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{p.description}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="font-semibold text-orange-600">{p.discountType==='PERCENTAGE' ? `${p.discountValue}%` : `Tk ${p.discountValue}`} off</span>
                <span>Target: {p.targetType}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                <Calendar className="w-3 h-3" />{new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditItem(p)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteTarget(p)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 text-red-400 border border-gray-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {meta && meta.totalPages > 1 && <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Promotion" size="lg">
        <PromoForm onSave={async (d: any) => { await createMut.mutateAsync(d); setShowCreate(false); }} onClose={() => setShowCreate(false)} loading={createMut.isPending} />
      </Modal>
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Promotion" size="lg">
        <PromoForm initial={editItem??undefined} onSave={async (d: any) => { await updateMut.mutateAsync({ id:editItem!.id, ...d }); setEditItem(null); }} onClose={() => setEditItem(null)} loading={updateMut.isPending} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteMut.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Promotion" message={`Delete "${deleteTarget?.name}"?`} loading={deleteMut.isPending} danger />
    </div>
  );
}