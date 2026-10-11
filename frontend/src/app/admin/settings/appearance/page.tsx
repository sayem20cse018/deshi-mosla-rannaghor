'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Palette, Facebook, Instagram, Youtube, Twitter,
  Megaphone, Phone, Plus, Pencil, Trash2,
  Truck, Tag, Gift, Zap, Store,
} from 'lucide-react';
import {
  PageHeader, AdminBtn, Modal, ConfirmDialog,
  LoadingState, ErrorState, Badge,
} from '@/components/admin/ui';
import { UploadButton } from '@/components/admin/media/UploadButton';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';
import api from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Announcement {
  id:         string;
  text:       string;
  textEn?:    string;
  link?:      string;
  icon?:      string;
  bgColor:    string;
  textColor:  string;
  isActive:   boolean;
  sortOrder:  number;
}

interface AnnouncementForm {
  text:       string;
  textEn:     string;
  link:       string;
  icon:       string;
  bgColor:    string;
  textColor:  string;
  isActive:   boolean;
  sortOrder:  number;
}

const ICON_OPTIONS = [
  { value: 'truck',  label: 'Truck',  Icon: Truck },
  { value: 'tag',    label: 'Tag',    Icon: Tag },
  { value: 'gift',   label: 'Gift',   Icon: Gift },
  { value: 'zap',    label: 'Zap',    Icon: Zap },
];

const TABS = [
  { id: 'branding',      label: 'Logo & Branding', icon: Palette },
  { id: 'social',        label: 'Social Media',    icon: Facebook },
  { id: 'announcements', label: 'Announcement Bar',icon: Megaphone },
  { id: 'contact',       label: 'Store Contact',   icon: Store },
] as const;

type TabId = typeof TABS[number]['id'];

const BLANK_ANN: AnnouncementForm = {
  text: '', textEn: '', link: '', icon: 'truck',
  bgColor: '#ea580c', textColor: '#ffffff', isActive: true, sortOrder: 0,
};

// ─── Tab: Logo & Branding ──────────────────────────────────────────────────

