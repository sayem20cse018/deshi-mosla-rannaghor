'use client';

import { Bell, Mail, MessageCircle, Smartphone, Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';

const INTEGRATIONS = [
  { name: 'Email (SMTP)', icon: Mail, description: 'Send order confirmations, shipping updates and admin alerts via email.', status: 'not-configured', note: 'Requires SMTP_HOST, SMTP_USER, SMTP_PASS environment variables.' },
  { name: 'SMS (Bangladesh)', icon: Smartphone, description: 'Send OTP, order updates and delivery notifications via SMS.', status: 'not-configured', note: 'Requires an SMS gateway API key (e.g. BulkSMSBD, SSL Wireless).' },
  { name: 'WhatsApp Business', icon: MessageCircle, description: 'Send order confirmations and delivery updates via WhatsApp.', status: 'partial', note: 'WhatsApp number is configured. Business API (Meta) not yet integrated.' },
];

export default function NotifSettingsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Notification Settings" description="Configure how admins and customers receive notifications." />

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800">Configuration required</p>
          <p className="text-xs text-blue-700 mt-0.5">Notification integrations require API credentials to be set in Railway environment variables. Contact your developer to configure these integrations.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {INTEGRATIONS.map(({ name, icon: Icon, description, status, note }) => (
          <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${status === 'partial' ? 'bg-amber-50' : 'bg-gray-100'}`}>
                <Icon className={`w-5 h-5 ${status === 'partial' ? 'text-amber-500' : 'text-gray-400'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-900">{name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                    {status === 'partial' ? 'Partial' : 'Not Configured'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{description}</p>
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">{note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}