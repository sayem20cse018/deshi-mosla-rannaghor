'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description="Manage customer accounts." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
