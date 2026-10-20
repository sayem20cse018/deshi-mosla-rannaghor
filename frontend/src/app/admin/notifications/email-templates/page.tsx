'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Email Templates" description="Manage email notification templates." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
