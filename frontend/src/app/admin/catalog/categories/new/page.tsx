'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useCreateCategory } from '@/hooks/useAdminCategories';
import { AdminBtn } from '@/components/admin/ui';
import api from '@/lib/api';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

interface ParentOption { id: string; name: string; }

export default function NewCategoryPage() {
  const router    = useRouter();
  const createMut = useCreateCategory();
  const [saving,  setSaving]  = useState(false);
  const [parents, setParents] = useState<ParentOption[]>([]);

  const [form, setForm] = useState({
    name:        '',
    nameEn:      '',
    slug:        '',
    description: '',
    image:       '',
    icon:        '',
    parentId:    '',
    isActive:    true,
    sortOrder:   0,
    showInNav:   false,
    navOrder:    0,
    metaTitle:   '',
    metaDesc:    '',
  });

  useEffect(() => {
    api.get('/categories/flat').then((r) => {
      setParents((r.data.data ?? []).map((c: { id: string; name: string }) => ({ id: c.id, name: c.name })));
    }).catch(() => {});
  }, []);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [k]: val }));
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
      const payload = {
        ...form,
        sortOrder: Number(form.sortOrder) || 0,
        navOrder:  Number(form.navOrder)  || 0,
        parentId:  form.parentId || undefined,
        nameEn:    form.nameEn    || undefined,
        description: form.description || undefined,
        image:     form.image     || undefined,
        icon:      form.icon      || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDesc:  form.metaDesc  || undefined,
      };
      await createMut.mutateAsync(payload);
      toast.success('Category created');
      router.push('/admin/catalog/categories');
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/catalog/categories">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Add New Category</h1>
          <p className="text-sm text-gray-400 mt-0.5">Fill in the category details</p>
        </div>
        <AdminBtn type="submit" icon={<Save className="w-4 h-4" />} loading={saving}>
          {saving ? 'Saving...' : 'Create Category'}
        </AdminBtn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main */}
        <div className="xl:col-span-2 space-y-5">

          {/* Basic */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={handleNameChange} placeholder="Category name" className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Name (English)</label>
                <input value={form.nameEn} onChange={set('nameEn')} placeholder="English name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input value={form.slug} onChange={set('slug')} placeholder="category-slug" className={cn(inputCls, 'font-mono')} required />
              </div>
              <div>
                <label className={labelCls}>Icon (emoji or text)</label>
                <input value={form.icon} onChange={set('icon')} placeholder="e.g. Spices" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Parent Category</label>
                <select value={form.parentId} onChange={set('parentId')} className={inputCls}>
                  <option value="">None (top level)</option>
                  {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                <input value={form.image} onChange={set('image')} placeholder="https://..." className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={set('description')} rows={3} placeholder="Category description..." className={cn(inputCls, 'resize-none')} />
            </div>
          </div>

          {/* SEO */}
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

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm">Status & Display</h3>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Active</span>
              <div
                onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={cn('w-11 h-6 rounded-full relative transition-colors cursor-pointer', form.isActive ? 'bg-green-500' : 'bg-gray-300')}
              >
                <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', form.isActive ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show in Nav</span>
              <div
                onClick={() => setForm((f) => ({ ...f, showInNav: !f.showInNav }))}
                className={cn('w-11 h-6 rounded-full relative transition-colors cursor-pointer', form.showInNav ? 'bg-blue-500' : 'bg-gray-300')}
              >
                <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', form.showInNav ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" min="0" value={form.sortOrder} onChange={set('sortOrder')} className={inputCls} />
            </div>

            {form.showInNav && (
              <div>
                <label className={labelCls}>Nav Order</label>
                <input type="number" min="0" value={form.navOrder} onChange={set('navOrder')} className={inputCls} />
              </div>
            )}
          </div>

          {/* Preview */}
          {form.name && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-3">Preview</h3>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-white border border-orange-100 flex items-center justify-center text-lg">
                  {form.icon || <Tag className="w-4 h-4 text-orange-400" />}
                </div>
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
