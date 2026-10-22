'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Save, ArrowLeft, Package, Tag, DollarSign,
  Image as ImageIcon, Star, CheckSquare, X, Plus, Layers, Pencil, Trash2,
  Upload, Loader2, GripVertical,
} from 'lucide-react';
import { cn, formatPriceEn } from '@/lib/utils';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useAdminProducts';
import { useCategories } from '@/hooks/useCategories';
import { AdminBtn, ConfirmDialog } from '@/components/admin/ui';
import { useUploadMedia, useUploadProgress, useBulkUploadMedia } from '@/hooks/useMedia';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateSku(): string {
  return 'SKU-' + Date.now().toString(36).toUpperCase();
}

type TabKey = 'basic' | 'pricing' | 'inventory' | 'flags' | 'images' | 'variants';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'basic',     label: 'Basic Info',  icon: Package },
  { key: 'pricing',   label: 'Pricing',     icon: DollarSign },
  { key: 'inventory', label: 'Inventory',   icon: Tag },
  { key: 'flags',     label: 'Flags & SEO', icon: Star },
  { key: 'images',    label: 'Images',      icon: ImageIcon },
  { key: 'variants',  label: 'Variants',    icon: Layers },
];

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router    = useRouter();
  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const { data: categories = [] } = useCategories();

  const [tab,      setTab]      = useState<TabKey>('basic');
  const [saving,   setSaving]   = useState(false);
  const [brands,   setBrands]   = useState<Array<{ id: string; name: string }>>([]);
  const [tagInput, setTagInput] = useState('');

  // Variants state
  interface Variant {
    id?:         string;
    name:        string;
    sku:         string;
    price:       string;
    salePrice:   string;
    stock:       string;
    weight:      string;
    isActive:    boolean;
    sortOrder:   string;
  }
  const [variants,       setVariants]       = useState<Variant[]>([]);
  const [variantLoaded,  setVariantLoaded]  = useState(false);
  const [editingVariant, setEditingVariant] = useState<number | null>(null);
  const [deletingVariant, setDeletingVariant] = useState<string | null>(null);
  const [variantForm, setVariantForm] = useState<Variant>({
    name: '', sku: '', price: '', salePrice: '', stock: '0', weight: '', isActive: true, sortOrder: '0',
  });
  const [showVariantForm, setShowVariantForm] = useState(false);

  // ── Image state ────────────────────────────────────────────────────────────
  type ProductImage = { id: string; url: string; altText?: string; isPrimary?: boolean; sortOrder?: number };
  const [images, setImages] = useState<ProductImage[]>(() =>
    Array.isArray(initialData?.images) ? (initialData.images as ProductImage[]) : []
  );
  const [uploadingImages, setUploadingImages] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const { progress, setFileProgress, clearProgress } = useUploadProgress();
  const uploadMut = useUploadMedia(setFileProgress);
  const imgInputRef = React.useRef<HTMLInputElement>(null);

  async function handleImageFiles(files: File[]) {
    if (!isEdit || !initialData?.id) {
      toast.error('Save the product first before uploading images');
      return;
    }
    const images2 = files.filter(f => f.type.startsWith('image/'));
    if (!images2.length) return;
    setUploadingImages(true);
    try {
      for (const file of images2) {
        const res = await uploadMut.mutateAsync({ file, folder: 'products' });
        const url = res.data.secureUrl;
        // Add to product via backend
        const r = await api.post(`/products/${initialData.id as string}/images`, { url, isPrimary: images.length === 0 });
        setImages((prev) => [...prev, r.data.data]);
      }
      toast.success(`${images2.length} image(s) uploaded`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingImages(false);
      clearProgress();
    }
  }

  async function handleDeleteImage(imgId: string) {
    if (!isEdit || !initialData?.id) return;
    setDeletingImageId(imgId);
    try {
      await api.delete(`/products/images/${imgId}`);
      setImages((prev) => prev.filter(i => i.id !== imgId));
      toast.success('Image removed');
    } catch {
      toast.error('Failed to remove image');
    } finally {
      setDeletingImageId(null);
    }
  }

  async function handleSetPrimary(imgId: string) {
    if (!isEdit || !initialData?.id) return;
    try {
      await api.patch(`/products/${initialData.id as string}/images/${imgId}/primary`);
      setImages((prev) => prev.map(i => ({ ...i, isPrimary: i.id === imgId })));
      toast.success('Primary image set');
    } catch {
      toast.error('Failed');
    }
  }

  const [form, setForm] = useState({
    name:          (initialData?.name as string)         ?? '',
    nameEn:        (initialData?.nameEn as string)       ?? '',
    slug:          (initialData?.slug as string)         ?? '',
    sku:           (initialData?.sku as string)          ?? '',
    description:   (initialData?.description as string)  ?? '',
    categoryId:    (initialData?.categoryId as string)   ?? '',
    brandId:       (initialData?.brandId as string)      ?? '',
    price:         (initialData?.price as string)        ?? '',
    discountPrice: (initialData?.discountPrice as string) ?? '',
    weight:        (initialData?.weight as string)       ?? '',
    size:          (initialData?.size as string)         ?? '',
    origin:        (initialData?.origin as string)       ?? '',
    minOrderQty:   (initialData?.minOrderQty as number)  ?? 1,
    maxOrderQty:   (initialData?.maxOrderQty as string)  ?? '',
    tags:          (initialData?.tags as string[])       ?? ([] as string[]),
    isActive:      (initialData?.isActive as boolean)    ?? true,
    isFeatured:    (initialData?.isFeatured as boolean)  ?? false,
    isBestSeller:  (initialData?.isBestSeller as boolean) ?? false,
    isNewArrival:  (initialData?.isNewArrival as boolean) ?? false,
    metaTitle:     (initialData?.metaTitle as string)    ?? '',
    metaDesc:      (initialData?.metaDesc as string)     ?? '',
  });

  useEffect(() => {
    api.get('/brands').then(r => setBrands(r.data.data ?? [])).catch(() => {});
  }, []);

  // Load existing variants when editing
  useEffect(() => {
    if (isEdit && initialData?.id && !variantLoaded) {
      api.get('/admin/products/' + initialData.id + '/variants')
        .then((r) => {
          const raw = r.data.data ?? [];
          setVariants(raw.map((v: {
            id?: string; name: string; sku: string; price: number;
            salePrice?: number | null; stock?: number; weight?: string | null;
            isActive?: boolean; sortOrder?: number;
          }) => ({
            id:         v.id,
            name:       v.name,
            sku:        v.sku,
            price:      String(v.price),
            salePrice:  v.salePrice ? String(v.salePrice) : '',
            stock:      String(v.stock ?? 0),
            weight:     v.weight ?? '',
            isActive:   v.isActive ?? true,
            sortOrder:  String(v.sortOrder ?? 0),
          })));
          setVariantLoaded(true);
        })
        .catch(() => { setVariantLoaded(true); });
    }
  }, [isEdit, initialData, variantLoaded]);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm(f => ({ ...f, [k]: val }));
    };
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setForm(f => ({
      ...f,
      name,
      slug: isEdit ? f.slug : generateSlug(name),
      sku:  isEdit ? f.sku  : f.sku || generateSku(),
    }));
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput('');
  }

  function removeTag(t: string) {
    setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));
  }

  function setVF(k: keyof typeof variantForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setVariantForm((f) => ({ ...f, [k]: val }));
    };
  }

  function resetVariantForm() {
    setVariantForm({ name: '', sku: '', price: '', salePrice: '', stock: '0', weight: '', isActive: true, sortOrder: '0' });
    setEditingVariant(null);
    setShowVariantForm(false);
  }

  async function handleSaveVariant() {
    if (!variantForm.name.trim()) { toast.error('Variant name required'); return; }
    if (!variantForm.sku.trim())  { toast.error('Variant SKU required'); return; }
    if (!variantForm.price || Number(variantForm.price) <= 0) { toast.error('Valid price required'); return; }

    if (!isEdit || !initialData?.id) {
      toast.error('Save the product first before adding variants');
      return;
    }

    const payload = {
      name:      variantForm.name,
      sku:       variantForm.sku,
      price:     Number(variantForm.price),
      salePrice: variantForm.salePrice ? Number(variantForm.salePrice) : undefined,
      stock:     Number(variantForm.stock) || 0,
      weight:    variantForm.weight || undefined,
      isActive:  variantForm.isActive,
      sortOrder: Number(variantForm.sortOrder) || 0,
    };

    try {
      if (editingVariant !== null && variants[editingVariant]?.id) {
        const variantId = variants[editingVariant].id as string;
        await api.patch('/admin/products/' + initialData.id + '/variants/' + variantId, payload);
        setVariants((prev) => prev.map((v, i) => i === editingVariant ? { ...variantForm, id: variantId } : v));
        toast.success('Variant updated');
      } else {
        const res = await api.post('/admin/products/' + initialData.id + '/variants', payload);
        setVariants((prev) => [...prev, { ...variantForm, id: res.data.data?.id }]);
        toast.success('Variant added');
      }
      resetVariantForm();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Failed to save variant');
    }
  }

  async function handleDeleteVariant(variantId: string, index: number) {
    if (!isEdit || !initialData?.id) return;
    try {
      await api.delete('/admin/products/' + initialData.id + '/variants/' + variantId);
      setVariants((prev) => prev.filter((_, i) => i !== index));
      toast.success('Variant deleted');
      setDeletingVariant(null);
    } catch {
      toast.error('Failed to delete variant');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim())                           { toast.error('Product name is required'); setTab('basic');   return; }
    if (!form.slug.trim())                           { toast.error('Slug is required');          setTab('basic');   return; }
    if (!form.sku.trim())                            { toast.error('SKU is required');            setTab('basic');   return; }
    if (!form.categoryId)                            { toast.error('Category is required');       setTab('basic');   return; }
    if (!form.price || Number(form.price) <= 0)      { toast.error('Valid price required');       setTab('pricing'); return; }

    setSaving(true);
    const payload = {
      ...form,
      price:        Number(form.price),
      discountPrice:form.discountPrice ? Number(form.discountPrice) : undefined,
      minOrderQty:  Number(form.minOrderQty) || 1,
      maxOrderQty:  form.maxOrderQty ? Number(form.maxOrderQty) : undefined,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateMut.mutateAsync({ id: initialData.id as string, data: payload });
        toast.success('Product updated');
      } else {
        await createMut.mutateAsync(payload);
        toast.success('Product created');
        router.push('/admin/catalog/products');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/catalog/products">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{isEdit ? (form.name || 'Editing product') : 'Fill in the product details below'}</p>
        </div>
        <AdminBtn type="submit" icon={<Save className="w-4 h-4" />} loading={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
        </AdminBtn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        {/* Left: tabs + form */}
        <div className="xl:col-span-3 space-y-4">

          {/* Tab nav */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0',
                  tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Basic Info */}
          {tab === 'basic' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Basic Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Product Name (BN) *</label>
                  <input value={form.name} onChange={handleNameChange} placeholder="Product name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Product Name (EN)</label>
                  <input value={form.nameEn} onChange={set('nameEn')} placeholder="Product name in English"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Slug *</label>
                  <input value={form.slug} onChange={set('slug')} placeholder="product-slug"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">SKU *</label>
                  <input value={form.sku} onChange={set('sku')} placeholder="SKU-XXXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Category *</label>
                  <select value={form.categoryId} onChange={set('categoryId')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" required>
                    <option value="">Select category</option>
                    {(categories as Array<{ id: string; name: string }>).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Brand</label>
                  <select value={form.brandId} onChange={set('brandId')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white">
                    <option value="">No brand</option>
                    {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Weight / Size</label>
                  <input value={form.weight} onChange={set('weight')} placeholder="e.g. 500g, 1kg"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Origin</label>
                  <input value={form.origin} onChange={set('origin')} placeholder="Bangladesh"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={4}
                  placeholder="Product description..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white resize-none" />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder="Add a tag and press Enter"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                  <AdminBtn type="button" size="sm" variant="secondary" onClick={addTag} icon={<Plus className="w-3.5 h-3.5" />}>Add</AdminBtn>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {t}
                      <button type="button" onClick={() => removeTag(t)} className="text-orange-400 hover:text-orange-700 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {tab === 'pricing' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Pricing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Selling Price (BDT) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">BDT</span>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Sale Price (BDT)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">BDT</span>
                    <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={set('discountPrice')} placeholder="0.00"
                      className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                  </div>
                  {form.price && form.discountPrice && Number(form.discountPrice) < Number(form.price) && (
                    <p className="text-xs text-green-600 font-semibold mt-1">
                      Discount: {Math.round(((Number(form.price) - Number(form.discountPrice)) / Number(form.price)) * 100)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Inventory */}
          {tab === 'inventory' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Inventory & Order Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Min Order Qty</label>
                  <input type="number" min="1" value={form.minOrderQty} onChange={set('minOrderQty')}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Max Order Qty</label>
                  <input type="number" min="1" value={form.maxOrderQty} onChange={set('maxOrderQty')} placeholder="No limit"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-800">Stock management is handled in Inventory section after product creation.</p>
              </div>
            </div>
          )}

          {/* Flags & SEO */}
          {tab === 'flags' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3 mb-4">Product Flags</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { key: 'isActive',     label: 'Active' },
                      { key: 'isFeatured',   label: 'Featured' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                    ] as Array<{ key: keyof typeof form; label: string }>
                  ).map(({ key, label }) => {
                    const checked = form[key] as boolean;
                    return (
                      <label key={key}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                          checked ? 'border-orange-300 bg-orange-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200',
                        )}>
                        <input type="checkbox" checked={checked}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          className="sr-only" />
                        <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                          checked ? 'bg-orange-500 border-orange-500' : 'border-gray-300')}>
                          {checked && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3 mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">SEO Title</label>
                    <input value={form.metaTitle} onChange={set('metaTitle')} placeholder="SEO page title (60 chars recommended)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white" />
                    <p className="text-[10px] text-gray-400 mt-1">{form.metaTitle.length}/60 chars</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5">Meta Description</label>
                    <textarea value={form.metaDesc} onChange={set('metaDesc')} rows={3}
                      placeholder="Meta description (160 chars recommended)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white resize-none" />
                    <p className="text-[10px] text-gray-400 mt-1">{form.metaDesc.length}/160 chars</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Images */}
          {tab === 'images' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-black text-gray-900 text-sm">Product Images</h3>
                <AdminBtn
                  type="button" size="sm" variant="secondary"
                  icon={uploadingImages ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  loading={uploadingImages}
                  onClick={() => imgInputRef.current?.click()}
                >
                  {uploadingImages ? 'Uploading...' : 'Upload Images'}
                </AdminBtn>
              </div>

              {/* Hidden multi-file input */}
              <input
                ref={imgInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleImageFiles(Array.from(e.target.files));
                  e.target.value = '';
                }}
              />

              {/* Drag & drop zone */}
              <div
                className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer"
                onClick={() => imgInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files);
                  handleImageFiles(files);
                }}
              >
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">Click or drag images here to upload</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — Max 10MB each — Multiple files supported</p>
                {!isEdit && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5 mt-3 inline-block font-semibold">
                    Save the product first to enable image upload
                  </p>
                )}
              </div>

              {/* Upload progress */}
              {uploadingImages && Object.keys(progress).length > 0 && (
                <div className="space-y-2">
                  {Object.entries(progress).map(([name, pct]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span className="truncate max-w-[200px]">{name}</span>
                        <span className="font-semibold">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Image grid */}
              {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-100 hover:border-orange-300 transition-colors">
                      <Image
                        src={img.url}
                        alt={img.altText ?? ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 25vw"
                      />
                      {img.isPrimary && (
                        <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10">
                          PRIMARY
                        </div>
                      )}
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 z-10">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(img.id)}
                            className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[9px] font-black rounded-lg transition-colors"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          disabled={deletingImageId === img.id}
                          className="w-7 h-7 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingImageId === img.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">No images yet. Upload above.</p>
              )}
            </div>
          )}

          {/* Variants */}
          {tab === 'variants' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <h3 className="font-black text-gray-900 text-sm">Product Variants</h3>
                {isEdit && (
                  <AdminBtn
                    type="button"
                    size="sm"
                    variant="secondary"
                    icon={<Plus className="w-3.5 h-3.5" />}
                    onClick={() => { resetVariantForm(); setShowVariantForm(true); }}
                  >
                    Add Variant
                  </AdminBtn>
                )}
              </div>

              {!isEdit && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-amber-800">Save the product first to manage variants.</p>
                </div>
              )}

              {/* Inline variant form */}
              {showVariantForm && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="text-sm font-black text-gray-800">{editingVariant !== null ? 'Edit Variant' : 'New Variant'}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Name *</label>
                      <input value={variantForm.name} onChange={setVF('name')} placeholder="e.g. 500g Pack"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">SKU *</label>
                      <input value={variantForm.sku} onChange={setVF('sku')} placeholder="SKU-VAR-001"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Price *</label>
                      <input type="number" min="0" step="0.01" value={variantForm.price} onChange={setVF('price')} placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Sale Price</label>
                      <input type="number" min="0" step="0.01" value={variantForm.salePrice} onChange={setVF('salePrice')} placeholder="0.00"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Stock</label>
                      <input type="number" min="0" value={variantForm.stock} onChange={setVF('stock')} placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Weight</label>
                      <input value={variantForm.weight} onChange={setVF('weight')} placeholder="e.g. 500g"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variantForm.isActive}
                        onChange={(e) => setVariantForm((f) => ({ ...f, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded"
                      />
                      Active
                    </label>
                    <div className="ml-auto flex gap-2">
                      <AdminBtn type="button" size="sm" variant="secondary" onClick={resetVariantForm}>Cancel</AdminBtn>
                      <AdminBtn type="button" size="sm" onClick={handleSaveVariant}>
                        {editingVariant !== null ? 'Update' : 'Add'}
                      </AdminBtn>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants list */}
              {variants.length === 0 && !showVariantForm ? (
                <div className="text-center py-8 text-gray-400">
                  <Layers className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm">No variants yet. Add variants for different sizes, weights, or options.</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-gray-100">
                  {variants.map((v, i) => (
                    <div key={v.id ?? i} className="flex items-center gap-3 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                        <p className="text-[11px] font-mono text-gray-400">{v.sku}</p>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-black text-orange-600" style={{ fontFamily: 'Manrope,sans-serif' }}>
                          {formatPriceEn(Number(v.salePrice) || Number(v.price))}
                        </p>
                        {v.salePrice && (
                          <p className="text-[11px] text-gray-400 line-through">{formatPriceEn(Number(v.price))}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 hidden md:block">Stock: {v.stock}</span>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full',
                        v.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
                      )}>
                        {v.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVariantForm({ ...v });
                          setEditingVariant(i);
                          setShowVariantForm(true);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => v.id && setDeletingVariant(v.id + '|' + i)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: quick status sidebar */}
        <div className="xl:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm mb-4">Quick Status</h3>
            <div className="space-y-3">
              {(
                [
                  { key: 'isActive',     label: 'Active',      color: 'bg-green-500' },
                  { key: 'isFeatured',   label: 'Featured',    color: 'bg-orange-500' },
                  { key: 'isBestSeller', label: 'Best Seller', color: 'bg-amber-500' },
                  { key: 'isNewArrival', label: 'New Arrival', color: 'bg-blue-500' },
                ] as Array<{ key: keyof typeof form; label: string; color: string }>
              ).map(({ key, label, color }) => {
                const val = form[key] as boolean;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div
                      onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                      className={cn('w-11 h-6 rounded-full relative transition-colors cursor-pointer', val ? color : 'bg-gray-300')}
                    >
                      <div className={cn('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform', val ? 'translate-x-5' : 'translate-x-0.5')} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price preview */}
          {form.price && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-black text-gray-900 text-sm mb-3">Price Preview</h3>
              <p className="text-2xl font-black text-orange-600" style={{ fontFamily: 'Manrope,sans-serif' }}>
                {formatPriceEn(Number(form.discountPrice) || Number(form.price))}
              </p>
              {form.discountPrice && (
                <p className="text-sm text-gray-400 line-through">{formatPriceEn(Number(form.price))}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm variant delete */}
      <ConfirmDialog
        open={!!deletingVariant}
        onClose={() => setDeletingVariant(null)}
        onConfirm={() => {
          if (deletingVariant) {
            const [varId, idx] = deletingVariant.split('|');
            handleDeleteVariant(varId, Number(idx));
          }
        }}
        title="Delete Variant"
        message="This variant will be permanently deleted."
        danger
      />
    </form>
  );
}
