'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="View and manage notifications." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
