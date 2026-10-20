'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function NotifSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notification Settings" description="Configure notification preferences." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
