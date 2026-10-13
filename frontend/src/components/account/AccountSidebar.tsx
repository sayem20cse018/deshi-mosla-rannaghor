'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Star,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/account', icon: LayoutDashboard, label: 'ড্যাশবোর্ড' },
  { href: '/account/profile', icon: User, label: 'আমার প্রোফাইল' },
  { href: '/account/orders', icon: ShoppingBag, label: 'আমার অর্ডার' },
  { href: '/account/wishlist', icon: Heart, label: 'উইশলিস্ট' },
  { href: '/account/addresses', icon: MapPin, label: 'সংরক্ষিত ঠিকানা' },
  { href: '/account/payment-history', icon: CreditCard, label: 'পেমেন্ট ইতিহাস' },
  { href: '/account/reviews', icon: Star, label: 'আমার রিভিউ' },
  { href: '/account/coupons', icon: Tag, label: 'আমার কুপন' },
  { href: '/account/settings', icon: Settings, label: 'অ্যাকাউন্ট সেটিংস' },
];

interface AccountSidebarProps {
  onClose?: () => void;
}

export function AccountSidebar({ onClose }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    await logout();
    toast.success('লগআউট হয়েছে');
    router.push('/');
    onClose?.();
  }

  return (
    <nav className="flex flex-col h-full">
      {/* User card */}
      <div className="p-4 bg-gradient-to-br from-brand-700 to-brand-800 text-white rounded-2xl mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={44}
                height={44}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">{user?.name?.charAt(0) ?? 'গ'}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight truncate">{user?.name ?? '—'}</p>
            <p className="text-brand-200 text-xs truncate">{user?.email ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex-1 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = href === '/account' ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-brand-700',
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0',
                  active ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500',
                )}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-brand-400" />}
            </Link>
          );
        })}
      </div>

      {/* Logout */}
      <div className="pt-3 mt-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          লগআউট
        </button>
      </div>
    </nav>
  );
}
