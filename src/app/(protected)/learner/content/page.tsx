'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Learner Content Main Page
 * Redirects to first course
 */
export default function LearnerContentPage() {
  const router = useRouter();

  useEffect(() => {
    // İlk kursa yönlendir (dummy-course-1)
    router.replace('/learner/content/dummy-course-1');
  }, [router]);

  return (
    <div className="rbt-lesson-rightsidebar overflow-hidden">
      <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Loading...</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

