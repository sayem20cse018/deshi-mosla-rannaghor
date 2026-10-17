import { cn } from '@/lib/utils';

// ── Shimmer base ────────────────────────────────────────────
function Shimmer({ className }: { className?: string }) {
  return <div className={cn('shimmer-bg rounded-lg', className)} />;
}

// ── Product card skeleton ───────────────────────────────────
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm', className)}>
      {/* Image */}
      <Shimmer className="aspect-square w-full rounded-none" />
      {/* Info */}
      <div className="p-3 space-y-2.5">
        <Shimmer className="h-3.5 w-4/5" />
        <Shimmer className="h-3 w-2/5" />
        <div className="flex gap-1 pt-0.5">
          {[1,2,3,4,5].map(i => <Shimmer key={i} className="w-3 h-3 rounded-full" />)}
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <Shimmer className="h-5 w-1/3" />
          <Shimmer className="h-4 w-1/5" />
        </div>
        <Shimmer className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ── Product row skeleton (grid layout) ─────────────────────
export function SkeletonRow({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// ── Product detail page skeleton ───────────────────────────
export function SkeletonProductDetail() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-3 rounded-full" />
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-3 rounded-full" />
        <Shimmer className="h-3 w-32" />
      </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <Shimmer className="aspect-square w-full rounded-3xl" />
          <div className="flex gap-2">
            {[1,2,3,4].map(i => <Shimmer key={i} className="w-[72px] h-[72px] rounded-xl flex-shrink-0" />)}
          </div>
        </div>
        {/* Details */}
        <div className="space-y-5">
          <div className="flex gap-2">
            <Shimmer className="h-6 w-24 rounded-full" />
            <Shimmer className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Shimmer className="h-8 w-5/6" />
            <Shimmer className="h-4 w-2/5" />
          </div>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(i => <Shimmer key={i} className="w-4 h-4 rounded-full" />)}
            <Shimmer className="h-4 w-20 ml-1" />
          </div>
          <Shimmer className="h-20 w-full rounded-2xl" />
          <div className="flex gap-2">
            {[1,2,3].map(i => <Shimmer key={i} className="h-7 w-20 rounded-full" />)}
          </div>
          <div className="flex gap-2 items-center">
            <Shimmer className="h-12 w-36 rounded-xl" />
            <Shimmer className="h-5 w-24" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="flex-1 h-14 rounded-xl" />
            <Shimmer className="flex-1 h-14 rounded-xl" />
            <Shimmer className="w-[54px] h-14 rounded-xl flex-shrink-0" />
            <Shimmer className="w-[54px] h-14 rounded-xl flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[1,2,3,4].map(i => <Shimmer key={i} className="h-16 rounded-xl" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
