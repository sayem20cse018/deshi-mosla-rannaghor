'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function MediaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Media Library" description="Manage uploaded media files." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
