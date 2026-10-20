'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ProductsReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Products Report" description="Top performing products." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
