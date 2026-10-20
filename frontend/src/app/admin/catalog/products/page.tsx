'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Eye, Pencil, Trash2,
  Package,
  CheckSquare, Square,
  Download, Upload,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import {
  useAdminProducts,
  useDeleteProduct,
  useBulkDeleteProducts,
  useBulkStatusProducts,
  useToggleProductFlag,
  type ProductFilters,
} from '@/hooks/useAdminProducts';
import {
  PageHeader, AdminBtn, FilterBar, Pagination,
  ConfirmDialog, EmptyState, LoadingState, ErrorState,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

// Stock status badge
function StockBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    IN_STOCK:     'bg-green-100 text-green-700',
    LOW_STOCK:    'bg-amber-100 text-amber-700',
    OUT_OF_STOCK: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    IN_STOCK: 'In Stock', LOW_STOCK: 'Low', OUT_OF_STOCK: 'Out of Stock',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold', map[status] ?? 'bg-gray-100 text-gray-600')}>
      {labels[status] ?? status}
    </span>
  );
}

export default function AdminProductsPage() {
  const [filters, setFilters]             = useState<ProductFilters>({ page: 1, limit: 20 });
  const [search,  setSearch]              = useState('');
  const [selected, setSelected]           = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmBulk,   setConfirmBulk]   = useState<'delete' | 'activate' | 'deactivate' | null>(null);

  const { data, isLoading, error, refetch } = useAdminProducts(filters);
  const products  = data?.data ?? [];
  const meta      = data?.meta;

  const deleteMut      = useDeleteProduct();
  const bulkDeleteMut  = useBulkDeleteProducts();
  const bulkStatusMut  = useBulkStatusProducts();
  const toggleFlagMut  = useToggleProductFlag();

  function handleSearch(v: string) {
    setSearch(v);
    setFilters(f => ({ ...f, search: v || undefined, page: 1 }));
  }

  function toggleSelectAll() {
    if (selected.size === products.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map(p => p.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleDelete(id: string) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success('Product deleted');
      setConfirmDelete(null);
    } catch {
      toast.error('Delete failed');
    }
  }

  async function handleBulkAction() {
    const ids = Array.from(selected);
    try {
      if (confirmBulk === 'delete') {
        await bulkDeleteMut.mutateAsync(ids);
        toast.success(ids.length + ' products deleted');
      } else if (confirmBulk === 'activate') {
        await bulkStatusMut.mutateAsync({ ids, isActive: true });
        toast.success(ids.length + ' products activated');
      } else if (confirmBulk === 'deactivate') {
        await bulkStatusMut.mutateAsync({ ids, isActive: false });
        toast.success(ids.length + ' products deactivated');
      }
      setSelected(new Set());
      setConfirmBulk(null);
    } catch {
      toast.error('Action failed');
    }
  }

  async function handleToggleFlag(id: string, flag: string) {
    try {
      await toggleFlagMut.mutateAsync({ id, flag });
      toast.success('Updated');
    } catch {
      toast.error('Failed to update');
    }
  }

  const allSelected  = products.length > 0 && selected.size === products.length;
  const someSelected = selected.size > 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description={'Manage your product catalog' + (meta ? ' (' + meta.total + ' total)' : '')}
        action={
          <div className="flex items-center gap-2">
            <AdminBtn variant="secondary" icon={<Upload className="w-4 h-4" />} size="sm">Import</AdminBtn>
            <AdminBtn variant="secondary" icon={<Download className="w-4 h-4" />} size="sm">Export</AdminBtn>
            <Link href="/admin/catalog/products/new">
              <AdminBtn icon={<Plus className="w-4 h-4" />}>Add Product</AdminBtn>
            </Link>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterBar
          search={search}
          onSearch={handleSearch}
          placeholder="Search by name, SKU..."
        />
        <select
          value={filters.isActive ?? ''}
          onChange={e => setFilters(f => ({ ...f, isActive: e.target.value || undefined, page: 1 }))}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-sm"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={filters.stockStatus ?? ''}
          onChange={e => setFilters(f => ({ ...f, stockStatus: e.target.value || undefined, page: 1 }))}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-sm"
        >
          <option value="">All Stock</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
        <select
          value={filters.sortBy ?? ''}
          onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value || undefined, page: 1 }))}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 shadow-sm"
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="best_selling">Best Selling</option>
        </select>
      </div>

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
          <span className="text-sm font-bold text-orange-700">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <AdminBtn size="sm" variant="secondary" onClick={() => setConfirmBulk('activate')}>Activate</AdminBtn>
            <AdminBtn size="sm" variant="secondary" onClick={() => setConfirmBulk('deactivate')}>Deactivate</AdminBtn>
            <AdminBtn size="sm" variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setConfirmBulk('delete')}>
              Delete ({selected.size})
            </AdminBtn>
          </div>
        </div>
      )}

      {/* Table */}
      {isLoading ? <LoadingState message="Loading products..." /> : error ? (
        <ErrorState message="Could not load products" onRetry={() => refetch()} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Add your first product or try adjusting filters."
          icon={<Package className="w-7 h-7 text-gray-300" />}
          action={
            <Link href="/admin/catalog/products/new">
              <AdminBtn icon={<Plus className="w-4 h-4" />} size="sm">Add Product</AdminBtn>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-gray-700 transition-colors">
                      {allSelected
                        ? <CheckSquare className="w-4 h-4 text-orange-500" />
                        : <Square className="w-4 h-4" />
                      }
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Flags</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-24 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className={cn('hover:bg-gray-50/60 transition-colors', selected.has(p.id) && 'bg-orange-50/40')}>
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelect(p.id)} className="text-gray-400 hover:text-gray-700 transition-colors">
                        {selected.has(p.id)
                          ? <CheckSquare className="w-4 h-4 text-orange-500" />
                          : <Square className="w-4 h-4" />
                        }
                      </button>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          {p.primaryImage
                            ? <Image src={p.primaryImage} alt={p.name} width={40} height={40} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg text-gray-300">+</div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-[13px] truncate max-w-[180px]">{p.name}</p>
                          {p.nameEn && <p className="text-[11px] text-gray-400 truncate max-w-[180px]">{p.nameEn}</p>}
                          {p.category && <p className="text-[10px] text-gray-400">{p.category.name}</p>}
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-[12px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{p.sku}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <div>
                        <span className="text-[13px] font-black text-orange-600" style={{ fontFamily: 'Manrope,sans-serif' }}>
                          {formatPriceEn(p.discountPrice ?? p.price)}
                        </span>
                        {p.discountPrice && (
                          <p className="text-[11px] text-gray-400 line-through">{formatPriceEn(p.price)}</p>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <StockBadge status={p.stockStatus} />
                      <p className="text-[10px] text-gray-400 mt-0.5">{p.availableStock} units</p>
                    </td>

                    {/* Flags */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured   && <span className="text-[9px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">Featured</span>}
                        {p.isBestSeller && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Best</span>}
                        {p.isNewArrival && <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">New</span>}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFlag(p.id, 'isActive')}
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer',
                          p.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                        )}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={'/product/' + p.slug} target="_blank">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <Link href={'/admin/catalog/products/' + p.id + '/edit'}>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="px-4 py-4 border-t border-gray-100">
              <Pagination
                page={filters.page ?? 1}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={filters.limit ?? 20}
                onChange={p => setFilters(f => ({ ...f, page: p }))}
              />
            </div>
          )}
        </div>
      )}

      {/* Confirm delete single */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Product"
        message="This product will be permanently deleted. This action cannot be undone."
        loading={deleteMut.isPending}
        danger
      />

      {/* Confirm bulk action */}
      <ConfirmDialog
        open={!!confirmBulk}
        onClose={() => setConfirmBulk(null)}
        onConfirm={handleBulkAction}
        title={confirmBulk === 'delete' ? 'Delete ' + selected.size + ' Products' : 'Bulk Update'}
        message={
          confirmBulk === 'delete'
            ? 'These products will be permanently deleted. This cannot be undone.'
            : 'Update status for ' + selected.size + ' selected products?'
        }
        loading={bulkDeleteMut.isPending || bulkStatusMut.isPending}
        danger={confirmBulk === 'delete'}
      />
    </div>
  );
}
