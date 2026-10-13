'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────

export interface GuestCartItem {
  id: string; // local uuid
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    discountPercent: number | null;
    weight: string | null;
    stockStatus: string;
    primaryImage: string | null;
    availableStock: number;
  };
}

export interface CouponResult {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  discountAmount: number; // calculated
}

export interface CartTotals {
  subtotal: number;
  itemDiscount: number; // sum of all item-level discounts
  couponDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  isFreeDelivery: boolean;
  itemCount: number;
}

export interface CartStore {
  // State
  items: GuestCartItem[];
  isOpen: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  appliedCoupon: CouponResult | null;
  couponError: string | null;

  // Drawer
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Item CRUD
  addItem: (product: GuestCartItem['product'], quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;

  // Coupon
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;

  // Computed
  getTotals: () => CartTotals;
  getItemCount: () => number;
  getTotal: () => number;

  // Server sync
  syncToServer: () => Promise<void>;
  fetchFromServer: () => Promise<void>;
}

// ── Delivery charge logic (matches backend seed) ──────────
const FREE_DELIVERY_THRESHOLD = 1000;
const DEFAULT_DELIVERY_CHARGE = 60;

function calcDelivery(
  subtotal: number,
  coupon: CouponResult | null,
): {
  charge: number;
  isFree: boolean;
} {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return { charge: 0, isFree: true };
  if (coupon?.discountType === 'FREE_DELIVERY') return { charge: 0, isFree: true };
  return { charge: DEFAULT_DELIVERY_CHARGE, isFree: false };
}

function calcTotals(items: GuestCartItem[], coupon: CouponResult | null): CartTotals {
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  let subtotal = 0;
  let itemDiscount = 0;

  for (const item of items) {
    const original = item.product.price * item.quantity;
    const effective = (item.product.discountPrice ?? item.product.price) * item.quantity;
    subtotal += effective;
    itemDiscount += original - effective;
  }

  // Coupon discount
  let couponDiscount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENTAGE') {
      couponDiscount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
    } else if (coupon.discountType === 'FIXED_AMOUNT') {
      couponDiscount = Math.min(coupon.discountValue, subtotal);
    }
  }

  const afterCoupon = subtotal - couponDiscount;
  const { charge: deliveryCharge, isFree: isFreeDelivery } = calcDelivery(afterCoupon, coupon);
  const grandTotal = afterCoupon + deliveryCharge;

  return {
    subtotal,
    itemDiscount,
    couponDiscount,
    deliveryCharge,
    grandTotal,
    isFreeDelivery,
    itemCount,
  };
}

// ── Store ─────────────────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,
      isSyncing: false,
      appliedCoupon: null,
      couponError: null,

      // ── Drawer ─────────────────────────────────────────
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // ── Add item ───────────────────────────────────────
      addItem: async (product, quantity = 1) => {
        const { items } = get();
        const existing = items.find((i) => i.productId === product.id);

        if (existing) {
          const newQty = existing.quantity + quantity;
          set({
            items: items.map((i) => (i.productId === product.id ? { ...i, quantity: newQty } : i)),
          });
        } else {
          const newItem: GuestCartItem = {
            id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            productId: product.id,
            quantity,
            product,
          };
          set({ items: [...items, newItem] });
        }

        toast.success('কার্টে পণ্য যোগ হয়েছে', {
          style: { background: '#166534', color: '#fff' },
        });

        // Sync to server if authenticated
        const token = Cookies.get('access_token');
        if (token) {
          get().syncToServer();
        }
      },

      // ── Update quantity ────────────────────────────────
      updateItem: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        }));

        const token = Cookies.get('access_token');
        if (token) {
          api.patch(`/cart/item/${productId}`, { quantity }).catch(() => {});
        }
      },

      // ── Remove item ────────────────────────────────────
      removeItem: (productId) => {
        set((s) => ({
          items: s.items.filter((i) => i.productId !== productId),
        }));
        toast.success('পণ্য সরানো হয়েছে');

        const token = Cookies.get('access_token');
        if (token) {
          api.delete(`/cart/item/${productId}`).catch(() => {});
        }
      },

      // ── Clear cart ─────────────────────────────────────
      clearCart: () => {
        set({ items: [], appliedCoupon: null, couponError: null });
        const token = Cookies.get('access_token');
        if (token) {
          api.delete('/cart/clear').catch(() => {});
        }
      },

      // ── Apply coupon ───────────────────────────────────
      applyCoupon: async (code: string) => {
        if (!code.trim()) {
          set({ couponError: 'কুপন কোড দিন' });
          return;
        }
        set({ isLoading: true, couponError: null });
        try {
          const { subtotal } = get().getTotals();
          const res = await api.post('/coupons/validate', {
            code: code.trim().toUpperCase(),
            orderAmount: subtotal,
          });
          const couponData = res.data.data as CouponResult;

          // Recalculate discount amount
          let discountAmount = 0;
          if (couponData.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * couponData.discountValue) / 100;
            if (couponData.maxDiscount)
              discountAmount = Math.min(discountAmount, couponData.maxDiscount);
          } else if (couponData.discountType === 'FIXED_AMOUNT') {
            discountAmount = Math.min(couponData.discountValue, subtotal);
          } else if (couponData.discountType === 'FREE_DELIVERY') {
            discountAmount = DEFAULT_DELIVERY_CHARGE;
          }

          set({
            appliedCoupon: { ...couponData, discountAmount },
            couponError: null,
          });
          toast.success(`কুপন "${code.toUpperCase()}" প্রয়োগ হয়েছে!`);
        } catch (err: any) {
          const msg = err.response?.data?.message || 'অবৈধ কুপন কোড';
          set({ couponError: msg, appliedCoupon: null });
          toast.error(msg);
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Remove coupon ──────────────────────────────────
      removeCoupon: () => {
        set({ appliedCoupon: null, couponError: null });
        toast.success('কুপন সরানো হয়েছে');
      },

      // ── Computed ───────────────────────────────────────
      getTotals: () => calcTotals(get().items, get().appliedCoupon),
      getItemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
      getTotal: () => calcTotals(get().items, get().appliedCoupon).subtotal,

      // ── Sync guest cart → server ───────────────────────
      syncToServer: async () => {
        const { items, isSyncing } = get();
        if (isSyncing || !items.length) return;
        set({ isSyncing: true });
        try {
          for (const item of items) {
            await api
              .post('/cart/add', { productId: item.productId, quantity: item.quantity })
              .catch(() => {});
          }
        } finally {
          set({ isSyncing: false });
        }
      },

      // ── Fetch cart from server (on login) ─────────────
      fetchFromServer: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get('/cart');
          const serverCart = res.data.data;
          if (serverCart?.items?.length) {
            // Merge server items into local store
            const serverItems: GuestCartItem[] = serverCart.items.map((si: any) => ({
              id: si.id,
              productId: si.productId,
              quantity: si.quantity,
              product: {
                id: si.product.id,
                name: si.product.name,
                slug: si.product.slug,
                price: Number(si.product.price),
                discountPrice: si.product.discountPrice ? Number(si.product.discountPrice) : null,
                discountPercent: si.product.discountPercent ?? null,
                weight: si.product.weight ?? null,
                stockStatus: si.product.stockStatus,
                primaryImage: si.product.images?.[0]?.url ?? null,
                availableStock: si.product.inventory?.availableStock ?? 99,
              },
            }));
            set({ items: serverItems });
          }
        } catch {
          // not authenticated — keep local cart
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'dmr-cart-v2',
      partialize: (s) => ({
        items: s.items,
        appliedCoupon: s.appliedCoupon,
      }),
    },
  ),
);
