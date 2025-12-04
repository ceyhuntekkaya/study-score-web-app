'use client';

import { ManagerProvider } from '@/contexts/ManagerContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ManagerDashboardHeader from '@/components/manager/dashboard/ManagerDashboardHeader';
import ManagerDashboardSidebar from '@/components/manager/dashboard/ManagerDashboardSidebar';
import ManagerDashboardTop from '@/components/manager/dashboard/ManagerDashboardTop';
import ManagerDashboardFooter from '@/components/manager/dashboard/ManagerDashboardFooter';

/**
 * Manager Dashboard Layout
 * Converted from instructor-dashboard.html template (same as tutor)
 */
function ManagerLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-main-wrapper">
      {/* Header */}
      <ManagerDashboardHeader />

      {/* Banner Area */}
      <div className="rbt-page-banner-wrapper">
        <div className="rbt-banner-image"></div>
      </div>

      {/* Dashboard Area */}
      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Dashboard Top Section */}
              <ManagerDashboardTop />

              <div className="row g-5">
                {/* Sidebar */}
                <ManagerDashboardSidebar />

                {/* Main Content */}
                <div className="col-lg-9">
                  <div className="rbt-dashboard-content bg-color-white rbt-shadow-box mb--60">
                    <div className="content">{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      {/* Footer */}
      <ManagerDashboardFooter />
    </div>
  );
}

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <ManagerProvider>
        <ManagerLayoutContent>{children}</ManagerLayoutContent>
      </ManagerProvider>
    </ProtectedRoute>
  );
}
