'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter" description="Manage newsletter subscribers." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
