'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" description="Manage admin roles." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
