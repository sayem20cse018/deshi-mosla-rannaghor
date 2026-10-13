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
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-spice-600 uppercase mb-2">
            <span className="w-4 h-0.5 bg-spice-500 rounded-full inline-block" />
            {accent}
            <span className="w-4 h-0.5 bg-spice-500 rounded-full inline-block" />
          </span>
        )}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-sub mt-1">{subtitle}</p>}
      </div>

      {href && !center && (
        <Link
          href={href}
          className="flex-shrink-0 ml-4 flex items-center gap-1.5 text-xs font-bold text-spice-600 hover:text-spice-700 bg-spice-50 hover:bg-spice-100 border border-spice-200 px-3.5 py-2 rounded-xl transition-all"
        >
          {linkLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
