'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye, EyeOff, LogIn, Phone, Mail, Loader2,
  Send, Smartphone, ArrowRight, Lock,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const G  = '#0f4c2a';
const G2 = '#1a6b3c';
const GL = '#f0fdf4';
const GB = '#bbf7d0';

export default function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirect     = searchParams.get('redirect') || '/account';

  const { login, isLoading }                                 = useAuthStore();
  const { syncToServer, fetchFromServer, items: guestItems } = useCartStore();

  const [identifier, setIdentifier] = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const [otpPhone,   setOtpPhone]   = useState('');
  const [otp,        setOtp]        = useState('');
  const [otpSent,    setOtpSent]    = useState(false);
  const [otpLoad,    setOtpLoad]    = useState(false);
  const [verLoad,    setVerLoad]    = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!identifier.trim()) e.identifier = 'ইমেইল বা ফোন নম্বর দিন';
    if (!password)           e.password   = 'পাসওয়ার্ড দিন';
    else if (password.length < 6) e.password = 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষর';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors({});
    try {
      const hadGuest = guestItems.length > 0;
      await login(identifier.trim(), password);
      if (hadGuest) await syncToServer();
      await fetchFromServer();
      toast.success('লগইন সফল হয়েছে!');
      router.push(redirect);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'লগইন ব্যর্থ হয়েছে';
      setErrors({ form: msg });
      toast.error(msg);
      console.error('Login error:', err.response?.data || err.message);
    }
  }

  async function handleSendOtp() {
    if (!otpPhone.trim()) { toast.error('ফোন নম্বর দিন'); return; }
    setOtpLoad(true);
    try {
      await api.post('/auth/send-otp', { phone: otpPhone.trim() });
      setOtpSent(true);
      toast.success('OTP পাঠানো হয়েছে');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'OTP পাঠাতে সমস্যা হয়েছে');
    } finally { setOtpLoad(false); }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) { toast.error('OTP দিন'); return; }
    setVerLoad(true);
    try {
      await api.post('/auth/verify-otp', { phone: otpPhone.trim(), otp: otp.trim() });
      await fetchFromServer();
      toast.success('লগইন সফল!');
      router.push(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'OTP যাচাই ব্যর্থ');
    } finally { setVerLoad(false); }
  }

  const inp = (field: string) => cn(
    'w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400',
    'transition-all duration-150 focus:outline-none focus:ring-2',
    errors[field]
      ? 'border-red-300 focus:ring-red-100'
      : 'border-gray-200 focus:ring-[#0f4c2a]/15 focus:border-[#0f4c2a]',
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
            <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black text-white select-none"
                 style={{ background: `linear-gradient(135deg,${G},${G2})`, boxShadow: '0 2px 8px rgba(15,76,42,0.25)' }}>
              <LogIn className="w-4 h-4" />
              <span style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>লগইন</span>
            </div>
            <Link href="/register"
                  className="flex-1 flex items-center justify-center py-2.5 rounded-2xl text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
              নিবন্ধন
            </Link>
          </div>

          <div className="px-7 pt-6 pb-7">

            {/* Heading */}
            <div className="text-center mb-5">
              <h1 className="text-[22px] font-black text-gray-900" style={{ fontFamily: 'Manrope, sans-serif' }}>Welcome Back</h1>
              <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
            </div>

            {/* Error */}
            {errors.form && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                   style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                <span>⚠️</span> {errors.form}
              </div>
            )}

            {/* Password login form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              {/* Identifier */}
              <div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                    placeholder="Mobile Number or Email"
                    className={cn(inp('identifier'), 'pl-10')}
                    autoComplete="username" inputMode="email" />
                </div>
                {errors.identifier && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.identifier}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className={cn(inp('password'), 'pl-10 pr-11')}
                    autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPw(s => !s)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>⚠ {errors.password}</p>}
              </div>

              {/* Forgot */}
              <div className="text-right -mt-1">
                <Link href="/forgot-password"
                      className="text-xs font-bold hover:underline"
                      style={{ color: G, fontFamily: 'Noto Sans Bengali, sans-serif' }}>
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 text-white font-black py-3.5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-60 text-sm"
                style={{ background: `linear-gradient(135deg,${G},${G2})`, boxShadow: '0 4px 16px rgba(15,76,42,0.3)', fontFamily: 'Manrope, sans-serif' }}>
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> লগইন হচ্ছে...</>
                  : <>Login <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* OTP section */}
            <div className="rounded-2xl p-4 space-y-3" style={{ background: GL, border: `1px solid ${GB}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: GB }}>
                  <Smartphone className="w-5 h-5" style={{ color: G }} />
                </div>
                <div>
                  <p className="text-sm font-black" style={{ color: G, fontFamily: 'Manrope, sans-serif' }}>Login with OTP</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>Get a 6-digit code on your mobile number</p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="tel" value={otpPhone} onChange={e => setOtpPhone(e.target.value)}
                    placeholder="Mobile Number"
                    inputMode="tel"
                    className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0f4c2a]/15 focus:border-[#0f4c2a] transition-all" />
                </div>
                <button type="button" onClick={handleSendOtp} disabled={otpLoad}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-white text-xs font-black transition-all active:scale-95 disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg,${G},${G2})`, boxShadow: '0 2px 8px rgba(15,76,42,0.25)', fontFamily: 'Manrope, sans-serif' }}>
                  {otpLoad ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Send OTP
                </button>
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6} inputMode="numeric"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-center tracking-[0.3em] font-bold placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#0f4c2a]/15 focus:border-[#0f4c2a] transition-all" />
                  <button type="button" onClick={handleVerifyOtp} disabled={verLoad}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: GB, color: G, fontFamily: 'Manrope, sans-serif' }}>
                    {verLoad && <Loader2 className="w-4 h-4 animate-spin" />}
                    Verify OTP
                  </button>
                </div>
              )}
            </div>

            {/* Google */}
            <div className="mt-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 whitespace-nowrap" style={{ fontFamily: 'Manrope, sans-serif' }}>or sign in with</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <button type="button"
                className="w-full flex items-center justify-center py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>

            {/* Bottom CTA */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Manrope, sans-serif' }}>New to our platform?</span>
              <Link href="/register"
                    className="flex items-center gap-1 text-xs font-black hover:underline"
                    style={{ color: G, fontFamily: 'Manrope, sans-serif' }}>
                Create an Account <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Test creds */}
        <div className="mt-4 bg-white border border-gray-200 rounded-2xl px-4 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.08em] mb-1" style={{ color: G, fontFamily: 'Manrope, sans-serif' }}>🧪 Test Account</p>
          <p className="text-xs text-gray-500" style={{ fontFamily: 'Manrope, sans-serif' }}>rahim@test.com • Customer@123</p>
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
