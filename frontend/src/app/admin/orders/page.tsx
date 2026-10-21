'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package, ChevronDown, Download, RefreshCw, Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminOrders, useAdminOrderStatusCounts,
  useBulkUpdateOrderStatus, AdminOrder,
} from '@/hooks/useAdminOrders';
import {
  ORDER_STATUS_CONFIG, PAYMENT_METHOD_LABELS,
  formatCurrency, formatDate,
} from '@/lib/orderUtils';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/orders/OrderStatusBadge';
import { OrderDetailDrawer } from '@/components/admin/orders/OrderDetailDrawer';
import {
  PageHeader, AdminBtn, Pagination,
  FilterBar, LoadingState, ErrorState, EmptyState, ConfirmDialog,
} from '@/components/admin/ui';

//  Status tab order 
const STATUS_TABS = [
  'ALL','PENDING','CONFIRMED','PROCESSING','PACKED','SHIPPED','DELIVERED','CANCELLED','RETURNED','REFUNDED',
] as const;

export default function AllOrdersPage() {
  // Filters
  const [page, setPage]                 = useState(1);
  const [search, setSearch]             = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [methodFilter, setMethodFilter]   = useState('');
  const [fromDate, setFromDate]           = useState('');
  const [toDate, setToDate]               = useState('');
  const [showFilters, setShowFilters]     = useState(false);

  // Selected / drawer
  const [selectedIds, setSelectedIds]     = useState<string[]>([]);
  const [openOrderId, setOpenOrderId]     = useState<string | null>(null);
  const [bulkStatus, setBulkStatus]       = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const filters = {
    page,
    limit: 20,
    search:        search || undefined,
    status:        activeStatus !== 'ALL' ? activeStatus : undefined,
    paymentStatus: paymentFilter || undefined,
    paymentMethod: methodFilter  || undefined,
    from:          fromDate      || undefined,
    to:            toDate        || undefined,
  };

  const { data, isLoading, isError, refetch } = useAdminOrders(filters);
  const { data: statusCounts }                = useAdminOrderStatusCounts();
  const bulkUpdate                            = useBulkUpdateOrderStatus();

  const orders    = data?.data ?? [];
  const meta      = data?.meta;
  const counts    = statusCounts?.data ?? {};

  //  Selection 
  const allOnPage  = orders.map((o) => o.id);
  const allChecked = allOnPage.length > 0 && allOnPage.every((id) => selectedIds.includes(id));

  function toggleAll() {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(allOnPage);
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  //  Bulk action 
  async function handleBulkUpdate() {
    if (!bulkStatus || selectedIds.length === 0) return;
    await bulkUpdate.mutateAsync({ orderIds: selectedIds, status: bulkStatus });
    setSelectedIds([]);
    setBulkStatus('');
    setShowBulkConfirm(false);
  }

  //  Search debounce 
  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  function handleTabChange(s: string) {
    setActiveStatus(s);
    setPage(1);
    setSelectedIds([]);
  }

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Orders"
        description="Manage and process customer orders."
        action={
          <div className="flex items-center gap-2">
            <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
              Refresh
            </AdminBtn>
          </div>
        }
      />

      {/* Status Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-100">
          {STATUS_TABS.map((s) => {
            const cfg   = ORDER_STATUS_CONFIG[s] ?? { label: s, dot: 'bg-gray-400' };
            const count = counts[s] ?? 0;
            const label = s === 'ALL' ? 'All' : (cfg as any).label ?? s;
            return (
              <button
                key={s}
                onClick={() => handleTabChange(s)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex-shrink-0',
                  activeStatus === s
                    ? 'border-orange-500 text-orange-600 bg-orange-50/40'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                )}
              >
                {s !== 'ALL' && (
                  <span className={cn('w-1.5 h-1.5 rounded-full', (cfg as any).dot)} />
                )}
                {label}
                {count > 0 && (
                  <span className={cn(
                    'ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black',
                    activeStatus === s ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600',
                  )}>
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="p-4 border-b border-gray-50">
          <FilterBar
            search={search}
            onSearch={handleSearch}
            placeholder="Search by order#, name, phone, email..."
            onFilterToggle={() => setShowFilters((v) => !v)}
          >
            {/* Bulk action */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-lg border border-orange-200">
                  {selectedIds.length} selected
                </span>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  <option value="">Bulk Action</option>
                  <option value="CONFIRMED">Mark Confirmed</option>
                  <option value="PROCESSING">Mark Processing</option>
                  <option value="PACKED">Mark Packed</option>
                  <option value="SHIPPED">Mark Shipped</option>
                  <option value="DELIVERED">Mark Delivered</option>
                  <option value="CANCELLED">Cancel</option>
                </select>
                <AdminBtn
                  size="sm" variant="primary"
                  disabled={!bulkStatus}
                  onClick={() => setShowBulkConfirm(true)}
                >
                  Apply
                </AdminBtn>
                <AdminBtn size="sm" variant="ghost" onClick={() => setSelectedIds([])}>Clear</AdminBtn>
              </div>
            )}
          </FilterBar>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Payment Status</label>
                <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All Payments</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="FAILED">Failed</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Payment Method</label>
                <select value={methodFilter} onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All Methods</option>
                  <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="SSLCOMMERZ">SSLCommerz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
                <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
                <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading && <LoadingState message="Loading orders..." />}
        {isError   && <ErrorState message="Failed to load orders." onRetry={refetch} />}
        {!isLoading && !isError && orders.length === 0 && (
          <EmptyState title="No orders found" description="Try adjusting your filters." icon={<Package className="w-7 h-7 text-gray-300" />} />
        )}

        {!isLoading && !isError && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allChecked} onChange={toggleAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-200 cursor-pointer" />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Payment</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                  <th className="w-16 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    selected={selectedIds.includes(order.id)}
                    onToggle={() => toggleOne(order.id)}
                    onOpen={() => setOpenOrderId(order.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      <OrderDetailDrawer orderId={openOrderId} onClose={() => setOpenOrderId(null)} />

      {/* Bulk Confirm */}
      <ConfirmDialog
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={handleBulkUpdate}
        loading={bulkUpdate.isPending}
        title="Bulk Status Update"
        message={`Update ${selectedIds.length} order(s) to "${bulkStatus}"?`}
      />
    </div>
  );
}

//  Order Row 
function OrderRow({
  order, selected, onToggle, onOpen,
}: {
  order: AdminOrder;
  selected: boolean;
  onToggle: () => void;
  onOpen:   () => void;
}) {
  return (
    <tr className={cn('hover:bg-gray-50/60 transition-colors cursor-pointer', selected && 'bg-orange-50/30')}>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={selected} onChange={onToggle}
          className="rounded border-gray-300 text-orange-500 focus:ring-orange-200 cursor-pointer" />
      </td>
      <td className="px-4 py-3" onClick={onOpen}>
        <p className="font-bold text-gray-900 text-xs">#{order.orderNumber}</p>
        <p className="text-xs text-gray-400 mt-0.5">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
      </td>
      <td className="px-4 py-3" onClick={onOpen}>
        <p className="font-semibold text-gray-800 text-xs">{order.user.name}</p>
        <p className="text-xs text-gray-400">{order.user.phone}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell" onClick={onOpen}>
        <div className="flex items-center gap-1">
          {order.items.slice(0, 2).map((item, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
              {item.productImage ? (
                <Image src={item.productImage} alt={item.productName} width={32} height={32} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {order.items.length > 2 && (
            <span className="text-xs text-gray-400 ml-1">+{order.items.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3" onClick={onOpen}>
        <p className="font-bold text-gray-900 text-xs">{formatCurrency(order.totalAmount)}</p>
        {order.deliveryCharge === 0 && (
          <p className="text-xs text-green-600">Free delivery</p>
        )}
      </td>
      <td className="px-4 py-3" onClick={onOpen}>
        <OrderStatusBadge status={order.status} size="sm" />
      </td>
      <td className="px-4 py-3 hidden lg:table-cell" onClick={onOpen}>
        <div className="space-y-0.5">
          <PaymentStatusBadge status={order.paymentStatus} size="sm" />
          <p className="text-xs text-gray-400">{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell" onClick={onOpen}>
        {formatDate(order.createdAt, true)}
      </td>
      <td className="px-4 py-3" onClick={onOpen}>
        <button className="text-orange-500 hover:text-orange-600 text-xs font-bold">View</button>
      </td>
    </tr>
  );
}
