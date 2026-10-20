'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Product" description="Add a new product to the catalog." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
