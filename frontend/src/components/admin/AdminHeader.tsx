'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, ChevronRight, LogOut, User, Settings, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useAdminStore } from '@/store/admin.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

function useBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  return [
    { label: 'Admin', href: '/admin' },
    ...parts.map((part, i) => ({
      label: part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      href: '/admin/' + parts.slice(0, i + 1).join('/'),
    })),
  ];
}

export function AdminHeader() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useAdminStore();
  const router = useRouter();
  const crumbs = useBreadcrumbs();

  async function handleLogout() {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  }

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-5 flex-shrink-0 shadow-sm z-30">
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm flex-1 min-w-0 overflow-hidden">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
            {i === crumbs.length - 1 ? (
              <span className="text-gray-900 font-bold truncate">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Search className="w-4 h-4" />
        </button>

        <Link href="/" target="_blank"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-colors">
          View Site <ExternalLink className="w-3 h-3" />
        </Link>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="relative group">
          <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-black">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-gray-900 leading-tight">{user?.name ?? 'Admin'}</p>
              <p className="text-[10px] text-gray-400 leading-tight uppercase tracking-wide">{user?.role ?? 'ADMIN'}</p>
            </div>
          </button>

          <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
            <Link href="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <User className="w-4 h-4 text-gray-400" /> My Profile
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings className="w-4 h-4 text-gray-400" /> Settings
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
