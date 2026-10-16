'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Camera, CheckCircle, Upload } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// ── Cloudinary unsigned upload ────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'deshi_moslar_uploads';

  if (!cloudName) throw new Error('Cloudinary not configured');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'avatars');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.secure_url as string;
}

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['account-profile'],
    queryFn: async () => {
      const r = await api.get('/users/me');
      return r.data.data;
    },
  });

  const [form, setForm] = useState({ name: '', gender: '', dateOfBirth: '' });
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? '',
        gender: data.gender ?? '',
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
      });
    }
  }, [data]);

  // ── Avatar upload handler ─────────────────────────────
  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ ৫MB এর বেশি হতে পারবে না');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ইমেজ ফাইল আপলোড করুন');
      return;
    }

    setAvatarUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await updateProfile({ avatar: url });
      qc.invalidateQueries({ queryKey: ['account-profile'] });
      toast.success('প্রোফাইল ছবি আপডেট হয়েছে');
    } catch (err: any) {
      toast.error('ছবি আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('নাম দিন'); return; }
    setSaving(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
      });
      qc.invalidateQueries({ queryKey: ['account-profile'] });
      toast.success('প্রোফাইল আপডেট হয়েছে');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'আপডেট ব্যর্থ হয়েছে');
    } finally {
      setSaving(false);
    }
  }

  async function handlePwChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword.length < 8) { setPwError('পাসওয়ার্ড কমপক্ষে ৮ অক্ষর'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('পাসওয়ার্ড মিলছে না'); return; }
    setPwSaving(true);
    try {
      await changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('পাসওয়ার্ড পরিবর্তন হয়েছে');
    } catch (e: any) {
      setPwError(e.response?.data?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে');
    } finally {
      setPwSaving(false);
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f4c2a]" />
      </div>
    );

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Profile info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-5">ব্যক্তিগত তথ্য</h2>

        {/* Avatar upload */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-[#f0fdf4] flex items-center justify-center border-2 border-[#bbf7d0] overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt={user.name ?? 'avatar'} width={64} height={64}
                  className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-[#0f4c2a] font-bold text-2xl">{user?.name?.charAt(0)}</span>
              )}
            </div>

            {/* Camera button — triggers file input */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#0f4c2a] text-white rounded-full flex items-center justify-center hover:bg-[#0a3d22] transition-colors disabled:opacity-60"
              title="ছবি পরিবর্তন করুন"
            >
              {avatarUploading
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <Camera className="w-3 h-3" />
              }
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          <div>
            <p className="font-semibold text-gray-900">{data?.name}</p>
            <p className="text-gray-400 text-sm">{data?.email}</p>
            <p className="text-gray-400 text-sm">{data?.phone}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="mt-1.5 flex items-center gap-1 text-xs text-[#0f4c2a] hover:text-[#072d18] font-medium transition-colors disabled:opacity-60"
            >
              {avatarUploading
                ? <><Loader2 className="w-3 h-3 animate-spin" /> আপলোড হচ্ছে...</>
                : <><Upload className="w-3 h-3" /> ছবি পরিবর্তন করুন (max 5MB)</>
              }
            </button>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">নাম *</label>
              <input type="text" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">লিঙ্গ</label>
              <select value={form.gender} onChange={(e) => setForm(f => ({ ...f, gender: e.target.value }))} className="input-base">
                <option value="">নির্বাচন করুন</option>
                <option value="MALE">পুরুষ</option>
                <option value="FEMALE">মহিলা</option>
                <option value="OTHER">অন্যান্য</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ইমেইল</label>
              <input type="email" value={data?.email ?? ''} disabled className="input-base bg-gray-50 cursor-not-allowed text-gray-400" />
              <p className="text-xs text-gray-400 mt-1">ইমেইল পরিবর্তন করা যাবে না</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">ফোন</label>
              <input type="tel" value={data?.phone ?? ''} disabled className="input-base bg-gray-50 cursor-not-allowed text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">জন্ম তারিখ</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} className="input-base" />
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-5">পাসওয়ার্ড পরিবর্তন</h2>
        {pwError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            ⚠️ {pwError}
          </div>
        )}
        <form onSubmit={handlePwChange} className="space-y-4">
          {[
            { key: 'currentPassword', label: 'বর্তমান পাসওয়ার্ড', ph: '********' },
            { key: 'newPassword',     label: 'নতুন পাসওয়ার্ড (৮+ অক্ষর)', ph: '********' },
            { key: 'confirmPassword', label: 'নতুন পাসওয়ার্ড নিশ্চিত', ph: '********' },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
              <input
                type="password"
                value={(pwForm as any)[key]}
                onChange={(e) => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={ph}
                className={cn('input-base',
                  key === 'confirmPassword' && pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && 'border-red-400'
                )}
                autoComplete={key === 'currentPassword' ? 'current-password' : 'new-password'}
              />
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={pwSaving} className="btn-primary flex items-center gap-2 px-6">
              {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {pwSaving ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
