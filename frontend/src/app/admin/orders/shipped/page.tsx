'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ShippedOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Shipped Orders" description="Orders that have been shipped." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
