'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Providers" description="Manage third-party delivery providers." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
