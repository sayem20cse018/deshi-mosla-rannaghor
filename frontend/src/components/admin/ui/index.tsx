'use client';

import { useState } from 'react';
import {
  X, ChevronLeft, ChevronRight,
  AlertTriangle, Loader2, Search, SlidersHorizontal, RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
interface StatCardProps {
  title:     string;
  value:     string | number;
  icon:      React.ReactNode;
  change?:   string;
  positive?: boolean;
  color?:    string;
}

export function StatCard({ title, value, icon, change, positive, color = '#ea580c' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>{value}</p>
      {change && (
        <p className={cn('text-xs font-medium mt-1', positive ? 'text-green-600' : 'text-red-500')}>
          {positive ? '+' : ''}{change} vs last month
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'orange';

const BADGE: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger:  'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
  orange:  'bg-orange-100 text-orange-700',
};

export function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold', BADGE[variant])}>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page Header
// ---------------------------------------------------------------------------
interface PageHeaderProps { title: string; description?: string; action?: React.ReactNode; }

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{title}</h1>
        {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin Button
// ---------------------------------------------------------------------------
interface AdminBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  icon?:    React.ReactNode;
  size?:    'sm' | 'md' | 'lg';
}

const BTN_V = {
  primary:   'bg-orange-500 hover:bg-orange-600 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  ghost:     'text-gray-600 hover:bg-gray-100',
};
const BTN_S = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

export function AdminBtn({ variant = 'primary', loading, icon, size = 'md', children, className, disabled, ...props }: AdminBtnProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        BTN_V[variant], BTN_S[size], className,
      )}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
interface Column<T> { key: string; label: string; render?: (row: T) => React.ReactNode; width?: string; }
interface AdminTableProps<T> { columns: Column<T>[]; data: T[]; loading?: boolean; keyField: keyof T; }

export function AdminTable<T extends Record<string, unknown>>({ columns, data, loading, keyField }: AdminTableProps<T>) {
  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-orange-500" /></div>;
  if (!data.length) return <EmptyState title="No records found" description="Try adjusting your filters or add a new record." />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm bg-white">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider" style={{ width: c.width }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row) => (
            <tr key={String(row[keyField])} className="hover:bg-gray-50/60 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-gray-700">
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
interface PaginationProps { page: number; totalPages: number; total: number; limit: number; onChange: (p: number) => void; }

export function Pagination({ page, totalPages, total, limit, onChange }: PaginationProps) {
  const from = Math.min((page - 1) * limit + 1, total);
  const to   = Math.min(page * limit, total);
  const pages = Math.min(5, totalPages);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{from}-{to}</span> of <span className="font-semibold text-gray-900">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => {
          const p = i + 1;
          return (
            <button key={p} onClick={() => onChange(p)}
              className={cn('w-8 h-8 rounded-lg text-sm font-bold transition-colors',
                p === page ? 'bg-orange-500 text-white' : 'border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600')}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------
interface ModalProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
const MODAL_SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' };

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-2xl w-full', MODAL_SIZE[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirm Dialog
// ---------------------------------------------------------------------------
interface ConfirmDialogProps {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; message: string; loading?: boolean; danger?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, loading, danger }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', danger ? 'bg-red-100' : 'bg-orange-100')}>
            <AlertTriangle className={cn('w-5 h-5', danger ? 'text-red-600' : 'text-orange-600')} />
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base">{title}</h3>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={cn('flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50',
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600')}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drawer
// ---------------------------------------------------------------------------
interface DrawerProps { open: boolean; onClose: () => void; title: string; children: React.ReactNode; side?: 'right' | 'left'; width?: string; }

export function Drawer({ open, onClose, title, children, side = 'right', width = '480px' }: DrawerProps) {
  return (
    <>
      <div onClick={onClose} className={cn('fixed inset-0 bg-black/50 z-40 transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0 pointer-events-none')} />
      <div className={cn(
        'fixed top-0 h-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300',
        side === 'right' ? 'right-0' : 'left-0',
        open ? 'translate-x-0' : (side === 'right' ? 'translate-x-full' : '-translate-x-full'),
      )} style={{ width }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-black text-gray-900 text-base">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Empty / Loading / Error States
// ---------------------------------------------------------------------------
interface EmptyStateProps { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode; }

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-gray-100">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
        {icon ?? <Search className="w-7 h-7 text-gray-300" />}
      </div>
      <h3 className="font-black text-gray-800 text-base mb-2">{title}</h3>
      {description && <p className="text-gray-400 text-sm max-w-xs mb-4 leading-relaxed">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-2xl border border-gray-100">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-2xl border border-gray-100">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100">
        <AlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <p className="text-gray-700 font-semibold">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter Bar
// ---------------------------------------------------------------------------
interface FilterBarProps { search: string; onSearch: (v: string) => void; onFilterToggle?: () => void; placeholder?: string; children?: React.ReactNode; }

export function FilterBar({ search, onSearch, onFilterToggle, placeholder = 'Search...', children }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all shadow-sm" />
      </div>
      {children}
      {onFilterToggle && (
        <button onClick={onFilterToggle}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors shadow-sm">
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      )}
    </div>
  );
}
