'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboardHeader from '@/components/admin/dashboard/AdminDashboardHeader';

/**
 * Admin Dashboard Layout
 * Header with menu in center, full width content area
 */
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-main-wrapper rbt-admin-wrapper">
      {/* Header with menu in center */}
      <AdminDashboardHeader />

      {/* Dashboard Area - Full width content */}
      <div className="rbt-dashboard-area rbt-section-gapBottom" style={{ padding: '20px' }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60">
                <div className="content">{children}</div>
              </div>
            </div>
          </div>
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
