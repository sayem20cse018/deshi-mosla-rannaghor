'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Package, AlertTriangle, XCircle, RefreshCw,
  TrendingDown, TrendingUp, Minus, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminInventory, useAdjustStock, InventoryProduct,
} from '@/hooks/useAdminInventory';
import {
  PageHeader, AdminBtn, Pagination,
  FilterBar, LoadingState, ErrorState, EmptyState, Modal,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  IN_STOCK:     { label: 'In Stock',     dot: 'bg-green-500',  badge: 'bg-green-50 text-green-700 border-green-200'  },
  LOW_STOCK:    { label: 'Low Stock',    dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200'  },
  OUT_OF_STOCK: { label: 'Out of Stock', dot: 'bg-red-400',    badge: 'bg-red-50 text-red-600 border-red-200'         },
} as const;

const ADJUST_TYPES = [
  { value: 'MANUAL_ADD',    label: 'Add Stock'        },
  { value: 'MANUAL_REMOVE', label: 'Remove Stock'     },
  { value: 'CORRECTION',    label: 'Correction'       },
  { value: 'DAMAGE',        label: 'Damaged / Waste'  },
  { value: 'RETURN',        label: 'Customer Return'  },
] as const;

// ── Adjust Modal ────────────────────────────────────────────────────────────
function AdjustModal({
  product, onClose,
}: {
  product: InventoryProduct;
  onClose: () => void;
}) {
  const adjust = useAdjustStock();
  const [qty,    setQty]    = useState('');
  const [type,   setType]   = useState<typeof ADJUST_TYPES[number]['value']>('MANUAL_ADD');
  const [reason, setReason] = useState('');
  const [error,  setError]  = useState('');

  const current = product.inventory?.availableStock ?? 0;
  const parsed  = parseInt(qty) || 0;
  const isRemove = type === 'MANUAL_REMOVE' || type === 'DAMAGE';
  const delta   = isRemove ? -Math.abs(parsed) : Math.abs(parsed);
  const preview = current + delta;

  async function handleSubmit() {
    if (!parsed || parsed <= 0) { setError('Enter a valid quantity.'); return; }
    if (isRemove && parsed > current) { setError(`Cannot remove more than current stock (${current}).`); return; }
    setError('');
    try {
      await adjust.mutateAsync({ productId: product.id, adjustment: delta, type, reason: reason || undefined });
      toast.success(`Stock updated: ${current} → ${preview}`);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Adjustment failed.');
    }
  }

  return (
    <Modal open onClose={onClose} title="Adjust Stock" size="md">
      <div className="space-y-4">
        {/* Product info */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
            {product.images?.[0]?.url
              ? <Image src={product.images[0].url} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-lg">🌶️</div>
            }
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">SKU: {product.sku} · Current: <strong>{current}</strong></p>
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Adjustment Type</label>
          <div className="grid grid-cols-2 gap-2">
            {ADJUST_TYPES.map((t) => (
              <button key={t.value} type="button" onClick={() => setType(t.value)}
                className={cn('text-xs font-semibold px-3 py-2 rounded-xl border transition-all text-left',
                  type === t.value
                    ? 'bg-orange-50 border-orange-300 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300')}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quantity</label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQty(v => String(Math.max(1, (parseInt(v) || 0) - 1)))}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
            <input
              type="number" min="1" value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="0"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
            <button type="button" onClick={() => setQty(v => String((parseInt(v) || 0) + 1))}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          {parsed > 0 && (
            <p className={cn('text-xs mt-1.5 font-semibold',
              preview < 0 ? 'text-red-500' : preview === 0 ? 'text-amber-600' : 'text-gray-500')}>
              Result: {current} → <span className="font-black">{Math.max(0, preview)}</span>
              {preview <= 0 && ' (Out of stock)'}
              {preview > 0 && preview <= (product.inventory?.lowStockAlert ?? 10) && ' (Low stock)'}
            </p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Reason (optional)</label>
          <input
            type="text" value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Monthly restock, damaged in transit..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          />
        </div>

        {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

        <div className="flex gap-2 pt-1">
          <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
          <AdminBtn variant="primary" loading={adjust.isPending} onClick={handleSubmit} className="flex-1">
            {delta >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            Apply Adjustment
          </AdminBtn>
        </div>
      </div>
    </Modal>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function InventoryPage() {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [stockStatus,  setStockStatus]  = useState('');
  const [showFilters,  setShowFilters]  = useState(false);
  const [adjusting,    setAdjusting]    = useState<InventoryProduct | null>(null);

  const { data, isLoading, isError, refetch } = useAdminInventory({
    page, limit: 25, search: search || undefined,
    stockStatus: stockStatus || undefined,
    sortBy: 'updatedAt',
  });

  const products = data?.data ?? [];
  const meta     = data?.meta;

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Manage product stock levels and adjustments."
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
            placeholder="Search by product name or SKU..." onFilterToggle={() => setShowFilters(v => !v)}>
            {/* Quick status pills */}
            <div className="flex gap-1.5 ml-2">
              {['', 'LOW_STOCK', 'OUT_OF_STOCK'].map((s) => (
                <button key={s} onClick={() => { setStockStatus(s); setPage(1); }}
                  className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all whitespace-nowrap',
                    stockStatus === s
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300',
                  )}>
                  {s === '' ? 'All' : s === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                </button>
              ))}
            </div>
          </FilterBar>
        </div>

        {isLoading && <LoadingState message="Loading inventory..." />}
        {isError   && <ErrorState message="Failed to load inventory." onRetry={refetch} />}
        {!isLoading && !isError && products.length === 0 && (
          <EmptyState title="No products found" description="Try adjusting filters."
            icon={<Package className="w-7 h-7 text-gray-300" />} />
        )}

        {!isLoading && !isError && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Sold</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="w-16 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => {
                  const inv = p.inventory;
                  const cfg = STATUS_CONFIG[p.stockStatus] ?? STATUS_CONFIG.IN_STOCK;
                  const isLow = p.stockStatus === 'LOW_STOCK';
                  const isOos = p.stockStatus === 'OUT_OF_STOCK';
                  return (
                    <tr key={p.id} className={cn('hover:bg-gray-50/60 transition-colors', isOos && 'bg-red-50/20')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                            {p.images?.[0]?.url
                              ? <Image src={p.images[0].url} alt={p.name} width={36} height={36} className="object-cover w-full h-full" />
                              : <div className="w-full h-full flex items-center justify-center text-sm">🌶️</div>
                            }
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-1 max-w-[160px]">{p.name}</p>
                            {p.variants?.length > 0 && (
                              <p className="text-[10px] text-gray-400">{p.variants.length} variant{p.variants.length !== 1 ? 's' : ''}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs font-mono text-gray-600">{p.sku}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{p.category.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('text-sm font-black',
                            isOos ? 'text-red-500' : isLow ? 'text-amber-600' : 'text-gray-900')}>
                            {inv?.availableStock ?? '—'}
                          </span>
                          {isLow && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                          {isOos && <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                        </div>
                        {inv && (
                          <p className="text-[10px] text-gray-400">Alert at {inv.lowStockAlert}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-gray-600">{inv?.totalStock ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">{inv?.soldQuantity ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 w-fit', cfg.badge)}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setAdjusting(p)}
                          className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
                          Adjust
                        </button>
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

      {adjusting && <AdjustModal product={adjusting} onClose={() => setAdjusting(null)} />}
    </div>
  );
}
