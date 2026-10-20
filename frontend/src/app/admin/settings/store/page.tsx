'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function StoreSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Store Settings" description="Configure store information." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
