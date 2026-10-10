import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface CartStore {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  setCart: (cart: Cart) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      isLoading: false,

      setCart: (cart) => set({ cart }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const res = await api.get('/cart');
          set({ cart: res.data.data });
        } catch {
          // user might not be logged in
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (productId, quantity = 1) => {
        try {
          await api.post('/cart/add', { productId, quantity });
          await get().fetchCart();
          toast.success('কার্টে পণ্য যোগ হয়েছে');
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'কার্টে যোগ করা যায়নি');
        }
      },

      updateItem: async (productId, quantity) => {
        try {
          await api.patch(`/cart/item/${productId}`, { quantity });
          await get().fetchCart();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'আপডেট করা যায়নি');
        }
      },

      removeItem: async (productId) => {
        try {
          await api.delete(`/cart/item/${productId}`);
          await get().fetchCart();
          toast.success('কার্ট থেকে পণ্য সরানো হয়েছে');
        } catch {
          toast.error('পণ্য সরানো যায়নি');
        }
      },

      clearCart: async () => {
        try {
          await api.delete('/cart/clear');
          set({ cart: null });
        } catch {
          toast.error('Cart পরিষ্কার করা যায়নি');
        }
      },

      getItemCount: () => get().cart?.itemCount ?? 0,
      getTotal: () => get().cart?.total ?? 0,
    }),
    {
      name: 'dmr-cart',
      partialize: (state) => ({ cart: state.cart }),
    },
  ),
);
