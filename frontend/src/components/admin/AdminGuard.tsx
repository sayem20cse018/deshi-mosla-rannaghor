'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, fetchUser } = useAuthStore();

  // ready = true only after token has been verified against the backend
  const [ready, setReady] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const token = Cookies.get('access_token');

    if (!token) {
      // No cookie — ensure state is clean and redirect to login
      useAuthStore.setState({ user: null, isAuthenticated: false });
      if (typeof window !== 'undefined') {
        try { localStorage.removeItem('dmr-auth'); } catch {}
      }
      router.replace('/admin/login');
      return;
    }

    // Cookie exists — verify it with the backend before allowing access.
    // fetchUser() calls GET /auth/me. If the token is valid it sets
    // isAuthenticated:true, otherwise it clears the cookie and sets false.
    fetchUser().finally(() => setReady(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated) {
      router.replace('/admin/login');
      return;
    }

    if (user && user.role === 'CUSTOMER') {
      router.replace('/');
    }
  }, [ready, isAuthenticated, user, router]);

  // Always show spinner until backend verification completes.
  // This prevents a flash of admin UI before auth is confirmed.
  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f172a' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-slate-400 text-sm font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Do not render admin UI if verification failed
  if (!isAuthenticated || (user && user.role === 'CUSTOMER')) {
    return null;
  }

  return <>{children}</>;
}
