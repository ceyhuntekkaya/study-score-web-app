'use client';

import { TutorProvider } from '@/contexts/TutorContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import TutorDashboardHeader from '@/components/tutor/dashboard/TutorDashboardHeader';
import TutorDashboardSidebar from '@/components/tutor/dashboard/TutorDashboardSidebar';
import TutorDashboardTop from '@/components/tutor/dashboard/TutorDashboardTop';
import TutorDashboardFooter from '@/components/tutor/dashboard/TutorDashboardFooter';

/**
 * Tutor Dashboard Layout
 * Converted from instructor-dashboard.html template
 */
function TutorLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-main-wrapper">
      {/* Header */}
      <TutorDashboardHeader />

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
              <TutorDashboardTop />

              <div className="row g-5">
                {/* Sidebar */}
                <TutorDashboardSidebar />

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
      <TutorDashboardFooter />
    </div>
  );
}

export default function TutorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['tutor']}>
      <TutorProvider>
        <TutorLayoutContent>{children}</TutorLayoutContent>
      </TutorProvider>
    </ProtectedRoute>
  );
}

