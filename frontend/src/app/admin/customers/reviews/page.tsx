'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customer Reviews" description="Moderate customer reviews." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
