'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';

type Step = 'request' | 'verify' | 'success';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, verifyOtp } = useAuthStore();

  const [step, setStep] = useState<Step>('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('ইমেইল বা ফোন নম্বর দিন');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(identifier.trim());
      if ((res as any)?.dev_otp) setDevOtp((res as any).dev_otp);
      setStep('verify');
    } catch (err: any) {
      setError(err.response?.data?.message || 'অনুরোধ ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('৬ সংখ্যার OTP দিন');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOtp(identifier.trim(), otp.trim());
      // Pass to reset-password page via query
      router.push(`/reset-password?id=${encodeURIComponent(identifier.trim())}&otp=${otp.trim()}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP ভুল হয়েছে');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">দম</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Step: request */}
          {step === 'request' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-brand-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">পাসওয়ার্ড ভুলে গেছেন?</h1>
                <p className="text-gray-500 text-sm mt-1">
                  আপনার ইমেইল বা ফোন নম্বর দিন। আমরা একটি OTP পাঠাবো।
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleRequest} className="space-y-4">
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
                      className="input-base pl-9"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> পাঠানো হচ্ছে...
                    </>
                  ) : (
                    'OTP পাঠান'
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step: verify OTP */}
          {step === 'verify' && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-spice-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">OTP যাচাই করুন</h1>
                <p className="text-gray-500 text-sm mt-1">
                  <strong>{identifier}</strong>-এ পাঠানো ৬-সংখ্যার OTP দিন।
                </p>
                {devOtp && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg">
                    🧪 Dev mode OTP: <strong className="font-mono text-base">{devOtp}</strong>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    OTP কোড
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="input-base text-center text-2xl font-mono tracking-[0.5em]"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-center">OTP ১০ মিনিটের জন্য বৈধ</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> যাচাই হচ্ছে...
                    </>
                  ) : (
                    'OTP যাচাই করুন'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep('request');
                    setOtp('');
                    setError('');
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
                >
                  আবার পাঠান / পরিবর্তন করুন
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-4 h-4" /> লগইনে ফিরুন
          </Link>
        </div>
      </div>
    </div>
  );
}
