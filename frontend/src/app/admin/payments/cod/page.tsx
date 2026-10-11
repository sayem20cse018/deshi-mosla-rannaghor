'use client';

import { useState } from 'react';
import { CheckCircle, Clock, XCircle, Banknote } from 'lucide-react';
import {
  PageHeader, AdminTable, Pagination, Badge, FilterBar,
  LoadingState, ErrorState, StatCard,
} from '@/components/admin/ui';
import { useCODOrders, useUpdateCODStatus, CODOrder } from '@/hooks/useAdminDelivery';
import { formatPriceEn } from '@/lib/utils';

type CodStatus = 'PENDING' | 'COLLECTED' | 'FAILED';

function codBadge(status: string | null) {
  if (status === 'COLLECTED') return <Badge variant="success">Collected</Badge>;
  if (status === 'FAILED')    return <Badge variant="danger">Failed</Badge>;
  return <Badge variant="warning">Pending</Badge>;
}

export default function CODOrdersPage() {
  const [page, setPage]         = useState(1);
  const [codStatus, setCodStatus] = useState('');
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [search, setSearch]     = useState('');

  const { data, isLoading, isError, refetch } = useCODOrders({
    page,
    limit: 25,
    codStatus: codStatus || undefined,
    from:      from || undefined,
    to:        to || undefined,
  });

  const updateCOD = useUpdateCODStatus();

  function handleMark(paymentId: string, status: CodStatus) {
    updateCOD.mutate({ paymentId, codStatus: status });
  }

  // Client-side search filter
  const rows = (data?.data ?? []).filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.order.orderNumber.toLowerCase().includes(q) ||
      (o.order.user?.name ?? '').toLowerCase().includes(q) ||
      o.order.address.phone.toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      key: 'orderNumber', label: 'Order #',
      render: (r: CODOrder) => <span className="font-bold text-gray-900">#{r.order.orderNumber}</span>,
    },
    {
      key: 'customer', label: 'Customer',
      render: (r: CODOrder) => (
        <div>
          <p className="font-semibold text-gray-800">{r.order.address.fullName}</p>
          <p className="text-xs text-gray-500">{r.order.address.phone}</p>
        </div>
      ),
    },
    {
      key: 'district', label: 'District',
      render: (r: CODOrder) => <span className="text-gray-600">{r.order.address.district}</span>,
    },
    {
      key: 'amount', label: 'Amount',
      render: (r: CODOrder) => <span className="font-bold text-orange-600">{formatPriceEn(r.order.totalAmount)}</span>,
    },
    {
      key: 'codStatus', label: 'COD Status',
      render: (r: CODOrder) => codBadge(r.codStatus),
    },
    {
      key: 'createdAt', label: 'Order Date',
      render: (r: CODOrder) => <span className="text-gray-500 text-xs">{new Date(r.order.createdAt).toLocaleDateString('en-BD')}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (r: CODOrder) => (
        <div className="flex items-center gap-1.5">
          {r.codStatus !== 'COLLECTED' && (
            <button
              onClick={() => handleMark(r.id, 'COLLECTED')}
              disabled={updateCOD.isPending}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Collected
            </button>
          )}
          {r.codStatus !== 'FAILED' && r.codStatus !== 'COLLECTED' && (
            <button
              onClick={() => handleMark(r.id, 'FAILED')}
              disabled={updateCOD.isPending}
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" /> Failed
            </button>
          )}
          {r.codStatus === 'COLLECTED' && (
            <span className="text-xs text-gray-400 italic">Done</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="COD Orders"
        description="Cash on delivery order collection management"
      />

      {/* Summary stat */}
      {data?.pendingTotal != null && (
        <div className="max-w-xs">
          <StatCard
            title="Pending COD Amount"
            value={formatPriceEn(data.pendingTotal)}
            icon={<Banknote className="w-5 h-5" />}
            color="#ea580c"
          />
        </div>
      )}

      <FilterBar search={search} onSearch={(v) => { setSearch(v); }} placeholder="Search order # or customer...">
        <select
          value={codStatus}
          onChange={(e) => { setCodStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COLLECTED">Collected</option>
          <option value="FAILED">Failed</option>
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
          <AdminTable<CODOrder & Record<string, unknown>>
            columns={columns as unknown as Parameters<typeof AdminTable<CODOrder & Record<string, unknown>>>[0]['columns']}
            data={rows as (CODOrder & Record<string, unknown>)[]}
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
