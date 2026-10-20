'use client';
import { PageHeader, EmptyState } from '@/components/admin/ui';
export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Wishlist" description="View customer wishlists." />
      <EmptyState title="Coming soon" description="This section is under construction." />
    </div>
  );
}
