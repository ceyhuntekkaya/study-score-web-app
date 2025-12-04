'use client';

import LessonContent from '@/components/learner/content/LessonContent';

/**
 * Learner Lesson Page (Nested Dynamic Route)
 * Template content converted to React components
 * URL: /learner/content/[courseId]/[lessonId]
 * Sidebar is in layout to preserve state during navigation
 */
export default function LessonPage() {
  return <LessonContent />;
}

