'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function FaqsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="FAQs" description="Manage frequently asked questions." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
