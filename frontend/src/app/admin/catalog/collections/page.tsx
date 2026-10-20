'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Collections" description="Manage product collections." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
