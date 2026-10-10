import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 overflow-hidden', className)}>
      <div className="shimmer-bg aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="shimmer-bg h-3.5 w-3/4 rounded-lg" />
        <div className="shimmer-bg h-3 w-1/2 rounded-lg" />
        <div className="shimmer-bg h-4 w-1/3 rounded-lg" />
        <div className="shimmer-bg h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonRow({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
