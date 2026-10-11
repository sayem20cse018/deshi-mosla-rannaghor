'use client';

import { useState, useEffect } from 'react';
import { Save, Lock, Info } from 'lucide-react';
import { PageHeader, AdminBtn, Badge, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

// ─── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange, label, description }: {
  checked:     boolean;
  onChange:    (v: boolean) => void;
  label:       string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}
        aria-checked={checked}
        role="switch"
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PaymentSettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings('payment');
  const save = useSaveSettings();

  const [codEnabled, setCodEnabled]   = useState(false);
  const [sslEnabled, setSslEnabled]   = useState(false);
  const [saved, setSaved]             = useState(false);

  useEffect(() => {
    const grouped = data?.data?.grouped?.payment ?? {};
    setCodEnabled(grouped['cod_enabled'] === 'true');
    setSslEnabled(grouped['ssl_enabled'] === 'true');
  }, [data]);

  const isLive    = data?.data?.grouped?.payment?.['sslcommerz_is_live'] === 'true';

  async function handleSave() {
    await save.mutateAsync([
      { key: 'payment.cod_enabled', value: String(codEnabled) },
      { key: 'payment.ssl_enabled', value: String(sslEnabled) },
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (isLoading) return <LoadingState />;
  if (isError)   return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6 max-w-xl">
      <PageHeader title="Payment Settings" description="Configure which payment methods are available" />

      {/* Toggles */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-sm font-black text-gray-900 mb-2">Payment Methods</h2>
        <Toggle
          checked={codEnabled}
          onChange={setCodEnabled}
          label="Cash on Delivery (COD)"
          description="Allow customers to pay on delivery"
        />
        <Toggle
          checked={sslEnabled}
          onChange={setSslEnabled}
          label="SSLCommerz Online Payment"
          description="Enable bKash, Nagad, cards & other online methods"
        />

        <div className="flex items-center gap-3 mt-5">
          <AdminBtn icon={<Save className="w-4 h-4" />} loading={save.isPending} onClick={handleSave}>
            Save Settings
          </AdminBtn>
          {saved && <span className="text-sm font-semibold text-green-600">✓ Saved</span>}
        </div>
      </div>

      {/* Gateway info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-black text-gray-900">Gateway Configuration</h2>

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Payment gateway credentials (SSLCommerz store ID, password) are configured via environment variables on the server and cannot be changed here.
          </p>
        </div>

        <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">Current Mode</span>
          </div>
          {isLive
            ? <Badge variant="danger">Live</Badge>
            : <Badge variant="info">Sandbox</Badge>
          }
        </div>

        <p className="text-xs text-gray-400">
          To switch between sandbox and live mode, update <code className="bg-gray-100 px-1 rounded">SSLCOMMERZ_IS_LIVE</code> in your server environment variables and restart the backend.
        </p>
      </div>
    </div>
  );
}
