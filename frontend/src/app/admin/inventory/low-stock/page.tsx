'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function LowStockPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Low Stock Alert" description="Products with low stock." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
