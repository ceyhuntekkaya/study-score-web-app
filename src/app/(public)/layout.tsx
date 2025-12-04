'use client';

import PublicHeader from '@/components/public/header/PublicHeader';
import PublicFooter from '@/components/public/footer/PublicFooter';

/**
 * Public Layout
 * Uses template structure with React components (no jQuery)
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rbt-main-wrapper">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      
      {/* Progress Circle */}
      <div className="rbt-progress-parent">
        <svg className="rbt-back-circle svg-inner" width="100%" height="100%" viewBox="-1 -1 102 102">
          <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
        </svg>
      </div>
    </div>
  );
}

