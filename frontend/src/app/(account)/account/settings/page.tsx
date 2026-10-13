'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Shield, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    promotions: true,
    smsAlerts: false,
  });

  async function handleLogout() {
    await logout();
    toast.success('লগআউট হয়েছে');
    router.push('/');
  }

  const toggleNotif = (key: keyof typeof notifSettings) =>
    setNotifSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-gray-900">নোটিফিকেশন সেটিংস</h2>
        </div>
        <div className="space-y-4">
          {[
            {
              key: 'orderUpdates',
              label: 'অর্ডার আপডেট',
              sub: 'অর্ডার স্ট্যাটাস পরিবর্তনের নোটিফিকেশন',
            },
            { key: 'promotions', label: 'অফার ও ছাড়', sub: 'বিশেষ অফার ও প্রমোশনাল নোটিফিকেশন' },
            { key: 'smsAlerts', label: 'SMS নোটিফিকেশন', sub: 'ফোনে SMS আলার্ট পেতে চান?' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => toggleNotif(key as any)}
                className={cn(
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  notifSettings[key as keyof typeof notifSettings] ? 'bg-brand-600' : 'bg-gray-200',
                )}
                role="switch"
                aria-checked={notifSettings[key as keyof typeof notifSettings]}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                    notifSettings[key as keyof typeof notifSettings]
                      ? 'translate-x-5'
                      : 'translate-x-0',
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-5 h-5 text-brand-600" />
          <h2 className="text-base font-bold text-gray-900">নিরাপত্তা</h2>
        </div>
        <div className="space-y-3">
          <a
            href="/account/profile"
            className="flex items-center justify-between py-3 border-b border-gray-50 group"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors">
                পাসওয়ার্ড পরিবর্তন
              </p>
              <p className="text-xs text-gray-400 mt-0.5">নিরাপদ পাসওয়ার্ড ব্যবহার করুন</p>
            </div>
            <span className="text-xs text-brand-600 font-medium">পরিবর্তন করুন →</span>
          </a>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">দুই-ধাপ যাচাই (OTP)</p>
              <p className="text-xs text-gray-400 mt-0.5">লগইনে OTP যাচাই ব্যবহার করুন</p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">শীঘ্রই</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">সেশন</h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-5 py-2.5 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> সমস্ত ডিভাইস থেকে লগআউট
        </button>
        <p className="text-xs text-gray-400 mt-2">লগআউট করলে সব ডিভাইস থেকে সেশন বাতিল হবে।</p>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-bold text-red-700">বিপদ অঞ্চল</h2>
        </div>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-5 py-2.5 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" /> অ্যাকাউন্ট মুছে ফেলুন
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-red-700">⚠️ আপনি কি নিশ্চিত?</p>
            <p className="text-xs text-red-600">
              এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না। সমস্ত ডেটা মুছে যাবে।
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.error('অ্যাকাউন্ট মুছতে সাপোর্টে যোগাযোগ করুন');
                  setShowDeleteConfirm(false);
                }}
                className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                বাতিল
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
