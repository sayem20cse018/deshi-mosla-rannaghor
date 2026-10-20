'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function DeliverySettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Settings" description="Configure delivery settings." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
