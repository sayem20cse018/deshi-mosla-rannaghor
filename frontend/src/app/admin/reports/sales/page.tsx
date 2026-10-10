'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, XCircle, BarChart2 } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, StatCard } from '@/components/admin/ui';
import { useSalesReport } from '@/hooks/useReports';
import { formatPriceEn } from '@/lib/utils';

const PERIODS = [
  { label: 'Today',   value: 'today' },
  { label: '7 Days',  value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: 'Month',   value: 'month' },
  { label: 'Year',    value: 'year' },
] as const;

type Period = (typeof PERIODS)[number]['value'];

export default function SalesReportPage() {
  const [period, setPeriod] = useState<Period>('30days');
  const { data, isLoading, isError, refetch } = useSalesReport(period);

  const summary  = data?.data?.summary  ?? {};
  const byStatus = data?.data?.byStatus ?? [];
  const byMethod = data?.data?.byPaymentMethod ?? [];
  const chart    = data?.data?.chart ?? [];

  const changeNum = Number(summary.revenueChangePercent ?? 0);
  const changePos = changeNum >= 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Report" description="Revenue and order analytics" />

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

      {isLoading && <LoadingState message="Loading sales report..." />}
      {isError   && <ErrorState message="Failed to load sales report." onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={summary.totalOrders ?? 0}
              icon={<ShoppingCart className="w-5 h-5" />}
              color="#ea580c"
            />
            <StatCard
              title="Paid Orders"
              value={summary.paidOrders ?? 0}
              icon={<ShoppingCart className="w-5 h-5" />}
              color="#16a34a"
            />
            <StatCard
              title="Revenue"
              value={formatPriceEn(summary.totalRevenue)}
              icon={<DollarSign className="w-5 h-5" />}
              change={changeNum !== 0 ? `${Math.abs(changeNum).toFixed(1)}%` : undefined}
              positive={changePos}
              color="#ea580c"
            />
            <StatCard
              title="Avg Order Value"
              value={formatPriceEn(summary.avgOrderValue)}
              icon={<BarChart2 className="w-5 h-5" />}
              color="#7c3aed"
            />
          </div>

          {/* Cancelled / Revenue change */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold text-gray-700">
                Cancelled: <span className="text-red-600 font-black">{summary.cancelledOrders ?? 0}</span>
              </span>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
              {changePos
                ? <TrendingUp className="w-5 h-5 text-green-600" />
                : <TrendingDown className="w-5 h-5 text-red-500" />}
              <span className="text-sm font-semibold text-gray-700">
                Revenue vs prev period:{' '}
                <span className={changePos ? 'text-green-600 font-black' : 'text-red-500 font-black'}>
                  {changePos ? '+' : ''}{changeNum.toFixed(1)}%
                </span>
              </span>
            </div>
          </div>

          {/* By Status */}
          <Section title="By Order Status">
            {byStatus.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data</p>
            ) : (
              <SimpleTable
                columns={['Status', 'Count', 'Revenue']}
                rows={byStatus.map((r: Record<string, unknown>) => [
                  String(r.status ?? ''),
                  String(r.count ?? ''),
                  formatPriceEn(r.revenue as number),
                ])}
              />
            )}
          </Section>

          {/* By Payment Method */}
          <Section title="By Payment Method">
            {byMethod.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data</p>
            ) : (
              <SimpleTable
                columns={['Method', 'Count', 'Total']}
                rows={byMethod.map((r: Record<string, unknown>) => [
                  String(r.method ?? ''),
                  String(r.count ?? ''),
                  formatPriceEn(r.total as number),
                ])}
              />
            )}
          </Section>

          {/* Daily Chart (table) */}
          <Section title="Daily Breakdown">
            {chart.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data</p>
            ) : (
              <SimpleTable
                columns={['Date', 'Orders', 'Revenue']}
                rows={chart.map((r: Record<string, unknown>) => [
                  new Date(String(r.date)).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }),
                  String(r.orders ?? ''),
                  formatPriceEn(r.revenue as number),
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
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">
                {c}
              </th>
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
