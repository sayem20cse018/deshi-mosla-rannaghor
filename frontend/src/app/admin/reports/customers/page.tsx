'use client';

import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, StatCard } from '@/components/admin/ui';
import { useCustomersReport } from '@/hooks/useReports';
import { formatPriceEn } from '@/lib/utils';

const PERIODS = [
  { label: 'Today',   value: 'today' },
  { label: '7 Days',  value: '7days' },
  { label: '30 Days', value: '30days' },
  { label: 'Month',   value: 'month' },
  { label: 'Year',    value: 'year' },
] as const;

type Period = (typeof PERIODS)[number]['value'];

export default function CustomersReportPage() {
  const [period, setPeriod] = useState<Period>('30days');
  const { data, isLoading, isError, refetch } = useCustomersReport(period);

  const summary     = data?.data?.summary     ?? {};
  const topSpenders = data?.data?.topSpenders  ?? [];
  const signups     = data?.data?.dailySignups ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Customers Report" description="Customer growth and spending analytics" />

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

      {isLoading && <LoadingState message="Loading customers report..." />}
      {isError   && <ErrorState message="Failed to load customers report." onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Total Customers"
              value={summary.totalCustomers ?? 0}
              icon={<Users className="w-5 h-5" />}
              color="#ea580c"
            />
            <StatCard
              title="New in Period"
              value={summary.newCustomers ?? 0}
              icon={<UserPlus className="w-5 h-5" />}
              color="#16a34a"
            />
          </div>

          {/* Top Spenders */}
          <Section title="Top Spenders">
            {topSpenders.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No data for this period</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'Name', 'Email', 'Orders', 'Total Spent'].map((c) => (
                        <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topSpenders.map((r: Record<string, unknown>, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">{String(r.name ?? '—')}</td>
                        <td className="px-4 py-3 text-gray-500">{String(r.email ?? '—')}</td>
                        <td className="px-4 py-3 text-gray-700">{String(r.orders ?? r.orderCount ?? '—')}</td>
                        <td className="px-4 py-3 text-orange-600 font-bold">{formatPriceEn(r.totalSpent as number)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Daily Signups */}
          <Section title="Daily Signups">
            {signups.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No signup data for this period</p>
            ) : (
              <SimpleTable
                columns={['Date', 'New Customers']}
                rows={signups.map((r: Record<string, unknown>) => [
                  new Date(String(r.date)).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' }),
                  String(r.count ?? r.signups ?? '0'),
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
