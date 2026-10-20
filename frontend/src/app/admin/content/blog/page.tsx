'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function BlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog" description="Manage blog posts." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
