'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function PendingOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pending Orders" description="Orders awaiting confirmation." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
