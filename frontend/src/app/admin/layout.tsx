'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminSidebar } from '@/components/admin/sidebar/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { useAdminStore } from '@/store/admin.store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Admin login page - standalone, no sidebar/header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Protected admin pages - wrapped with guard + sidebar + header
  return (
    <AdminGuard>
      <AdminDashboardShell>{children}</AdminDashboardShell>
    </AdminGuard>
  );
}

function AdminDashboardShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useAdminStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 h-full">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
