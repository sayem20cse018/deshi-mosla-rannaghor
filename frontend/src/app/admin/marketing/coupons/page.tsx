'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Create and manage discount coupons." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
