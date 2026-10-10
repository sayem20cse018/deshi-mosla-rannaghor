'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import { PageHeader, LoadingState, ErrorState, EmptyState, Pagination } from '@/components/admin/ui';
import { useActivityLogs } from '@/hooks/useAdminContent';

type LogAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN';

const ACTION_STYLE: Record<LogAction, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  LOGIN:  'bg-gray-100 text-gray-600',
};

function ActionBadge({ action }: { action: string }) {
  const cls = ACTION_STYLE[action as LogAction] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>
      {action}
    </span>
  );
}

export default function ActivityPage() {
  const [page,   setPage]   = useState(1);
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [from,   setFrom]   = useState('');
  const [to,     setTo]     = useState('');

  const filters = {
    page,
    ...(action ? { action } : {}),
    ...(entity ? { entity } : {}),
    ...(from   ? { from }   : {}),
    ...(to     ? { to }     : {}),
  };

  const { data, isLoading, isError, refetch } = useActivityLogs(filters);

  const logs       = data?.data   ?? [];
  const meta       = data?.meta   ?? {};
  const total      = meta.total   ?? 0;
  const limit      = meta.limit   ?? 25;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" description="Admin action history" />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
          <option value="LOGIN">LOGIN</option>
        </select>

        <input
          type="text"
          value={entity}
          onChange={(e) => { setEntity(e.target.value); setPage(1); }}
          placeholder="Filter by entity..."
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />

        <input
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {isLoading && <LoadingState message="Loading activity logs..." />}
      {isError   && <ErrorState message="Failed to load activity logs." onRetry={() => refetch()} />}

      {!isLoading && !isError && logs.length === 0 && (
        <EmptyState
          title="No activity logs recorded yet"
          description="Admin actions will appear here once activity is recorded."
          icon={<Activity className="w-7 h-7 text-gray-300" />}
        />
      )}

      {!isLoading && !isError && logs.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Admin', 'Action', 'Entity', 'Entity ID', 'Timestamp'].map((c) => (
                    <th key={c} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log: Record<string, unknown>, i: number) => (
                  <tr key={String(log.id ?? i)} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {String(log.adminName ?? log.admin ?? '—')}
                      </p>
                      {log.adminEmail && (
                        <p className="text-xs text-gray-400">{String(log.adminEmail)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={String(log.action ?? '')} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {String(log.entity ?? log.entityType ?? '—')}
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {String(log.entityId ?? '—')}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(String(log.createdAt ?? log.timestamp ?? '')).toLocaleString('en-BD', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onChange={setPage} />
        </>
      )}
    </div>
  );
}
