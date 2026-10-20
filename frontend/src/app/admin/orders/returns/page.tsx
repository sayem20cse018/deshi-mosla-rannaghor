'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ReturnsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Returns" description="Manage return requests." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
