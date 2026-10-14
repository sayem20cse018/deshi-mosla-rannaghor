'use client';

import { create } from 'zustand';
import api from '@/lib/api';

export interface WishlistItem {
  id:              string;
  productId:       string;
  name:            string;
  slug:            string;
  price:           number;
  discountPrice:   number | null;
  discountPercent: number | null;
  weight:          string | null;
  stockStatus:     'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isActive:        boolean;
  primaryImage:    string | null;
  addedAt:         string;
}

interface WishlistState {
  items:     WishlistItem[];
  loading:   boolean;
  fetched:   boolean;

  // Actions
  fetchWishlist:      ()                       => Promise<void>;
  addToWishlist:      (productId: string)      => Promise<void>;
  removeFromWishlist: (productId: string)      => Promise<void>;
  clearWishlist:      ()                       => Promise<void>;
  isWishlisted:       (productId: string)      => boolean;
  reset:              ()                       => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items:   [],
  loading: false,
  fetched: false,

  // ── Fetch wishlist from server ────────────────────────
  fetchWishlist: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await api.get('/users/me/wishlist');
      set({ items: res.data.data ?? [], fetched: true });
    } catch {
      // Not logged in or network error — stay silent
      set({ fetched: true });
    } finally {
      set({ loading: false });
    }
  },

  // ── Add ───────────────────────────────────────────────
  addToWishlist: async (productId: string) => {
    // Optimistic: no local update, just call API then refresh
    await api.post(`/users/me/wishlist/${productId}`);
    // Refresh items
    const res = await api.get('/users/me/wishlist');
    set({ items: res.data.data ?? [] });
  },

  // ── Remove ────────────────────────────────────────────
  removeFromWishlist: async (productId: string) => {
    // Optimistic local update first
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }));
    await api.delete(`/users/me/wishlist/${productId}`);
  },

  // ── Clear ─────────────────────────────────────────────
  clearWishlist: async () => {
    set({ items: [] });
    await api.delete('/users/me/wishlist');
  },

  // ── Check ─────────────────────────────────────────────
  isWishlisted: (productId: string) =>
    get().items.some((i) => i.productId === productId),

  // ── Reset (on logout) ─────────────────────────────────
  reset: () => set({ items: [], fetched: false, loading: false }),
}));
