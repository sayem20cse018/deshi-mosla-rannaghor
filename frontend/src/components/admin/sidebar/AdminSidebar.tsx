'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV, type NavItem } from './navConfig';
import { useAdminStore } from '@/store/admin.store';

function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isExact  = item.href === '/admin' ? pathname === '/admin' : false;
  const isActive = item.href
    ? (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href))
    : false;

  const hasChildren = !!(item.children && item.children.length > 0);
  const childActive  = hasChildren && item.children!.some(
    (c) => c.href && (c.href === '/admin' ? pathname === '/admin' : pathname.startsWith(c.href)),
  );
  const [open, setOpen] = useState(childActive);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
            childActive ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
          )}
        >
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          {!collapsed && (
            <>
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {open || childActive
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </>
          )}
        </button>
        {(open || childActive) && !collapsed && (
          <div className="ml-4 mt-0.5 pl-3 border-l border-slate-700/60 space-y-0.5">
            {item.children!.map((child) => {
              const ca = child.href && (child.href === '/admin' ? pathname === '/admin' : pathname.startsWith(child.href));
              return (
                <Link key={child.href} href={child.href!}
                  className={cn(
                    'block px-3 py-1.5 rounded-lg text-[13px] transition-colors',
                    ca ? 'text-orange-400 bg-orange-500/10 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                  )}>
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href!}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors relative group',
        isActive ? 'bg-orange-500/15 text-orange-400 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
      )}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {!collapsed && <span className="flex-1">{item.label}</span>}
      {!collapsed && item.badge === 'alert' && (
        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 transition-opacity shadow-lg">
          {item.label}
        </div>
      )}
    </Link>
  );
}

export function AdminSidebar() {
  const { sidebarCollapsed, collapseSidebar } = useAdminStore();

  return (
    <aside
      className={cn(
        'h-full flex flex-col border-r border-slate-800 transition-all duration-300 overflow-hidden',
        sidebarCollapsed ? 'w-16' : 'w-64',
      )}
      style={{ background: '#0f172a' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
          <span className="text-white font-black text-sm">D</span>
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="text-white font-black text-sm leading-tight truncate">Admin Panel</p>
            <p className="text-slate-500 text-[10px] tracking-widest uppercase">Deshi Moslar</p>
          </div>
        )}
      </div>

      {/* Nav scroll area */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-4 scrollbar-hide">
        {ADMIN_NAV.map((section) => (
          <div key={section.title}>
            {!sidebarCollapsed && (
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.12em] px-3 mb-1">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.label} item={item} collapsed={sidebarCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 p-2 border-t border-slate-800">
        <button
          onClick={collapseSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors text-sm"
        >
          {sidebarCollapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
