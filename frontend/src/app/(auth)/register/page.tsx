'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, UserPlus, Loader2, Check, X,
  ArrowRight, Lock, Mail, Phone,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const G  = '#ea580c';
const G2 = '#c2410c';
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '৮+ অক্ষর',    ok: password.length >= 8 },
    { label: 'সংখ্যা',       ok: /\d/.test(password) },
    { label: 'বড় হাত',      ok: /[A-Z]/.test(password) },
    { label: 'ছোট হাত',     ok: /[a-z]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const bar = score <= 1 ? 'bg-red-400' : score === 2 ? 'bg-amber-400' : score === 3 ? 'bg-yellow-400' : 'bg-[#ea580c]';
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i <= score ? bar : 'bg-gray-200')} />)}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map(({ label, ok }) => (
          <span key={label} className={cn('flex items-center gap-1 text-[11px]', ok ? 'text-[#ea580c]' : 'text-gray-400')}
                style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
            {ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading }                              = useAuthStore();
  const { syncToServer, fetchFromServer, items: guestItems } = useCartStore();

  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

  function set_(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'নাম কমপক্ষে ২ অক্ষর';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'সঠিক ইমেইল দিন';
    if (!BD_PHONE.test(form.phone.trim())) e.phone = 'সঠিক ফোন নম্বর দিন';
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
      const hadGuest = guestItems.length > 0;
      await register(form.name.trim(), form.email.trim(), form.phone.trim(), form.password);
      if (hadGuest) await syncToServer();
      await fetchFromServer();
      toast.success('নিবন্ধন সফল! স্বাগতম।');
      router.push('/account');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'নিবন্ধন ব্যর্থ হয়েছে';
      setErrors({ form: msg });
      toast.error(msg);
    }
  }

  const inp = (field: string) => cn(
    'w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400',
    'transition-all duration-150 focus:outline-none focus:ring-2',
    errors[field]
      ? 'border-red-300 focus:ring-red-100'
      : 'border-gray-200 focus:ring-[#ea580c]/15 focus:border-[#ea580c]',
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10"
         style={{ background: '#f3f4f6', fontFamily: 'Noto Sans Bengali, Manrope, sans-serif' }}>
      <div className="w-full" style={{ maxWidth: '400px' }}>

        {/* Logo */}
        <div className="text-center mb-7">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
                 style={{ background: `linear-gradient(135deg,${G},${G2})` }}>
              <span className="text-white font-black text-base" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দম</span>
            </div>
            <div className="text-left">
              <p className="font-black text-base leading-tight" style={{ color: G, fontFamily: 'Noto Sans Bengali, sans-serif' }}>দেশি মসলার রান্নাঘর</p>
              <p className="text-[10px] font-semibold tracking-[0.14em] uppercase" style={{ color: '#ea580c', fontFamily: 'Manrope, sans-serif' }}>Deshi Moslar Rannaghar</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>

          {/* Tab toggle */}
          <div className="flex p-2 gap-1.5" style={{ background: '#f3f4f6' }}>
            <Link href="/login"
                  className="flex-1 flex items-center justify-center py-2.5 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              লগইন
            </Link>
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black text-white select-none"
                 style={{ background: `linear-gradient(135deg,${G},${G2})`, boxShadow: '0 2px 8px rgba(15,76,42,0.25)' }}>
              <UserPlus className="w-4 h-4" />
              <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>নিবন্ধন</span>
            </div>
          </div>

          <div className="px-7 pt-6 pb-7">

            {/* Heading */}
            <div className="text-center mb-5">
              <h1 className="text-[22px] font-black text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Create Account</h1>
              <p className="text-gray-400 text-sm mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>বিশেষ অফার পেতে যোগ দিন</p>
            </div>

            {errors.form && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                   style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                <span>⚠️</span> {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3">

              {/* Name */}
              <div>
                <input type="text" value={form.name} onChange={set_('name')}
                  placeholder="পূর্ণ নাম" className={inp('name')}
                  autoComplete="name" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }} />
                {errors.name && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={form.email} onChange={set_('email')}
                    placeholder="ইমেইল ঠিকানা" className={cn(inp('email'), 'pl-10')}
                    autoComplete="email" inputMode="email" style={{ fontFamily: 'Manrope, sans-serif' }} />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={set_('phone')}
                    placeholder="মোবাইল নম্বর" className={cn(inp('phone'), 'pl-10')}
                    autoComplete="tel" inputMode="tel" style={{ fontFamily: 'Manrope, sans-serif' }} />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set_('password')}
                    placeholder="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)" className={cn(inp('password'), 'pl-10 pr-11')}
                    autoComplete="new-password" style={{ fontFamily: 'Manrope, sans-serif' }} />
                  <button type="button" onClick={() => setShowPw(s => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.password}</p>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showCf ? 'text' : 'password'} value={form.confirm} onChange={set_('confirm')}
                    placeholder="পাসওয়ার্ড নিশ্চিত করুন" className={cn(inp('confirm'), 'pl-10 pr-11')}
                    autoComplete="new-password" style={{ fontFamily: 'Manrope, sans-serif' }} />
                  <button type="button" onClick={() => setShowCf(s => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirm && form.password === form.confirm && (
                  <p className="text-[#ea580c] text-xs mt-1 flex items-center gap-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    <Check className="w-3 h-3" /> পাসওয়ার্ড মিলেছে
                  </p>
                )}
                {errors.confirm && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.confirm}</p>}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 accent-[#ea580c] flex-shrink-0" />
                <span className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  আমি{' '}
                  <Link href="/terms" className="font-bold hover:underline" style={{ color: G }}>শর্তাবলী</Link>
                  {' ও '}
                  <Link href="/privacy-policy" className="font-bold hover:underline" style={{ color: G }}>গোপনীয়তা নীতি</Link>
                  {' '}সম্মত আছি
                </span>
              </label>
              {errors.agreed && <p className="text-red-500 text-xs" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.agreed}</p>}

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 text-sm mt-1"
                style={{ background: `linear-gradient(135deg,${G},${G2})`, boxShadow: '0 4px 16px rgba(15,76,42,0.3)', fontFamily: 'Manrope, sans-serif' }}>
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> নিবন্ধন হচ্ছে...</>
                  : <>Create Account <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* Bottom CTA */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>Already have an account?</span>
              <Link href="/login" className="flex items-center gap-1 text-xs font-black hover:underline" style={{ color: G, fontFamily: 'Manrope, sans-serif' }}>
                Sign In <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
            ← হোম পেজে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
