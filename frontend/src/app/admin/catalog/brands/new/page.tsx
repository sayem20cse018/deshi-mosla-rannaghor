'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useCreateBrand } from '@/hooks/useAdminBrands';
import { AdminBtn } from '@/components/admin/ui';
import { UploadButton } from '@/components/admin/media/UploadButton';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewBrandPage() {
  const router    = useRouter();
  const createMut = useCreateBrand();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name:        '',
    nameEn:      '',
    slug:        '',
    logo:        '',
    description: '',
    website:     '',
    isActive:    true,
  });

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }

    setSaving(true);
    try {
      await createMut.mutateAsync({
        ...form,
        nameEn:      form.nameEn      || undefined,
        logo:        form.logo        || undefined,
        description: form.description || undefined,
        website:     form.website     || undefined,
      });
      toast.success('Brand created');
      router.push('/admin/catalog/brands');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white';
  const labelCls = 'block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/catalog/brands">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Add New Brand</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the brand details</p>
        </div>
        <AdminBtn type="submit" icon={<Save className="w-4 h-4" />} loading={saving}>
          {saving ? 'Saving...' : 'Create Brand'}
        </AdminBtn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Brand Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Brand Name *</label>
                <input value={form.name} onChange={handleNameChange} placeholder="Brand name" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Name (English)</label>
                <input value={form.nameEn} onChange={set('nameEn')} placeholder="English name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input value={form.slug} onChange={set('slug')} placeholder="brand-slug" className={cn(inputCls, 'font-mono')} required />
              </div>
              <div>
                <label className={labelCls}>Website</label>
                <input value={form.website} onChange={set('website')} placeholder="https://example.com" className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Logo</label>
              <UploadButton
                value={form.logo}
                onChange={(url) => setForm((f) => ({ ...f, logo: url }))}
                folder="brands"
                label="Upload Brand Logo"
                aspectRatio="square"
              />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Brand description..." className={cn(inputCls, 'resize-none')} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-4">Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active</span>
              <div
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={cn('w-11 h-6 rounded-full relative transition-colors cursor-pointer', form.isActive ? 'bg-green-500' : 'bg-gray-300')}
              >
                <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </div>
          </div>

          {(form.name || form.logo) && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-3">Preview</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                {form.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo} alt={form.name} className="w-10 h-10 rounded-lg object-contain border border-gray-100 bg-white p-1" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-400 font-black text-sm">
                    {form.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{form.name}</p>
                  {form.nameEn && <p className="text-[11px] text-gray-500">{form.nameEn}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
