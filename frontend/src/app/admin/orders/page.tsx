'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function AllOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="All Orders" description="View and manage all customer orders." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
