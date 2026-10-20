'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { fetchFromServer } = useCartStore();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [error,      setError]      = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) { setError('Enter email or phone'); return; }
    if (!password)           { setError('Enter password'); return; }

    try {
      await login(identifier.trim(), password);
      const { user } = useAuthStore.getState();

      if (!user || user.role === 'CUSTOMER') {
        setError('Access denied. Admin account required.');
        await useAuthStore.getState().logout();
        return;
      }

      toast.success('Welcome, ' + user.name + '!');
      router.replace('/admin');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Check credentials.';
      setError(msg);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ea580c, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #ea580c, transparent)' }} />
      </div>

      <div className="relative w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Deshi Moslar Rannaghar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Orange top bar */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#ea580c,#c2410c)' }} />

          <div className="p-7">
            <h2 className="text-lg font-black text-gray-900 mb-1">Sign in</h2>
            <p className="text-gray-400 text-sm mb-6">Admin accounts only</p>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="text-base flex-shrink-0">&#9888;</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Email or phone number"
                  className="w-full border border-gray-200 rounded-xl bg-gray-50 pl-10 pr-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  autoComplete="username"
                  inputMode="email"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full border border-gray-200 rounded-xl bg-gray-50 pl-10 pr-11 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: 'linear-gradient(135deg,#ea580c,#c2410c)',
                  boxShadow: '0 4px 16px rgba(234,88,12,0.35)',
                }}
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                ) : (
                  <>Sign in to Admin Panel</>
                )}
              </button>
            </form>

            {/* Admin credentials hint */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Default Admin</p>
              <div className="space-y-1 text-xs text-gray-500" style={{ fontFamily: 'Manrope,sans-serif' }}>
                <p>admin@deshimoslar.com</p>
                <p className="text-gray-400">Password set during setup</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Deshi Moslar Rannaghar &copy; 2025
        </p>
      </div>
    </div>
  );
}
