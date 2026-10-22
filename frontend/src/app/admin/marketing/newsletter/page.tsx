'use client';

import { useState } from 'react';
import { Mail, Trash2, Download, Search, Check, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNewsletterSubscribers, useDeleteSubscriber, useBulkDeleteSubscribers, useExportSubscribers, NewsletterSubscriber } from '@/hooks/useMarketing';
import { PageHeader, AdminBtn, ConfirmDialog, FilterBar, Pagination, LoadingState, ErrorState, EmptyState, Badge } from '@/components/admin/ui';

export default function NewsletterPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber|null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const { data, isLoading, isError, refetch } = useNewsletterSubscribers({ page, limit:50, search:search||undefined });
  const deleteMut = useDeleteSubscriber();
  const bulkDeleteMut = useBulkDeleteSubscribers();
  const exportMut = useExportSubscribers();

  const items = data?.data ?? [];
  const meta = data?.meta;

  const allSelected = items.length > 0 && items.every(i => selectedIds.includes(i.id));
  function toggleAll() { allSelected ? setSelectedIds([]) : setSelectedIds(items.map(i => i.id)); }
  function toggleOne(id:string) { setSelectedIds(p => p.includes(id) ? p.filter(x => x!==id) : [...p, id]); }

  async function handleExport() {
    const result = await exportMut.mutateAsync();
    if (!result.data) return;
    const blob = new Blob([result.data], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter Subscribers" description={`${meta?.total ?? 0} total subscribers`}
        action={
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <AdminBtn variant="danger" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={() => setBulkDeleteOpen(true)}>
                Delete {selectedIds.length}
              </AdminBtn>
            )}
            <AdminBtn variant="secondary" size="sm"
              icon={exportDone ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Download className="w-3.5 h-3.5" />}
              loading={exportMut.isPending} onClick={handleExport}>
              Export CSV
            </AdminBtn>
          </div>
        }
      />

      {/* Stats */}
      {meta && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total', value: meta.total, icon:<Users className="w-5 h-5" />, color:'text-blue-600', bg:'bg-blue-50' },
            { label:'Active', value: items.filter(i => i.isActive).length + (page > 1 ? '...' : ''), icon:<Mail className="w-5 h-5" />, color:'text-green-600', bg:'bg-green-50' },
            { label:'This Page', value: items.length, icon:<Check className="w-5 h-5" />, color:'text-orange-600', bg:'bg-orange-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg, s.color)}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <FilterBar search={search} onSearch={v => { setSearch(v); setPage(1); }} placeholder="Search by email or name..." />

      {isLoading && <LoadingState message="Loading subscribers..." />}
      {isError && <ErrorState message="Failed to load subscribers." onRetry={refetch} />}
      {!isLoading && !isError && items.length === 0 && (
        <EmptyState title="No subscribers" description="Subscribers will appear here when people sign up for the newsletter." icon={<Mail className="w-7 h-7 text-gray-300" />} />
      )}

      {!isLoading && items.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-200 cursor-pointer" />
                </th>
                {['Email','Name','Source','Status','Subscribed','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(sub => (
                <tr key={sub.id} className={cn('hover:bg-gray-50/60 transition-colors', selectedIds.includes(sub.id) && 'bg-orange-50/30')}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(sub.id)} onChange={() => toggleOne(sub.id)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-200 cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 text-xs">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{sub.name || '-'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{sub.source || 'website'}</td>
                  <td className="px-4 py-3"><Badge variant={sub.isActive?'success':'default'}>{sub.isActive?'Active':'Unsubscribed'}</Badge></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDeleteTarget(sub)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && meta.totalPages > 1 && <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onChange={setPage} />}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteMut.mutate(deleteTarget!.id); setDeleteTarget(null); }}
        title="Delete Subscriber" message={`Remove "${deleteTarget?.email}" from newsletter?`} loading={deleteMut.isPending} danger />

      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => { bulkDeleteMut.mutate(selectedIds); setSelectedIds([]); setBulkDeleteOpen(false); }}
        title="Bulk Delete" message={`Remove ${selectedIds.length} subscribers? This cannot be undone.`} loading={bulkDeleteMut.isPending} danger />
    </div>
  );
}