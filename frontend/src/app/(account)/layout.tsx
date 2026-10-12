'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { AccountSidebar } from '@/components/account/AccountSidebar';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checked, setChecked]       = useState(false);

  // Client-side auth guard
  useEffect(() => {
    // Wait briefly for store rehydration
    const timer = setTimeout(() => {
      setChecked(true);
      if (!isAuthenticated) {
        router.replace('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (!checked || (!isAuthenticated && !isLoading)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <nav className="text-xs text-gray-400 mb-1 flex items-center gap-1.5">
              <a href="/" className="hover:text-brand-600">হোম</a>
              <span>/</span>
              <span className="text-gray-600 font-medium">আমার অ্যাকাউন্ট</span>
            </nav>
            <h1 className="text-xl font-bold text-gray-900">আমার অ্যাকাউন্ট</h1>
          </div>

          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:border-brand-300 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-4 h-4" /> মেনু
          </button>
        </div>

        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <AccountSidebar />
          </aside>

          {/* Mobile sidebar drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4 overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-bold text-gray-900">অ্যাকাউন্ট মেনু</p>
                  <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <AccountSidebar onClose={() => setMobileOpen(false)} />
              </div>
            </div>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
