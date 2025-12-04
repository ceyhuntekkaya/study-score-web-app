'use client';

import { ContentProvider } from '@/contexts/ContentContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LessonSidebar from '@/components/learner/content/LessonSidebar';

/**
 * Learner Content Layout
 * Converted from lesson.html template
 * Sidebar is in layout to preserve state during navigation
 */
function ContentLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-lesson-area bg-color-white">
      <div className="rbt-lesson-content-wrapper">
        <LessonSidebar />
        {children}
      </div>
    </div>
  );
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['learner']}>
      <ContentProvider>
        <ContentLayoutContent>{children}</ContentLayoutContent>
      </ContentProvider>
    </ProtectedRoute>
  );
}

