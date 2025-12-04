'use client';

import { DashboardProvider } from '@/contexts/DashboardContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LearnerDashboardHeader from '@/components/learner/dashboard/LearnerDashboardHeader';
import LearnerDashboardSidebar from '@/components/learner/dashboard/LearnerDashboardSidebar';
import LearnerDashboardTop from '@/components/learner/dashboard/LearnerDashboardTop';
import LearnerDashboardFooter from '@/components/learner/dashboard/LearnerDashboardFooter';

/**
 * Learner Dashboard Layout
 * Converted from template - includes header, sidebar, top section, footer
 */
function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-main-wrapper">
      {/* Header */}
      <LearnerDashboardHeader />

      {/* Banner Area (empty in template) */}
      <div className="rbt-page-banner-wrapper">
        <div className="rbt-banner-image"></div>
      </div>

      {/* Dashboard Area */}
      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Dashboard Top Section */}
              <LearnerDashboardTop />

              <div className="row g-5">
                {/* Sidebar */}
                <LearnerDashboardSidebar />

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
      <LearnerDashboardFooter />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <DashboardProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </DashboardProvider>
    </ProtectedRoute>
  );
}

