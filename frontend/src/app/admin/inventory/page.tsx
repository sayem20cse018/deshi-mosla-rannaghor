'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Monitor product stock levels." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
