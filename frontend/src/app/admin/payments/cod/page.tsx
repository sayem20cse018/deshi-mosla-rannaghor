'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CodPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Cash on Delivery" description="Manage COD orders." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
