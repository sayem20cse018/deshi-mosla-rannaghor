'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, XCircle, RefreshCw, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminLowStock, useAdjustStock, InventoryProduct } from '@/hooks/useAdminInventory';
import {
  PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState, Modal,
} from '@/components/admin/ui';
import { Minus, Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

function QuickRestockModal({ product, onClose }: { product: InventoryProduct; onClose: () => void }) {
  const adjust = useAdjustStock();
  const [qty, setQty] = useState('50');
  const [reason, setReason] = useState('Restocked');
  const current = product.inventory?.availableStock ?? 0;

  async function handleRestock() {
    const amount = parseInt(qty);
    if (!amount || amount <= 0) { toast.error('Enter a valid quantity.'); return; }
    try {
      await adjust.mutateAsync({ productId: product.id, adjustment: amount, type: 'MANUAL_ADD', reason });
      toast.success(`Restocked ${product.name}: +${amount}`);
      onClose();
    } catch (e: any) { toast.error(e?.response?.data?.message ?? 'Failed.'); }
  }

  return (
    <Modal open onClose={onClose} title="Quick Restock" size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 overflow-hidden flex-shrink-0">
            {product.images?.[0]?.url
              ? <Image src={product.images[0].url} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center">🌶️</div>
            }
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{product.name}</p>
            <p className="text-xs text-gray-500">Current stock: <strong className={product.stockStatus === 'OUT_OF_STOCK' ? 'text-red-500' : 'text-amber-600'}>{current}</strong></p>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Add Quantity</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setQty(v => String(Math.max(1, parseInt(v || '0') - 10)))}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Minus className="w-4 h-4 text-gray-500" />
            </button>
            <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
            <button onClick={() => setQty(v => String((parseInt(v || '0')) + 10))}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Plus className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">New stock: <strong>{current + (parseInt(qty) || 0)}</strong></p>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Reason</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
        </div>
        <div className="flex gap-2">
          <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
          <AdminBtn variant="primary" loading={adjust.isPending} onClick={handleRestock} className="flex-1">
            <TrendingUp className="w-3.5 h-3.5" /> Restock
          </AdminBtn>
        </div>
      </div>
    </Modal>
  );
}

export default function LowStockPage() {
  const { data, isLoading, isError, refetch } = useAdminLowStock();
  const [restocking, setRestocking] = useState<InventoryProduct | null>(null);

  const products  = data?.data ?? [];
  const oos       = products.filter(p => p.stockStatus === 'OUT_OF_STOCK');
  const lowStock  = products.filter(p => p.stockStatus === 'LOW_STOCK');

  return (
    <div className="space-y-5">
      <PageHeader
        title="Low Stock & Out of Stock"
        description={`${oos.length} out of stock · ${lowStock.length} low stock`}
        action={
          <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
            Refresh
          </AdminBtn>
        }
      />

      {isLoading && <LoadingState message="Loading stock alerts..." />}
      {isError   && <ErrorState message="Failed to load." onRetry={refetch} />}

      {!isLoading && !isError && products.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-green-500" />
          </div>
          <p className="font-bold text-gray-900">All products are well stocked!</p>
          <p className="text-xs text-gray-400 mt-1">No low stock or out-of-stock products found.</p>
        </div>
      )}

      {/* Out of Stock */}
      {oos.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-red-50/30">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <h3 className="font-black text-red-700 text-sm">Out of Stock ({oos.length})</h3>
          </div>
          <StockTable products={oos} onRestock={setRestocking} />
        </div>
      )}

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-amber-50/30">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <h3 className="font-black text-amber-700 text-sm">Low Stock ({lowStock.length})</h3>
          </div>
          <StockTable products={lowStock} onRestock={setRestocking} />
        </div>
      )}

      {restocking && <QuickRestockModal product={restocking} onClose={() => setRestocking(null)} />}
    </div>
  );
}

function StockTable({ products, onRestock }: { products: InventoryProduct[]; onRestock: (p: InventoryProduct) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
            <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">SKU</th>
            <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Available</th>
            <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Alert At</th>
            <th className="w-24 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p) => {
            const inv = p.inventory;
            const isOos = p.stockStatus === 'OUT_OF_STOCK';
            return (
              <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                      {p.images?.[0]?.url
                        ? <Image src={p.images[0].url} alt={p.name} width={36} height={36} className="object-cover w-full h-full" />
                        : <div className="w-full h-full flex items-center justify-center text-sm">🌶️</div>
                      }
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1 max-w-[150px]">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.category.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs font-mono text-gray-600">{p.sku}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-sm font-black', isOos ? 'text-red-500' : 'text-amber-600')}>
                    {inv?.availableStock ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs text-gray-500">{inv?.lowStockAlert ?? 10}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onRestock(p)}
                    className="text-xs font-bold text-orange-500 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                    Restock
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