function BrandingTab() {
  const { data, isLoading, isError, refetch } = useSettings('brand');
  const save = useSaveSettings();

  const grouped = data?.data?.grouped?.brand ?? {};
  const [form, setForm] = useState({
    'brand.logo':         '',
    'brand.logo_mobile':  '',
    'brand.favicon':      '',
    'brand.logo_text':    '',
    'brand.logo_text_en': '',
    'brand.tagline':      '',
  });

  useEffect(() => {
    if (grouped && Object.keys(grouped).length > 0) {
      setForm({
        'brand.logo':         grouped['logo']         ?? '',
        'brand.logo_mobile':  grouped['logo_mobile']  ?? '',
        'brand.favicon':      grouped['favicon']      ?? '',
        'brand.logo_text':    grouped['logo_text']    ?? '',
        'brand.logo_text_en': grouped['logo_text_en'] ?? '',
        'brand.tagline':      grouped['tagline']      ?? '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
    save.mutate(settings, {
      onSuccess: () => toast.success('Branding saved'),
      onError:   () => toast.error('Failed to save branding'),
    });
  };

  if (isLoading) return <LoadingState message="Loading brand settings…" />;
  if (isError)   return <ErrorState message="Failed to load brand settings" onRetry={refetch} />;

  return (
    <div className="space-y-8">
      {/* Image Uploads */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Logos & Favicon</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Desktop Logo</label>
            <UploadButton
              value={form['brand.logo']}
              onChange={(url) => setForm(f => ({ ...f, 'brand.logo': url }))}
              folder="branding"
              label="Upload Logo"
              aspectRatio="wide"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Logo</label>
            <UploadButton
              value={form['brand.logo_mobile']}
              onChange={(url) => setForm(f => ({ ...f, 'brand.logo_mobile': url }))}
              folder="branding"
              label="Upload Mobile Logo"
              aspectRatio="square"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Favicon</label>
            <UploadButton
              value={form['brand.favicon']}
              onChange={(url) => setForm(f => ({ ...f, 'brand.favicon': url }))}
              folder="branding"
              label="Upload Favicon"
              aspectRatio="square"
            />
          </div>
        </div>
      </div>

      {/* Text Fields */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-5">Text & Tagline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { key: 'brand.logo_text',    label: 'Logo Text (Bengali)',  placeholder: 'দেশি মসলার রান্নাঘর' },
            { key: 'brand.logo_text_en', label: 'Logo Text (English)',  placeholder: 'Deshi Moslar' },
            { key: 'brand.tagline',      label: 'Tagline',              placeholder: '100% authentic deshi products' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className={key === 'brand.tagline' ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      {(form['brand.logo'] || form['brand.logo_text']) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Preview</h3>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            {form['brand.logo'] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form['brand.logo']} alt="Logo preview" className="h-10 object-contain" />
            ) : (
              <span className="text-lg font-black text-orange-600">{form['brand.logo_text']}</span>
            )}
            {form['brand.tagline'] && (
              <span className="text-xs text-gray-500 italic">{form['brand.tagline']}</span>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <AdminBtn onClick={handleSave} loading={save.isPending}>
          Save Branding
        </AdminBtn>
      </div>
    </div>
  );
}

// ─── Tab: Social Media ─────────────────────────────────────────────────────

function SocialTab() {
  const { data: socialData, isLoading: loadSocial, isError: errSocial, refetch: refetchSocial } = useSettings('social');
  const { data: storeData,  isLoading: loadStore,  isError: errStore }  = useSettings('store');
  const save = useSaveSettings();

  const socialGrouped = socialData?.data?.grouped?.social ?? {};
  const storeGrouped  = storeData?.data?.grouped?.store   ?? {};

  const [form, setForm] = useState({
    'social.facebook':  '',
    'social.instagram': '',
    'social.youtube':   '',
    'social.twitter':   '',
    'store.whatsapp':   '',
  });

  useEffect(() => {
    if (Object.keys(socialGrouped).length > 0 || Object.keys(storeGrouped).length > 0) {
      setForm({
        'social.facebook':  socialGrouped['facebook']  ?? '',
        'social.instagram': socialGrouped['instagram'] ?? '',
        'social.youtube':   socialGrouped['youtube']   ?? '',
        'social.twitter':   socialGrouped['twitter']   ?? '',
        'store.whatsapp':   storeGrouped['whatsapp']   ?? '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socialData, storeData]);

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
    save.mutate(settings, {
      onSuccess: () => toast.success('Social links saved'),
      onError:   () => toast.error('Failed to save social links'),
    });
  };

  const isLoading = loadSocial || loadStore;
  const isError   = errSocial  || errStore;

  if (isLoading) return <LoadingState message="Loading social settings…" />;
  if (isError)   return <ErrorState message="Failed to load social settings" onRetry={refetchSocial} />;

  const FIELDS = [
    { key: 'social.facebook',  label: 'Facebook URL',  Icon: Facebook,  placeholder: 'https://facebook.com/yourpage' },
    { key: 'social.instagram', label: 'Instagram URL', Icon: Instagram, placeholder: 'https://instagram.com/yourhandle' },
    { key: 'social.youtube',   label: 'YouTube URL',   Icon: Youtube,   placeholder: 'https://youtube.com/yourchannel' },
    { key: 'social.twitter',   label: 'Twitter / X',   Icon: Twitter,   placeholder: 'https://twitter.com/yourhandle' },
    { key: 'store.whatsapp',   label: 'WhatsApp',      Icon: Phone,     placeholder: '+880 1700-000000' },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
        {FIELDS.map(({ key, label, Icon, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={form[key]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
            {form[key] && (
              <a href={form[key]} target="_blank" rel="noopener noreferrer"
                className="text-xs text-orange-500 hover:text-orange-600 mt-1 inline-block truncate max-w-sm">
                {form[key]}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <AdminBtn onClick={handleSave} loading={save.isPending}>
          Save Social Links
        </AdminBtn>
      </div>
    </div>
  );
}

// ─── Tab: Announcement Bar ────────────────────────────────────────────────

function AnnouncementsTab() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm]                 = useState<AnnouncementForm>(BLANK_ANN);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data } = await api.get('/admin/announcements');
      return (data?.data ?? data) as Announcement[];
    },
  });

  const createMut = useMutation({
    mutationFn: (dto: AnnouncementForm) => api.post('/admin/announcements', dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-announcements'] }); toast.success('Announcement created'); closeModal(); },
    onError:   () => toast.error('Failed to create announcement'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<AnnouncementForm> }) =>
      api.patch(`/admin/announcements/${id}`, dto),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-announcements'] }); toast.success('Announcement updated'); closeModal(); },
    onError:   () => toast.error('Failed to update announcement'),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/announcements/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-announcements'] }); toast.success('Announcement deleted'); setDeleteTarget(null); },
    onError:   () => toast.error('Failed to delete announcement'),
  });

  const openCreate = () => { setEditing(null); setForm(BLANK_ANN); setModalOpen(true); };
  const openEdit   = (a: Announcement) => {
    setEditing(a);
    setForm({ text: a.text, textEn: a.textEn ?? '', link: a.link ?? '', icon: a.icon ?? 'truck',
              bgColor: a.bgColor, textColor: a.textColor, isActive: a.isActive, sortOrder: a.sortOrder });
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = () => {
    if (!form.text.trim()) { toast.error('Bengali text is required'); return; }
    if (editing) updateMut.mutate({ id: editing.id, dto: form });
    else         createMut.mutate(form);
  };

  const isSaving = createMut.isPending || updateMut.isPending;
  const items    = data ?? [];

  const AnnouncementIcon = ({ iconName }: { iconName?: string }) => {
    const found = ICON_OPTIONS.find(o => o.value === iconName);
    if (!found) return <Truck className="w-4 h-4" />;
    return <found.Icon className="w-4 h-4" />;
  };

  if (isLoading) return <LoadingState message="Loading announcements…" />;
  if (isError)   return <ErrorState message="Failed to load announcements" onRetry={refetch} />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Changes auto-sync to the announcement bar on the storefront.</p>
        <AdminBtn icon={<Plus className="w-4 h-4" />} onClick={openCreate} disabled={items.length >= 6}>
          Add Announcement
        </AdminBtn>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No announcements yet. Add one to display on the storefront.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {items.map((a, idx) => (
            <div key={a.id} className={`flex items-center gap-4 px-5 py-4 ${idx < items.length - 1 ? 'border-b border-gray-50' : ''}`}>
              {/* Color + Icon preview */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: a.bgColor, color: a.textColor }}>
                <AnnouncementIcon iconName={a.icon} />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{a.text}</p>
                {a.textEn && <p className="text-xs text-gray-400 truncate">{a.textEn}</p>}
              </div>
              {/* Color swatch */}
              <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
                   style={{ background: a.bgColor }} title={a.bgColor} />
              {/* Active badge */}
              <Badge variant={a.isActive ? 'success' : 'default'}>
                {a.isActive ? 'Active' : 'Inactive'}
              </Badge>
              {/* Actions */}
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(a)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTarget(a.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length >= 6 && (
        <p className="text-xs text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
          Maximum 6 announcements reached. Delete one to add a new entry.
        </p>
      )}

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Edit Announcement' : 'Add Announcement'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Text (Bengali) <span className="text-red-500">*</span></label>
            <input type="text" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              placeholder="৳১০০০+ অর্ডারে ফ্রি ডেলিভারি"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Text (English)</label>
            <input type="text" value={form.textEn} onChange={e => setForm(f => ({ ...f, textEn: e.target.value }))}
              placeholder="Free delivery on orders ৳1000+"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link URL</label>
            <input type="url" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
              placeholder="https://example.com/offer"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Icon</label>
            <div className="flex gap-2">
              {ICON_OPTIONS.map(({ value, label, Icon }) => (
                <button key={value} type="button" onClick={() => setForm(f => ({ ...f, icon: value }))}
                  className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                    form.icon === value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={form.bgColor} onChange={e => setForm(f => ({ ...f, bgColor: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={form.textColor} onChange={e => setForm(f => ({ ...f, textColor: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
              <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))}
                min={0} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-orange-500' : 'bg-gray-200'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
          </div>
          {/* Preview */}
          <div className="rounded-xl overflow-hidden">
            <p className="text-xs font-semibold text-gray-500 mb-2">Preview</p>
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                 style={{ background: form.bgColor, color: form.textColor }}>
              {(() => { const opt = ICON_OPTIONS.find(o => o.value === form.icon); return opt ? <opt.Icon className="w-4 h-4" /> : null; })()}
              {form.text || 'Announcement text…'}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <AdminBtn variant="secondary" onClick={closeModal}>Cancel</AdminBtn>
            <AdminBtn onClick={handleSubmit} loading={isSaving}>
              {editing ? 'Update' : 'Create'}
            </AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMut.mutate(deleteTarget)}
        loading={deleteMut.isPending}
        title="Delete Announcement"
        message="Are you sure you want to delete this announcement? This action cannot be undone."
        danger
      />
    </div>
  );
}

// ─── Tab: Store Contact ────────────────────────────────────────────────────

function ContactTab() {
  const { data, isLoading, isError, refetch } = useSettings('store');
  const save = useSaveSettings();

  const grouped = data?.data?.grouped?.store ?? {};
  const [form, setForm] = useState({
    'store.name':    '',
    'store.name_en': '',
    'store.email':   '',
    'store.phone':   '',
    'store.phone2':  '',
    'store.address': '',
  });

  useEffect(() => {
    if (grouped && Object.keys(grouped).length > 0) {
      setForm({
        'store.name':    grouped['name']    ?? '',
        'store.name_en': grouped['name_en'] ?? '',
        'store.email':   grouped['email']   ?? '',
        'store.phone':   grouped['phone']   ?? '',
        'store.phone2':  grouped['phone2']  ?? '',
        'store.address': grouped['address'] ?? '',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleSave = () => {
    const settings = Object.entries(form).map(([key, value]) => ({ key, value }));
    save.mutate(settings, {
      onSuccess: () => toast.success('Contact info saved'),
      onError:   () => toast.error('Failed to save contact info'),
    });
  };

  if (isLoading) return <LoadingState message="Loading store settings…" />;
  if (isError)   return <ErrorState message="Failed to load store settings" onRetry={refetch} />;

  const FIELDS: { key: keyof typeof form; label: string; placeholder: string; type?: string; span?: boolean }[] = [
    { key: 'store.name',    label: 'Store Name (Bengali)', placeholder: 'দেশি মসলার রান্নাঘর' },
    { key: 'store.name_en', label: 'Store Name (English)', placeholder: 'Deshi Moslar Rannaghar' },
    { key: 'store.email',   label: 'Email Address',        placeholder: 'info@deshimoslar.com', type: 'email' },
    { key: 'store.phone',   label: 'Phone Number',         placeholder: '+880 1700-000000', type: 'tel' },
    { key: 'store.phone2',  label: 'Second Phone',         placeholder: '+880 1800-000000', type: 'tel' },
    { key: 'store.address', label: 'Address',              placeholder: 'Dhaka, Bangladesh', span: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-5">This information appears in the website footer and contact pages.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map(({ key, label, placeholder, type = 'text', span }) => (
            <div key={key} className={span ? 'sm:col-span-2' : ''}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <AdminBtn onClick={handleSave} loading={save.isPending}>
          Save Contact Info
        </AdminBtn>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function AppearancePage() {
  const [activeTab, setActiveTab] = useState<TabId>('branding');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Appearance & Branding"
        description="Manage your store's visual identity, social links, announcements, and contact info."
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-8 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${
              activeTab === id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'branding'      && <BrandingTab />}
      {activeTab === 'social'        && <SocialTab />}
      {activeTab === 'announcements' && <AnnouncementsTab />}
      {activeTab === 'contact'       && <ContactTab />}
    </div>
  );
}
