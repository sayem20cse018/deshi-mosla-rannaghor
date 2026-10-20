'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Brands" description="Manage product brands." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
