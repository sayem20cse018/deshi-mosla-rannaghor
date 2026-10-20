'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CustomersReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers Report" description="Customer analytics." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
