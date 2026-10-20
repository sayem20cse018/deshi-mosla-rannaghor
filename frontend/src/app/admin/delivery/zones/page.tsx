'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Zones" description="Configure delivery zones." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
