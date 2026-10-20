'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ProcessingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Processing Orders" description="Orders currently being processed." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
