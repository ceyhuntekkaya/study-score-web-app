'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import type { CourseLessonDetailDTO, CourseLessonPartDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

/**
 * Lesson Content Component
 * Converted from template - video player and lesson content
 * Uses pathname to parse route params (works in both page and layout)
 */
export default function LessonContent() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useContent();
  
  // Parse courseId and lessonId from pathname
  // Path format: /learner/content/[courseId]/[lessonId]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const courseId = pathParts[2] || 'dummy-course-1'; // learner, content, [courseId]
  const lessonId = pathParts[3] || 'dummy-1'; // [lessonId]
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // API call to fetch course with all details
  const { data: courseDetails, isLoading, error } = useGetCourseWithAllDetails(
    courseId,
    {
      query: {
        enabled: !!courseId && courseId !== 'dummy-course-1', // Only fetch if we have a real courseId
      },
    }
  );

  // Find selected lesson from API data
  const selectedLesson = useMemo(() => {
    if (!courseDetails?.lessons || !lessonId || lessonId === 'dummy-1') {
      return null;
    }

    // Helper function to recursively find lesson
    const findLesson = (lessons: CourseLessonDetailDTO[]): CourseLessonDetailDTO | null => {
      for (const lesson of lessons) {
        if (lesson.id === lessonId) {
          return lesson;
        }
        // Check childLessons if available (type assertion needed)
        const lessonWithChildren = lesson as CourseLessonDetailDTO & { childLessons?: CourseLessonDetailDTO[] };
        if (lessonWithChildren.childLessons && lessonWithChildren.childLessons.length > 0) {
          const found = findLesson(lessonWithChildren.childLessons);
          if (found) return found;
        }
      }
      return null;
    };

    return findLesson(courseDetails.lessons);
  }, [courseDetails, lessonId]);

  // Get lessonParts from selected lesson
  const lessonParts = useMemo(() => {
    if (!selectedLesson?.lessonParts) {
      return [];
    }
    return selectedLesson.lessonParts
      .filter((part): part is CourseLessonPartDetailDTO => !!part)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
  }, [selectedLesson]);

  // Get selected part
  const selectedPart = useMemo(() => {
    if (!selectedPartId || !lessonParts.length) {
      return null;
    }
    return lessonParts.find((part) => part.id === selectedPartId) || null;
  }, [selectedPartId, lessonParts]);

  // Auto-select first part when lesson changes
  useEffect(() => {
    if (lessonParts.length > 0 && !selectedPartId) {
      setSelectedPartId(lessonParts[0].id || null);
    } else if (lessonParts.length === 0) {
      setSelectedPartId(null);
    }
  }, [lessonParts, selectedPartId]);

  // Log API response to console
  useEffect(() => {
    if (courseDetails) {
      console.log('=== Course With All Details API Response ===');
      console.log('Course ID:', courseId);
      console.log('Full Response:', courseDetails);
      console.log('Response Type:', typeof courseDetails);
      console.log('Response Keys:', courseDetails ? Object.keys(courseDetails) : 'N/A');
      if (courseDetails) {
        console.log('Course Title:', (courseDetails as any)?.title || (courseDetails as any)?.name || 'N/A');
        console.log('Lessons:', (courseDetails as any)?.lessons || (courseDetails as any)?.courseLessons || 'N/A');
        if ((courseDetails as any)?.lessons) {
          console.log('Number of Lessons:', Array.isArray((courseDetails as any).lessons) ? (courseDetails as any).lessons.length : 'N/A');
        }
        if ((courseDetails as any)?.courseLessons) {
          console.log('Number of Course Lessons:', Array.isArray((courseDetails as any).courseLessons) ? (courseDetails as any).courseLessons.length : 'N/A');
        }
      }
      console.log('============================================');
    }
    if (error) {
      console.error('=== Course With All Details API Error ===');
      console.error('Error:', error);
      console.error('==========================================');
    }
    if (isLoading) {
      console.log('Loading course with all details...');
    }
  }, [courseDetails, error, isLoading, courseId]);

  // Get lesson data from API or fallback to dummy
  const lessonData = useMemo(() => {
    // Use API data if available
    if (selectedLesson) {
      return {
        id: selectedLesson.id || lessonId,
        title: selectedLesson.name || 'Untitled Lesson',
        description: selectedLesson.description || '',
        courseTitle: courseDetails?.name || 'Course',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE', // Default video, will be replaced with actual content later
      };
    }

    // Fallback to dummy data
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
        title: 'Study Score Assignments',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Complete your assignments and submit them.',
      },
      'dummy-9': {
        title: 'Study Score Assignments Submit',
        videoUrl: 'https://www.youtube.com/embed/qKzhrXqT6oE',
        description: 'Learn how to submit your assignments properly.',
      },
    };

    const dummyLesson = lessons[lessonId] || lessons['dummy-1'];
    return {
      id: lessonId,
      title: dummyLesson.title,
      description: dummyLesson.description,
      videoUrl: dummyLesson.videoUrl,
      courseTitle: courseDetails?.name || 'The Complete Study Score 2026: From Zero to Expert!',
    };
  }, [selectedLesson, lessonId, courseDetails]);

  // Get header title: "Lesson Name / Part Name" or just "Lesson Name"
  const headerTitle = useMemo(() => {
    const lessonName = selectedLesson?.name || lessonData.title;
    if (selectedPart?.name) {
      return `${lessonName} / ${selectedPart.name}`;
    }
    return lessonName;
  }, [selectedLesson, selectedPart, lessonData]);

  // Lesson değiştiğinde scroll to top and reset selected part
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedPartId(null); // Reset part selection when lesson changes
  }, [lessonId]);

  return (
    <div className={`rbt-lesson-rightsidebar overflow-hidden lesson-video ${!sidebarOpen ? 'full-width' : ''}`}>
      <div className="lesson-top-bar">
        <div className="lesson-top-left">
          <div className="rbt-lesson-toggle">
            <button
              className="lesson-toggle-active btn-round-white-opacity"
              title="Toggle Sidebar"
              onClick={toggleSidebar}
            >
              <i className={`feather-arrow-${sidebarOpen ? 'left' : 'right'}`}></i>
            </button>
          </div>
          <h5>{headerTitle}</h5>
        </div>
        <div className="lesson-top-right">
          <div className="rbt-btn-close">
            <Link href="/learner/dashboard" title="Go Back to Dashboard" className="rbt-round-btn">
              <i className="feather-x"></i>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Lesson Parts Navigation */}
      {lessonParts.length > 0 && (
        <div className="lesson-parts-nav bg-color-extra2 ptb--15">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="rbt-button-group d-flex flex-wrap gap-2">
                  {lessonParts.map((part) => {
                    const isActive = selectedPartId === part.id;
                    return (
                      <button
                        key={part.id}
                        className={`rbt-btn btn-sm ${isActive ? 'bg-primary' : 'bg-primary-opacity'}`}
                        onClick={() => setSelectedPartId(part.id || null)}
                        style={{
                          whiteSpace: 'nowrap',
                          minWidth: 'auto',
                        }}
                      >
                        <span className="btn-text">{part.name || `Part ${part.orderNumber || ''}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-auto ms-auto">
                <button
                  className="rbt-btn btn-md bg-primary"
                  onClick={() => {
                    // TODO: Implement Study with AI functionality
                    console.log('Study with AI clicked');
                  }}
                >
                  <span className="btn-text">Study with AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="inner">
        <div className="rbt-video-player">
          <iframe
            src={lessonData.videoUrl}
            allowFullScreen
            allow="autoplay"
            style={{ width: '100%', border: 'none' }}
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

