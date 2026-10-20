'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ChargesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Delivery Charges" description="Set delivery charge rules." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
