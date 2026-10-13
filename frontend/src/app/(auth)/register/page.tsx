'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, Loader2, Check, X } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'ন্যূনতম ৮ অক্ষর', ok: password.length >= 8 },
    { label: 'সংখ্যা আছে', ok: /\d/.test(password) },
    { label: 'বড় হাতের অক্ষর', ok: /[A-Z]/.test(password) },
    { label: 'ছোট হাতের অক্ষর', ok: /[a-z]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const color =
    score <= 1
      ? 'bg-red-400'
      : score === 2
        ? 'bg-amber-400'
        : score === 3
          ? 'bg-yellow-400'
          : 'bg-brand-500';
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all',
              i <= score ? color : 'bg-gray-200',
            )}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map(({ label, ok }) => (
          <span
            key={label}
            className={cn(
              'flex items-center gap-1 text-[11px]',
              ok ? 'text-brand-600' : 'text-gray-400',
            )}
          >
            {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const { syncToServer, fetchFromServer, items: guestItems } = useCartStore();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  function set_(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'নাম কমপক্ষে ২ অক্ষর';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'সঠিক ইমেইল দিন';
    if (!BD_PHONE.test(form.phone.trim()))
      e.phone = 'সঠিক বাংলাদেশি ফোন নম্বর দিন (যেমন: 01700000000)';
    if (form.password.length < 8) e.password = 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর';
    if (form.password !== form.confirm) e.confirm = 'পাসওয়ার্ড মিলছে না';
    if (!agreed) e.agreed = 'শর্তাবলীতে সম্মত হন';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    try {
      const hadGuestItems = guestItems.length > 0;
      await register(form.name.trim(), form.email.trim(), form.phone.trim(), form.password);
      if (hadGuestItems) await syncToServer();
      await fetchFromServer();
      toast.success('নিবন্ধন সফল হয়েছে! স্বাগতম।');
      router.push('/account');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'নিবন্ধন ব্যর্থ হয়েছে';
      setErrors({ form: msg });
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50 flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">দম</span>
            </div>
            <div className="text-left">
              <p className="text-brand-800 font-bold text-sm leading-tight">দেশি মসলার রান্নাঘর</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-5 mb-1">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="text-gray-500 text-sm">বিশেষ অফার ও সহজ কেনাকাটার জন্য</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
          {errors.form && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span> {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                পূর্ণ নাম *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set_('name')}
                placeholder="রহিম উদ্দিন"
                className={cn('input-base', errors.name && 'border-red-400')}
                autoComplete="name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ইমেইল ঠিকানা *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set_('email')}
                placeholder="rahim@example.com"
                className={cn('input-base', errors.email && 'border-red-400')}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                ফোন নম্বর *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={set_('phone')}
                placeholder="01700000000"
                className={cn('input-base', errors.phone && 'border-red-400')}
                autoComplete="tel"
                inputMode="tel"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড *
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set_('password')}
                  placeholder="কমপক্ষে ৮ অক্ষর"
                  className={cn('input-base pr-10', errors.password && 'border-red-400')}
                  autoComplete="new-password"
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
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                পাসওয়ার্ড নিশ্চিত করুন *
              </label>
              <div className="relative">
                <input
                  type={showCf ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={set_('confirm')}
                  placeholder="পাসওয়ার্ড আবার দিন"
                  className={cn('input-base pr-10', errors.confirm && 'border-red-400')}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCf((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-600 focus:ring-brand-500 flex-shrink-0"
              />
              <span className="text-xs text-gray-600 leading-relaxed">
                আমি{' '}
                <Link href="/terms" className="text-brand-600 hover:underline">
                  শর্তাবলী
                </Link>{' '}
                এবং{' '}
                <Link href="/privacy-policy" className="text-brand-600 hover:underline">
                  গোপনীয়তা নীতি
                </Link>{' '}
                পড়েছি এবং সম্মত আছি
              </span>
            </label>
            {errors.agreed && <p className="text-red-500 text-xs -mt-2">{errors.agreed}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-brand-700/20 text-base mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> নিবন্ধন হচ্ছে...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> নিবন্ধন করুন
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-5">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link
            href="/login"
            className="text-brand-700 font-semibold hover:text-brand-800 underline underline-offset-2"
          >
            লগইন করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
