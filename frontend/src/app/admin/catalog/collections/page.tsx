'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminCollections,
  useDeleteCollection,
  useUpdateCollection,
  type AdminCollection,
} from '@/hooks/useAdminCollections';
import {
  PageHeader, AdminBtn, FilterBar, Pagination,
  ConfirmDialog, EmptyState, LoadingState, ErrorState,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

export default function AdminCollectionsPage() {
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAdminCollections({ page, limit: 20, search: search || undefined });
  const collections = data?.data ?? [];
  const meta        = data?.meta;

  const deleteMut = useDeleteCollection();
  const updateMut = useUpdateCollection();

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  async function handleDelete(id: string) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success('Collection deleted');
      setConfirmDelete(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Delete failed');
    }
  }

  async function handleToggleActive(col: AdminCollection) {
    try {
      await updateMut.mutateAsync({ id: col.id, data: { isActive: !col.isActive } });
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Collections"
        description={'Manage product collections' + (meta ? ' (' + meta.total + ' total)' : '')}
        action={
          <Link href="/admin/catalog/collections/new">
            <AdminBtn icon={<Plus className="w-4 h-4" />}>Add Collection</AdminBtn>
          </Link>
        }
      />

      <FilterBar search={search} onSearch={handleSearch} placeholder="Search collections..." />

      {isLoading ? (
        <LoadingState message="Loading collections..." />
      ) : error ? (
        <ErrorState message="Could not load collections" onRetry={() => refetch()} />
      ) : collections.length === 0 ? (
        <EmptyState
          title="No collections found"
          description="Add your first collection to group products."
          icon={<LayoutGrid className="w-7 h-7 text-gray-300" />}
          action={
            <Link href="/admin/catalog/collections/new">
              <AdminBtn icon={<Plus className="w-4 h-4" />} size="sm">Add Collection</AdminBtn>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Collection</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Products</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Order</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-20 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {col.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={col.image} alt={col.name} className="w-10 h-10 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                            <LayoutGrid className="w-4 h-4 text-orange-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-[13px]">{col.name}</p>
                          {col.nameEn && <p className="text-[11px] text-gray-400">{col.nameEn}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-[12px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded">{col.slug}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-600">{col._count.products}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-gray-500">#{col.sortOrder}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(col)}
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer',
                          col.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
                        )}
                      >
                        {col.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={'/admin/catalog/collections/' + col.id + '/edit'}>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(col.id)}
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
              <Pagination page={page} totalPages={meta.totalPages} total={meta.total} limit={20} onChange={setPage} />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Collection"
        message="This collection will be permanently deleted. Products will not be deleted, only removed from the collection."
        loading={deleteMut.isPending}
        danger
      />
    </div>
  );
}
