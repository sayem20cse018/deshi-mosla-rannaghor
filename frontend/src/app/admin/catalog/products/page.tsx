'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage your product catalog." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
