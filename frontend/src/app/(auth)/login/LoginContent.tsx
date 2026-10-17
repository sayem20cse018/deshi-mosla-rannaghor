'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, Phone, Mail, Loader2, ShieldCheck, Truck, Star, ChevronRight } from 'lucide-react';
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
      if (hadGuestItems) await syncToServer();
      await fetchFromServer();
      toast.success('লগইন সফল হয়েছে!');
      router.push(redirect);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'লগইন ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ ও তথ্য যাচাই করুন।';
      setErrors({ form: msg });
      toast.error(msg);
      console.error('Login error:', err.response?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ══ LEFT PANEL — Brand visual (desktop only) ══════════════ */}
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

        {/* Middle — Hero text */}
        <div className="relative z-10 px-10 pb-6">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ১০০% খাঁটি দেশীয় পণ্য
            </span>
            <h2 className="text-white font-black text-4xl xl:text-5xl leading-tight mb-4"
                style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              প্রতিটি রান্নায়<br />
              <span style={{ color: '#fff7ed' }}>আসল স্বাদ</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm"
               style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              দেশি মসলা ও গ্রোসারি পণ্য — সরাসরি আপনার দরজায়।
            </p>
          </div>

          {/* Trust points */}
          <div className="space-y-3 mb-10">
            {[
              { icon: ShieldCheck, text: '১০০% খাঁটি ও মানসম্পন্ন পণ্য' },
              { icon: Truck,       text: 'সারাদেশে দ্রুত ডেলিভারি' },
              { icon: Star,        text: '১০,০০০+ সন্তুষ্ট গ্রাহক' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-white/70 text-sm" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/[0.10] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-white/75 text-sm leading-relaxed italic"
               style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              &ldquo;মসলার গুণমান অসাধারণ। প্রতিবারই অর্ডার করি, কখনো হতাশ হইনি।&rdquo;
            </p>
            <p className="text-white/40 text-xs mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>— রহিম উদ্দিন, ঢাকা</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-10 pb-8">
          <p className="text-white/25 text-xs" style={{ fontFamily: 'Manrope, sans-serif' }}>
            © 2025 দেশি মসলার রান্নাঘর
          </p>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Login form ════════════════════════════ */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 bg-gray-50 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden w-full max-w-sm mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-[#0f4c2a] flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দম</span>
            </div>
            <div className="text-left">
              <p className="text-[#0f4c2a] font-black text-base leading-tight" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>দেশি মসলার রান্নাঘর</p>
              <p className="text-[#ea580c] text-xs font-semibold tracking-wider uppercase" style={{ fontFamily: 'Manrope, sans-serif' }}>Deshi Moslar Rannaghar</p>
            </div>
          </Link>
        </div>

        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              স্বাগতম 👋
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              আপনার অ্যাকাউন্টে লগইন করুন
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">

            {/* Global error */}
            {errors.form && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                   style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                <span className="flex-shrink-0 text-base">⚠️</span> {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Identifier */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-2"
                       style={{ fontFamily: 'Manrope, sans-serif' }}>
                  ইমেইল বা ফোন নম্বর
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="rahim@example.com বা 01700000000"
                    className={cn(
                      'w-full rounded-xl border bg-gray-50 px-4 py-3 pl-10 text-sm placeholder:text-gray-400 transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:bg-white',
                      errors.identifier
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-gray-200 focus:ring-[#ea580c]/10 focus:border-[#ea580c]',
                    )}
                    autoComplete="username"
                    inputMode="email"
                    style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                     style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    ⚠ {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em]"
                         style={{ fontFamily: 'Manrope, sans-serif' }}>
                    পাসওয়ার্ড
                  </label>
                  <Link href="/forgot-password"
                        className="text-xs font-semibold text-[#c2410c] hover:text-[#7c1d06] transition-colors"
                        style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    ভুলে গেছেন?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড"
                    className={cn(
                      'w-full rounded-xl border bg-gray-50 px-4 py-3 pr-11 text-sm placeholder:text-gray-400 transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:bg-white',
                      errors.password
                        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
                        : 'border-gray-200 focus:ring-[#ea580c]/10 focus:border-[#ea580c]',
                    )}
                    autoComplete="current-password"
                    style={{ fontFamily: 'Manrope, Noto Sans Bengali, sans-serif' }}
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1.5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                    ⚠ {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: isLoading ? '#c2410c' : 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)',
                  boxShadow: '0 6px 20px rgba(194,65,12,0.35)',
                  fontFamily: 'Noto Sans Bengali, sans-serif',
                }}
              >
                {isLoading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> লগইন হচ্ছে...</>
                ) : (
                  <><LogIn className="w-5 h-5" /> লগইন করুন</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>অথবা</span>
              </div>
            </div>

            {/* Register CTA inside card */}
            <Link href="/register"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 hover:border-[#ea580c]/20 hover:bg-[#fff7ed] text-gray-700 hover:text-[#c2410c] font-semibold text-sm transition-all duration-200 group"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              নতুন অ্যাকাউন্ট তৈরি করুন
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Test credentials */}
          <div className="mt-4 bg-white border border-[#fed7aa] rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] font-black text-[#c2410c] uppercase tracking-[0.08em] mb-2"
               style={{ fontFamily: 'Manrope, sans-serif' }}>🧪 টেস্ট অ্যাকাউন্ট</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-4 text-center">📧</span>
                <span style={{ fontFamily: 'Manrope, sans-serif' }}>rahim@test.com</span>
                <span className="text-gray-300">•</span>
                <span style={{ fontFamily: 'Manrope, sans-serif' }}>Customer@123</span>
              </div>
              <p className="text-gray-400 text-[10px] pl-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
                বা: test@deshimoslar.com / Test@12345
              </p>
            </div>
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
