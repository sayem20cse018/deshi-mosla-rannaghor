'use client';

import { cn, formatPriceEn } from '@/lib/utils';
import { DeliveryProvider, formatEstimatedTime } from '@/lib/deliveryProviders';
import { Clock, Zap, CalendarClock, CheckCircle, Truck, Package } from 'lucide-react';

// Emoji rendered via icon - avoids encoding issues in data files
const EMOJI_ICON: Record<string, React.ElementType> = {
  truck: Truck,
  panda: Package,
  bike:  Zap,
  bolt:  Zap,
  box:   Package,
};

const TYPE_ICON: Record<string, React.ElementType> = {
  STANDARD:  Clock,
  EXPRESS:   Zap,
  SAME_DAY:  Zap,
  SCHEDULED: CalendarClock,
};

const TYPE_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  STANDARD:  { bg: '#f0fdf4', text: '#166534',  border: '#bbf7d0' },
  EXPRESS:   { bg: '#fff7ed', text: '#c2410c',  border: '#fed7aa' },
  SAME_DAY:  { bg: '#fdf4ff', text: '#7e22ce',  border: '#e9d5ff' },
  SCHEDULED: { bg: '#eff6ff', text: '#1d4ed8',  border: '#bfdbfe' },
};

interface DeliveryProviderSelectorProps {
  providers:  DeliveryProvider[];
  selectedId: string | null;
  onSelect:   (provider: DeliveryProvider) => void;
}

export function DeliveryProviderSelector({
  providers,
  selectedId,
  onSelect,
}: DeliveryProviderSelectorProps) {
  return (
    <div className="space-y-2.5">
      {providers.map((provider) => {
        const selected  = selectedId === provider.id;
        const TypeIcon  = TYPE_ICON[provider.deliveryType] ?? Clock;
        const typeColor = TYPE_COLOR[provider.deliveryType] ?? TYPE_COLOR.STANDARD;
        const timeLabel = formatEstimatedTime(provider.estimatedMin, provider.estimatedMax);
        const EmojiIcon = EMOJI_ICON[provider.emoji] ?? Package;

        return (
          <label
            key={provider.id}
            className={cn(
              'flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150',
              selected
                ? 'border-[#0f4c2a] bg-[#f0fdf4] ring-2 ring-[#0f4c2a]/10'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50',
              !provider.available && 'opacity-50 cursor-not-allowed',
            )}
          >
            <input
              type="radio"
              name="deliveryProvider"
              value={provider.id}
              checked={selected}
              disabled={!provider.available}
              onChange={() => provider.available && onSelect(provider)}
              className="sr-only"
            />

            {/* Radio dot */}
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
              selected ? 'border-[#0f4c2a] bg-[#0f4c2a]' : 'border-gray-300 bg-white',
            )}>
              {selected && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>

            {/* Logo icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: provider.logoColor + '20', border: '1.5px solid ' + provider.logoColor + '30' }}
            >
              <EmojiIcon className="w-5 h-5" style={{ color: provider.logoColor }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-gray-900 text-sm leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  {provider.name}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: typeColor.bg, color: typeColor.text, border: '1px solid ' + typeColor.border }}
                >
                  <TypeIcon className="w-2.5 h-2.5" />
                  {provider.typeLabel}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-[11px] text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  <Clock className="w-3 h-3" /> {timeLabel}
                </span>
                {provider.note && (
                  <span className="text-[11px] text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {provider.note}
                  </span>
                )}
              </div>
            </div>

            {/* Fee */}
            <div className="text-right flex-shrink-0">
              <p
                className={cn('font-black text-sm', selected ? 'text-[#0f4c2a]' : 'text-gray-800')}
                style={{ fontFamily: 'Manrope, sans-serif' }}
              >
                {provider.fee === 0 ? 'Free' : formatPriceEn(provider.fee)}
              </p>
              {selected && (
                <p className="text-[10px] text-[#0f4c2a] font-semibold mt-0.5 flex items-center gap-0.5 justify-end">
                  <CheckCircle className="w-3 h-3" /> Selected
                </p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
