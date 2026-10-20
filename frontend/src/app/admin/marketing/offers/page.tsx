'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function OffersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Offers" description="Manage special offers." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
