'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import {
  PageHeader, AdminBtn, AdminTable, Pagination,
  Modal, ConfirmDialog, FilterBar, Badge, LoadingState, ErrorState,
} from '@/components/admin/ui';
import {
  useDeliveryCharges,
  useCreateDeliveryCharge,
  useUpdateDeliveryCharge,
  useDeleteDeliveryCharge,
  DeliveryCharge,
} from '@/hooks/useAdminDelivery';
import { formatPriceEn } from '@/lib/utils';

// ─── Form ────────────────────────────────────────────────────────────────────

interface ChargeForm {
  label:        string;
  division:     string;
  district:     string;
  area:         string;
  charge:       string;
  minOrderFree: string;
  isActive:     boolean;
}

const EMPTY: ChargeForm = { label: '', division: '', district: '', area: '', charge: '', minOrderFree: '', isActive: true };

function toForm(c: DeliveryCharge): ChargeForm {
  return {
    label:        c.label,
    division:     c.division     ?? '',
    district:     c.district     ?? '',
    area:         c.area         ?? '',
    charge:       String(c.charge),
    minOrderFree: c.minOrderFree != null ? String(c.minOrderFree) : '',
    isActive:     c.isActive,
  };
}

function ChargeFormFields({ form, onChange }: { form: ChargeForm; onChange: (f: ChargeForm) => void }) {
  const set = (key: keyof ChargeForm, val: string | boolean) => onChange({ ...form, [key]: val });
  const field = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400';
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Label *</label>
        <input className={field} value={form.label} onChange={(e) => set('label', e.target.value)} placeholder="e.g. Dhaka City" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Division</label>
          <input className={field} value={form.division} onChange={(e) => set('division', e.target.value)} placeholder="Dhaka" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">District</label>
          <input className={field} value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="Dhaka" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-600 mb-1">Area</label>
        <input className={field} value={form.area} onChange={(e) => set('area', e.target.value)} placeholder="Gulshan, Banani..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Charge (৳) *</label>
          <input type="number" min="0" className={field} value={form.charge} onChange={(e) => set('charge', e.target.value)} placeholder="80" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Free from (৳)</label>
          <input type="number" min="0" className={field} value={form.minOrderFree} onChange={(e) => set('minOrderFree', e.target.value)} placeholder="500" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 accent-orange-500" />
        <span className="text-sm font-medium text-gray-700">Active</span>
      </label>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeliveryChargesPage() {
  const [page, setPage]       = useState(1);
  const [search, setSearch]   = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [modal, setModal]     = useState<'create' | 'edit' | null>(null);
  const [form, setForm]       = useState<ChargeForm>(EMPTY);
  const [editing, setEditing] = useState<DeliveryCharge | null>(null);
  const [delTarget, setDelTarget] = useState<DeliveryCharge | null>(null);

  const { data, isLoading, isError, refetch } = useDeliveryCharges({ page, limit: 20, search, isActive: activeFilter });
  const create = useCreateDeliveryCharge();
  const update = useUpdateDeliveryCharge();
  const remove = useDeleteDeliveryCharge();

  function openCreate() { setForm(EMPTY); setEditing(null); setModal('create'); }
  function openEdit(c: DeliveryCharge) { setForm(toForm(c)); setEditing(c); setModal('edit'); }
  function closeModal() { setModal(null); setEditing(null); }

  async function handleSave() {
    const payload = {
      label:        form.label,
      division:     form.division     || undefined,
      district:     form.district     || undefined,
      area:         form.area         || undefined,
      charge:       Number(form.charge),
      minOrderFree: form.minOrderFree ? Number(form.minOrderFree) : undefined,
      isActive:     form.isActive,
    };
    if (modal === 'create') {
      await create.mutateAsync(payload as Parameters<typeof create.mutateAsync>[0]);
    } else if (editing) {
      await update.mutateAsync({ id: editing.id, ...payload });
    }
    closeModal();
  }

  const isSaving = create.isPending || update.isPending;

  const columns = [
    { key: 'label',    label: 'Label',      render: (r: DeliveryCharge) => <span className="font-semibold text-gray-900">{r.label}</span> },
    { key: 'division', label: 'Division',   render: (r: DeliveryCharge) => r.division ?? <span className="text-gray-400">—</span> },
    { key: 'district', label: 'District',   render: (r: DeliveryCharge) => r.district ?? <span className="text-gray-400">—</span> },
    { key: 'area',     label: 'Area',       render: (r: DeliveryCharge) => r.area ?? <span className="text-gray-400">—</span> },
    {
      key: 'charge', label: 'Charge',
      render: (r: DeliveryCharge) => <span className="font-bold text-orange-600">{formatPriceEn(r.charge)}</span>,
    },
    {
      key: 'minOrderFree', label: 'Free From',
      render: (r: DeliveryCharge) => r.minOrderFree ? formatPriceEn(r.minOrderFree) : <span className="text-gray-400">—</span>,
    },
    {
      key: 'isActive', label: 'Status',
      render: (r: DeliveryCharge) => <Badge variant={r.isActive ? 'success' : 'default'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (r: DeliveryCharge) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => setDelTarget(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Charges"
        description="Manage delivery charges by region"
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Charge</AdminBtn>}
      />

      <FilterBar search={search} onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search by label, district...">
        <select
          value={activeFilter}
          onChange={(e) => { setActiveFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </FilterBar>

      {isLoading ? <LoadingState /> : isError ? <ErrorState onRetry={refetch} /> : (
        <>
          <AdminTable<DeliveryCharge & Record<string, unknown>>
            columns={columns as unknown as Parameters<typeof AdminTable<DeliveryCharge & Record<string, unknown>>>[0]['columns']}
            data={(data?.data ?? []) as (DeliveryCharge & Record<string, unknown>)[]}
            keyField="id"
          />
          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} limit={20} onChange={setPage} />
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      <Modal open={modal !== null} onClose={closeModal} title={modal === 'create' ? 'Add Delivery Charge' : 'Edit Delivery Charge'} size="md">
        <ChargeFormFields form={form} onChange={setForm} />
        <div className="flex gap-3 mt-6">
          <AdminBtn variant="secondary" className="flex-1" onClick={closeModal}>Cancel</AdminBtn>
          <AdminBtn className="flex-1" loading={isSaving} onClick={handleSave} disabled={!form.label || !form.charge}>
            {modal === 'create' ? 'Create' : 'Save Changes'}
          </AdminBtn>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={async () => {
          if (delTarget) {
            await remove.mutateAsync(delTarget.id);
            setDelTarget(null);
          }
        }}
        title="Delete Delivery Charge"
        message={`Delete "${delTarget?.label}"? This may soft-delete if orders reference it.`}
        loading={remove.isPending}
        danger
      />
    </div>
  );
}
