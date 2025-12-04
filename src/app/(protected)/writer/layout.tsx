'use client';

import { WriterProvider } from '@/contexts/WriterContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicHeader from '@/components/public/header/PublicHeader';
import PublicFooter from '@/components/public/footer/PublicFooter';

/**
 * Writer Layout
 * Uses course-filter-one-toggle.html structure with public header/footer
 */
function WriterLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="rbt-main-wrapper">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      {children}

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

export default function WriterLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['writer']}>
      <WriterProvider>
        <WriterLayoutContent>{children}</WriterLayoutContent>
      </WriterProvider>
    </ProtectedRoute>
  );
}
