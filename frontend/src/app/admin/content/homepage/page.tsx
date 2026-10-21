'use client';

import { useState, useEffect } from 'react';
import {
  ChevronUp, ChevronDown, GripVertical, Edit2, Eye, EyeOff,
  Save, Loader2, Settings, Image as ImageIcon, Type, Link2,
  RefreshCw, X, Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminHomepageSections, useUpsertHomepageSection,
  useToggleHomepageSection, useReorderHomepageSections,
  HomepageSection,
} from '@/hooks/useHomepageCms';
import {
  PageHeader, AdminBtn, Modal, LoadingState, ErrorState, EmptyState,
} from '@/components/admin/ui';

// ── Section definitions (seed defaults if DB empty) ───────────────────────────
const SECTION_DEFS: {
  key:     string;
  label:   string;
  icon:    string;
  hint:    string;
  fields:  ('title'|'subtitle'|'description'|'image'|'imageMobile'|'button'|'extraData')[];
}[] = [
  { key: 'announcement',    label: 'Announcement Bar',     icon: '📢', hint: 'Top-of-page scrolling announcement text.',                 fields: ['title','subtitle','button'] },
  { key: 'hero',            label: 'Hero Slider',          icon: '🖼️',  hint: 'Controlled by Hero Slides page. Enable/disable here.',     fields: [] },
  { key: 'trust',           label: 'Trust / Benefits',     icon: '✅', hint: '4 trust badge cards below the hero.',                      fields: ['title','extraData'] },
  { key: 'categories',      label: 'Featured Categories',  icon: '🏷️',  hint: 'Category grid section.',                                  fields: ['title','subtitle'] },
  { key: 'top_selling',     label: 'Top Selling Products', icon: '🔥', hint: 'Best selling products row.',                               fields: ['title','subtitle','extraData'] },
  { key: 'new_arrivals',    label: 'New Arrivals',         icon: '✨', hint: 'Latest products row.',                                     fields: ['title','subtitle','extraData'] },
  { key: 'promo_banner',    label: 'Promotional Banner',   icon: '🎁', hint: 'Full-width promotional image/text banner.',                fields: ['title','subtitle','image','imageMobile','button'] },
  { key: 'collections',     label: 'Collections',          icon: '📦', hint: 'Collection showcase rows (from Collections module).',      fields: ['title','subtitle','extraData'] },
  { key: 'signature',       label: 'Signature Products',   icon: '⭐', hint: 'Curated signature product section.',                      fields: ['title','subtitle','extraData'] },
  { key: 'recipes',         label: 'Recipes Section',      icon: '🍳', hint: 'Recipe cards section.',                                   fields: ['title','subtitle','button'] },
  { key: 'story',           label: 'Brand Story',          icon: '📖', hint: 'Brand story / about section on homepage.',                 fields: ['title','subtitle','description','image','button'] },
  { key: 'testimonials',    label: 'Testimonials',         icon: '💬', hint: 'Customer review cards.',                                  fields: ['title','subtitle'] },
  { key: 'newsletter',      label: 'Newsletter',           icon: '📧', hint: 'Email subscription section.',                             fields: ['title','subtitle','button'] },
  { key: 'footer',          label: 'Footer',               icon: '🦶', hint: 'Footer content and links.',                               fields: ['description','extraData'] },
];

// ── Section Row ───────────────────────────────────────────────────────────────

interface SectionRowProps {
  def:      typeof SECTION_DEFS[0];
  section:  HomepageSection | undefined;
  idx:      number;
  total:    number;
  onMove:   (dir: -1|1) => void;
  onToggle: () => void;
  onEdit:   () => void;
  toggling: boolean;
}

