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

export function PaymentMethodBadge({ method, size = 'md' }: { method: string; size?: 'sm' | 'md' }) {
  const MAP: Record<string, { label: string; bg: string; color: string }> = {
    CASH_ON_DELIVERY: { label: 'COD',       bg: 'bg-green-50',  color: 'text-green-700' },
    BKASH:            { label: 'bKash',     bg: 'bg-pink-50',   color: 'text-pink-700'  },
    NAGAD:            { label: 'Nagad',     bg: 'bg-orange-50', color: 'text-orange-700'},
    ROCKET:           { label: 'Rocket',    bg: 'bg-violet-50', color: 'text-violet-700'},
    SSLCOMMERZ:       { label: 'Card/Net',  bg: 'bg-blue-50',   color: 'text-blue-700'  },
    VISA:             { label: 'Visa',      bg: 'bg-blue-50',   color: 'text-blue-700'  },
    MASTERCARD:       { label: 'Mastercard',bg: 'bg-red-50',    color: 'text-red-700'   },
  };
  const cfg = MAP[method] ?? { label: method, bg: 'bg-gray-100', color: 'text-gray-600' };
  return (
    <span className={cn(
      'inline-flex items-center font-semibold rounded-full',
      cfg.bg, cfg.color,
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
    )}>
      {cfg.label}
    </span>
  );
}
