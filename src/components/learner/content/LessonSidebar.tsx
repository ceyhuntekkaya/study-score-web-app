'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import type { CourseLessonDetailDTO } from '@/generated/api/openAPIDefinition.schemas';
import { LessonSection, LessonItem } from '@/lib/menus';

// Extended type to include childLessons (may come from API but not in type definition)
interface CourseLessonDetailDTOWithChildren extends CourseLessonDetailDTO {
  childLessons?: CourseLessonDetailDTOWithChildren[];
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
  const courseId = pathParts[2]; // learner, content, [courseId]
  const lessonId = pathParts[3]; // [lessonId] if exists

  // API call to fetch course with all details
  const { data: courseDetails, isLoading } = useGetCourseWithAllDetails(
    courseId || '',
    {
      query: {
        enabled: !!courseId, // Only fetch if we have a courseId
      },
    }
  );
  
  // Accordion state'i localStorage'dan restore et veya default değer kullan
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lesson-accordion-state');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Nested accordion state for TOPICs
  const [openTopics, setOpenTopics] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lesson-topics-state');
      if (saved) {
        try {
          return new Set(JSON.parse(saved));
        } catch {
          return new Set();
        }
      }
    }
    return new Set();
  });

  // Accordion state değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson-accordion-state', JSON.stringify(Array.from(openSections)));
    }
  }, [openSections]);

  // Topics state değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lesson-topics-state', JSON.stringify(Array.from(openTopics)));
    }
  }, [openTopics]);

  // Helper function to recursively get all child lessons
  const getChildLessons = (lesson: CourseLessonDetailDTOWithChildren): CourseLessonDetailDTOWithChildren[] => {
    // First check if childLessons array exists (from API)
    if (lesson.childLessons && lesson.childLessons.length > 0) {
      return lesson.childLessons as CourseLessonDetailDTOWithChildren[];
    }
    // Fallback: use parentLessonId relationship if childLessons not available
    return [];
  };

  // Helper function to recursively count all LESSONs in a tree
  const countLessonsInTree = (lesson: CourseLessonDetailDTOWithChildren, allLessons: CourseLessonDetailDTOWithChildren[]): number => {
    let count = 0;
    
    // If this is a LESSON, count it
    if (lesson.lessonLevel === 'LESSON') {
      count = 1;
    }
    
    // Get children (from childLessons array or by parentLessonId)
    const children = getChildLessons(lesson);
    if (children.length > 0) {
      children.forEach((child) => {
        count += countLessonsInTree(child, allLessons);
      });
    } else {
      // Fallback: find children by parentLessonId
      const childrenById = allLessons.filter((l) => l.parentLessonId === lesson.id);
      childrenById.forEach((child) => {
        count += countLessonsInTree(child, allLessons);
      });
    }
    
    return count;
  };

  // Transform API data to LessonSection format
  // UNIT -> TOPIC -> LESSON hierarchy (using childLessons array when available)
  const sections = useMemo(() => {
    if (!courseDetails?.lessons || courseDetails.lessons.length === 0) {
      return [];
    }

    // Cast to extended type to access childLessons
    const allLessons = courseDetails.lessons
      .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
      .map((lesson) => lesson as CourseLessonDetailDTOWithChildren)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

    // Get UNIT level lessons (top level, no parent)
    const units = allLessons.filter(
      (lesson) => lesson.lessonLevel === 'UNIT' && !lesson.parentLessonId
    );

    // Build sections from UNITs
    const sectionsList: LessonSection[] = units.map((unit, unitIndex) => {
      // Get children of this UNIT (from childLessons or by parentLessonId)
      const unitChildren = getChildLessons(unit);
      
      // If childLessons exists, use it; otherwise fallback to parentLessonId
      let topics: CourseLessonDetailDTOWithChildren[] = [];
      let directLessons: CourseLessonDetailDTOWithChildren[] = [];
      
      if (unitChildren.length > 0) {
        // Use childLessons array
        topics = unitChildren
          .filter((child) => child.lessonLevel === 'TOPIC')
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
        
        directLessons = unitChildren
          .filter((child) => child.lessonLevel === 'LESSON')
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      } else {
        // Fallback: use parentLessonId relationship
        topics = allLessons
          .filter(
            (lesson) =>
              lesson.lessonLevel === 'TOPIC' && lesson.parentLessonId === unit.id
          )
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

        directLessons = allLessons
          .filter(
            (lesson) =>
              lesson.lessonLevel === 'LESSON' && lesson.parentLessonId === unit.id
          )
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      }

      // Calculate total lessons count recursively
      const totalLessonsCount = countLessonsInTree(unit, allLessons);

      return {
        id: `unit-${unit.id || unitIndex}`,
        title: unit.name || `Unit ${unitIndex + 1}`,
        completedCount: 0, // TODO: Calculate from progress
        totalCount: totalLessonsCount,
        lessons: [], // Will be rendered separately with nested structure
        // Store additional data for nested rendering
        unit: unit,
        topics: topics,
        directLessons: directLessons,
      } as LessonSection & {
        unit: CourseLessonDetailDTOWithChildren;
        topics: CourseLessonDetailDTOWithChildren[];
        directLessons: CourseLessonDetailDTOWithChildren[];
      };
    });

    return sectionsList;
  }, [courseDetails]);

  // Find which UNIT contains the active lesson and auto-open it (only when lessonId changes)
  useEffect(() => {
    if (!lessonId || !sections.length || !courseDetails?.lessons) {
      // If no lessonId, open first section if none are open
      setOpenSections((prev) => {
        if (sections.length > 0 && prev.size === 0) {
          return new Set([sections[0].id]);
        }
        return prev;
      });
      return;
    }

    // Find which section (UNIT) contains the active lesson
    const findSectionForLesson = (): string | null => {
      for (const section of sections) {
        const sectionWithData = section as LessonSection & {
          unit?: CourseLessonDetailDTOWithChildren;
          topics?: CourseLessonDetailDTOWithChildren[];
          directLessons?: CourseLessonDetailDTOWithChildren[];
        };
        
        const topics = sectionWithData.topics || [];
        const directLessons = sectionWithData.directLessons || [];
        
        // Check direct lessons
        if (directLessons.some((lesson) => lesson.id === lessonId)) {
          return section.id;
        }
        
        // Check lessons in topics
        for (const topic of topics) {
          const topicWithChildren = topic as CourseLessonDetailDTOWithChildren;
          const topicChildLessons = getChildLessons(topicWithChildren);
          
          let topicLessons: CourseLessonDetailDTOWithChildren[] = [];
          if (topicChildLessons.length > 0) {
            topicLessons = topicChildLessons.filter((child) => child.lessonLevel === 'LESSON');
          } else {
            const allLessons = (courseDetails?.lessons || [])
              .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
              .map((lesson) => lesson as CourseLessonDetailDTOWithChildren);
            
            topicLessons = allLessons.filter(
              (lesson) =>
                lesson.lessonLevel === 'LESSON' &&
                lesson.parentLessonId === topic.id
            );
          }
          
          if (topicLessons.some((lesson) => lesson.id === lessonId)) {
            return section.id;
          }
        }
      }
      return null;
    };

    const sectionId = findSectionForLesson();
    
    // Only open if the section is not already open (to avoid interfering with user interactions)
    if (sectionId) {
      setOpenSections((prev) => {
        // Only update if the section is not already open
        if (!prev.has(sectionId)) {
          return new Set([sectionId]);
        }
        return prev; // Keep existing state if already open
      });
    }
  }, [lessonId, sections, courseDetails]); // Removed openSections from dependencies to prevent infinite loop

  // Scroll to active lesson when lessonId changes or accordion opens
  useEffect(() => {
    if (lessonId && openSections.size > 0) {
      // Wait for accordion to fully open and DOM to update
      const timeoutId = setTimeout(() => {
        const activeLessonElement = document.getElementById(`active-lesson-${lessonId}`);
        if (activeLessonElement) {
          activeLessonElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500); // Increased timeout to wait for accordion animation

      return () => clearTimeout(timeoutId);
    }
  }, [lessonId, openSections]);

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


        {isLoading ? (
          <div className="text-center p--20">
            <p>Loading course content...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center p--20">
            <p>No course content available.</p>
          </div>
        ) : (
          <div className="rbt-accordion-style rbt-accordion-02 for-right-content accordion">
            <div className="accordion" id="accordionExampleb2">
              {sections.map((section) => {
                const sectionWithData = section as LessonSection & {
                  unit?: CourseLessonDetailDTOWithChildren;
                  topics?: CourseLessonDetailDTOWithChildren[];
                  directLessons?: CourseLessonDetailDTOWithChildren[];
                };
                const isOpen = openSections.has(section.id);
                const topics = sectionWithData.topics || [];
                const directLessons = sectionWithData.directLessons || [];

                return (
                  <div key={section.id} className="accordion-item card">
                    <h2 className="accordion-header card-header" id={`heading-${section.id}`}>
                      <button
                        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => {
                          if (isOpen) {
                            // If already open, close it
                            setOpenSections(new Set());
                          } else {
                            // If closed, open only this one (close others)
                            setOpenSections(new Set([section.id]));
                          }
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
                        {/* Collect all LESSONs from this UNIT (direct + from all TOPICs) */}
                        {(() => {
                          // Get all LESSONs from TOPICs
                          const allTopicLessons: CourseLessonDetailDTOWithChildren[] = [];
                          
                          topics.forEach((topic) => {
                            const topicWithChildren = topic as CourseLessonDetailDTOWithChildren;
                            const topicChildLessons = getChildLessons(topicWithChildren);
                            
                            let topicLessons: CourseLessonDetailDTOWithChildren[] = [];
                            if (topicChildLessons.length > 0) {
                              // Use childLessons array
                              topicLessons = topicChildLessons
                                .filter((child) => child.lessonLevel === 'LESSON')
                                .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
                            } else {
                              // Fallback: use parentLessonId relationship
                              const allLessons = (courseDetails?.lessons || [])
                                .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
                                .map((lesson) => lesson as CourseLessonDetailDTOWithChildren);
                              
                              topicLessons = allLessons
                                .filter(
                                  (lesson) =>
                                    lesson.lessonLevel === 'LESSON' &&
                                    lesson.parentLessonId === topic.id
                                )
                                .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
                            }
                            
                            allTopicLessons.push(...topicLessons);
                          });
                          
                          // Combine direct lessons and topic lessons, sort by orderNumber
                          const allLessonsInUnit = [...directLessons, ...allTopicLessons].sort(
                            (a, b) => (a.orderNumber || 0) - (b.orderNumber || 0)
                          );
                          
                          if (allLessonsInUnit.length === 0) {
                            return (
                              <div className="text-center p--10">
                                <p className="text-muted">No lessons available in this unit.</p>
                              </div>
                            );
                          }
                          
                          return (
                            <ul className="rbt-course-main-content liststyle">
                              {allLessonsInUnit.map((lesson) => {
                                // Strict comparison for active state
                                const isActive = !!lessonId && !!lesson.id && lesson.id === lessonId;
                                return (
                                  <li
                                    key={lesson.id}
                                    id={isActive ? `active-lesson-${lesson.id}` : undefined}
                                    className={isActive ? 'active' : ''}
                                  >
                                    <Link
                                      href={`/learner/content/${courseId}/${lesson.id}`}
                                      className={isActive ? 'active' : ''}
                                      onClick={() => {
                                        const sectionId = section.id;
                                        if (!openSections.has(sectionId)) {
                                          const newOpenSections = new Set(openSections);
                                          newOpenSections.add(sectionId);
                                          setOpenSections(newOpenSections);
                                        }
                                      }}
                                    >
                                      <div className="course-content-left">
                                        <i className={getLessonIcon('video')}></i>
                                        <span className="text">{lesson.name || 'Untitled Lesson'}</span>
                                      </div>
                                      <div className="course-content-right">
                                        <span className={isActive ? 'rbt-check' : 'rbt-check unread'}>
                                          <i className={isActive ? 'feather-check' : 'feather-circle'}></i>
                                        </span>
                                      </div>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

