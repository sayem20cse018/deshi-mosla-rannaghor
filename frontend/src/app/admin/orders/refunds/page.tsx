'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function RefundsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Refunds" description="Manage refund requests." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
