'use client';

import { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export default function DeliverySettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings('delivery');
  const save = useSaveSettings();

  const [freeThreshold, setFreeThreshold] = useState('');
  const [defaultCharge, setDefaultCharge] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const grouped = data?.data?.grouped?.delivery ?? {};
    setFreeThreshold(grouped['free_threshold'] ?? '');
    setDefaultCharge(grouped['default_charge'] ?? '');
  }, [data]);

  async function handleSave() {
    await save.mutateAsync([
      { key: 'delivery.free_threshold', value: freeThreshold },
      { key: 'delivery.default_charge', value: defaultCharge },
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all';

  if (isLoading) return <LoadingState />;
  if (isError)   return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Delivery Settings" description="Configure default delivery thresholds" />

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700 leading-relaxed">
            These settings act as global defaults. Per-district charges in Delivery Charges take precedence when matched.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Free Delivery Threshold (৳)
          </label>
          <input
            type="number"
            min="0"
            className={field}
            value={freeThreshold}
            onChange={(e) => setFreeThreshold(e.target.value)}
            placeholder="e.g. 500"
          />
          <p className="text-xs text-gray-400 mt-1.5">Orders above this amount get free delivery by default.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1.5">
            Default Delivery Charge (৳)
          </label>
          <input
            type="number"
            min="0"
            className={field}
            value={defaultCharge}
            onChange={(e) => setDefaultCharge(e.target.value)}
            placeholder="e.g. 80"
          />
          <p className="text-xs text-gray-400 mt-1.5">Applied when no matching per-district charge is found.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <AdminBtn
            icon={<Save className="w-4 h-4" />}
            loading={save.isPending}
            onClick={handleSave}
          >
            Save Settings
          </AdminBtn>
          {saved && <span className="text-sm font-semibold text-green-600">✓ Saved successfully</span>}
        </div>
      </div>
    </div>
  );
}
