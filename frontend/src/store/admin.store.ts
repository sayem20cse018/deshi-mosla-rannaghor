'use client';

import { create } from 'zustand';

interface AdminStore {
  sidebarOpen:      boolean;
  sidebarCollapsed: boolean;
  toggleSidebar:    () => void;
  collapseSidebar:  () => void;
  setSidebarOpen:   (v: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarOpen:      false,
  sidebarCollapsed: false,
  toggleSidebar:    () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  collapseSidebar:  () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarOpen:   (v) => set({ sidebarOpen: v }),
}));
