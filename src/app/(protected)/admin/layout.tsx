'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/contexts/AdminContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboardHeader from '@/components/admin/dashboard/AdminDashboardHeader';
import AdminDashboardSidebar from '@/components/admin/dashboard/AdminDashboardSidebar';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.add('ssa-admin-body');
    return () => {
      document.body.classList.remove('ssa-admin-body');
    };
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSidebar();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="ssa-admin-shell">
      <AdminDashboardSidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="ssa-admin-main">
        <AdminDashboardHeader
          onMenuClick={() => setSidebarOpen(true)}
          menuOpen={sidebarOpen}
        />
        <div className="ssa-admin-content-wrap">
          <main className="ssa-admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AdminProvider>
    </ProtectedRoute>
  );
}
