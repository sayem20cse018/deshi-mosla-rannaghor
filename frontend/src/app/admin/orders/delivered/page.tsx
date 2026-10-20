'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function DeliveredPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivered Orders" description="Orders successfully delivered." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
