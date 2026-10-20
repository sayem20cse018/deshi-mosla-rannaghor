'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function OrdersReportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Orders Report" description="Analyze order patterns." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
