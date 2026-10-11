'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FileText, Save } from 'lucide-react';
import { PageHeader, AdminBtn, LoadingState, ErrorState } from '@/components/admin/ui';
import { useSettings, useSaveSettings } from '@/hooks/useSettings';

const PAGES = [
  { key: 'pages.about.content',          label: 'About Us',          placeholder: 'About our store...' },
  { key: 'pages.privacy.content',        label: 'Privacy Policy',    placeholder: 'Privacy policy content...' },
  { key: 'pages.terms.content',          label: 'Terms & Conditions',placeholder: 'Terms and conditions...' },
  { key: 'pages.return.content',         label: 'Return Policy',     placeholder: 'Return policy content...' },
  { key: 'pages.shipping.content',       label: 'Shipping Policy',   placeholder: 'Shipping information...' },
];

export default function PagesPage() {
  const { data, isLoading, isError } = useSettings('pages');
  const save = useSaveSettings();
  const [values, setValues] = useState<Record<string, string>>({});
  const [active, setActive] = useState(PAGES[0].key);

  useEffect(() => {
    if (data?.data?.settings) {
      const m: Record<string, string> = {};
      data.data.settings.forEach((s: any) => { m[s.key] = s.value; });
      setValues(m);
    }
  }, [data]);

  async function handleSave() {
    const settings = Object.entries(values)
      .filter(([key]) => key.startsWith('pages.') || PAGES.some(p => p.key === key))
      .map(([key, value]) => ({ key, value }));
    if (!settings.length) return;
    try {
      await save.mutateAsync(settings);
      toast.success('Page content saved.');
    } catch { toast.error('Save failed.'); }
  }

  const currentPage = PAGES.find(p => p.key === active)!;

  if (isLoading) return <LoadingState message="Loading pages..." />;
  if (isError)   return <ErrorState message="Failed to load page content." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Static Pages"
        description="Edit content for static information pages."
        action={<AdminBtn icon={<Save className="w-4 h-4" />} loading={save.isPending} onClick={handleSave}>Save Page</AdminBtn>}
      />

      <div className="flex gap-5 items-start">
        {/* Page list */}
        <div className="w-48 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          {PAGES.map(p => (
            <button key={p.key} onClick={() => setActive(p.key)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${active === p.key ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <FileText className="w-3.5 h-3.5 inline mr-2 opacity-60" />
              {p.label}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-black text-gray-900 mb-3">{currentPage.label}</h3>
          <textarea
            value={values[currentPage.key] ?? ''}
            onChange={e => setValues(v => ({ ...v, [currentPage.key]: e.target.value }))}
            placeholder={currentPage.placeholder}
            rows={20}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-2">Content is saved to database and displayed on the corresponding page.</p>
        </div>
      </div>
    </div>
  );
}