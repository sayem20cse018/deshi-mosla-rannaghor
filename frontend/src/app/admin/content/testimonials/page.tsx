'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function TestimonialsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Manage customer testimonials." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
