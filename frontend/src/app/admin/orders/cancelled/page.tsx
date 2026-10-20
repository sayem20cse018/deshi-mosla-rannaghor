'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CancelledPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cancelled Orders" description="Orders that were cancelled." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
