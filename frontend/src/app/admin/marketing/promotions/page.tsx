'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Promotions" description="Manage promotional campaigns." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
