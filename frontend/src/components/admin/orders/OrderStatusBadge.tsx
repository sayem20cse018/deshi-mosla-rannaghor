'use client';

import { cn } from '@/lib/utils';
import {
  ORDER_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
} from '@/lib/orderUtils';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const cfg = ORDER_STATUS_CONFIG[status] ?? {
    label: status, color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200', dot: 'bg-gray-500',
  };
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-semibold rounded-full border',
      cfg.color, cfg.bg, cfg.border,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export function PaymentStatusBadge({ status, size = 'md' }: OrderStatusBadgeProps) {
  const cfg = PAYMENT_STATUS_CONFIG[status] ?? {
    label: status, color: 'text-gray-700', bg: 'bg-gray-100',
  };
  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded-full',
      cfg.color, cfg.bg,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
    )}>
      {cfg.label}
    </span>
  );
}
