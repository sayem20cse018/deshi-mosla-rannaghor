'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function HomepagePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Content" description="Manage homepage sections." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
