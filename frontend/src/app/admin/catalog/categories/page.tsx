'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ChevronRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminCategories,
  useDeleteCategory,
  useUpdateCategory,
  type AdminCategory,
} from '@/hooks/useAdminCategories';
import {
  PageHeader, AdminBtn, FilterBar, Pagination,
  ConfirmDialog, EmptyState, LoadingState, ErrorState,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useAdminCategories({ page, limit: 50, search: search || undefined });
  const categories = data?.data ?? [];
  const meta       = data?.meta;

  const deleteMut = useDeleteCategory();
  const updateMut = useUpdateCategory();

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
  }

  async function handleDelete(id: string) {
    try {
      await deleteMut.mutateAsync(id);
      toast.success('Category deleted');
      setConfirmDelete(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Delete failed');
    }
  }

  async function handleToggleActive(cat: AdminCategory) {
    try {
      await updateMut.mutateAsync({ id: cat.id, data: { isActive: !cat.isActive } });
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  }

  const parents  = categories.filter((c) => !c.parentId);
  const children = categories.filter((c) => c.parentId);

  function renderCategory(cat: AdminCategory, level = 0) {
    const subs = children.filter((c) => c.parentId === cat.id);
    return (
      <div key={cat.id}>
        <div className={cn(
          'flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors border-b border-gray-50',
          level > 0 && 'bg-gray-50/30',
        )}>
          {level > 0 && (
            <div className="flex items-center text-gray-300 ml-6">
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Icon */}
          <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-sm">
            {cat.icon || <Tag className="w-3.5 h-3.5 text-orange-400" />}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
            {cat.nameEn && <p className="text-[11px] text-gray-400">{cat.nameEn}</p>}
            <p className="text-[10px] text-gray-400 font-mono">{cat.slug}</p>
          </div>

          {/* Sort order */}
          <span className="text-[11px] text-gray-400 w-12 text-center hidden md:block">
            #{cat.sortOrder}
          </span>

          {/* Products count */}
          <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:block">
            {cat._count.products} products
          </span>

          {/* Nav badge */}
          {cat.showInNav && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold hidden md:block">
              Nav
            </span>
          )}

          {/* Status */}
          <button
            onClick={() => handleToggleActive(cat)}
            className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors',
              cat.isActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            )}
          >
            {cat.isActive ? 'Active' : 'Inactive'}
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href={'/admin/catalog/categories/' + cat.id + '/edit'}>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </Link>
            <button
              onClick={() => setConfirmDelete(cat.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {subs.map((sub) => renderCategory(sub, level + 1))}
      </div>
    );
  }

  const displayList = search
    ? categories
    : [...parents.flatMap((p) => [p, ...children.filter((c) => c.parentId === p.id)])];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        description={'Manage product categories' + (meta ? ' (' + meta.total + ' total)' : '')}
        action={
          <Link href="/admin/catalog/categories/new">
            <AdminBtn icon={<Plus className="w-4 h-4" />}>Add Category</AdminBtn>
          </Link>
        }
      />

      <FilterBar
        search={search}
        onSearch={handleSearch}
        placeholder="Search categories..."
      />

      {isLoading ? (
        <LoadingState message="Loading categories..." />
      ) : error ? (
        <ErrorState message="Could not load categories" onRetry={() => refetch()} />
      ) : displayList.length === 0 ? (
        <EmptyState
          title="No categories found"
          description="Add your first category to get started."
          icon={<Tag className="w-7 h-7 text-gray-300" />}
          action={
            <Link href="/admin/catalog/categories/new">
              <AdminBtn icon={<Plus className="w-4 h-4" />} size="sm">Add Category</AdminBtn>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="w-8" />
            <div className="flex-1 text-xs font-black text-gray-500 uppercase tracking-wider">Name</div>
            <div className="w-12 text-xs font-black text-gray-500 uppercase tracking-wider text-center hidden md:block">Order</div>
            <div className="w-24 text-xs font-black text-gray-500 uppercase tracking-wider hidden sm:block">Products</div>
            <div className="w-10 hidden md:block" />
            <div className="w-20 text-xs font-black text-gray-500 uppercase tracking-wider">Status</div>
            <div className="w-16" />
          </div>

          {search
            ? categories.map((cat) => renderCategory(cat, 0))
            : parents.map((p) => renderCategory(p, 0))
          }
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={50}
          onChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Category"
        message="This category will be permanently deleted. Products in this category will need to be reassigned. This cannot be undone."
        loading={deleteMut.isPending}
        danger
      />
    </div>
  );
}
