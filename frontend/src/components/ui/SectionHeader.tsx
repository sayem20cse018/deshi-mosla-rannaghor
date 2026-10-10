import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  center?: boolean;
  className?: string;
  accent?: string; // colored word in title
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = 'সব দেখুন',
  center = false,
  className,
  accent,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-end justify-between mb-6 md:mb-8',
        center && 'flex-col items-center text-center',
        className,
      )}
    >
      <div className={cn(center && 'flex flex-col items-center')}>
        {accent && (
          <span className="inline-block text-xs font-semibold tracking-widest text-spice-500 uppercase mb-1.5">
            {accent}
          </span>
        )}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub mt-1">{subtitle}</p>}
      </div>

      {href && !center && (
        <Link
          href={href}
          className="btn-ghost flex-shrink-0 ml-4 text-brand-700 hover:text-brand-800"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
