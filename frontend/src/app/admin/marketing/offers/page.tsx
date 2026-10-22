'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, AdminOffer } from '@/hooks/useMarketing';
import { PageHeader, AdminBtn, Modal, ConfirmDialog, FilterBar, Pagination, LoadingState, ErrorState, EmptyState, Badge } from '@/components/admin/ui';

const BLANK: Partial<AdminOffer> = { name:'', nameEn:'', description:'', discountType:'PERCENTAGE', discountValue:10, minOrderAmount:0, maxDiscount:0, isActive:true, sortOrder:0, targetType:'ALL', startDate:'', endDate:'' };

function OfferForm({ initial=BLANK, onSave, onClose, loading }: any) {
  const [f, setF] = useState<any>({ ...BLANK, ...initial });
  const set = (k:string, v:any) => setF((p:any) => ({ ...p, [k]:v }));
  const field = (label:string, key:string, type='text', ph='') => (
    <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
    <input type={type} value={f[key]??''} onChange={e => set(key, type==='number'?Number(e.target.value):e.target.value)} placeholder={ph}
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
      <div className="grid grid-cols-2 gap-3">{field('Name (BN)','name')}{field('Name (EN)','nameEn')}</div>
      {field('Description','description')}
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Discount Type</label>
          <select value={f.discountType??'PERCENTAGE'} onChange={e => set('discountType',e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option value="PERCENTAGE">Percentage</option><option value="FIXED_AMOUNT">Fixed Amount</option><option value="FREE_DELIVERY">Free Delivery</option>
          </select>
        </div>
        {field('Discount Value','discountValue','number')}
      </div>
      <div className="grid grid-cols-2 gap-3">{field('Min Order (Tk)','minOrderAmount','number')}{field('Max Discount (Tk)','maxDiscount','number')}</div>
      <div className="grid grid-cols-2 gap-3">{field('Start Date','startDate','date')}{field('End Date','endDate','date')}</div>
      <div className="flex gap-3 pt-2">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={() => onSave(f)} className="flex-1">Save Offer</AdminBtn>
      </div>
    </div>
  );
}

export default function OffersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<AdminOffer|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminOffer|null>(null);
  const { data, isLoading, isError, refetch } = useAdminOffers({ page, search:search||undefined });
  const createMut = useCreateOffer(); const updateMut = useUpdateOffer(); const deleteMut = useDeleteOffer();
  const items = data?.data ?? []; const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader title="Offers" description="Manage limited-time offers and deals."
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Offer</AdminBtn>} />
      <FilterBar search={search} onSearch={v => { setSearch(v); setPage(1); }} placeholder="Search offers..." />
      {isLoading && <LoadingState message="Loading offers..." />}
      {isError && <ErrorState message="Failed to load." onRetry={refetch} />}
      {!isLoading && !isError && items.length === 0 && (
        <EmptyState title="No offers" description="Create your first offer." icon={<Tag className="w-7 h-7 text-gray-300" />}
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Add Offer</AdminBtn>} />
      )}
      {!isLoading && items.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Name','Discount','Target','Schedule','Status','Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/60">
                  <td className="px-4 py-3"><p className="font-semibold text-gray-900">{o.name}</p>{o.description && <p className="text-xs text-gray-400 truncate max-w-[180px]">{o.description}</p>}</td>
                  <td className="px-4 py-3 font-bold">{o.discountType==='PERCENTAGE' ? `${o.discountValue}%` : `Tk ${o.discountValue}`}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{o.targetType}</td>
                  <td className="px-4 py-3 text-xs text-gray-500"><div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(o.startDate).toLocaleDateString()} - {new Date(o.endDate).toLocaleDateString()}</div></td>
                  <td className="px-4 py-3"><Badge variant={o.isActive?'success':'default'}>{o.isActive?'Active':'Off'}</Badge></td>
                  <td className="px-4 py-3"><div className="flex gap-1">
                    <button onClick={() => setEditItem(o)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-50 text-orange-500"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteTarget(o)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && meta.totalPages > 1 && <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Offer" size="lg">
        <OfferForm onSave={async (d: any) => { await createMut.mutateAsync(d); setShowCreate(false); }} onClose={() => setShowCreate(false)} loading={createMut.isPending} />
      </Modal>
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Offer" size="lg">
        <OfferForm initial={editItem??undefined} onSave={async (d: any) => { await updateMut.mutateAsync({ id:editItem!.id, ...d }); setEditItem(null); }} onClose={() => setEditItem(null)} loading={updateMut.isPending} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteMut.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Offer" message={`Delete "${deleteTarget?.name}"?`} loading={deleteMut.isPending} danger />
    </div>
  );
}