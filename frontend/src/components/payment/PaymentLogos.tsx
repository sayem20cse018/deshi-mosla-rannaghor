/**
 * Official payment brand logos as inline SVG components.
 * Logos are FIXED  cannot be changed from Admin Panel.
 * Used consistently across: Checkout, Order Details, Footer, Admin Panel.
 */

export function BkashLogo({ className = 'w-16 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="36" rx="6" fill="#E2136E"/>
      <text x="10" y="24" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold" fill="white">bKash</text>
    </svg>
  );
}

export function NagadLogo({ className = 'w-16 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="36" rx="6" fill="#F26522"/>
      <text x="10" y="24" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="bold" fill="white">Nagad</text>
    </svg>
  );
}

export function RocketLogo({ className = 'w-16 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="36" rx="6" fill="#8B1A7E"/>
      <text x="8" y="24" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white">Rocket</text>
    </svg>
  );
}

export function CodLogo({ className = 'w-16 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="36" rx="6" fill="#1F2937"/>
      <g transform="translate(10,8)">
        <rect x="0" y="2" width="24" height="16" rx="2" fill="#374151" stroke="#6EE7B7" strokeWidth="1.5"/>
        <line x1="0" y1="7" x2="24" y2="7" stroke="#6EE7B7" strokeWidth="1.5"/>
        <rect x="2" y="10" width="8" height="2" rx="1" fill="#6EE7B7"/>
      </g>
      <text x="38" y="23" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" fill="#6EE7B7">COD</text>
    </svg>
  );
}

export function SslLogo({ className = 'w-16 h-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="36" rx="6" fill="#1D4ED8"/>
      <text x="8" y="24" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" fill="white">CARD</text>
    </svg>
  );
}

export type PaymentKey = 'CASH_ON_DELIVERY' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'SSLCOMMERZ' | string;

export function PaymentLogo({ method, className }: { method: PaymentKey; className?: string }) {
  const cls = className ?? 'h-8 w-auto';
  switch (method) {
    case 'BKASH':            return <BkashLogo className={cls} />;
    case 'NAGAD':            return <NagadLogo className={cls} />;
    case 'ROCKET':           return <RocketLogo className={cls} />;
    case 'CASH_ON_DELIVERY': return <CodLogo className={cls} />;
    case 'SSLCOMMERZ':       return <SslLogo className={cls} />;
    default:
      return (
        <div className="flex items-center justify-center rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 h-8 min-w-[56px]">
          {method.replace(/_/g, ' ')}
        </div>
      );
  }
}

export const PAYMENT_COLORS: Record<string, { bg: string; text: string; border: string; selectedBg: string }> = {
  CASH_ON_DELIVERY: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0', selectedBg: '#DCFCE7' },
  BKASH:            { bg: '#FDF2F8', text: '#9D174D', border: '#FBCFE8', selectedBg: '#FCE7F3' },
  NAGAD:            { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA', selectedBg: '#FFEDD5' },
  ROCKET:           { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE', selectedBg: '#EDE9FE' },
  SSLCOMMERZ:       { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE', selectedBg: '#DBEAFE' },
};