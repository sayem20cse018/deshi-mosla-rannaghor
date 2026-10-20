'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function RecipesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Recipes" description="Manage recipe content." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
