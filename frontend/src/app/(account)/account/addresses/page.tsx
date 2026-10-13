'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus, Pencil, Trash2, Star, Loader2, X, Check } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const EMPTY_ADDR = {
  label: '',
  fullName: '',
  phone: '',
  division: '',
  district: '',
  area: '',
  fullAddress: '',
  postalCode: '',
  isDefault: false,
};

export default function AddressesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_ADDR });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const r = await api.get('/users/me/addresses');
      return r.data.data;
    },
  });

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_ADDR });
    setErrors({});
    setShowForm(true);
  }
  function openEdit(a: any) {
    setEditing(a);
    setForm({ ...EMPTY_ADDR, ...a });
    setErrors({});
    setShowForm(true);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'নাম দিন';
    if (!form.phone.trim()) e.phone = 'ফোন দিন';
    if (!form.division.trim()) e.division = 'বিভাগ দিন';
    if (!form.district.trim()) e.district = 'জেলা দিন';
    if (!form.area.trim()) e.area = 'এলাকা দিন';
    if (!form.fullAddress.trim()) e.fullAddress = 'ঠিকানা দিন';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/users/me/addresses/${editing.id}`, form);
        toast.success('ঠিকানা আপডেট হয়েছে');
      } else {
        await api.post('/users/me/addresses', form);
        toast.success('ঠিকানা যোগ হয়েছে');
      }
      qc.invalidateQueries({ queryKey: ['my-addresses'] });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'সংরক্ষণ ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await api.delete(`/users/me/addresses/${id}`);
      toast.success('ঠিকানা মুছে ফেলা হয়েছে');
      qc.invalidateQueries({ queryKey: ['my-addresses'] });
    } finally {
      setDeleting(null);
    }
  }

  async function handleSetDefault(id: string) {
    await api.patch(`/users/me/addresses/${id}/default`);
    toast.success('ডিফল্ট ঠিকানা সেট হয়েছে');
    qc.invalidateQueries({ queryKey: ['my-addresses'] });
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );

  const DIVISIONS = [
    'ঢাকা',
    'চট্টগ্রাম',
    'রাজশাহী',
    'খুলনা',
    'বরিশাল',
    'সিলেট',
    'রংপুর',
    'ময়মনসিংহ',
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">সংরক্ষিত ঠিকানা</h2>
        <button
          onClick={openAdd}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> নতুন ঠিকানা
        </button>
      </div>

      {/* Address list */}
      {data?.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-600 font-semibold mb-2">কোনো ঠিকানা নেই</p>
          <button onClick={openAdd} className="btn-primary text-sm">
            ঠিকানা যোগ করুন
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data?.map((addr: any) => (
            <div
              key={addr.id}
              className={cn(
                'bg-white rounded-2xl border p-5 shadow-sm',
                addr.isDefault ? 'border-brand-200' : 'border-gray-100',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900 text-sm">{addr.fullName}</p>
                      {addr.label && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {addr.label}
                        </span>
                      )}
                      {addr.isDefault && (
                        <span className="text-xs bg-brand-50 text-brand-600 border border-brand-200 px-2 py-0.5 rounded-full font-semibold">
                          ডিফল্ট
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{addr.fullAddress}</p>
                    <p className="text-gray-500 text-sm">
                      {addr.area}, {addr.district}, {addr.division}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">📞 {addr.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="btn-icon text-gray-400 hover:text-amber-500"
                      title="ডিফল্ট করুন"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openEdit(addr)}
                    className="btn-icon text-gray-400 hover:text-brand-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={deleting === addr.id}
                    className="btn-icon text-gray-400 hover:text-red-500"
                  >
                    {deleting === addr.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">
                {editing ? 'ঠিকানা সম্পাদনা' : 'নতুন ঠিকানা'}
              </h3>
              <button onClick={() => setShowForm(false)} className="btn-icon">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { key: 'label', label: 'লেবেল (ঐচ্ছিক)', ph: 'বাড়ি / অফিস', req: false },
                { key: 'fullName', label: 'পূর্ণ নাম *', ph: 'রহিম উদ্দিন', req: true },
                { key: 'phone', label: 'ফোন নম্বর *', ph: '01700000000', req: true },
                {
                  key: 'fullAddress',
                  label: 'সম্পূর্ণ ঠিকানা *',
                  ph: 'বাড়ি/রোড/মহল্লা',
                  req: true,
                },
                { key: 'area', label: 'এলাকা *', ph: 'মিরপুর', req: true },
                { key: 'postalCode', label: 'পোস্টাল কোড', ph: '1216', req: false },
              ].map(({ key, label, ph }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={ph}
                    className={cn('input-base', errors[key] && 'border-red-400')}
                  />
                  {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    বিভাগ *
                  </label>
                  <select
                    value={form.division}
                    onChange={(e) => setForm((f) => ({ ...f, division: e.target.value }))}
                    className={cn('input-base', errors.division && 'border-red-400')}
                  >
                    <option value="">নির্বাচন করুন</option>
                    {DIVISIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.division && (
                    <p className="text-red-500 text-xs mt-1">{errors.division}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    জেলা *
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))}
                    placeholder="ঢাকা"
                    className={cn('input-base', errors.district && 'border-red-400')}
                  />
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-brand-600"
                />
                <span className="text-sm text-gray-700 font-medium">
                  ডিফল্ট ঠিকানা হিসেবে সেট করুন
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
