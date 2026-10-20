'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function AdjustmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Stock Adjustments" description="Make inventory adjustments." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
