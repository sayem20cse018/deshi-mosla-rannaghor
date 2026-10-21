'use client';

import { MediaLibrary } from '@/components/admin/media/MediaLibrary';
import { PageHeader } from '@/components/admin/ui';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload and manage all images."
      />
      <MediaLibrary mode="page" />
    </div>
  );
}
