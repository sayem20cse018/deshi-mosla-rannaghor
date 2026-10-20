'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activity Logs" description="View admin activity logs." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