function SectionRow({ def, section, idx, total, onMove, onToggle, onEdit, toggling }: SectionRowProps) {
  const enabled = section?.isEnabled ?? true;

  return (
    <div className={cn(
      'bg-white rounded-2xl border shadow-sm transition-all',
      enabled ? 'border-gray-100' : 'border-gray-100 opacity-55',
    )}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Reorder */}
        <div className="flex flex-col gap-0.5 flex-shrink-0">
          <button onClick={() => onMove(-1)} disabled={idx === 0}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-20">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <GripVertical className="w-4 h-4 text-gray-300 mx-auto" />
          <button onClick={() => onMove(1)} disabled={idx === total - 1}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-20">
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Icon + Label */}
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-lg flex-shrink-0 border border-gray-100">
          {def.icon}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{def.label}</p>
          <p className="text-xs text-gray-400 truncate">{def.hint}</p>
          {section?.title && (
            <p className="text-xs text-orange-600 mt-0.5 truncate">"{section.title}"</p>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full',
            enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500',
          )}>
            {enabled ? 'On' : 'Off'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {def.fields.length > 0 && (
            <button onClick={onEdit}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-orange-50 text-orange-500 transition-colors"
              title="Edit content">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button onClick={onToggle} disabled={toggling}
            className={cn(
              'w-8 h-8 flex items-center justify-center rounded-xl transition-colors',
              enabled ? 'hover:bg-red-50 text-red-400' : 'hover:bg-green-50 text-green-500',
            )}
            title={enabled ? 'Disable section' : 'Enable section'}>
            {toggling
              ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              : enabled ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section Edit Form ─────────────────────────────────────────────────────────

interface SectionFormProps {
  def:     typeof SECTION_DEFS[0];
  section: HomepageSection | undefined;
  onSave:  (dto: Partial<HomepageSection> & { key: string }) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

function SectionForm({ def, section, onSave, onClose, loading }: SectionFormProps) {
  const [form, setForm] = useState<Record<string, string>>({
    title:        section?.title        ?? '',
    titleEn:      section?.titleEn      ?? '',
    subtitle:     section?.subtitle     ?? '',
    subtitleEn:   section?.subtitleEn   ?? '',
    description:  section?.description  ?? '',
    image:        section?.image        ?? '',
    imageMobile:  section?.imageMobile  ?? '',
    buttonLabel:   section?.buttonLabel  ?? '',
    buttonLabelEn: section?.buttonLabelEn ?? '',
    buttonUrl:    section?.buttonUrl    ?? '',
  });

  const [extraData, setExtraData] = useState(
    section?.extraData ? JSON.stringify(section.extraData, null, 2) : '',
  );
  const [extraError, setExtraError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const textField = (label: string, key: string, multiline = false, placeholder = '') => (
    <div key={key}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      {multiline ? (
        <textarea value={form[key] ?? ''} onChange={(e) => set(key, e.target.value)}
          rows={3} placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
      ) : (
        <input type="text" value={form[key] ?? ''} onChange={(e) => set(key, e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400" />
      )}
    </div>
  );

  async function handleSave() {
    let parsedExtra: Record<string, unknown> | undefined;
    if (extraData.trim()) {
      try { parsedExtra = JSON.parse(extraData); setExtraError(''); }
      catch { setExtraError('Invalid JSON'); return; }
    }
    await onSave({
      key: def.key,
      ...form,
      extraData: parsedExtra,
    });
  }

  const hasField = (f: string) => def.fields.includes(f as any);

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <p className="text-xs text-gray-500 bg-gray-50 rounded-xl p-3">{def.hint}</p>

      {/* Title */}
      {hasField('title') && (
        <div className="grid grid-cols-2 gap-3">
          {textField('Title (BN)', 'title', false, 'e.g. সেরা পণ্য')}
          {textField('Title (EN)', 'titleEn', false, 'e.g. Best Products')}
        </div>
      )}

      {/* Subtitle */}
      {hasField('subtitle') && (
        <div className="grid grid-cols-2 gap-3">
          {textField('Subtitle (BN)', 'subtitle', false, 'e.g. আমাদের নির্বাচিত পণ্য')}
          {textField('Subtitle (EN)', 'subtitleEn', false, 'e.g. Our selected products')}
        </div>
      )}

      {/* Description */}
      {hasField('description') && (
        <div className="grid grid-cols-2 gap-3">
          {textField('Description (BN)', 'description', true)}
          {textField('Description (EN)', 'descriptionEn', true)}
        </div>
      )}

      {/* Images */}
      {hasField('image') && (
        <div className="grid grid-cols-2 gap-3">
          {textField('Desktop Image URL', 'image', false, 'https://res.cloudinary.com/...')}
          {hasField('imageMobile') && textField('Mobile Image URL', 'imageMobile', false, 'https://res.cloudinary.com/...')}
        </div>
      )}

      {/* Button */}
      {hasField('button') && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {textField('Button Label (BN)', 'buttonLabel', false, 'e.g. সব দেখুন')}
            {textField('Button Label (EN)', 'buttonLabelEn', false, 'e.g. View All')}
          </div>
          {textField('Button URL', 'buttonUrl', false, '/shop')}
        </>
      )}

      {/* Extra Data (JSON) */}
      {hasField('extraData') && (
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
            Extra Config (JSON)
          </label>
          <textarea
            value={extraData}
            onChange={(e) => { setExtraData(e.target.value); setExtraError(''); }}
            rows={4}
            placeholder={'{\n  "limit": 8,\n  "slug": "mosla"\n}'}
            className={cn(
              'w-full border rounded-xl px-3 py-2 text-xs font-mono resize-none focus:outline-none focus:ring-2',
              extraError ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-200 focus:border-orange-400',
            )}
          />
          {extraError && <p className="text-xs text-red-500 mt-1">{extraError}</p>}
          <p className="text-xs text-gray-400 mt-1">Use JSON for section-specific options like limit, slug, colors, etc.</p>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
        <AdminBtn variant="secondary" onClick={onClose} className="flex-1">Cancel</AdminBtn>
        <AdminBtn variant="primary" loading={loading} onClick={handleSave} className="flex-1">
          Save Section
        </AdminBtn>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HomepageCmsPage() {
  const { data, isLoading, isError, refetch } = useAdminHomepageSections();
  const upsert   = useUpsertHomepageSection();
  const toggle   = useToggleHomepageSection();
  const reorder  = useReorderHomepageSections();

  const dbSections = data?.data ?? [];

  // Local ordered list of section keys (for reorder UX)
  const [order, setOrder] = useState<string[]>(() => SECTION_DEFS.map((d) => d.key));
  const [editing, setEditing] = useState<typeof SECTION_DEFS[0] | null>(null);
  const [togglingKey, setTogglingKey] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Sync order from DB sortOrder on load
  useEffect(() => {
    if (!dbSections.length) return;
    const sorted = [...SECTION_DEFS].sort((a, b) => {
      const aS = dbSections.find((s) => s.key === a.key)?.sortOrder ?? 99;
      const bS = dbSections.find((s) => s.key === b.key)?.sortOrder ?? 99;
      return aS - bS;
    });
    setOrder(sorted.map((d) => d.key));
  }, [dbSections.length]);

  function getSectionForKey(key: string) {
    return dbSections.find((s) => s.key === key);
  }

  function getDefForKey(key: string) {
    return SECTION_DEFS.find((d) => d.key === key)!;
  }

  function move(idx: number, dir: -1 | 1) {
    const next = idx + dir;
    if (next < 0 || next >= order.length) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[next]] = [newOrder[next], newOrder[idx]];
    setOrder(newOrder);
    reorder.mutate(newOrder.map((key, i) => ({ key, sortOrder: i })));
  }

  async function handleToggle(key: string) {
    const current = getSectionForKey(key);
    const enabled = current?.isEnabled ?? true;
    setTogglingKey(key);
    await toggle.mutateAsync({ key, isEnabled: !enabled });
    setTogglingKey(null);
  }

  async function handleSave(dto: Partial<HomepageSection> & { key: string }) {
    await upsert.mutateAsync(dto);
    setSaved(dto.key);
    setTimeout(() => setSaved(null), 2000);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage CMS"
        description="Enable/disable and edit every homepage section. Reorder with arrows."
        action={
          <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>
            Refresh
          </AdminBtn>
        }
      />

      {/* Info banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <Settings className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-orange-800">
          <p className="font-bold">Admin CMS</p>
          <p className="text-xs mt-0.5 text-orange-700">
            Toggle sections on/off instantly. Click Edit to change titles, images and button links.
            Hero slides are managed separately at Content &rarr; Hero Slides.
          </p>
        </div>
      </div>

      {isLoading && <LoadingState message="Loading sections..." />}
      {isError   && <ErrorState message="Failed to load sections." onRetry={refetch} />}

      {!isLoading && (
        <div className="space-y-2">
          {order.map((key, idx) => {
            const def     = getDefForKey(key);
            const section = getSectionForKey(key);
            if (!def) return null;
            return (
              <div key={key} className="relative">
                <SectionRow
                  def={def}
                  section={section}
                  idx={idx}
                  total={order.length}
                  onMove={(dir) => move(idx, dir)}
                  onToggle={() => handleToggle(key)}
                  onEdit={() => setEditing(def)}
                  toggling={togglingKey === key}
                />
                {/* Saved flash */}
                {saved === key && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full pointer-events-none">
                    <Check className="w-3 h-3" /> Saved
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit: ${editing.label}` : ''}
        size="lg"
      >
        {editing && (
          <SectionForm
            def={editing}
            section={getSectionForKey(editing.key)}
            onSave={handleSave}
            onClose={() => setEditing(null)}
            loading={upsert.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
