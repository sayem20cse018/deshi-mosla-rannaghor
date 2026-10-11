'use client';

import { RefreshCw, Database, Server, Clock, MemoryStick, ShoppingCart, Package, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSystemHealth } from '@/hooks/useAdminUsers';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { formatPriceEn } from '@/lib/utils';

function StatCard({ label, value, icon: Icon, color = 'text-orange-500' }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
        <Icon className={cn('w-4 h-4', color)} />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function formatUptime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function SystemHealthPage() {
  const { data, isLoading, isError, refetch, dataUpdatedAt } = useSystemHealth();
  const h = data?.data;

  return (
    <div className="space-y-5">
      <PageHeader
        title="System Health"
        description={dataUpdatedAt ? `Last checked: ${new Date(dataUpdatedAt).toLocaleTimeString()}` : 'Real-time system status'}
        action={<AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>Refresh</AdminBtn>}
      />

      {isLoading && <LoadingState message="Checking system health..." />}
      {isError   && <ErrorState message="Could not reach system health endpoint." onRetry={refetch} />}

      {h && (
        <>
          {/* Database status */}
          <div className={cn(
            'rounded-2xl border p-4 flex items-center gap-3',
            h.database.status === 'healthy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
          )}>
            <div className={cn('w-3 h-3 rounded-full', h.database.status === 'healthy' ? 'bg-green-500' : 'bg-red-500')} />
            <Database className={cn('w-4 h-4', h.database.status === 'healthy' ? 'text-green-600' : 'text-red-500')} />
            <div>
              <p className={cn('font-bold text-sm', h.database.status === 'healthy' ? 'text-green-800' : 'text-red-700')}>
                Database — {h.database.status === 'healthy' ? 'Connected' : 'Error'}
              </p>
              <p className={cn('text-xs', h.database.status === 'healthy' ? 'text-green-600' : 'text-red-500')}>
                {h.database.message}
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Users"     value={h.stats.totalUsers}     icon={Users}       color="text-blue-500" />
            <StatCard label="Active Products" value={h.stats.totalProducts}  icon={Package}     color="text-green-500" />
            <StatCard label="Total Orders"    value={h.stats.totalOrders}    icon={ShoppingCart} color="text-orange-500" />
            <StatCard label="Pending Orders"  value={h.stats.pendingOrders}  icon={AlertCircle} color="text-amber-500" />
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <p className="text-sm font-bold opacity-80 mb-1">Total Revenue (all time)</p>
            <p className="text-3xl font-black">{formatPriceEn(h.stats.totalRevenue)}</p>
            <p className="text-xs opacity-60 mt-1">From confirmed/delivered orders</p>
          </div>

          {/* Server info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-4">Server Information</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Server,    label: 'Environment', value: h.environment.nodeEnv },
                { icon: Server,    label: 'Node.js',     value: h.environment.nodeVersion },
                { icon: Clock,     label: 'Uptime',      value: formatUptime(h.environment.uptime) },
                { icon: MemoryStick, label: 'Memory',    value: `${h.environment.memoryMB} MB` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3">Last updated: {new Date(h.timestamp).toLocaleString()}</p>
          </div>
        </>
      )}
    </div>
  );
}