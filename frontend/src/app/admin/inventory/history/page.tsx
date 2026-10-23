'use client';

import { useState, useCallback } from 'react';
import { History, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminInventoryLogs } from '@/hooks/useAdminInventory';
import {
  PageHeader, AdminBtn, Pagination,
  FilterBar, LoadingState, ErrorState, EmptyState,
} from '@/components/admin/ui';

const TYPE_CONFIG: Record<string, { label: string; color: string; sign: '+' | '-' }> = {
  SALE:          { label: 'Sale',         color: 'text-red-600',    sign: '-' },
  MANUAL_ADD:    { label: 'Manual Add',   color: 'text-green-600',  sign: '+' },
  MANUAL_REMOVE: { label: 'Manual Remove',color: 'text-red-500',    sign: '-' },
  CORRECTION:    { label: 'Correction',   color: 'text-blue-600',   sign: '+' },
  DAMAGE:        { label: 'Damage/Waste', color: 'text-orange-600', sign: '-' },
  RETURN:        { label: 'Return',       color: 'text-purple-600', sign: '+' },
  ADJUSTMENT:    { label: 'Adjustment',   color: 'text-gray-600',   sign: '+' },
};

function formatDateTime(d: string) {
  return new Date(d).toLocaleString('en-BD', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function InventoryHistoryPage() {
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState('');
  const [typeFilter,setTypeFilter]= useState('');
  const [fromDate,  setFromDate]  = useState('');
  const [toDate,    setToDate]    = useState('');
  const [showFilters,setShowFilters] = useState(false);

  const { data, isLoading, isError, refetch } = useAdminInventoryLogs({
    page, limit: 30,
    type: typeFilter || undefined,
    from: fromDate   || undefined,
    to:   toDate     || undefined,
  });

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory History"
        description="Full log of all stock changes."
        action={
          <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
            Refresh
          </AdminBtn>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-50">
          <FilterBar search={search} onSearch={handleSearch}
            placeholder="Search..." onFilterToggle={() => setShowFilters(v => !v)} />
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All Types</option>
                  {Object.entries(TYPE_CONFIG).map(([v, { label }]) => (
                    <option key={v} value={v}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">From</label>
                <input type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">To</label>
                <input type="date" value={toDate} onChange={e => { setToDate(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
            </div>
          )}
        </div>

        {isLoading && <LoadingState message="Loading history..." />}
        {isError   && <ErrorState message="Failed to load history." onRetry={refetch} />}
        {!isLoading && !isError && logs.length === 0 && (
          <EmptyState title="No logs found" description="Stock changes will appear here."
            icon={<History className="w-7 h-7 text-gray-300" />} />
        )}

        {!isLoading && !isError && logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Reason</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Reference</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log) => {
                  const cfg  = TYPE_CONFIG[log.type] ?? TYPE_CONFIG.ADJUSTMENT;
                  const isPos = log.changeQty >= 0;
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-gray-900">{log.inventory?.product?.name ?? '—'}</p>
                        <p className="text-[10px] font-mono text-gray-400">{log.inventory?.product?.sku}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-bold', cfg.color)}>{cfg.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {isPos
                            ? <TrendingUp className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                            : <TrendingDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                          }
                          <span className={cn('text-sm font-black', isPos ? 'text-green-600' : 'text-red-500')}>
                            {isPos ? '+' : ''}{log.changeQty}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{log.reason ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-[10px] font-mono text-gray-400">{log.reference ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500">{formatDateTime(log.createdAt)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
