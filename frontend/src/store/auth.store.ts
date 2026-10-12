'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string | null;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Core auth
  login:    (identifier: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
  fetchUser: () => Promise<void>;

  // Password reset flow
  forgotPassword:  (identifier: string) => Promise<{ dev_otp?: string }>;
  verifyOtp:       (identifier: string, otp: string) => Promise<void>;
  resetPassword:   (identifier: string, otp: string, newPassword: string) => Promise<void>;

  // Profile
  updateProfile:   (data: Partial<{ name: string; gender: string; dateOfBirth: string; avatar: string }>) => Promise<void>;
  changePassword:  (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // ── Login ─────────────────────────────────────────
      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/login', { identifier, password });
          const { user, access_token } = res.data.data;
          Cookies.set('access_token', access_token, {
            expires: 7,
            sameSite: 'lax',
            secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
          });
          set({ user, isAuthenticated: true });
          // cart sync happens in providers.tsx via useEffect on isAuthenticated
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Register ──────────────────────────────────────
      register: async (name, email, phone, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post('/auth/register', { name, email, phone, password });
          const { user, access_token } = res.data.data;
          Cookies.set('access_token', access_token, {
            expires: 7,
            sameSite: 'lax',
            secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
          });
          set({ user, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      // ── Logout ────────────────────────────────────────
      logout: async () => {
        try { await api.post('/auth/logout'); } catch { /* silent */ }
        Cookies.remove('access_token');
        set({ user: null, isAuthenticated: false });
      },

      // ── Fetch current user ────────────────────────────
      fetchUser: async () => {
        const token = Cookies.get('access_token');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data, isAuthenticated: true });
        } catch {
          Cookies.remove('access_token');
          set({ user: null, isAuthenticated: false });
        }
      },

      // ── Forgot password ───────────────────────────────
      forgotPassword: async (identifier) => {
        const res = await api.post('/auth/forgot-password', { identifier });
        return res.data; // may contain dev_otp
      },

      // ── Verify OTP ────────────────────────────────────
      verifyOtp: async (identifier, otp) => {
        await api.post('/auth/verify-otp', { identifier, otp });
      },

      // ── Reset password ────────────────────────────────
      resetPassword: async (identifier, otp, newPassword) => {
        await api.post('/auth/reset-password', { identifier, otp, newPassword });
      },

      // ── Update profile ────────────────────────────────
      updateProfile: async (data) => {
        const res = await api.put('/users/me', data);
        set((s) => ({ user: s.user ? { ...s.user, ...res.data.data } : s.user }));
      },

      // ── Change password ───────────────────────────────
      changePassword: async (currentPassword, newPassword) => {
        await api.post('/users/me/change-password', { currentPassword, newPassword });
      },
    }),
    {
      name: 'dmr-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);
