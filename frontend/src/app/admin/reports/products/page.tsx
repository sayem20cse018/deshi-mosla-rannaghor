'use client';

import { useState } from 'react';
import { AlertTriangle, PackageX } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, StatCard } from '@/components/admin/ui';
import { useProductsReport } from '@/hooks/useReports';

const PERIODS = [
  { label: 'Today',   value: 'today' },
  { label: '7 Days',  value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: 'Month',   value: 'month' },
  { label: 'Year',    value: 'year' },
] as const;

type Period = (typeof PERIODS)[number]['value'];

export default function ProductsReportPage() {
  const [period, setPeriod] = useState<Period>('30days');
  const { data, isLoading, isError, refetch } = useProductsReport(period);

  const bestSelling = data?.data?.bestSelling ?? [];
  const outOfStock  = data?.data?.outOfStock  ?? [];
  const lowStock    = data?.data?.lowStock    ?? [];
  const summary     = data?.data?.summary     ?? {};

  return (
    <div className="space-y-6">
      <PageHeader title="Products Report" description="Sales performance and inventory health" />

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

      {isLoading && <LoadingState message="Loading products report..." />}
      {isError   && <ErrorState message="Failed to load products report." onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          {/* Stock summary */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Out of Stock"
              value={summary.outOfStockCount ?? outOfStock.length}
              icon={<PackageX className="w-5 h-5" />}
              color="#dc2626"
            />
            <StatCard
              title="Low Stock"
              value={summary.lowStockCount ?? lowStock.length}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="#d97706"
            />
          </div>

          {/* Best Selling */}
          <Section title="Best Selling Products">
            {bestSelling.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No sales data for this period</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'Product', 'Qty Sold', 'Revenue'].map((c) => (
                        <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bestSelling.map((r: Record<string, unknown>, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">{String(r.productName ?? r.name ?? '')}</td>
                        <td className="px-4 py-3 text-gray-700">{String(r.qtySold ?? r.quantity ?? '')}</td>
                        <td className="px-4 py-3 text-gray-700">৳{Number(r.revenue ?? 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Out of Stock */}
          <Section title="Out of Stock">
            {outOfStock.length === 0 ? (
              <p className="text-sm text-green-600 py-4 text-center font-semibold">All products are in stock 🎉</p>
            ) : (
              <SimpleTable
                columns={['Product', 'SKU', 'Stock']}
                rows={outOfStock.map((r: Record<string, unknown>) => [
                  String(r.productName ?? r.name ?? ''),
                  String(r.sku ?? '—'),
                  String(r.availableStock ?? r.stock ?? '0'),
                ])}
              />
            )}
          </Section>

          {/* Low Stock */}
          <Section title="Low Stock">
            {lowStock.length === 0 ? (
              <p className="text-sm text-green-600 py-4 text-center font-semibold">No low stock alerts</p>
            ) : (
              <SimpleTable
                columns={['Product', 'SKU', 'Available', 'Threshold']}
                rows={lowStock.map((r: Record<string, unknown>) => [
                  String(r.productName ?? r.name ?? ''),
                  String(r.sku ?? '—'),
                  String(r.availableStock ?? r.stock ?? '0'),
                  String(r.alertThreshold ?? r.threshold ?? '—'),
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
