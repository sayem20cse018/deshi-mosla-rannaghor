'use client';

import { useState } from 'react';
import { PageHeader, LoadingState, ErrorState } from '@/components/admin/ui';
import { useOrdersReport } from '@/hooks/useReports';
import { formatPriceEn } from '@/lib/utils';

const PERIODS = [
  { label: 'Today',   value: 'today' },
  { label: '7 Days',  value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: 'Month',   value: 'month' },
  { label: 'Year',    value: 'year' },
] as const;

type Period = (typeof PERIODS)[number]['value'];

export default function OrdersReportPage() {
  const [period, setPeriod] = useState<Period>('30days');
  const { data, isLoading, isError, refetch } = useOrdersReport(period);

  const summary  = data?.data?.summary  ?? {};
  const byStatus = data?.data?.byStatus ?? [];
  const byMethod = data?.data?.byPaymentMethod ?? [];
  const chart    = data?.data?.chart ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Orders Report" description="Order volume and fulfilment analytics" />

      {/* Period selector */}
      <div className="flex gap-2 flex-wrap">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              period === p.value
                ? 'bg-orange-500 text-white shadow'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState message="Loading orders report..." />}
      {isError   && <ErrorState message="Failed to load orders report." onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          {/* Delivery summary */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm text-sm">
              <span className="text-gray-500">Avg Delivery Charge: </span>
              <span className="font-black text-gray-900">{formatPriceEn(summary.avgDeliveryCharge)}</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm text-sm">
              <span className="text-gray-500">Free Delivery Orders: </span>
              <span className="font-black text-gray-900">{summary.freeDeliveryCount ?? 0}</span>
            </div>
          </div>

          {/* By Status */}
          <Section title="By Order Status">
            <SimpleTable
              columns={['Status', 'Count']}
              rows={byStatus.map((r: Record<string, unknown>) => [
                String(r.status ?? ''),
                String(r.count ?? ''),
              ])}
            />
          </Section>

          {/* By Payment Method */}
          <Section title="By Payment Method">
            <SimpleTable
              columns={['Method', 'Count', 'Total']}
              rows={byMethod.map((r: Record<string, unknown>) => [
                String(r.method ?? ''),
                String(r.count ?? ''),
                formatPriceEn(r.total as number),
              ])}
            />
          </Section>

          {/* Daily chart */}
          <Section title="Daily Orders">
            {chart.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data for selected period</p>
            ) : (
              <SimpleTable
                columns={['Date', 'Orders']}
                rows={chart.map((r: Record<string, unknown>) => [
                  new Date(String(r.date)).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }),
                  String(r.orders ?? ''),
                ])}
              />
            )}
          </Section>
        </>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-black text-gray-800 text-base mb-4">{title}</h2>
      {children}
    </div>
  );
}

function SimpleTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  if (!rows.length) return <p className="text-sm text-gray-400 py-4 text-center">No data</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/60">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
