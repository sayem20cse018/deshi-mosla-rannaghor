'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function TagsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tags" description="Manage product tags." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
