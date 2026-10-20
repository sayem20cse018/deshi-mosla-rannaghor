'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function InventoryHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory History" description="View inventory change history." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
