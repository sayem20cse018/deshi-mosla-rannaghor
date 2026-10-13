import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  count,
  size = 'sm',
  showCount = true,
  className,
}: StarRatingProps) {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.4;
  const empty = 5 - filled - (half ? 1 : 0);
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: filled }).map((_, i) => (
          <Star key={`f-${i}`} className={cn(iconSize, 'fill-amber-400 text-amber-400')} />
        ))}
        {half && <StarHalf className={cn(iconSize, 'fill-amber-400 text-amber-400')} />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} className={cn(iconSize, 'text-gray-300')} />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-gray-500 leading-none">
          {rating.toFixed(1)}
          {count !== undefined && <span className="text-gray-400 ml-0.5">({count})</span>}
        </span>
      )}
    </div>
  );
}
