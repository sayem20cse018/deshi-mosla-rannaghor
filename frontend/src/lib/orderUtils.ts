//  Status config 
export const ORDER_STATUS_CONFIG: Record<string, {
  label:   string;
  color:   string;
  bg:      string;
  border:  string;
  dot:     string;
}> = {
  PENDING:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200', dot: 'bg-amber-500'  },
  CONFIRMED:  { label: 'Confirmed',  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',  dot: 'bg-blue-500'   },
  PROCESSING: { label: 'Processing', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200',dot: 'bg-purple-500' },
  PACKED:     { label: 'Packed',     color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200',dot: 'bg-indigo-500' },
  SHIPPED:    { label: 'Shipped',    color: 'text-cyan-700',   bg: 'bg-cyan-50',   border: 'border-cyan-200',  dot: 'bg-cyan-500'   },
  DELIVERED:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200', dot: 'bg-green-500'  },
  CANCELLED:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',   dot: 'bg-red-500'    },
  RETURNED:   { label: 'Returned',   color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200',dot: 'bg-orange-500' },
  REFUNDED:   { label: 'Refunded',   color: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200',  dot: 'bg-teal-500'   },
};

export const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:              { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-50'  },
  PROCESSING:           { label: 'Processing', color: 'text-blue-700',   bg: 'bg-blue-50'   },
  PAID:                 { label: 'Paid',       color: 'text-green-700',  bg: 'bg-green-50'  },
  FAILED:               { label: 'Failed',     color: 'text-red-700',    bg: 'bg-red-50'    },
  CANCELLED:            { label: 'Cancelled',  color: 'text-gray-700',   bg: 'bg-gray-100'  },
  REFUNDED:             { label: 'Refunded',   color: 'text-teal-700',   bg: 'bg-teal-50'   },
  PARTIALLY_REFUNDED:   { label: 'Part. Refund',color:'text-teal-700',   bg: 'bg-teal-50'   },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH_ON_DELIVERY: 'Cash on Delivery',
  BKASH:            'bKash',
  NAGAD:            'Nagad',
  ROCKET:           'Rocket',
  SSLCOMMERZ:       'SSLCommerz',
  VISA:             'Visa',
  MASTERCARD:       'Mastercard',
  BKASH_MANUAL:     'bKash (Manual)',
};

//  Next valid statuses from current 
export const NEXT_STATUSES: Record<string, string[]> = {
  PENDING:    ['CONFIRMED', 'CANCELLED'],
  CONFIRMED:  ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKED', 'CANCELLED'],
  PACKED:     ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED', 'RETURNED'],
  DELIVERED:  ['RETURNED', 'REFUNDED'],
  CANCELLED:  [],
  RETURNED:   ['REFUNDED'],
  REFUNDED:   [],
};

//  Helpers 
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatDate(dateStr: string | null | undefined, short = false): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (short) return d.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: '2-digit' });
  return d.toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Payment brand colors and visual config
export const PAYMENT_BRAND_CONFIG: Record<string, {
  label: string; bg: string; color: string; border: string; icon: string;
}> = {
  CASH_ON_DELIVERY: { label: 'Cash on Delivery', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0', icon: 'cash' },
  BKASH:            { label: 'bKash',            bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8', icon: 'bkash' },
  NAGAD:            { label: 'Nagad',            bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', icon: 'nagad' },
  ROCKET:           { label: 'Rocket',           bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe', icon: 'rocket' },
  SSLCOMMERZ:       { label: 'SSLCommerz',       bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: 'card' },
  VISA:             { label: 'Visa',             bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: 'card' },
  MASTERCARD:       { label: 'Mastercard',       bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', icon: 'card' },
  BKASH_MANUAL:     { label: 'bKash (Manual)',   bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8', icon: 'bkash' },
};