'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  const { fetchUser, isAuthenticated } = useAuthStore();
  const { fetchFromServer, syncToServer, items } = useCartStore();
  const { fetchWishlist, reset: resetWishlist } = useWishlistStore();

  // Rehydrate user on first mount
  useEffect(() => {
    fetchUser();
  }, []); // eslint-disable-line

  // When authentication changes → sync cart + wishlist
  const prevAuth = useRef<boolean | null>(null);
  useEffect(() => {
    if (prevAuth.current === null) {
      prevAuth.current = isAuthenticated;
      if (isAuthenticated) {
        fetchFromServer();
        fetchWishlist();
      }
      return;
    }
    if (isAuthenticated && prevAuth.current === false) {
      // Just logged in: push guest items then pull merged cart + wishlist
      (async () => {
        if (items.length > 0) await syncToServer();
        await fetchFromServer();
        await fetchWishlist();
      })();
    } else if (!isAuthenticated && prevAuth.current === true) {
      // Just logged out: clear wishlist
      resetWishlist();
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated]); // eslint-disable-line

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
