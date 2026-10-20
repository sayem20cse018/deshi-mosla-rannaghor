'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, AtSign, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import Cookies from 'js-cookie';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated, user } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState('');

  // If already authenticated as admin, redirect immediately
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'CUSTOMER') {
      router.replace('/admin');
    }
  }, [isAuthenticated, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) { setError('Email or phone number is required.'); return; }
    if (!password)           { setError('Password is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    try {
      await login(identifier.trim(), password);

      // Read fresh state after login
      const state = useAuthStore.getState();

      if (!state.user) {
        setError('Authentication failed. Please try again.');
        return;
      }

      if (state.user.role === 'CUSTOMER') {
        setError('Access denied. This portal is for admin users only.');
        await state.logout();
        return;
      }

      // Success -- admin or super_admin
      router.replace('/admin');
    } catch (err: any) {
      const status = err.response?.status;
      const msg    = err.response?.data?.message;

      if (status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (status === 403) {
        setError('Your account does not have admin access.');
      } else if (status === 0 || !err.response) {
        setError('Cannot reach server. Check your internet connection.');
      } else {
        setError(msg || 'Sign in failed. Please try again.');
      }
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: '#f8fafc' }}
    >
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />

      <div className="relative w-full max-w-[420px]">

        {/* Brand header */}
        <div className="text-center mb-8">
          {/* Logo icon */}
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#0f4c2a 0%,#1a6b3c 100%)', boxShadow: '0 8px 24px rgba(15,76,42,0.25)' }}
          >
            <span className="text-white font-black text-xl" style={{ fontFamily: 'Noto Sans Bengali,sans-serif' }}>D</span>
          </div>
          <h1 className="text-[13px] font-black text-gray-500 uppercase tracking-[0.18em]" style={{ fontFamily: 'Manrope,sans-serif' }}>
            DESHI MOSLAR RANNAGHAR
          </h1>
          <p className="text-[11px] text-gray-400 mt-1 tracking-wider uppercase" style={{ fontFamily: 'Manrope,sans-serif' }}>
            Admin Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#ea580c,#c2410c)' }} />

          <div className="px-8 py-8">

            {/* Heading */}
            <div className="flex items-center gap-3 mb-7">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#fff7ed' }}
              >
                <ShieldCheck className="w-4.5 h-4.5" style={{ color: '#ea580c' }} />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900" style={{ fontFamily: 'Manrope,sans-serif' }}>Sign in to Admin</h2>
                <p className="text-[12px] text-gray-400">Authorised personnel only</p>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Email / Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: 'Manrope,sans-serif' }}>
                  Email or Phone
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => { setIdentifier(e.target.value); setError(''); }}
                    placeholder="admin@example.com"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all"
                    autoComplete="username"
                    inputMode="email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5" style={{ fontFamily: 'Manrope,sans-serif' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter your password"
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white transition-all"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: isLoading ? '#c2410c' : 'linear-gradient(135deg,#ea580c 0%,#c2410c 100%)',
                  boxShadow: isLoading ? 'none' : '0 4px 16px rgba(234,88,12,0.30)',
                  fontFamily: 'Manrope,sans-serif',
                }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 mt-6" style={{ fontFamily: 'Manrope,sans-serif' }}>
          Deshi Moslar Rannaghar &copy; 2025 &bull; Admin Portal
        </p>
      </div>
    </div>
  );
}
