'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, UserPlus, Loader2, Check, X,
  ShieldCheck, Truck, Star, Gift,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'ন্যূনতম ৮ অক্ষর',    ok: password.length >= 8 },
    { label: 'সংখ্যা আছে',           ok: /\d/.test(password) },
    { label: 'বড় হাতের অক্ষর',       ok: /[A-Z]/.test(password) },
    { label: 'ছোট হাতের অক্ষর',      ok: /[a-z]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const barColor =
    score <= 1 ? 'bg-red-400' :
    score === 2 ? 'bg-amber-400' :
    score === 3 ? 'bg-yellow-400' :
    'bg-[#ea580c]';

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={cn('h-1 flex-1 rounded-full transition-all', i <= score ? barColor : 'bg-gray-200')} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {checks.map(({ label, ok }) => (
          <span key={label} className={cn('flex items-center gap-1 text-[11px]', ok ? 'text-[#c2410c]' : 'text-gray-400')}
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
  const { register, isLoading } = useAuthStore();
  const { syncToServer, fetchFromServer, items: guestItems } = useCartStore();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [agreed, setAgreed]   = useState(false);

  function set_(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'নাম কমপক্ষে ২ অক্ষর';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'সঠিক ইমেইল দিন';
    if (!BD_PHONE.test(form.phone.trim())) e.phone = 'সঠিক বাংলাদেশি ফোন নম্বর দিন';
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

  const inputCls = (field: string) => cn(
    'w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:bg-white',
    errors[field]
      ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
      : 'border-gray-200 focus:ring-[#ea580c]/10 focus:border-[#ea580c]',
  );

  return (
    <div className="min-h-screen flex">

      {/* ══ LEFT PANEL ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden flex-col justify-between"
           style={{ background: 'linear-gradient(145deg, #7c1d06 0%, #c2410c 50%, #ea580c 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #fff7ed, transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
             style={{ background: 'radial-gradient(circle, #fed7aa, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
             style={{ background: 'radial-gradient(circle, #ffffff, transparent)' }} />

        {/* Top — Logo */}
        <div className="relative z-10 p-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-black text-base" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দম</span>
            </div>
            <div>
              <p className="text-white font-black text-base leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দেশি মসলার রান্নাঘর</p>
              <p className="text-white/50 text-[11px] font-semibold tracking-[0.15em] uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>Deshi Moslar Rannaghar</p>
            </div>
          </Link>
        </div>

        {/* Middle */}
        <div className="relative z-10 px-10 pb-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              বিনামূল্যে অ্যাকাউন্ট খুলুন
            </span>
            <h2 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-4"
                style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              আজই যোগ দিন<br />
              <span style={{ color: '#fff7ed' }}>রান্নাঘরে</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm"
               style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              বিশেষ অফার, এক্সক্লুসিভ ডিসকাউন্ট ও সহজ অর্ডারের সুবিধা পান।
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-10">
            {[
              { icon: Gift,        text: 'নতুন সদস্যদের জন্য বিশেষ ছাড়' },
              { icon: ShieldCheck, text: 'নিরাপদ কেনাকাটার নিশ্চয়তা' },
              { icon: Truck,       text: 'অর্ডার ট্র্যাকিং সুবিধা' },
              { icon: Star,        text: 'পয়েন্ট ও রিওয়ার্ড প্রোগ্রাম' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/70 text-sm" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { v: '৫০০+', l: 'পণ্য' },
              { v: '১০হা+', l: 'গ্রাহক' },
              { v: '৯৮%', l: 'সন্তুষ্ট' },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/[0.08] border border-white/10 rounded-2xl p-3 text-center">
                <p className="text-white font-black text-xl leading-none" style={{ fontFamily: 'Manrope, sans-serif' }}>{v}</p>
                <p className="text-white/50 text-[11px] mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-10 pb-8">
          <p className="text-white/25 text-xs" style={{ fontFamily: 'Manrope, sans-serif' }}>
            © 2025 দেশি মসলার রান্নাঘর
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL ════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-gray-50 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden w-full max-w-sm mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-[#ea580c] flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দম</span>
            </div>
            <div className="text-left">
              <p className="text-gray-900 font-black text-base leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দেশি মসলার রান্নাঘর</p>
              <p className="text-[#ea580c] text-xs font-semibold tracking-wider uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>Deshi Moslar Rannaghar</p>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              নতুন অ্যাকাউন্ট ✨
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              কয়েক সেকেন্ডে নিবন্ধন করুন
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

            {errors.form && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                   style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                <span className="flex-shrink-0 text-base">⚠️</span> {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>পূর্ণ নাম *</label>
                <input type="text" value={form.name} onChange={set_('name')}
                  placeholder="রহিম উদ্দিন"
                  className={inputCls('name')} autoComplete="name"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>ইমেইল *</label>
                <input type="email" value={form.email} onChange={set_('email')}
                  placeholder="rahim@example.com"
                  className={inputCls('email')} autoComplete="email" inputMode="email"
                  style={{ fontFamily: 'Manrope, sans-serif' }} />
                {errors.email && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>ফোন নম্বর *</label>
                <input type="tel" value={form.phone} onChange={set_('phone')}
                  placeholder="01700000000"
                  className={inputCls('phone')} autoComplete="tel" inputMode="tel"
                  style={{ fontFamily: 'Manrope, sans-serif' }} />
                {errors.phone && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.phone}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>পাসওয়ার্ড *</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set_('password')}
                    placeholder="কমপক্ষে ৮ অক্ষর"
                    className={cn(inputCls('password'), 'pr-11')} autoComplete="new-password"
                    style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }} />
                  <button type="button" onClick={() => setShowPw((s) => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.password}</p>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>পাসওয়ার্ড নিশ্চিত *</label>
                <div className="relative">
                  <input type={showCf ? 'text' : 'password'} value={form.confirm} onChange={set_('confirm')}
                    placeholder="পাসওয়ার্ড আবার দিন"
                    className={cn(inputCls('confirm'), 'pr-11')} autoComplete="new-password"
                    style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }} />
                  <button type="button" onClick={() => setShowCf((s) => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showCf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.confirm && form.password === form.confirm && (
                  <p className="text-[#c2410c] text-xs mt-1.5 flex items-center gap-1"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    <Check className="w-3 h-3" /> পাসওয়ার্ড মিলেছে
                  </p>
                )}
                {errors.confirm && <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.confirm}</p>}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#ea580c] focus:ring-[#ea580c]/20 flex-shrink-0 accent-[#ea580c]" />
                <span className="text-xs text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors"
                      style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  আমি{' '}
                  <Link href="/terms" className="text-[#c2410c] hover:underline font-medium">শর্তাবলী</Link>
                  {' '}এবং{' '}
                  <Link href="/privacy-policy" className="text-[#c2410c] hover:underline font-medium">গোপনীয়তা নীতি</Link>
                  {' '}পড়েছি ও সম্মত আছি
                </span>
              </label>
              {errors.agreed && <p className="text-red-500 text-xs -mt-2" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.agreed}</p>}

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] text-[15px] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                style={{
                  background: isLoading ? '#c2410c' : 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                  boxShadow: '0 6px 20px rgba(194,65,12,0.35)',
                  fontFamily: 'Noto Sans Bengali, sans-serif',
                }}>
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> নিবন্ধন হচ্ছে...</>
                ) : (
                  <><UserPlus className="w-5 h-5" /> নিবন্ধন করুন</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>ইতিমধ্যে অ্যাকাউন্ট আছে?</span>
              </div>
            </div>

            {/* Login CTA */}
            <Link href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 hover:border-[#ea580c]/20 hover:bg-[#fff7ed] text-gray-700 hover:text-[#c2410c] font-semibold text-sm transition-all duration-200 group"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              লগইন করুন
              <span className="transition-transform group-hover:translate-x-0.5 inline-block">→</span>
            </Link>
          </div>

          {/* Back to shop */}
          <div className="text-center mt-5">
            <Link href="/"
                  className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              ← হোম পেজে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
