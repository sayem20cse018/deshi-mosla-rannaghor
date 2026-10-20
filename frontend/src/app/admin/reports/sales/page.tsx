'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function SalesReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Sales Report" description="View sales analytics and revenue." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
