'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

const FIELDS: { key: string; label: string; type?: string }[] = [
  { key: 'store.name',            label: 'Store Name (Bengali)' },
  { key: 'store.name_en',         label: 'Store Name (English)' },
  { key: 'store.email',           label: 'Contact Email',   type: 'email' },
  { key: 'store.phone',           label: 'Contact Phone',   type: 'tel' },
  { key: 'store.address',         label: 'Address' },
  { key: 'store.currency',        label: 'Currency Code' },
  { key: 'store.currency_symbol', label: 'Currency Symbol' },
  { key: 'store.whatsapp',        label: 'WhatsApp Number', type: 'tel' },
];

export default function StoreSettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings('store');
  const saveSettings = useSaveSettings();

  const [values,  setValues]  = useState<Record<string, string>>({});
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    if (data?.data?.grouped?.store) {
      setValues(data.data.grouped.store);
    }
  }, [data]);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    const payload = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? '' }));
    await saveSettings.mutateAsync(payload);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) return <LoadingState message="Loading store settings..." />;
  if (isError)   return <ErrorState message="Failed to load settings." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Store Settings" description="General store information" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
        {FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">{f.label}</label>
            <input
              type={f.type ?? 'text'}
              value={values[f.key] ?? ''}
              onChange={(e) => handleChange(f.key, e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <AdminBtn loading={saveSettings.isPending} onClick={handleSave}>
            Save Settings
          </AdminBtn>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
              <CheckCircle className="w-4 h-4" /> Saved successfully
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
