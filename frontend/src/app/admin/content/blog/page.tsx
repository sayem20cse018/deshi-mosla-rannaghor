'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import {
  PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState,
  FilterBar, Pagination, Modal, ConfirmDialog, Badge,
} from '@/components/admin/ui';
import { UploadButton } from '@/components/admin/media/UploadButton';
import {
  useAdminBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog,
} from '@/hooks/useAdminContent';
import { truncate } from '@/lib/utils';

interface BlogForm {
  title:           string;
  titleEn:         string;
  slug:            string;
  excerpt:         string;
  content:         string;
  coverImage:      string;
  isPublished:     boolean;
  seoTitle:        string;
  metaDescription: string;
}

const EMPTY_FORM: BlogForm = {
  title: '', titleEn: '', slug: '', excerpt: '',
  content: '', coverImage: '', isPublished: false,
  seoTitle: '', metaDescription: '',
};

function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function BlogPage() {
  const [page,         setPage]         = useState(1);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editId,       setEditId]       = useState<string | null>(null);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [form,         setForm]         = useState<BlogForm>(EMPTY_FORM);

  const limit = 15;
  const filters = {
    page, limit,
    ...(search       ? { search }                        : {}),
    ...(statusFilter ? { isPublished: statusFilter }     : {}),
  };

  const { data, isLoading, isError, refetch } = useAdminBlogs(filters);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const blogs    = data?.data   ?? [];
  const meta     = data?.meta   ?? {};
  const total    = meta.total   ?? 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Auto-slug from english title
  useEffect(() => {
    if (!editId) setForm((f) => ({ ...f, slug: slugify(f.titleEn) }));
  }, [form.titleEn, editId]);

  function openCreate() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(blog: Record<string, unknown>) {
    setEditId(String(blog.id));
    setForm({
      title:           String(blog.title           ?? ''),
      titleEn:         String(blog.titleEn         ?? ''),
      slug:            String(blog.slug            ?? ''),
      excerpt:         String(blog.excerpt         ?? ''),
      content:         String(blog.content         ?? ''),
      coverImage:      String(blog.coverImage      ?? ''),
      isPublished:     Boolean(blog.isPublished),
      seoTitle:        String(blog.seoTitle        ?? ''),
      metaDescription: String(blog.metaDescription ?? ''),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (editId) {
      await updateBlog.mutateAsync({ id: editId, ...form });
    } else {
      await createBlog.mutateAsync(form);
    }
    setModalOpen(false);
  }

  async function handleDelete() {
    if (deleteId) {
      await deleteBlog.mutateAsync(deleteId);
      setDeleteId(null);
    }
  }

  const saving = createBlog.isPending || updateBlog.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Posts"
        description="Manage blog articles"
        action={<AdminBtn icon={<Plus className="w-4 h-4" />} onClick={openCreate}>New Post</AdminBtn>}
      />

      <FilterBar
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        placeholder="Search posts..."
      >
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </FilterBar>

      {isLoading && <LoadingState message="Loading blog posts..." />}
      {isError   && <ErrorState message="Failed to load posts." onRetry={() => refetch()} />}

      {!isLoading && !isError && blogs.length === 0 && (
        <EmptyState
          title="No blog posts yet"
          description="Click 'New Post' to write your first article."
          action={<AdminBtn onClick={openCreate} icon={<Plus className="w-4 h-4" />}>New Post</AdminBtn>}
        />
      )}

      {!isLoading && !isError && blogs.length > 0 && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Title', 'Status', 'Created', 'Actions'].map((c) => (
                    <th key={c} className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((blog: Record<string, unknown>) => (
                  <tr key={String(blog.id)} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{truncate(String(blog.title ?? blog.titleEn ?? ''), 60)}</p>
                      {blog.titleEn && <p className="text-xs text-gray-400 mt-0.5">{truncate(String(blog.titleEn), 60)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {blog.isPublished
                        ? <Badge variant="success"><Eye className="w-3 h-3 inline mr-1" />Published</Badge>
                        : <Badge variant="warning"><EyeOff className="w-3 h-3 inline mr-1" />Draft</Badge>
                      }
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(String(blog.createdAt ?? '')).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(blog)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(String(blog.id))}
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
        title={editId ? 'Edit Blog Post' : 'New Blog Post'}
        size="xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Title (Bengali)">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-base"
                placeholder="শিরোনাম"
              />
            </FormField>
            <FormField label="Title (English)">
              <input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="input-base"
                placeholder="Post title in English"
              />
            </FormField>
          </div>

          <FormField label="Slug">
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="input-base font-mono text-xs"
              placeholder="post-url-slug"
            />
          </FormField>

          <FormField label="Excerpt">
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              rows={2}
              className="input-base resize-none"
              placeholder="Short description..."
            />
          </FormField>

          <FormField label="Content">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className="input-base resize-none"
              placeholder="Full blog content..."
            />
          </FormField>

          <FormField label="Cover Image">
            <UploadButton
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              folder="blog"
              label="Upload cover image"
              aspectRatio="wide"
            />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="SEO Title">
              <input
                value={form.seoTitle}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                className="input-base"
                placeholder="SEO page title"
              />
            </FormField>
            <FormField label="Meta Description">
              <input
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                className="input-base"
                placeholder="Meta description"
              />
            </FormField>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              className={`w-10 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow m-0.5 transition-transform ${form.isPublished ? 'translate-x-4' : ''}`} />
            </div>
            <span className="text-sm font-semibold text-gray-700">Published</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <AdminBtn variant="secondary" onClick={() => setModalOpen(false)}>Cancel</AdminBtn>
            <AdminBtn loading={saving} onClick={handleSave}>
              {editId ? 'Save Changes' : 'Create Post'}
            </AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message="Are you sure you want to delete this blog post? This cannot be undone."
        loading={deleteBlog.isPending}
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
