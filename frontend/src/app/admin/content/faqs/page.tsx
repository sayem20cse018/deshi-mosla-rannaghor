'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState,
  FilterBar, Pagination, Modal, ConfirmDialog, Badge,
} from '@/components/admin/ui';
import {
  useAdminFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq,
} from '@/hooks/useAdminContent';
import { truncate } from '@/lib/utils';

interface FaqForm {
  question:   string;
  questionEn: string;
  answer:     string;
  answerEn:   string;
  sortOrder:  number;
  isPublished: boolean;
}

const EMPTY_FORM: FaqForm = {
  question: '', questionEn: '', answer: '', answerEn: '',
  sortOrder: 0, isPublished: true,
};

export default function FaqsPage() {
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId,    setEditId]    = useState<string | null>(null);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [form,      setForm]      = useState<FaqForm>(EMPTY_FORM);

  const { data, isLoading, isError, refetch } = useAdminFaqs({ page, search });
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const faqs     = data?.data   ?? [];
  const meta     = data?.meta   ?? {};
  const total    = meta.total   ?? 0;
  const limit    = meta.limit   ?? 20;
  const totalPages = Math.ceil(total / limit) || 1;

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(faq: Record<string, unknown>) {
    setEditId(String(faq.id));
    setForm({
      question:    String(faq.question    ?? ''),
      questionEn:  String(faq.questionEn  ?? ''),
      answer:      String(faq.answer      ?? ''),
      answerEn:    String(faq.answerEn    ?? ''),
      sortOrder:   Number(faq.sortOrder   ?? 0),
      isPublished: Boolean(faq.isPublished ?? true),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (editId) {
      await updateFaq.mutateAsync({ id: editId, ...form });
    } else {
      await createFaq.mutateAsync(form);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (deleteId) {
      await deleteFaq.mutateAsync(deleteId);
      setDeleteId(null);
    }
  }

  const saving = createFaq.isPending || updateFaq.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions"
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={openCreate}>New FAQ</AdminBtn>}
      />

      <FilterBar
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search questions..."
      />

      {isLoading && <LoadingState message="Loading FAQs..." />}
      {isError   && <ErrorState message="Failed to load FAQs." onRetry={() => refetch()} />}

      {!isLoading && !isError && faqs.length === 0 && (
        <EmptyState
          title="No FAQs yet"
          description="Click 'New FAQ' to add the first question."
          action={<AdminBtn onClick={openCreate} icon={<Plus className="w-4 h-4" />}>New FAQ</AdminBtn>}
        />
      )}

      {!isLoading && !isError && faqs.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Order', 'Question', 'Status', 'Actions'].map((c) => (
                    <th key={c} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {faqs.map((faq: Record<string, unknown>) => (
                  <tr key={String(faq.id)} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-bold w-16">{String(faq.sortOrder ?? '—')}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{truncate(String(faq.question ?? ''), 80)}</p>
                      {Boolean(faq.questionEn) && (
                        <p className="text-xs text-gray-400 mt-0.5">{truncate(String(faq.questionEn), 80)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {faq.isPublished
                        ? <Badge variant="success">Published</Badge>
                        : <Badge variant="warning">Hidden</Badge>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(faq)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(String(faq.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onChange={setPage} />
        </>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit FAQ' : 'New FAQ'}
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-4">
            <FormField label="Question (Bengali)">
              <textarea
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                rows={2}
                className="input-base resize-none"
                placeholder="প্রশ্ন লিখুন..."
              />
            </FormField>
            <FormField label="Question (English)">
              <textarea
                value={form.questionEn}
                onChange={(e) => setForm({ ...form, questionEn: e.target.value })}
                rows={2}
                className="input-base resize-none"
                placeholder="Question in English..."
              />
            </FormField>
            <FormField label="Answer (Bengali)">
              <textarea
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                rows={3}
                className="input-base resize-none"
                placeholder="উত্তর লিখুন..."
              />
            </FormField>
            <FormField label="Answer (English)">
              <textarea
                value={form.answerEn}
                onChange={(e) => setForm({ ...form, answerEn: e.target.value })}
                rows={3}
                className="input-base resize-none"
                placeholder="Answer in English..."
              />
            </FormField>
          </div>

          <div className="flex items-center gap-6">
            <FormField label="Sort Order">
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                className="input-base w-24"
                min={0}
              />
            </FormField>

            <label className="flex items-center gap-3 cursor-pointer mt-5">
              <div
                onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-orange-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow m-0.5 transition-transform ${form.isPublished ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700">Published</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <AdminBtn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminBtn>
            <AdminBtn loading={saving} onClick={handleSave}>
              {editId ? 'Save Changes' : 'Create FAQ'}
            </AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This cannot be undone."
        loading={deleteFaq.isPending}
        danger
      />

      <style jsx>{`
        .input-base {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .input-base:focus {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgb(249 115 22 / 0.15);
        }
      `}</style>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}
