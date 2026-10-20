'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function PagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description="Manage static pages." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
