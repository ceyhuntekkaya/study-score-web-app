'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Lesson Content Component
 * Converted from template - video player and lesson content
 * Uses pathname to parse route params (works in both page and layout)
 */
export default function LessonContent() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Parse courseId and lessonId from pathname
  // Path format: /learner/content/[courseId]/[lessonId]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const courseId = pathParts[2] || 'dummy-course-1'; // learner, content, [courseId]
  const lessonId = pathParts[3] || 'dummy-1'; // [lessonId]

  // Dummy lesson data - will be replaced with API call
  // Her lesson ID'sine göre farklı içerik
  const lessonData = useMemo(() => {
    const lessons: Record<string, { title: string; videoUrl: string; description: string }> = {
      'dummy-1': {
        title: 'Course Intro',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Let us analyze the greatest hits of the past and learn what makes these tracks so special.',
      },
      'dummy-2': {
        title: 'Introduction',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'This is the introduction lesson. Learn the basics of the course.',
      },
      'dummy-3': {
        title: 'Hello World!',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Start your journey with Hello World! This is your first step.',
      },
      'dummy-4': {
        title: 'Values and Variables',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Learn about values and variables in programming.',
      },
      'dummy-5': {
        title: 'Basic Operators',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Understanding basic operators and how to use them.',
      },
      'dummy-6': {
        title: 'Questions Types',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Learn about different types of questions in quizzes.',
      },
      'dummy-7': {
        title: 'All Questions',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Review all questions and their formats.',
      },
      'dummy-8': {
        title: 'Histudy Assignments',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Complete your assignments and submit them.',
      },
      'dummy-9': {
        title: 'Histudy Assignments Submit',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Learn how to submit your assignments properly.',
      },
    };

    return {
      id: lessonId,
      ...(lessons[lessonId] || lessons['dummy-1']),
      courseTitle: 'The Complete Histudy 2024: From Zero to Expert!',
    };
  }, [lessonId]);

  // Lesson değiştiğinde scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId]);

  return (
    <div className={`rbt-lesson-rightsidebar overflow-hidden lesson-video ${!sidebarOpen ? 'full-width' : ''}`}>
      <div className="lesson-top-bar">
        <div className="lesson-top-left">
          <div className="rbt-lesson-toggle">
            <button
              className="lesson-toggle-active btn-round-white-opacity"
              title="Toggle Sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`feather-arrow-${sidebarOpen ? 'left' : 'right'}`}></i>
            </button>
          </div>
          <h5>{lessonData.courseTitle}</h5>
        </div>
        <div className="lesson-top-right">
          <div className="rbt-btn-close">
            <Link href={`/learner/content/${courseId}`} title="Go Back to Course" className="rbt-round-btn">
              <i className="feather-x"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="inner">
        <div className="plyr__video-embed rbtplayer">
          <iframe
            src={lessonData.videoUrl}
            allowFullScreen
            allow="autoplay"
            style={{ width: '100%', height: '500px', border: 'none' }}
          ></iframe>
        </div>
        <div className="content">
          <div className="section-title">
            <h4>{lessonData.title}</h4>
            <p>{lessonData.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-color-extra2 ptb--15 overflow-hidden">
        <div className="rbt-button-group">
          {/* TODO: Previous/Next lesson navigation - will be implemented with actual lesson order */}
          <button className="rbt-btn icon-hover icon-hover-left btn-md bg-primary-opacity" disabled>
            <span className="btn-icon"><i className="feather-arrow-left"></i></span>
            <span className="btn-text">Previous</span>
          </button>

          <button className="rbt-btn icon-hover btn-md" disabled>
            <span className="btn-text">Next</span>
            <span className="btn-icon"><i className="feather-arrow-right"></i></span>
          </button>
        </div>
      </div>
    </div>
  );
}

