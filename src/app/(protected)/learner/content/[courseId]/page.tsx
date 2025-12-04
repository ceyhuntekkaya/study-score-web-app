'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Learner Content Course Page
 * Redirects to first lesson when only courseId is provided
 * URL: /learner/content/[courseId]
 */
export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // İlk ders ID'sini belirle (sidebar'daki ilk ders - Welcome Histudy > Course Intro)
  const firstLessonId = 'dummy-1';

  useEffect(() => {
    if (courseId && !isRedirecting) {
      setIsRedirecting(true);
      // İlk derse yönlendir
      router.replace(`/learner/content/${courseId}/${firstLessonId}`);
    }
  }, [courseId, router, firstLessonId, isRedirecting]);

  if (!courseId) {
    return (
      <div className="rbt-lesson-rightsidebar overflow-hidden">
        <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="content">
            <div className="section-title">
              <h4 className="rbt-title-style-3">Course not found</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rbt-lesson-rightsidebar overflow-hidden">
      <div className="inner" style={{ padding: '40px', textAlign: 'center' }}>
        <div className="content">
          <div className="section-title">
            <h4 className="rbt-title-style-3">Loading Course...</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

