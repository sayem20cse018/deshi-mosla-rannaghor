'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Grid2X2, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'হোম' },
  { href: '/shop', icon: ShoppingBag, label: 'শপ' },
  { href: '/categories', icon: Grid2X2, label: 'ক্যাটাগরি' },
  { href: '/account/wishlist', icon: Heart, label: 'উইশলিস্ট' },
  { href: '/account', icon: User, label: 'অ্যাকাউন্ট' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 flex-1 py-2 transition-colors',
                isActive ? 'text-brand-700' : 'text-gray-500 hover:text-brand-600',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
