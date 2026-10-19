// -- Delivery Provider System -------------------------------------------------
// Future: This data will come from Admin Panel API.
// For now, mock data is used. Structure is future-ready.

export type DeliveryType = 'STANDARD' | 'EXPRESS' | 'SAME_DAY' | 'SCHEDULED';

export interface DeliveryProvider {
  id:           string;         // unique ID
  name:         string;         // Display name e.g. "Foodpanda Express"
  shortName:    string;         // Short name e.g. "Foodpanda"
  emoji:        string;         // Logo emoji (until real logos available)
  logoColor:    string;         // Brand color for logo bg
  deliveryType: DeliveryType;
  typeLabel:    string;         // Bengali label
  estimatedMin: number;         // minutes (min)
  estimatedMax: number;         // minutes (max)
  fee:          number;         // BDT
  available:    boolean;        // Can Admin disable a provider
  trackingUrl?: string;         // Deep link template e.g. "https://..."
  note?:        string;         // Optional note shown to customer
}

// -- Mock providers — replace with API call later ------------------------------
export const MOCK_DELIVERY_PROVIDERS: DeliveryProvider[] = [
  {
    id:           'self',
    name:         '?????? ????????',
    shortName:    '??????',
    emoji:        '??',
    logoColor:    '#0f4c2a',
    deliveryType: 'STANDARD',
    typeLabel:    '?????? ????????',
    estimatedMin: 1440,   // 1 day
    estimatedMax: 4320,   // 3 days
    fee:          60,
    available:    true,
    note:         '????? ????? ?-? ?????????',
  },
  {
    id:           'foodpanda',
    name:         'Foodpanda Express',
    shortName:    'Foodpanda',
    emoji:        '??',
    logoColor:    '#d70f64',
    deliveryType: 'EXPRESS',
    typeLabel:    '????????? ????????',
    estimatedMin: 30,
    estimatedMax: 60,
    fee:          80,
    available:    true,
    note:         '???? ????? ?????',
    trackingUrl:  'https://www.foodpanda.com.bd',
  },
  {
    id:           'pathao',
    name:         'Pathao Courier',
    shortName:    'Pathao',
    emoji:        '??',
    logoColor:    '#e8192c',
    deliveryType: 'EXPRESS',
    typeLabel:    '????????? ????????',
    estimatedMin: 45,
    estimatedMax: 90,
    fee:          70,
    available:    true,
    note:         '????, ?????????, ?????',
    trackingUrl:  'https://merchant.pathao.com',
  },
  {
    id:           'shohoz',
    name:         'Shohoz Delivery',
    shortName:    'Shohoz',
    emoji:        '?',
    logoColor:    '#f7941d',
    deliveryType: 'SAME_DAY',
    typeLabel:    '???? ?? ????????',
    estimatedMin: 120,
    estimatedMax: 240,
    fee:          90,
    available:    true,
    note:         '????? ?????? ??? ?????',
    trackingUrl:  'https://shohoz.com',
  },
  {
    id:           'redx',
    name:         'RedX Courier',
    shortName:    'RedX',
    emoji:        '??',
    logoColor:    '#e53e3e',
    deliveryType: 'STANDARD',
    typeLabel:    '?????? ????????',
    estimatedMin: 720,
    estimatedMax: 2880,
    fee:          50,
    available:    true,
    note:         '???????? ????????',
    trackingUrl:  'https://redx.com.bd',
  },
];

// -- Helper: format estimated time ---------------------------------------------
export function formatEstimatedTime(minMinutes: number, maxMinutes: number): string {
  const fmt = (m: number) => {
    if (m < 60)   return `${m} ?????`;
    if (m < 1440) return `${Math.round(m / 60)} ?????`;
    return `${Math.round(m / 1440)} ???`;
  };
  return `${fmt(minMinutes)} – ${fmt(maxMinutes)}`;
}

// -- Helper: get available providers ------------------------------------------
export function getAvailableProviders(): DeliveryProvider[] {
  return MOCK_DELIVERY_PROVIDERS.filter((p) => p.available);
}
