'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ConfirmedOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Confirmed Orders" description="Orders that have been confirmed." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
