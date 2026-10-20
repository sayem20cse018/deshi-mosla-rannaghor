'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function SmsTemplatesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SMS Templates" description="Manage SMS notification templates." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
