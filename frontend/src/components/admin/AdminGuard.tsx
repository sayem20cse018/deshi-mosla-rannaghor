'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router  = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();
  const [ready, setReady] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const token = Cookies.get('access_token');

    if (!token) {
      // No token -- go to login immediately
      router.replace('/login?redirect=/admin');
      return;
    }

    // Token exists -- fetch user to confirm role
    fetchUser().finally(() => setReady(true));
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated) {
      router.replace('/login?redirect=/admin');
      return;
    }
    if (user && user.role === 'CUSTOMER') {
      router.replace('/');
    }
  }, [ready, isAuthenticated, user, router]);

  // Loading
  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#020817' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authorised
  if (!isAuthenticated || (user && user.role === 'CUSTOMER')) return null;

  return <>{children}</>;
}
