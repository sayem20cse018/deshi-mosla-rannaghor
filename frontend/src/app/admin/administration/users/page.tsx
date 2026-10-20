'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Admin Users" description="Manage admin user accounts." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
