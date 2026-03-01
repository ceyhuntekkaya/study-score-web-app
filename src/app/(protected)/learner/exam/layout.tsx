'use client';

import { ExamProvider } from '@/contexts/ExamContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LearnerDashboardHeader from '@/components/learner/dashboard/LearnerDashboardHeader';
import LearnerDashboardFooter from '@/components/learner/dashboard/LearnerDashboardFooter';
import ExamSidebar from '@/components/learner/exam/ExamSidebar';
import { usePathname } from 'next/navigation';

function ExamLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTakePage = pathname?.includes('/take');

  // Take page: full-screen exam UI (no header/sidebar/footer)
  if (isTakePage) {
    return <>{children}</>;
  }

  // Exam list/welcome/etc: same template as dashboard for visual consistency
  return (
    <div className="rbt-main-wrapper">
      <LearnerDashboardHeader />

      <div className="rbt-page-banner-wrapper">
        <div className="rbt-banner-image"></div>
      </div>

      <div className="rbt-dashboard-area rbt-section-overlayping-top rbt-section-gapBottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row g-5">
                <ExamSidebar />
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

      <div className="rbt-separator-mid">
        <div className="container">
          <hr className="rbt-separator m-0" />
        </div>
      </div>

      <LearnerDashboardFooter />
    </div>
  );
}

export default function ExamLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <ExamProvider>
        <ExamLayoutContent>{children}</ExamLayoutContent>
      </ExamProvider>
    </ProtectedRoute>
  );
}
