import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import api from '@/lib/api';
import Cookies from 'js-cookie';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { identifier, password });
          const { user, access_token } = res.data.data;
          Cookies.set('access_token', access_token, { expires: 7, secure: true, sameSite: 'lax' });
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, phone, password });
          const { user, access_token } = res.data.data;
          Cookies.set('access_token', access_token, { expires: 7, secure: true, sameSite: 'lax' });
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch { /* silent */ }
        Cookies.remove('access_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'dmr-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
