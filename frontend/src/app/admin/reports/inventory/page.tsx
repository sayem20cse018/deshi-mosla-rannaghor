'use client';

import { Package, PackageX, AlertTriangle, TrendingUp } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, StatCard } from '@/components/admin/ui';
import { useInventoryReport } from '@/hooks/useReports';

export default function InventoryReportPage() {
  const { data, isLoading, isError, refetch } = useInventoryReport();

  const summary     = data?.data?.summary          ?? {};
  const topSold     = data?.data?.topSold           ?? [];
  const adjustments = data?.data?.recentAdjustments ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Report" description="Stock levels and product movement" />

      {isLoading && <LoadingState message="Loading inventory report..." />}
      {isError   && <ErrorState message="Failed to load inventory report." onRetry={() => refetch()} />}

      {!isLoading && !isError && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Products"
              value={summary.totalProducts ?? 0}
              icon={<Package className="w-5 h-5" />}
              color="#ea580c"
            />
            <StatCard
              title="Active Products"
              value={summary.activeProducts ?? 0}
              icon={<TrendingUp className="w-5 h-5" />}
              color="#16a34a"
            />
            <StatCard
              title="Out of Stock"
              value={summary.outOfStock ?? 0}
              icon={<PackageX className="w-5 h-5" />}
              color="#dc2626"
            />
            <StatCard
              title="Low Stock"
              value={summary.lowStock ?? 0}
              icon={<AlertTriangle className="w-5 h-5" />}
              color="#d97706"
            />
          </div>

          {/* Top Sold */}
          <Section title="Top Sold Products">
            {topSold.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No sales data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['#', 'Product', 'SKU', 'Sold Qty', 'Available'].map((c) => (
                        <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topSold.map((r: Record<string, unknown>, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                        <td className="px-4 py-3 text-gray-900 font-semibold">{String(r.productName ?? r.name ?? '')}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{String(r.sku ?? '—')}</td>
                        <td className="px-4 py-3 text-gray-700">{String(r.soldQty ?? r.sold ?? '0')}</td>
                        <td className="px-4 py-3">
                          <span className={Number(r.availableStock ?? r.stock ?? 0) === 0
                            ? 'text-red-600 font-bold'
                            : Number(r.availableStock ?? r.stock ?? 0) < 10
                              ? 'text-amber-600 font-bold'
                              : 'text-green-600 font-semibold'
                          }>
                            {String(r.availableStock ?? r.stock ?? '0')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* Recent Adjustments */}
          <Section title="Recent Stock Adjustments">
            {adjustments.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No recent adjustments</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Product', 'Type', 'Change', 'Reason', 'Date'].map((c) => (
                        <th key={c} className="text-left px-4 py-2.5 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {adjustments.map((r: Record<string, unknown>, i: number) => {
                      const change = Number(r.changeQty ?? r.change ?? 0);
                      return (
                        <tr key={i} className="hover:bg-gray-50/60">
                          <td className="px-4 py-3 text-gray-900 font-semibold">{String(r.productName ?? r.product ?? '')}</td>
                          <td className="px-4 py-3 text-gray-500">{String(r.type ?? '—')}</td>
                          <td className="px-4 py-3">
                            <span className={change >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                              {change >= 0 ? '+' : ''}{change}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">{String(r.reason ?? '—')}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(String(r.date ?? r.createdAt ?? '')).toLocaleDateString('en-BD', {
                              day: '2-digit', month: 'short', year: 'numeric',
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
