import { Truck, ExternalLink } from 'lucide-react';

interface DeliveryProviderBadgeProps {
  providerName?:   string;
  trackingUrl?:    string;
  deliveryStatus?: string;
  compact?:        boolean;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:          { label: 'Pending',           color: '#92400e' },
  ASSIGNED:         { label: 'Assigned',          color: '#1d4ed8' },
  PICKED_UP:        { label: 'Picked up',         color: '#7e22ce' },
  IN_TRANSIT:       { label: 'In transit',        color: '#ea580c' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery',  color: '#0891b2' },
  DELIVERED:        { label: 'Delivered',         color: '#15803d' },
  FAILED:           { label: 'Failed',            color: '#dc2626' },
  RETURNED:         { label: 'Returned',          color: '#6b7280' },
};

export function DeliveryProviderBadge({
  providerName,
  trackingUrl,
  deliveryStatus,
  compact = false,
}: DeliveryProviderBadgeProps) {
  if (!providerName) return null;

  const statusInfo = deliveryStatus ? STATUS_LABEL[deliveryStatus] : null;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <Truck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {providerName}
        </span>
        {statusInfo && (
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: statusInfo.color + '15', color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
        <Truck className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-700" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {providerName}
        </p>
        {statusInfo && (
          <p
            className="text-[11px] font-semibold mt-0.5"
            style={{ color: statusInfo.color, fontFamily: 'Manrope, sans-serif' }}
          >
            {statusInfo.label}
          </p>
        )}
      </div>
      {trackingUrl && (
        <a
          href={trackingUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-1.5 rounded-lg transition-all active:scale-95 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0f4c2a,#1a6b3c)', fontFamily: 'Manrope, sans-serif' }}
        >
          <Truck className="w-3 h-3" /> Track
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      )}
    </div>
  );
}
