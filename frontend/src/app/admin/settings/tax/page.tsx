'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function TaxSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tax Settings" description="Configure tax rates and rules." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
