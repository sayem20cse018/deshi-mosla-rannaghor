'use client';

import { useState } from 'react';
import { PageHeader, LoadingState, ErrorState, EmptyState, FilterBar, Pagination } from '@/components/admin/ui';
import { useAdminTransactions } from '@/hooks/useAdminContent';
import { formatPriceEn, truncate } from '@/lib/utils';

type TxnStatus = 'PAID' | 'FAILED' | 'PROCESSING' | 'CANCELLED' | 'PENDING';

const STATUS_BADGE: Record<TxnStatus, string> = {
  PAID:       'bg-green-100 text-green-700',
  FAILED:     'bg-red-100 text-red-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  CANCELLED:  'bg-gray-100 text-gray-500',
  PENDING:    'bg-amber-100 text-amber-700',
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_BADGE[status as TxnStatus] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}

export default function TransactionsPage() {
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [status,     setStatus]     = useState('');
  const [method,     setMethod]     = useState('');
  const [from,       setFrom]       = useState('');
  const [to,         setTo]         = useState('');

  const limit = 20;
  const filters = {
    page, limit,
    ...(search ? { search } : {}),
    ...(status ? { status } : {}),
    ...(method ? { method } : {}),
    ...(from   ? { from }   : {}),
    ...(to     ? { to }     : {}),
  };

  const { data, isLoading, isError, refetch } = useAdminTransactions(filters);

  const txns       = data?.data   ?? [];
  const meta       = data?.meta   ?? {};
  const total      = meta.total   ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Payment Transactions" description="All payment records" />

      {/* Filters */}
      <FilterBar
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search by transaction ID or order number..."
      >
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Status</option>
          <option value="PAID">PAID</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="FAILED">FAILED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          value={method}
          onChange={(e) => { setMethod(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Methods</option>
          <option value="COD">COD</option>
          <option value="SSLCOMMERZ">SSLCommerz</option>
          <option value="BKASH">bKash</option>
        </select>

        <input
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </FilterBar>

      {isLoading && <LoadingState message="Loading transactions..." />}
      {isError   && <ErrorState message="Failed to load transactions." onRetry={() => refetch()} />}

      {!isLoading && !isError && txns.length === 0 && (
        <EmptyState title="No transactions found" description="Try adjusting your filters." />
      )}

      {!isLoading && !isError && txns.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Txn ID', 'Order', 'Customer', 'Method', 'Amount', 'Status', 'Date'].map((c) => (
                    <th key={c} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {txns.map((t: Record<string, unknown>) => (
                  <tr key={String(t.id)} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      {truncate(String(t.transactionId ?? t.id ?? ''), 16)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">
                      {String(t.orderNumber ?? t.orderId ?? '—')}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{String(t.customerName ?? t.name ?? '—')}</p>
                      <p className="text-xs text-gray-400">{String(t.customerPhone ?? t.phone ?? '')}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{String(t.paymentMethod ?? t.method ?? '—')}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{formatPriceEn(t.amount as number)}</td>
                    <td className="px-4 py-3"><StatusBadge status={String(t.status ?? '')} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(String(t.createdAt ?? t.date ?? '')).toLocaleDateString('en-BD', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onChange={setPage} />
        </>
      )}
    </div>
  );
}
