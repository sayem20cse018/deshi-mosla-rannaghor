'use client';

import { ExternalLink, Clock } from 'lucide-react';
import { PageHeader, Badge } from '@/components/admin/ui';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Provider {
  name:        string;
  description: string;
  website:     string;
  logo:        string;
  color:       string;
}

const PROVIDERS: Provider[] = [
  {
    name:        'Pathao',
    description: 'One of Bangladesh\'s leading on-demand courier platforms. Offers same-day and next-day delivery across Dhaka and other major cities with real-time tracking.',
    website:     'https://pathao.com/bd/courier/',
    logo:        'P',
    color:       '#e3001b',
  },
  {
    name:        'Steadfast Courier',
    description: 'A reliable nationwide courier service popular with e-commerce businesses. Provides API integration for shipment creation and parcel tracking.',
    website:     'https://steadfast.com.bd',
    logo:        'S',
    color:       '#0066cc',
  },
  {
    name:        'Sundarban Courier',
    description: 'One of the oldest courier networks in Bangladesh with extensive coverage across divisions, districts, and upazilas including rural areas.',
    website:     'https://sundarbancourier.com',
    logo:        'SC',
    color:       '#ff6600',
  },
  {
    name:        'Redx',
    description: 'Tech-first last-mile delivery service focused on merchants and SMEs. Provides pick-up from warehouse and delivery to customers nationwide.',
    website:     'https://redx.com.bd',
    logo:        'R',
    color:       '#e63946',
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm"
            style={{ backgroundColor: provider.color }}
          >
            {provider.logo}
          </div>
          <div>
            <h3 className="font-black text-gray-900 text-base">{provider.name}</h3>
            <Badge variant="warning">
              <Clock className="w-3 h-3 mr-1 inline-block" />
              Integration Coming Soon
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{provider.description}</p>

      <a
        href={provider.website}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
      >
        Visit website <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DeliveryProvidersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Providers"
        description="Supported courier integrations for Deshi Moslar Rannaghar"
      />

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-3">
        <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-orange-800">Delivery Tracking Coming Soon</p>
          <p className="text-xs text-orange-600 mt-1 leading-relaxed">
            Automatic shipment creation, tracking updates, and webhook notifications from courier APIs will be available in a future update. For now, you can manually add tracking info on each order.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PROVIDERS.map((p) => (
          <ProviderCard key={p.name} provider={p} />
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h3 className="text-sm font-black text-gray-800 mb-2">Want to add a courier?</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          If you use a courier service not listed here, you can still manage orders manually by entering tracking numbers in the order detail page. Contact support to request a new courier integration.
        </p>
      </div>
    </div>
  );
}
