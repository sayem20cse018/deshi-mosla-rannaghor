'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function OnlinePayPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Online Payments" description="View online payment records." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
