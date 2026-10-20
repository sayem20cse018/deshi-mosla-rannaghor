'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Manage product categories." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
