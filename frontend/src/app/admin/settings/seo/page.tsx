'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function SeoSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SEO Settings" description="Configure SEO settings." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
