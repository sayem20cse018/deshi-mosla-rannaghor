'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Info } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

export default function PaymentSettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings('payment');
  const saveSettings = useSaveSettings();

  const [codEnabled, setCodEnabled] = useState(false);
  const [sslEnabled, setSslEnabled] = useState(false);
  const [saved,      setSaved]      = useState(false);

  useEffect(() => {
    const grouped = data?.data?.grouped?.payment ?? {};
    setCodEnabled(grouped['payment.cod_enabled'] === 'true');
    setSslEnabled(grouped['payment.ssl_enabled'] === 'true');
  }, [data]);

  async function handleSave() {
    await saveSettings.mutateAsync([
      { key: 'payment.cod_enabled', value: codEnabled ? 'true' : 'false' },
      { key: 'payment.ssl_enabled', value: sslEnabled ? 'true' : 'false' },
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) return <LoadingState message="Loading payment settings..." />;
  if (isError)   return <ErrorState message="Failed to load settings." onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Settings" description="Configure available payment methods" />

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>Payment gateway credentials (API keys, secret keys) are configured via environment variables on the server and are not editable here.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-md space-y-6">
        {/* COD toggle */}
        <ToggleRow
          label="Enable Cash on Delivery"
          description="Allow customers to pay on delivery"
          enabled={codEnabled}
          onToggle={() => { setCodEnabled(!codEnabled); setSaved(false); }}
        />

        {/* SSLCommerz toggle */}
        <ToggleRow
          label="Enable SSLCommerz"
          description="Accept online payments via SSLCommerz"
          enabled={sslEnabled}
          onToggle={() => { setSslEnabled(!sslEnabled); setSaved(false); }}
        />

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

function ToggleRow({
  label, description, enabled, onToggle,
}: {
  label: string; description: string; enabled: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-bold text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-orange-500' : 'bg-gray-200'}`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow m-0.5 transition-transform ${enabled ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}
