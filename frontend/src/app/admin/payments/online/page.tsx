'use client';

import { useState } from 'react';
import { PageHeader, AdminTable, Pagination, Badge, FilterBar, LoadingState, ErrorState } from '@/components/admin/ui';
import { useOnlinePayments, OnlinePayment } from '@/hooks/useAdminDelivery';
import { formatPriceEn } from '@/lib/utils';

// ─── Badges ──────────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    BKASH:       { label: 'bKash',       cls: 'bg-pink-100 text-pink-700' },
    NAGAD:       { label: 'Nagad',       cls: 'bg-orange-100 text-orange-700' },
    SSLCOMMERZ:  { label: 'SSLCommerz',  cls: 'bg-blue-100 text-blue-700' },
    ROCKET:      { label: 'Rocket',      cls: 'bg-purple-100 text-purple-700' },
    UPAY:        { label: 'Upay',        cls: 'bg-teal-100 text-teal-700' },
  };
  const cfg = map[method] ?? { label: method, cls: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'PAID')       return <Badge variant="success">Paid</Badge>;
  if (status === 'FAILED')     return <Badge variant="danger">Failed</Badge>;
  if (status === 'PROCESSING') return <Badge variant="info">Processing</Badge>;
  if (status === 'REFUNDED')   return <Badge variant="default">Refunded</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OnlinePaymentsPage() {
  const [page, setPage]     = useState(1);
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [from, setFrom]     = useState('');
  const [to, setTo]         = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useOnlinePayments({
    page,
    limit:  25,
    status: status || undefined,
    method: method || undefined,
    from:   from   || undefined,
    to:     to     || undefined,
  });

  // Client-side search
  const rows = (data?.data ?? []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.transactionId ?? '').toLowerCase().includes(q) ||
      (p.order.orderNumber).toLowerCase().includes(q) ||
      (p.order.user?.name ?? '').toLowerCase().includes(q) ||
      (p.order.user?.email ?? '').toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      key: 'transactionId', label: 'Txn ID',
      render: (r: OnlinePayment) => (
        <span className="font-mono text-xs text-gray-700 truncate max-w-[120px] block">
          {r.transactionId ?? r.transactions[0]?.txnId ?? '—'}
        </span>
      ),
    },
    {
      key: 'orderNumber', label: 'Order #',
      render: (r: OnlinePayment) => <span className="font-bold text-gray-900">#{r.order.orderNumber}</span>,
    },
    {
      key: 'customer', label: 'Customer',
      render: (r: OnlinePayment) => (
        <div>
          <p className="font-semibold text-gray-800">{r.order.user?.name ?? '—'}</p>
          <p className="text-xs text-gray-400">{r.order.user?.email ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'paymentMethod', label: 'Method',
      render: (r: OnlinePayment) => <MethodBadge method={r.paymentMethod} />,
    },
    {
      key: 'amount', label: 'Amount',
      render: (r: OnlinePayment) => <span className="font-bold text-orange-600">{formatPriceEn(r.amount)}</span>,
    },
    {
      key: 'paymentStatus', label: 'Status',
      render: (r: OnlinePayment) => <StatusBadge status={r.paymentStatus} />,
    },
    {
      key: 'createdAt', label: 'Date',
      render: (r: OnlinePayment) => (
        <span className="text-gray-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-BD')}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Online Payments" description="Track and monitor all online payment transactions" />

      <FilterBar search={search} onSearch={setSearch} placeholder="Search txn ID, order #, customer...">
        <select
          value={method}
          onChange={(e) => { setMethod(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Methods</option>
          <option value="BKASH">bKash</option>
          <option value="NAGAD">Nagad</option>
          <option value="SSLCOMMERZ">SSLCommerz</option>
          <option value="ROCKET">Rocket</option>
          <option value="UPAY">Upay</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <span className="text-gray-400 text-sm">—</span>
          <input
            type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </FilterBar>

      {isLoading ? <LoadingState /> : isError ? <ErrorState onRetry={refetch} /> : (
        <>
          <AdminTable<OnlinePayment & Record<string, unknown>>
            columns={columns as unknown as Parameters<typeof AdminTable<OnlinePayment & Record<string, unknown>>>[0]['columns']}
            data={rows as (OnlinePayment & Record<string, unknown>)[]}
            keyField="id"
          />
          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} limit={25} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
