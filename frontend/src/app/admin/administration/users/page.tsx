'use client';

import { useState } from 'react';
import { UserCog, Plus, Pencil, Trash2, KeyRound, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useAdminUsers, useCreateAdminUser, useUpdateAdminUser,
  useResetAdminPassword, useDeleteAdminUser, AdminUser,
} from '@/hooks/useAdminUsers';
import {
  PageHeader, AdminBtn, LoadingState, ErrorState, EmptyState,
  Modal, ConfirmDialog,
} from '@/components/admin/ui';
import toast from 'react-hot-toast';

const ROLES = ['ADMIN', 'SUPER_ADMIN', 'MANAGER', 'SUPPORT'] as const;

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  ADMIN:       'bg-orange-100 text-orange-700',
  MANAGER:     'bg-blue-100 text-blue-700',
  SUPPORT:     'bg-green-100 text-green-700',
};

function formatDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface UserForm {
  name: string; email: string; phone: string;
  password: string; role: string;
}
const EMPTY: UserForm = { name: '', email: '', phone: '', password: '', role: 'ADMIN' };

export default function AdminUsersPage() {
  const { data, isLoading, isError, refetch } = useAdminUsers();
  const createMut  = useCreateAdminUser();
  const updateMut  = useUpdateAdminUser();
  const resetMut   = useResetAdminPassword();
  const deleteMut  = useDeleteAdminUser();

  const [showCreate, setShowCreate] = useState(false);
  const [editing,    setEditing]    = useState<AdminUser | null>(null);
  const [resetting,  setResetting]  = useState<AdminUser | null>(null);
  const [deleting,   setDeleting]   = useState<AdminUser | null>(null);
  const [form,       setForm]       = useState<UserForm>(EMPTY);
  const [newPass,    setNewPass]     = useState('');
  const [formErr,    setFormErr]     = useState('');

  const users = data?.data ?? [];

  function openCreate() { setForm(EMPTY); setFormErr(''); setShowCreate(true); }
  function openEdit(u: AdminUser) {
    setForm({ name: u.name, email: u.email, phone: u.phone, password: '', role: u.role });
    setFormErr('');
    setEditing(u);
  }

  async function handleCreate() {
    if (!form.name || !form.email || !form.phone || !form.password) {
      setFormErr('All fields are required.'); return;
    }
    try {
      await createMut.mutateAsync(form);
      toast.success('Admin user created.');
      setShowCreate(false);
    } catch (e: any) { setFormErr(e?.response?.data?.message ?? 'Failed to create user.'); }
  }

  async function handleUpdate() {
    if (!editing) return;
    try {
      await updateMut.mutateAsync({ id: editing.id, name: form.name, role: form.role });
      toast.success('User updated.');
      setEditing(null);
    } catch { toast.error('Update failed.'); }
  }

  async function handleReset() {
    if (!resetting || !newPass.trim()) return;
    if (newPass.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    try {
      await resetMut.mutateAsync({ id: resetting.id, password: newPass });
      toast.success('Password reset.');
      setResetting(null); setNewPass('');
    } catch { toast.error('Reset failed.'); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success('Admin user deactivated.');
      setDeleting(null);
    } catch (e: any) { toast.error(e?.response?.data?.message ?? 'Delete failed.'); }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400';
  const labelCls = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5';

  return (
    <div className="space-y-5">
      <PageHeader
        title="Admin Users"
        description={`${users.length} admin accounts`}
        action={
          <div className="flex gap-2">
            <AdminBtn variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => refetch()}>Refresh</AdminBtn>
            <AdminBtn size="sm" icon={<Plus className="w-3.5 h-3.5" />} onClick={openCreate}>Add Admin</AdminBtn>
          </div>
        }
      />

      {isLoading && <LoadingState message="Loading admin users..." />}
      {isError   && <ErrorState message="Failed to load admin users." onRetry={refetch} />}

      {!isLoading && !isError && users.length === 0 && (
        <EmptyState title="No admin users" description="Create the first admin account." icon={<UserCog className="w-7 h-7 text-gray-300" />} />
      )}

      {!isLoading && !isError && users.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                <th className="w-32 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-black text-orange-500">{u.name[0]?.toUpperCase()}</span>
                      </div>
                      <p className="font-bold text-gray-900 text-xs">{u.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-700">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600')}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{formatDate(u.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', u.isActive && !u.isBlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                      {u.isBlocked ? 'Blocked' : u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} title="Edit" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-500 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { setResetting(u); setNewPass(''); }} title="Reset Password" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors">
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleting(u)} title="Deactivate" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add Admin User" size="md">
        <div className="space-y-3">
          {(['name','email','phone','password'] as const).map((f) => (
            <div key={f}>
              <label className={labelCls}>{f === 'name' ? 'Full Name' : f.charAt(0).toUpperCase() + f.slice(1)}{f !== 'password' ? ' *' : ' *'}</label>
              <input type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'} value={form[f]}
                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))} className={inputCls} />
            </div>
          ))}
          <div>
            <label className={labelCls}>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inputCls}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {formErr && <p className="text-xs text-red-500">{formErr}</p>}
          <div className="flex gap-2 pt-1">
            <AdminBtn variant="secondary" onClick={() => setShowCreate(false)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn variant="primary" loading={createMut.isPending} onClick={handleCreate} className="flex-1">Create Admin</AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Admin User" size="sm">
        <div className="space-y-3">
          <div><label className={labelCls}>Full Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} /></div>
          <div><label className={labelCls}>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} className={inputCls}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select></div>
          <div className="flex gap-2 pt-1">
            <AdminBtn variant="secondary" onClick={() => setEditing(null)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn variant="primary" loading={updateMut.isPending} onClick={handleUpdate} className="flex-1">Save</AdminBtn>
          </div>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={!!resetting} onClose={() => setResetting(null)} title={`Reset Password — ${resetting?.name ?? ''}`} size="sm">
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Enter a new password for this admin user.</p>
          <div><label className={labelCls}>New Password (min 8 chars)</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className={inputCls} /></div>
          <div className="flex gap-2 pt-1">
            <AdminBtn variant="secondary" onClick={() => setResetting(null)} className="flex-1">Cancel</AdminBtn>
            <AdminBtn variant="primary" loading={resetMut.isPending} onClick={handleReset} className="flex-1">Reset</AdminBtn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete}
        loading={deleteMut.isPending} title="Deactivate Admin User" danger
        message={`Deactivate "${deleting?.name ?? ''}"? They will no longer be able to log in.`} />
    </div>
  );
}