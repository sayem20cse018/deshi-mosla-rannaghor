'use client';

import { useRouter } from 'next/navigation';
import { MapPin, TrendingUp, PackageX } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, EmptyState } from '@/components/admin/ui';
import { useDeliveryCharges, DeliveryCharge } from '@/hooks/useAdminDelivery';
import { formatPriceEn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ZoneSummary {
  division:        string;
  districtCount:   number;
  avgCharge:       number;
  minCharge:       number;
  maxCharge:       number;
  freeThreshold:   number | null;
  chargeCount:     number;
}

// ─── Grouping logic ──────────────────────────────────────────────────────────

function groupByDivision(charges: DeliveryCharge[]): ZoneSummary[] {
  const map = new Map<string, DeliveryCharge[]>();

  for (const c of charges) {
    const key = c.division ?? '(No Division)';
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(c);
  }

  return Array.from(map.entries()).map(([division, items]) => {
    const districts = new Set(items.map((i) => i.district).filter(Boolean));
    const charges   = items.map((i) => Number(i.charge));
    const thresholds = items.map((i) => i.minOrderFree != null ? Number(i.minOrderFree) : null).filter((t): t is number => t !== null);

    return {
      division,
      districtCount: districts.size || items.length,
      avgCharge:     charges.reduce((a, b) => a + b, 0) / charges.length,
      minCharge:     Math.min(...charges),
      maxCharge:     Math.max(...charges),
      freeThreshold: thresholds.length ? Math.min(...thresholds) : null,
      chargeCount:   items.length,
    };
  }).sort((a, b) => a.division.localeCompare(b.division));
}

// ─── Zone Card ───────────────────────────────────────────────────────────────

function ZoneCard({ zone, onClick }: { zone: ZoneSummary; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
            <MapPin className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base">{zone.division}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {zone.districtCount} district{zone.districtCount !== 1 ? 's' : ''} · {zone.chargeCount} rate{zone.chargeCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-0.5">Avg Charge</p>
          <p className="text-sm font-black text-gray-900">{formatPriceEn(Math.round(zone.avgCharge))}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-0.5">Range</p>
          <p className="text-sm font-bold text-gray-700">
            {zone.minCharge === zone.maxCharge
              ? formatPriceEn(zone.minCharge)
              : `${formatPriceEn(zone.minCharge)} – ${formatPriceEn(zone.maxCharge)}`}
          </p>
        </div>
      </div>

      {zone.freeThreshold != null && (
        <div className="mt-3 bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-xs font-bold text-green-700">
            Free delivery from {formatPriceEn(zone.freeThreshold)}
          </span>
        </div>
      )}

      <p className="text-xs text-orange-500 font-semibold mt-3 group-hover:underline">View charges →</p>
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeliveryZonesPage() {
  const router = useRouter();

  // Fetch all charges (large limit to group all)
  const { data, isLoading, isError, refetch } = useDeliveryCharges({ limit: 500 });

  const zones = data?.data ? groupByDivision(data.data) : [];

  function handleZoneClick(division: string) {
    const params = new URLSearchParams({ search: division });
    router.push(`/admin/delivery/charges?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Zones"
        description="Overview of delivery coverage grouped by division"
      />

      {isLoading ? <LoadingState /> : isError ? <ErrorState onRetry={refetch} /> : zones.length === 0 ? (
        <EmptyState
          title="No zones configured"
          description="Add delivery charges to see zone coverage here."
          icon={<PackageX className="w-7 h-7 text-gray-300" />}
          action={
            <button
              onClick={() => router.push('/admin/delivery/charges')}
              className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              Go to Delivery Charges →
            </button>
          }
        />
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <ZoneCard key={zone.division} zone={zone} onClick={() => handleZoneClick(zone.division)} />
            ))}
          </div>

          <p className="text-sm text-gray-400 text-center">
            Click a zone to filter delivery charges by that division.
          </p>
        </>
      )}
    </div>
  );
}
