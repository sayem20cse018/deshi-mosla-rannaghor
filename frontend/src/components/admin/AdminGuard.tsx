'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetchUser().then(() => setChecked(true));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!checked) return; // wait until fetchUser completes

    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (user && user.role === 'CUSTOMER') {
      router.replace('/');
    }
  }, [checked, isAuthenticated, user, router]);

  // Show loader while checking auth
  if (!checked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020817' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role === 'CUSTOMER')) return null;

  return <>{children}</>;
}
