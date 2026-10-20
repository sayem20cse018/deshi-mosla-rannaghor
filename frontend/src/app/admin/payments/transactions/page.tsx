'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" description="View all payment transactions." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
