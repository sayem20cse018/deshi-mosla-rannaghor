// Delivery Provider System
// Future: data will come from Admin Panel API.
// For now, mock/static data. Structure is future-ready.

export type DeliveryType = 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'SCHEDULED';

export interface DeliveryProvider {
  id:           string;
  name:         string;
  shortName:    string;
  emoji:        string;    // stored as text key, rendered via EMOJI_MAP
  logoColor:    string;
  deliveryType: DeliveryType;
  typeLabel:    string;
  estimatedMin: number;    // minutes
  estimatedMax: number;    // minutes
  fee:          number;    // BDT
  available:    boolean;
  trackingUrl?: string;
  note?:        string;
}

// emoji map - keep emoji out of this TS file to avoid encoding issues
export const PROVIDER_EMOJI: Record<string, string> = {
  self:      'truck',
  foodpanda: 'panda',
  pathao:    'bike',
  shohoz:    'bolt',
  redx:      'box',
};

export const MOCK_DELIVERY_PROVIDERS: DeliveryProvider[] = [
  {
    id:           'self',
    name:         'Nijoswo Delivery',
    shortName:    'Nijoswo',
    emoji:        'truck',
    logoColor:    '#0f4c2a',
    deliveryType: 'STANDARD',
    typeLabel:    'Standard Delivery',
    estimatedMin: 1440,
    estimatedMax: 4320,
    fee:          60,
    available:    true,
    note:         '2-3 working days outside Dhaka',
  },
  {
    id:           'foodpanda',
    name:         'Foodpanda Express',
    shortName:    'Foodpanda',
    emoji:        'panda',
    logoColor:    '#d70f64',
    deliveryType: 'EXPRESS',
    typeLabel:    'Express Delivery',
    estimatedMin: 30,
    estimatedMax: 60,
    fee:          80,
    available:    true,
    note:         'Dhaka city only',
    trackingUrl:  'https://www.foodpanda.com.bd',
  },
  {
    id:           'pathao',
    name:         'Pathao Courier',
    shortName:    'Pathao',
    emoji:        'bike',
    logoColor:    '#e8192c',
    deliveryType: 'EXPRESS',
    typeLabel:    'Express Delivery',
    estimatedMin: 45,
    estimatedMax: 90,
    fee:          70,
    available:    true,
    note:         'Dhaka, Ctg, Sylhet',
    trackingUrl:  'https://merchant.pathao.com',
  },
  {
    id:           'shohoz',
    name:         'Shohoz Delivery',
    shortName:    'Shohoz',
    emoji:        'bolt',
    logoColor:    '#f7941d',
    deliveryType: 'SAME_DAY',
    typeLabel:    'Same Day Delivery',
    estimatedMin: 120,
    estimatedMax: 240,
    fee:          90,
    available:    true,
    note:         'Order today, get today',
    trackingUrl:  'https://shohoz.com',
  },
  {
    id:           'redx',
    name:         'RedX Courier',
    shortName:    'RedX',
    emoji:        'box',
    logoColor:    '#e53e3e',
    deliveryType: 'STANDARD',
    typeLabel:    'Standard Delivery',
    estimatedMin: 720,
    estimatedMax: 2880,
    fee:          50,
    available:    true,
    note:         'Nationwide delivery',
    trackingUrl:  'https://redx.com.bd',
  },
];

export function formatEstimatedTime(minMinutes: number, maxMinutes: number): string {
  const fmt = (m: number): string => {
    if (m < 60)   return m + ' min';
    if (m < 1440) return Math.round(m / 60) + ' hr';
    return Math.round(m / 1440) + ' day';
  };
  return fmt(minMinutes) + ' - ' + fmt(maxMinutes);
}

export function getAvailableProviders(): DeliveryProvider[] {
  return MOCK_DELIVERY_PROVIDERS.filter((p) => p.available);
}
