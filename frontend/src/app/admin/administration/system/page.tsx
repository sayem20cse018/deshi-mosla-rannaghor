'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function SystemPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Health" description="Monitor system health and status." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
