'use client';

import { Shield, Lock, CheckCircle } from 'lucide-react';
import { PageHeader } from '@/components/admin/ui';

const ROLES = [
  {
    name: 'SUPER_ADMIN',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    dot:   'bg-purple-500',
    description: 'Full access to all features including admin user management, system settings and financial data.',
    permissions: ['All Admin permissions', 'Create/delete admin users', 'System settings', 'Financial reports', 'All CRUD operations'],
  },
  {
    name: 'ADMIN',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dot:   'bg-orange-500',
    description: 'Full access to orders, products, customers and content management.',
    permissions: ['Order management', 'Product CRUD', 'Customer management', 'Content CMS', 'Reports', 'Inventory management'],
  },
  {
    name: 'MANAGER',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot:   'bg-blue-500',
    description: 'Access to orders, inventory and customer support features.',
    permissions: ['Order management', 'Inventory adjustments', 'Customer support', 'View reports'],
  },
  {
    name: 'SUPPORT',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot:   'bg-green-500',
    description: 'Read-only access to orders and customers for support queries.',
    permissions: ['View orders', 'View customers', 'View products'],
  },
];

export default function RolesPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Roles & Permissions"
        description="Admin role definitions. Assign roles when creating admin users."
      />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Role-based access control</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Roles are assigned when creating admin users. To change a role, edit the admin user from the Admin Users page.
            Custom role configuration is managed via environment and code.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <div key={role.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-2 h-2 rounded-full ${role.dot}`} />
              <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${role.color}`}>
                {role.name}
              </span>
              <Shield className="w-4 h-4 text-gray-300 ml-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{role.description}</p>
            <div className="space-y-1.5">
              {role.permissions.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}