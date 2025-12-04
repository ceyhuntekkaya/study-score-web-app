'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';

interface LessonItem {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: string;
  completed: boolean;
}

interface CourseSection {
  id: string;
  title: string;
  lessons: LessonItem[];
  completedCount: number;
  totalCount: number;
}

/**
 * Lesson Sidebar Component
 * Converted from template - course content sidebar
 * Uses pathname to parse route params (layout can't use useParams)
 */
export default function LessonSidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useContent();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Parse courseId and lessonId from pathname
  // Path format: /learner/content/[courseId] or /learner/content/[courseId]/[lessonId]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const courseId = pathParts[2] || 'dummy-course-1'; // learner, content, [courseId]
  const lessonId = pathParts[3] || 'dummy-1'; // [lessonId] if exists
  
  // Accordion state'i localStorage'dan restore et veya default değer kullan
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lesson-accordion-state');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          return new Set(['section-1']);
        }
      }
    }
    return new Set(['section-1']);
  });

  // Accordion state değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson-accordion-state', JSON.stringify(Array.from(openSections)));
    }
  }, [openSections]);

  const sections: CourseSection[] = [
    {
      id: 'section-1',
      title: 'Welcome Histudy',
      completedCount: 1,
      totalCount: 2,
      lessons: [
        {
          id: 'dummy-1',
          title: 'Course Intro',
          type: 'video',
          duration: '30 min',
          completed: true,
        },
        {
          id: 'dummy-2',
          title: 'Introduction',
          type: 'text',
          completed: true,
        },
      ],
    },
    {
      id: 'section-2',
      title: 'Welcome Lessons',
      completedCount: 1,
      totalCount: 3,
      lessons: [
        {
          id: 'dummy-3',
          title: 'Hello World!',
          type: 'video',
          duration: '0.37',
          completed: true,
        },
        {
          id: 'dummy-4',
          title: 'Values and Variables',
          type: 'video',
          duration: '20 min',
          completed: false,
        },
        {
          id: 'dummy-5',
          title: 'Basic Operators',
          type: 'video',
          duration: '15 min',
          completed: false,
        },
      ],
    },
    {
      id: 'section-3',
      title: 'Histudy Quiz',
      completedCount: 0,
      totalCount: 8,
      lessons: [
        {
          id: 'dummy-6',
          title: 'Questions Types',
          type: 'quiz',
          completed: false,
        },
        {
          id: 'dummy-7',
          title: 'All Questions',
          type: 'quiz',
          completed: false,
        },
      ],
    },
    {
      id: 'section-4',
      title: 'Histudy Assignments',
      completedCount: 0,
      totalCount: 2,
      lessons: [
        {
          id: 'dummy-8',
          title: 'Histudy Assignments',
          type: 'assignment',
          completed: false,
        },
        {
          id: 'dummy-9',
          title: 'Histudy Assignments Submit',
          type: 'assignment',
          completed: false,
        },
      ],
    },
  ];

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'feather-play-circle';
      case 'text':
        return 'feather-file-text';
      case 'quiz':
        return 'feather-help-circle';
      case 'assignment':
        return 'feather-file-text';
      default:
        return 'feather-file';
    }
  };

  return (
    <div className={`rbt-lesson-leftsidebar ${!sidebarOpen ? 'sibebar-none' : ''}`}>
      <div className="rbt-course-feature-inner rbt-search-activation">
        <div className="section-title">
          <h4 className="rbt-title-style-3">Course Content</h4>
        </div>

        <div className="lesson-search-wrapper">
          <form action="#" className="rbt-search-style-1" onSubmit={(e) => e.preventDefault()}>
            <input
              className="rbt-search-active"
              type="text"
              placeholder="Search Lesson"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn disabled" type="submit">
              <i className="feather-search"></i>
            </button>
          </form>
        </div>

        <hr className="mt--10" />

        <div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">
          <div className="accordion" id="accordionExampleb2">
            {sections.map((section) => {
              const isOpen = openSections.has(section.id);
              return (
                <div key={section.id} className="accordion-item card">
                  <h2 className="accordion-header card-header" id={`heading-${section.id}`}>
                    <button
                      className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                      type="button"
                      onClick={() => {
                        const newOpenSections = new Set(openSections);
                        if (isOpen) {
                          newOpenSections.delete(section.id);
                        } else {
                          newOpenSections.add(section.id);
                        }
                        setOpenSections(newOpenSections);
                      }}
                      aria-expanded={isOpen}
                    >
                      {section.title} <span className="rbt-badge-5 ml--10">{section.completedCount}/{section.totalCount}</span>
                    </button>
                  </h2>
                  <div
                    id={`collapse-${section.id}`}
                    className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                    aria-labelledby={`heading-${section.id}`}
                  >
                    <div className="accordion-body card-body">
                      <ul className="rbt-course-main-content liststyle">
                        {section.lessons.map((lesson) => {
                          const isActive = lesson.id === lessonId;
                          return (
                            <li key={lesson.id} className={isActive ? 'active' : ''}>
                              <Link 
                                href={`/learner/content/${courseId}/${lesson.id}`}
                                className={isActive ? 'active' : ''}
                                onClick={() => {
                                  // Link tıklanınca accordion'u açık tut
                                  const sectionId = section.id;
                                  if (!openSections.has(sectionId)) {
                                    const newOpenSections = new Set(openSections);
                                    newOpenSections.add(sectionId);
                                    setOpenSections(newOpenSections);
                                  }
                                }}
                              >
                                <div className="course-content-left">
                                  <i className={getLessonIcon(lesson.type)}></i>
                                  <span className="text">{lesson.title}</span>
                                </div>
                                <div className="course-content-right">
                                  {lesson.duration && <span className="min-lable">{lesson.duration}</span>}
                                  <span className={lesson.completed ? 'rbt-check' : 'rbt-check unread'}>
                                    <i className={lesson.completed ? 'feather-check' : 'feather-circle'}></i>
                                  </span>
                                </div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

