'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="General Settings" description="Configure general site settings." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
