'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payment Settings" description="Configure payment gateways." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
