'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Copy, Check, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, AdminCoupon } from '@/hooks/useMarketing';
import { PageHeader, AdminBtn, Modal, ConfirmDialog, FilterBar, Pagination, LoadingState, ErrorState, EmptyState, Badge } from '@/components/admin/ui';

const BLANK: Partial<AdminCoupon> & { startDate:string; expiryDate:string } = {
  code:'', description:'', discountType:'PERCENTAGE', discountValue:10,
  minOrderAmount:0, maxDiscount:0, usageLimit:0, userLimit:1, isActive:true,
  startDate: new Date().toISOString().split('T')[0],
  expiryDate: new Date(Date.now()+30*864e5).toISOString().split('T')[0],
};

function CouponForm({ initial = BLANK, onSave, onClose, loading }: { initial?:any; onSave:(d:any)=>Promise<void>; onClose:()=>void; loading:boolean }) {
  const [f, setF] = useState<any>({ ...BLANK, ...initial });
  const set = (k:string, v:any) => setF((p:any) => ({ ...p, [k]:v }));

  const field = (label:string, key:string, type='text', opts?:any) => (
    <div key={key}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input type={type} value={f[key]??''} onChange={e => set(key, type==='number'?Number(e.target.value):e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" {...opts} />
    </div>
  );

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <button type="button" onClick={() => set('isActive',!f.isActive)}
          className={cn('w-10 h-5 rounded-full relative transition-colors', f.isActive?'bg-orange-500':'bg-gray-300')}>
          <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', f.isActive?'translate-x-5':'translate-x-0.5')} />
        </button>
        <span className="text-sm font-semibold text-gray-700">{f.isActive?'Active':'Inactive'}</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Code</label>
          <input value={f.code??''} onChange={e => set('code', e.target.value.toUpperCase())}
            placeholder="SAVE20" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-orange-200" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Type</label>
          <select value={f.discountType??'PERCENTAGE'} onChange={e => set('discountType',e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200">
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount</option>
            <option value="FREE_DELIVERY">Free Delivery</option>
          </select>
        </div>
      </div>
      {field('Description', 'description', 'text')}
      <div className="grid grid-cols-3 gap-3">
        {field('Discount Value', 'discountValue', 'number')}
        {field('Min Order (Tk)', 'minOrderAmount', 'number')}
        {field('Max Discount (Tk)', 'maxDiscount', 'number')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Total Usage Limit', 'usageLimit', 'number')}
        {field('Per User Limit', 'userLimit', 'number')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {field('Start Date', 'startDate', 'date')}
        {field('Expiry Date', 'expiryDate', 'date')}
      </div>
      <div className="flex gap-3 pt-2">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={() => onSave(f)} className="flex-1">Save Coupon</AdminBtn>
      </div>
    </div>
  );
}

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editItem, setEditItem] = useState<AdminCoupon|null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon|null>(null);
  const [copied, setCopied] = useState<string|null>(null);

  const { data, isLoading, isError, refetch } = useAdminCoupons({ page, limit:20, search:search||undefined });
  const createMut = useCreateCoupon();
  const updateMut = useUpdateCoupon();
  const deleteMut = useDeleteCoupon();

  const items = data?.data ?? [];
  const meta = data?.meta;

  function copyCode(code:string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  function statusBadge(c:AdminCoupon) {
    const now = new Date();
    if (!c.isActive) return <Badge variant="default">Inactive</Badge>;
    if (new Date(c.expiryDate) < now) return <Badge variant="danger">Expired</Badge>;
    if (c.usageLimit && c.usedCount >= c.usageLimit) return <Badge variant="warning">Limit Reached</Badge>;
    return <Badge variant="success">Active</Badge>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Create and manage discount coupons."
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Create Coupon</AdminBtn>} />

      <FilterBar search={search} onSearch={v => { setSearch(v); setPage(1); }} placeholder="Search by code or description..." />

      {isLoading && <LoadingState message="Loading coupons..." />}
      {isError && <ErrorState message="Failed to load coupons." onRetry={refetch} />}
      {!isLoading && !isError && items.length === 0 && (
        <EmptyState title="No coupons" description="Create your first discount coupon." icon={<Tag className="w-7 h-7 text-gray-300" />}
          action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>Create Coupon</AdminBtn>} />
      )}

      {!isLoading && items.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Code','Type','Discount','Min Order','Usage','Validity','Status','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-xs bg-gray-100 px-2 py-1 rounded-lg">{c.code}</span>
                      <button onClick={() => copyCode(c.code)} className="text-gray-400 hover:text-orange-500 transition-colors">
                        {copied===c.code ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {c.description && <p className="text-xs text-gray-400 mt-0.5 max-w-[160px] truncate">{c.description}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.discountType.replace('_',' ')}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {c.discountType==='PERCENTAGE' ? `${c.discountValue}%` : c.discountType==='FREE_DELIVERY' ? 'Free Del.' : `Tk ${c.discountValue}`}
                    {c.maxDiscount ? <span className="text-xs text-gray-400 ml-1">(max Tk{c.maxDiscount})</span> : null}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.minOrderAmount ? `Tk ${c.minOrderAmount}` : '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.usedCount}/{c.usageLimit??'inf'} used</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(c.expiryDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-3">{statusBadge(c)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditItem(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-50 text-orange-500 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setDeleteTarget(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Coupon" size="lg">
        <CouponForm onSave={async d => { await createMut.mutateAsync(d); setShowCreate(false); }} onClose={() => setShowCreate(false)} loading={createMut.isPending} />
      </Modal>
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Coupon" size="lg">
        <CouponForm initial={editItem ?? undefined} onSave={async d => { await updateMut.mutateAsync({ id:editItem!.id, ...d }); setEditItem(null); }} onClose={() => setEditItem(null)} loading={updateMut.isPending} />
      </Modal>
      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { deleteMut.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Coupon" message={`Delete coupon "${deleteTarget?.code}"? This cannot be undone.`} loading={deleteMut.isPending} danger />
    </div>
  );
}