'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier   = searchParams.get('id') || '';
  const otp          = searchParams.get('otp') || '';

  const { resetPassword } = useAuthStore();

  const [newPassword, setNewPassword]   = useState('');
  const [confirm, setConfirm]           = useState('');
  const [showPw, setShowPw]             = useState(false);
  const [loading, setLoading]           = useState(false);
  const [done, setDone]                 = useState(false);
  const [error, setError]               = useState('');

  if (!identifier || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">অবৈধ অনুরোধ। আবার চেষ্টা করুন।</p>
          <Link href="/forgot-password" className="btn-primary">পাসওয়ার্ড রিসেট শুরু করুন</Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 8) { setError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষর'); return; }
    if (newPassword !== confirm) { setError('পাসওয়ার্ড মিলছে না'); return; }
    setError(''); setLoading(true);
    try {
      await resetPassword(identifier, otp, newPassword);
      setDone(true);
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">দম</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {done ? (
            <div className="text-center py-4">
              <CheckCircle className="w-16 h-16 text-brand-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">পাসওয়ার্ড পরিবর্তন হয়েছে!</h2>
              <p className="text-gray-500 text-sm mb-6">এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।</p>
              <Link href="/login" className="btn-primary px-8 py-3 inline-flex">লগইন করুন</Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7 text-brand-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">নতুন পাসওয়ার্ড সেট করুন</h1>
                <p className="text-gray-500 text-sm mt-1">{identifier}</p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">নতুন পাসওয়ার্ড</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৮ অক্ষর"
                      className="input-base pr-10"
                      autoComplete="new-password"
                    />
                    <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="আবার পাসওয়ার্ড দিন"
                    className={cn('input-base', confirm && newPassword !== confirm && 'border-red-400')}
                    autoComplete="new-password"
                  />
                  {confirm && newPassword !== confirm && (
                    <p className="text-red-500 text-xs mt-1">পাসওয়ার্ড মিলছে না</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> পরিবর্তন হচ্ছে...</> : 'পাসওয়ার্ড পরিবর্তন করুন'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
