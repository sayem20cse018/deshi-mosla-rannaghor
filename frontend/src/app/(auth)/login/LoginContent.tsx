'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, Phone, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const { login, isLoading } = useAuthStore();
  const { syncToServer, fetchFromServer, items: guestItems } = useCartStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!identifier.trim()) e.identifier = 'ইমেইল বা ফোন নম্বর দিন';
    if (!password) e.password = 'পাসওয়ার্ড দিন';
    else if (password.length < 6) e.password = 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষর';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});

    try {
      const hadGuestItems = guestItems.length > 0;
      await login(identifier.trim(), password);

      // Cart merge: sync guest → server, then fetch merged cart
      if (hadGuestItems) {
        await syncToServer();
      }
      await fetchFromServer();

      toast.success('লগইন সফল হয়েছে!');
      router.push(redirect);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে';
      setErrors({ form: msg });
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">দম</span>
            </div>
            <div className="text-left">
              <p className="text-brand-800 font-bold text-base leading-tight">দেশি মসলার</p>
              <p className="text-brand-500 text-sm">রান্নাঘর</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-1">
            আপনার অ্যাকাউন্টে লগইন করুন
          </h1>
          <p className="text-gray-500 text-sm">ইমেইল বা ফোন নম্বর দিয়ে লগইন করুন</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Global error */}
          {errors.form && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="flex-shrink-0">⚠️</span> {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Identifier */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ইমেইল বা ফোন নম্বর
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {identifier.includes('@') ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <Phone className="w-4 h-4" />
                  )}
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="rahim@example.com অথবা 01700000000"
                  className={cn(
                    'input-base pl-9',
                    errors.identifier && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                  )}
                  autoComplete="username"
                  inputMode="email"
                />
              </div>
              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">পাসওয়ার্ড</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার পাসওয়ার্ড দিন"
                  className={cn(
                    'input-base pr-10',
                    errors.password && 'border-red-400 focus:border-red-500 focus:ring-red-200',
                  )}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-brand-700/20 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> লগইন হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> লগইন করুন
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">অথবা</span>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-brand-700 mb-1.5">🧪 টেস্ট অ্যাকাউন্ট:</p>
            <p>📧 rahim@test.com&nbsp;&nbsp;&nbsp;🔑 Customer@123</p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          নতুন গ্রাহক?{' '}
          <Link
            href="/register"
            className="text-brand-700 font-semibold hover:text-brand-800 underline underline-offset-2"
          >
            নিবন্ধন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
