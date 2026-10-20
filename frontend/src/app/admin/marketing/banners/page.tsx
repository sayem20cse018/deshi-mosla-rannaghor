'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function BannersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Banners" description="Manage homepage and category banners." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
