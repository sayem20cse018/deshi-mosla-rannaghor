'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export default function TaxSettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings('tax');
  const saveSettings = useSaveSettings();

  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate,    setTaxRate]    = useState('');
  const [saved,      setSaved]      = useState(false);

  useEffect(() => {
    const grouped = data?.data?.grouped?.tax ?? {};
    setTaxEnabled(grouped['tax.enabled'] === 'true');
    setTaxRate(grouped['tax.rate'] ?? '');
  }, [data]);

  async function handleSave() {
    await saveSettings.mutateAsync([
      { key: 'tax.enabled', value: taxEnabled ? 'true' : 'false' },
      { key: 'tax.rate',    value: taxRate },
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) return <LoadingState message="Loading tax settings..." />;
  if (isError)   return <ErrorState message="Failed to load settings." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Tax Settings" description="Configure tax rates for orders" />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md space-y-6">
        {/* Enable Tax toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800 text-sm">Enable Tax</p>
            <p className="text-xs text-gray-400 mt-0.5">Apply tax to all orders</p>
          </div>
          <button
            type="button"
            onClick={() => { setTaxEnabled(!taxEnabled); setSaved(false); }}
            className={`w-11 h-6 rounded-full transition-colors ${taxEnabled ? 'bg-orange-500' : 'bg-gray-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow m-0.5 transition-transform ${taxEnabled ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {/* Tax Rate */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Tax Rate (%)</label>
          <div className="relative">
            <input
              type="number"
              value={taxRate}
              onChange={(e) => { setTaxRate(e.target.value); setSaved(false); }}
              disabled={!taxEnabled}
              min={0}
              max={100}
              step={0.01}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all disabled:opacity-50 disabled:bg-gray-50"
              placeholder="e.g. 5"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">%</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
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
