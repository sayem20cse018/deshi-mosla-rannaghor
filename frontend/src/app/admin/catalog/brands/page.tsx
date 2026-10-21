'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Layers } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  useAdminBrands,
  useDeleteBrand,
  useUpdateBrand,
  type AdminBrand,
} from '@/hooks/useAdminBrands';
import {
  PageHeader, AdminBtn, FilterBar, Pagination,
  ConfirmDialog, EmptyState, LoadingState, ErrorState,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

export default function AdminBrandsPage() {
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAdminBrands({ page, limit: 30, search: search || undefined });
  const brands = data?.data ?? [];
  const meta   = data?.meta;

  const deleteMut = useDeleteBrand();
  const updateMut = useUpdateBrand();

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  async function handleDelete(id: string) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success('Brand deleted');
      setConfirmDelete(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Delete failed');
    }
  }

  async function handleToggleActive(brand: AdminBrand) {
    try {
      await updateMut.mutateAsync({ id: brand.id, data: { isActive: !brand.isActive } });
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Brands"
        description={'Manage product brands' + (meta ? ' (' + meta.total + ' total)' : '')}
        action={
          <Link href="/admin/catalog/brands/new">
            <AdminBtn icon={<Plus className="w-4 h-4" />}>Add Brand</AdminBtn>
          </Link>
        }
      />

      <FilterBar search={search} onSearch={handleSearch} placeholder="Search brands..." />

      {isLoading ? (
        <LoadingState message="Loading brands..." />
      ) : error ? (
        <ErrorState message="Could not load brands" onRetry={() => refetch()} />
      ) : brands.length === 0 ? (
        <EmptyState
          title="No brands found"
          description="Add your first brand to get started."
          icon={<Layers className="w-7 h-7 text-gray-300" />}
          action={
            <Link href="/admin/catalog/brands/new">
              <AdminBtn icon={<Plus className="w-4 h-4" />} size="sm">Add Brand</AdminBtn>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Products</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Website</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-20 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 flex items-center justify-center">
                          {brand.logo ? (
                            <Image src={brand.logo} alt={brand.name} width={40} height={40} className="w-full h-full object-contain p-1" />
                          ) : (
                            <Layers className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-[13px]">{brand.name}</p>
                          {brand.nameEn && <p className="text-[11px] text-gray-400">{brand.nameEn}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[12px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{brand.slug}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{brand._count.products}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[120px] block">
                          {brand.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(brand)}
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer',
                          brand.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                        )}
                      >
                        {brand.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={'/admin/catalog/brands/' + brand.id + '/edit'}>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(brand.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

          {meta && meta.totalPages > 1 && (
            <div className="px-4 py-4 border-t border-gray-100">
              <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={30} onChange={setPage} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Brand"
        message="This brand will be permanently deleted. Products linked to this brand will lose their brand association."
        loading={deleteMut.isPending}
        danger
      />
    </div>
  );
}
