'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { UploadButton } from '@/components/admin/media/UploadButton';
import { useCreateCollection } from '@/hooks/useAdminCollections';
import { AdminBtn } from '@/components/admin/ui';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewCollectionPage() {
  const router    = useRouter();
  const createMut = useCreateCollection();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name:        '',
    nameEn:      '',
    slug:        '',
    description: '',
    image:       '',
    banner:      '',
    isActive:    true,
    sortOrder:   0,
    metaTitle:   '',
    metaDesc:    '',
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
        sortOrder:   Number(form.sortOrder) || 0,
        nameEn:      form.nameEn      || undefined,
        description: form.description || undefined,
        image:       form.image       || undefined,
        banner:      form.banner      || undefined,
        metaTitle:   form.metaTitle   || undefined,
        metaDesc:    form.metaDesc    || undefined,
      });
      toast.success('Collection created');
      router.push('/admin/catalog/collections');
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
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/catalog/collections">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Add New Collection</h1>
          <p className="text-sm text-gray-400 mt-0.5">Group products into a curated collection</p>
        </div>
        <AdminBtn type="submit" icon={<Save className="w-4 h-4" />} loading={saving}>
          {saving ? 'Saving...' : 'Create Collection'}
        </AdminBtn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Collection Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Collection Name *</label>
                <input value={form.name} onChange={handleNameChange} placeholder="Collection name" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Name (English)</label>
                <input value={form.nameEn} onChange={set('nameEn')} placeholder="English name" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Slug *</label>
                <input value={form.slug} onChange={set('slug')} placeholder="collection-slug" className={cn(inputCls, 'font-mono')} required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Collection description..." className={cn(inputCls, 'resize-none')} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Media</h3>
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input value={form.image} onChange={set('image')} placeholder="https://cdn.example.com/collection.jpg" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Banner Image URL</label>
              <input value={form.banner} onChange={set('banner')} placeholder="https://cdn.example.com/banner.jpg" className={inputCls} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">SEO Settings</h3>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.metaTitle} onChange={set('metaTitle')} placeholder="SEO title (60 chars)" className={inputCls} />
              <p className="text-[10px] text-gray-400 mt-1">{form.metaTitle.length}/60 chars</p>
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.metaDesc} onChange={set('metaDesc')} rows={3} placeholder="Meta description (160 chars)" className={cn(inputCls, 'resize-none')} />
              <p className="text-[10px] text-gray-400 mt-1">{form.metaDesc.length}/160 chars</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm">Settings</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active</span>
              <div
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={cn('w-11 h-6 rounded-full relative transition-colors cursor-pointer', form.isActive ? 'bg-green-500' : 'bg-gray-300')}
              >
                <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} className={inputCls} />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-800">After creating the collection, you can add products from the edit page.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
