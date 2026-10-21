'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2, Search } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { cn, formatPriceEn } from '@/lib/utils';
import {
  useAdminCollection,
  useUpdateCollection,
  useAddCollectionProduct,
  useRemoveCollectionProduct,
} from '@/hooks/useAdminCollections';
import { AdminBtn, LoadingState, ErrorState, ConfirmDialog } from '@/components/admin/ui';
import api from '@/lib/api';

interface ProductSearchResult {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discountPrice: number | null;
  primaryImage: string | null;
}

export default function EditCollectionPage() {
  const params    = useParams<{ id: string }>();
  const id        = params.id;
  const router    = useRouter();
  const updateMut = useUpdateCollection();
  const addProductMut    = useAddCollectionProduct();
  const removeProductMut = useRemoveCollectionProduct();

  const { data: collection, isLoading, error } = useAdminCollection(id);
  const [saving,       setSaving]       = useState(false);
  const [ready,        setReady]        = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<ProductSearchResult[]>([]);
  const [searching,    setSearching]    = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);

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

  useEffect(() => {
    if (collection && !ready) {
      setForm({
        name:        collection.name        ?? '',
        nameEn:      collection.nameEn      ?? '',
        slug:        collection.slug        ?? '',
        description: collection.description ?? '',
        image:       collection.image       ?? '',
        banner:      collection.banner      ?? '',
        isActive:    collection.isActive    ?? true,
        sortOrder:   collection.sortOrder   ?? 0,
        metaTitle:   collection.metaTitle   ?? '',
        metaDesc:    collection.metaDesc    ?? '',
      });
      setReady(true);
    }
  }, [collection, ready]);

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.slug.trim()) { toast.error('Slug is required'); return; }

    setSaving(true);
    try {
      await updateMut.mutateAsync({
        id,
        data: {
          ...form,
          sortOrder:   Number(form.sortOrder) || 0,
          nameEn:      form.nameEn      || undefined,
          description: form.description || undefined,
          image:       form.image       || undefined,
          banner:      form.banner      || undefined,
          metaTitle:   form.metaTitle   || undefined,
          metaDesc:    form.metaDesc    || undefined,
        },
      });
      toast.success('Collection updated');
      router.push('/admin/catalog/collections');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleProductSearch() {
    if (!productSearch.trim()) return;
    setSearching(true);
    try {
      const res = await api.get('/products/admin/list', { params: { search: productSearch, limit: 10 } });
      setSearchResults(res.data.data ?? []);
    } catch {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  }

  async function handleAddProduct(productId: string) {
    try {
      await addProductMut.mutateAsync({ collectionId: id, productId });
      toast.success('Product added');
      setSearchResults([]);
      setProductSearch('');
    } catch {
      toast.error('Failed to add product');
    }
  }

  async function handleRemoveProduct(productId: string) {
    try {
      await removeProductMut.mutateAsync({ collectionId: id, productId });
      toast.success('Product removed');
      setRemoveTarget(null);
    } catch {
      toast.error('Failed to remove product');
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white';
  const labelCls = 'block text-[11px] font-bold text-gray-500 uppercase tracking-[0.08em] mb-1.5';

  if (isLoading) return <LoadingState message="Loading collection..." />;
  if (error)     return <ErrorState message="Could not load collection" />;

  const existingProductIds = new Set((collection?.products ?? []).map((p) => p.id));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href="/admin/catalog/collections">
          <button type="button" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Edit Collection</h1>
          <p className="text-sm text-gray-400 mt-0.5">{form.name || 'Editing collection'}</p>
        </div>
        <AdminBtn type="submit" icon={<Save className="w-4 h-4" />} loading={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </AdminBtn>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          {/* Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Collection Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Collection Name *</label>
                <input value={form.name} onChange={set('name')} placeholder="Collection name" className={inputCls} required />
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

          {/* Media */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">Media</h3>
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input value={form.image} onChange={set('image')} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Banner Image URL</label>
              <input value={form.banner} onChange={set('banner')} placeholder="https://..." className={inputCls} />
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3 mb-4">
              Products ({(collection?.products ?? []).length})
            </h3>

            {/* Add product search */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleProductSearch(); } }}
                  placeholder="Search products to add..."
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
              <AdminBtn type="button" variant="secondary" size="sm" icon={<Plus className="w-3.5 h-3.5" />} loading={searching} onClick={handleProductSearch}>
                Search
              </AdminBtn>
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden mb-4">
                {searchResults.map((p) => {
                  const alreadyAdded = existingProductIds.has(p.id);
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                      {p.primaryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.primaryImage} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{formatPriceEn(p.discountPrice ?? p.price)}</span>
                      <button
                        type="button"
                        onClick={() => handleAddProduct(p.id)}
                        disabled={alreadyAdded}
                        className={cn(
                          'text-xs font-bold px-3 py-1.5 rounded-lg transition-colors',
                          alreadyAdded
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-50 text-orange-600 hover:bg-orange-100',
                        )}
                      >
                        {alreadyAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Current products */}
            {(collection?.products ?? []).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No products in this collection yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {(collection?.products ?? []).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-2.5">
                    {p.primaryImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.primaryImage} alt={p.name} className="w-9 h-9 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                    </div>
                    <span className="text-sm font-bold text-orange-600 hidden sm:block">{formatPriceEn(p.discountPrice ?? p.price)}</span>
                    <button
                      type="button"
                      onClick={() => setRemoveTarget(p.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            <h3 className="font-black text-gray-900 text-sm border-b border-gray-50 pb-3">SEO Settings</h3>
            <div>
              <label className={labelCls}>SEO Title</label>
              <input value={form.metaTitle} onChange={set('metaTitle')} placeholder="SEO title" className={inputCls} />
              <p className="text-[10px] text-gray-400 mt-1">{form.metaTitle.length}/60 chars</p>
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea value={form.metaDesc} onChange={set('metaDesc')} rows={3} placeholder="Meta description" className={cn(inputCls, 'resize-none')} />
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
        </div>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => removeTarget && handleRemoveProduct(removeTarget)}
        title="Remove Product"
        message="Remove this product from the collection? The product itself will not be deleted."
        loading={removeProductMut.isPending}
        danger
      />
    </form>
  );
}
