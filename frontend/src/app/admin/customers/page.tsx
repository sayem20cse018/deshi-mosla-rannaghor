'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Users, ShoppingBag, Star, CheckCircle,
  XCircle, AlertCircle, MoreVertical, RefreshCw,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import {
  useAdminCustomers, useToggleCustomer, AdminCustomer,
} from '@/hooks/useAdminCustomers';
import {
  PageHeader, AdminBtn, Pagination,
  FilterBar, LoadingState, ErrorState, EmptyState, ConfirmDialog, Modal,
} from '@/components/admin/ui';
import { useAdminCustomer } from '@/hooks/useAdminCustomers';
import toast from 'react-hot-toast';

const ORDER_STATUS_DOT: Record<string, string> = {
  PENDING:    'bg-amber-400',
  CONFIRMED:  'bg-blue-400',
  PROCESSING: 'bg-purple-400',
  SHIPPED:    'bg-cyan-400',
  DELIVERED:  'bg-green-500',
  CANCELLED:  'bg-red-400',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Customer Detail Panel ──────────────────────────────────────────────────
function CustomerDetailPanel({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { data, isLoading, isError } = useAdminCustomer(customerId);
  const toggleMut = useToggleCustomer();
  const customer = data?.data;

  async function handle(action: 'activate' | 'deactivate' | 'block' | 'unblock') {
    try {
      await toggleMut.mutateAsync({ id: customerId, action });
      toast.success(`Customer ${action}d.`);
    } catch { toast.error('Action failed.'); }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <aside className={cn(
        'fixed top-0 right-0 h-full bg-white z-50 shadow-2xl flex flex-col',
        'transition-transform duration-300 translate-x-0',
      )} style={{ width: 'min(560px,100vw)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-black text-gray-900">Customer Profile</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400">
            <XCircle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading && <LoadingState message="Loading customer..." />}
          {isError   && <ErrorState message="Failed to load customer." />}

          {customer && (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 border-2 border-orange-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {customer.avatar
                    ? <Image src={customer.avatar} alt={customer.name} width={56} height={56} className="object-cover w-full h-full" />
                    : <span className="text-xl font-black text-orange-500">{customer.name[0]}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.email}</p>
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      customer.isActive && !customer.isBlocked
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-600 border-red-200')}>
                      {customer.isBlocked ? 'Blocked' : customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {customer.isEmailVerified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Email ✓</span>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 space-y-0.5">
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="text-xs font-semibold text-gray-700">{formatDate(customer.createdAt)}</p>
                  {customer.lastLoginAt && (
                    <>
                      <p className="text-xs text-gray-400 mt-1">Last login</p>
                      <p className="text-xs font-semibold text-gray-700">{formatDate(customer.lastLoginAt)}</p>
                    </>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Orders', value: customer._count?.orders ?? customer.orders?.length ?? 0, icon: ShoppingBag, color: 'text-orange-500' },
                  { label: 'Spending', value: formatPriceEn(customer.totalSpending), icon: ShoppingBag, color: 'text-green-600', isText: true },
                  { label: 'Reviews', value: customer._count?.reviews ?? customer.reviews?.length ?? 0, icon: Star, color: 'text-amber-500' },
                ].map(({ label, value, color, isText }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                    <p className={cn('font-black text-lg', color)}>{value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {customer.isActive
                  ? <AdminBtn size="sm" variant="ghost" onClick={() => handle('deactivate')} loading={toggleMut.isPending}>Deactivate</AdminBtn>
                  : <AdminBtn size="sm" variant="primary" onClick={() => handle('activate')} loading={toggleMut.isPending}>Activate</AdminBtn>
                }
                {customer.isBlocked
                  ? <AdminBtn size="sm" variant="secondary" onClick={() => handle('unblock')} loading={toggleMut.isPending}>Unblock</AdminBtn>
                  : <AdminBtn size="sm" variant="ghost" onClick={() => handle('block')} loading={toggleMut.isPending}>Block</AdminBtn>
                }
              </div>

              {/* Recent orders */}
              {customer.orders?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Recent Orders</p>
                  <div className="space-y-2">
                    {customer.orders.map((o) => (
                      <div key={o.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                        <span className={cn('w-2 h-2 rounded-full flex-shrink-0', ORDER_STATUS_DOT[o.status] ?? 'bg-gray-400')} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 font-mono">#{o.orderNumber}</p>
                          <p className="text-xs text-gray-500">{formatDate(o.createdAt)} · {o.itemCount} item{o.itemCount !== 1 ? 's' : ''}</p>
                        </div>
                        <p className="text-xs font-bold text-gray-900 flex-shrink-0">{formatPriceEn(o.totalAmount)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent reviews */}
              {customer.reviews?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Recent Reviews</p>
                  <div className="space-y-2">
                    {customer.reviews.map((r) => (
                      <div key={r.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-gray-800 truncate flex-1">{r.product.name}</p>
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={cn('w-3 h-3', i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200')} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                            r.status === 'APPROVED' ? 'bg-green-50 text-green-700'
                            : r.status === 'REJECTED' ? 'bg-red-50 text-red-600'
                            : 'bg-yellow-50 text-yellow-700'
                          )}>{r.status}</span>
                          <p className="text-[10px] text-gray-400">{formatDate(r.createdAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addresses */}
              {customer.addresses?.length > 0 && (
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Addresses</p>
                  <div className="space-y-2">
                    {customer.addresses.map((a: any) => (
                      <div key={a.id} className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                        <p className="font-semibold text-gray-800">{a.fullName} · {a.phone}</p>
                        <p>{a.fullAddress}, {a.area}, {a.district}, {a.division}</p>
                        {a.isDefault && <span className="text-[10px] font-bold text-orange-500">Default</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CustomersPage() {
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [isActive,   setIsActive]   = useState('');
  const [isBlocked,  setIsBlocked]  = useState('');
  const [showFilters,setShowFilters]= useState(false);
  const [selected,   setSelected]   = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useAdminCustomers({
    page, limit: 20, search: search || undefined,
    isActive: isActive || undefined,
    isBlocked: isBlocked || undefined,
  });

  const customers = data?.data ?? [];
  const meta      = data?.meta;

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        description={`Manage ${meta?.total ?? 0} registered customers.`}
        action={
          <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
            Refresh
          </AdminBtn>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-gray-50">
          <FilterBar
            search={search}
            onSearch={handleSearch}
            placeholder="Search by name, email, phone..."
            onFilterToggle={() => setShowFilters(v => !v)}
          />
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <select value={isActive} onChange={e => { setIsActive(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Block Status</label>
                <select value={isBlocked} onChange={e => { setIsBlocked(e.target.value); setPage(1); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-orange-200">
                  <option value="">All</option>
                  <option value="false">Not Blocked</option>
                  <option value="true">Blocked</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading && <LoadingState message="Loading customers..." />}
        {isError   && <ErrorState message="Failed to load customers." onRetry={refetch} />}
        {!isLoading && !isError && customers.length === 0 && (
          <EmptyState title="No customers found" description="Try adjusting filters." icon={<Users className="w-7 h-7 text-gray-300" />} />
        )}

        {!isLoading && !isError && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Orders</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Spending</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden xl:table-cell">Last Order</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id}
                    className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                    onClick={() => setSelected(c.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {c.avatar
                            ? <Image src={c.avatar} alt={c.name} width={36} height={36} className="object-cover w-full h-full" />
                            : <span className="text-sm font-black text-orange-500">{c.name[0]}</span>
                          }
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{c.name}</p>
                          <p className="text-xs text-gray-400 md:hidden">{c.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-700">{c.email}</p>
                      <p className="text-xs text-gray-400">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs font-bold text-gray-900">{c.totalOrders}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-xs font-bold text-orange-600">{formatPriceEn(c.totalSpending)}</p>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      {c.lastOrder ? (
                        <>
                          <p className="text-xs font-mono text-gray-700">#{c.lastOrder.orderNumber}</p>
                          <p className="text-xs text-gray-400">{formatDate(c.lastOrder.createdAt)}</p>
                        </>
                      ) : <span className="text-xs text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border',
                        c.isBlocked
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : c.isActive
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-500 border-gray-200',
                      )}>
                        {c.isBlocked ? 'Blocked' : c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">
                      {formatDate(c.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-orange-500 hover:text-orange-600 text-xs font-bold">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && <CustomerDetailPanel customerId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
