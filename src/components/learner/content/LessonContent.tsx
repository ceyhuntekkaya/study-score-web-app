'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import { useGetCourseProgress } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';
import type { CourseLessonDetailDTO, CourseLessonPartDetailDTO } from '@/generated/api/openAPIDefinition.schemas';
import MaterialRenderer from './MaterialRenderer';
import { useProgressTracking } from './useProgressTracking';
import AIChat from './AIChat';
import TtsService from '@/components/common/TtsService';

/**
 * Lesson Content Component
 * Displays lesson content with materials and tracks user progress
 */
export default function LessonContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useContent();

  // Parse courseId and lessonId from pathname
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const courseId = pathParts[2];
  const lessonId = pathParts[3];
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [pendingPartId, setPendingPartId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  // API calls
  const { data: courseDetails } = useGetCourseWithAllDetails(
    courseId || '',
    { query: { enabled: !!courseId } }
  );

  const { data: courseProgress } = useGetCourseProgress(
    courseId || '',
    { query: { enabled: !!courseId } }
  );



  // Find selected lesson
  const selectedLesson = useMemo(() => {
    if (!courseDetails?.lessons || !lessonId) return null;

    const findLesson = (lessons: CourseLessonDetailDTO[]): CourseLessonDetailDTO | null => {
      for (const lesson of lessons) {
        if (lesson.id === lessonId) return lesson;
        const lessonWithChildren = lesson as CourseLessonDetailDTO & { childLessons?: CourseLessonDetailDTO[] };
        if (lessonWithChildren.childLessons?.length) {
          const found = findLesson(lessonWithChildren.childLessons);
          if (found) return found;
        }
      }
      return null;
    };

    return findLesson(courseDetails.lessons);
  }, [courseDetails, lessonId]);

  // Get lesson parts
  const lessonParts = useMemo(() => {
    if (!selectedLesson?.lessonParts) return [];
    return selectedLesson.lessonParts
      .filter((part): part is CourseLessonPartDetailDTO => !!part)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
  }, [selectedLesson]);

  // Get selected part
  const selectedPart = useMemo(() => {
    if (!selectedPartId || !lessonParts.length) return null;
    return lessonParts.find((part) => part.id === selectedPartId) || null;
  }, [selectedPartId, lessonParts]);

  // Get materials from selected part - use stable reference
  const materials = useMemo(() => {
    if (!selectedPart?.materials) return [];
    return selectedPart.materials
      .filter((material) => !!material)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
  }, [selectedPartId, selectedPart?.materials?.length || 0, selectedPart?.materials?.map(m => `${m.id}-${m.orderNumber}`).join(',') || '']);

  // Progress tracking hook
  const { registerVideoElement, handlePdfLoad, handlePdfDownload, handleLinkClick } = useProgressTracking({
    selectedPartId,
    materials,
  });

  // Get all parts from all lessons (for navigation)
  const allParts = useMemo(() => {
    if (!courseDetails?.lessons) return [];

    const collectParts = (lessons: CourseLessonDetailDTO[]): Array<{ part: CourseLessonPartDetailDTO; lessonId: string; lessonName: string }> => {
      const parts: Array<{ part: CourseLessonPartDetailDTO; lessonId: string; lessonName: string }> = [];

      for (const lesson of lessons) {
        if (lesson.lessonParts?.length) {
          const sortedParts = lesson.lessonParts
            .filter((part): part is CourseLessonPartDetailDTO => !!part)
            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

          sortedParts.forEach((part) => {
            parts.push({
              part,
              lessonId: lesson.id || '',
              lessonName: lesson.name || 'Untitled Lesson',
            });
          });
        }

        const lessonWithChildren = lesson as CourseLessonDetailDTO & { childLessons?: CourseLessonDetailDTO[] };
        if (lessonWithChildren.childLessons?.length) {
          const childParts = collectParts(lessonWithChildren.childLessons);
          parts.push(...childParts);
        }
      }

      return parts;
    };

    return collectParts(courseDetails.lessons);
  }, [courseDetails]);

  // Find current part index
  const currentPartIndex = useMemo(() => {
    if (!selectedPartId || !allParts.length) return -1;
    return allParts.findIndex((item) => item.part.id === selectedPartId);
  }, [selectedPartId, allParts]);

  // Get previous and next part
  const previousPart = useMemo(() => {
    if (currentPartIndex > 0) return allParts[currentPartIndex - 1];
    return null;
  }, [currentPartIndex, allParts]);

  const nextPart = useMemo(() => {
    if (currentPartIndex >= 0 && currentPartIndex < allParts.length - 1) {
      return allParts[currentPartIndex + 1];
    }
    return null;
  }, [currentPartIndex, allParts]);

  // Navigation handlers
  const handlePreviousPart = () => {
    if (previousPart?.lessonId && previousPart.part.id) {
      setPendingPartId(previousPart.part.id);
      router.push(`/learner/content/${courseId}/${previousPart.lessonId}`);
    }
  };

  const handleNextPart = () => {
    if (nextPart?.lessonId && nextPart.part.id) {
      setPendingPartId(nextPart.part.id);
      router.push(`/learner/content/${courseId}/${nextPart.lessonId}`);
    }
  };

  // Auto-select first part when lesson changes
  useEffect(() => {
    if (lessonParts.length > 0) {
      if (pendingPartId) {
        const partExists = lessonParts.some((part) => part.id === pendingPartId);
        if (partExists) {
          setSelectedPartId(pendingPartId);
          setPendingPartId(null);
          return;
        }
      }

      if (selectedPartId) {
        const partExists = lessonParts.some((part) => part.id === selectedPartId);
        if (partExists) return;
      }

      // Only set if different to avoid unnecessary updates
      const firstPartId = lessonParts[0].id || null;
      if (firstPartId !== selectedPartId) {
        setSelectedPartId(firstPartId);
      }
    } else {
      if (selectedPartId !== null) {
        setSelectedPartId(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lessonParts.length, pendingPartId]); // Removed selectedPartId from deps to avoid loop

  // Header title
  const headerTitle = useMemo(() => {
    const lessonName = selectedLesson?.name || 'Untitled Lesson';
    if (selectedPart?.name) {
      return `${lessonName} / ${selectedPart.name}`;
    }
    return lessonName;
  }, [selectedLesson, selectedPart]);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId]);

  return (
    <div className={`rbt-lesson-rightsidebar overflow-hidden lesson-video ${!sidebarOpen ? 'full-width' : ''}`}>
      {/* Top Bar */}
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
                        onClick={() => {setSelectedPartId(part.id || null)
                          setShowAIChat(false)
                        }}
                        style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
                      >
                        <span className="btn-text">{part.name || `Part ${part.orderNumber || ''}`}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="col-auto ms-auto">
                <button
                  className={`rbt-btn btn-md ${showAIChat ? 'bg-primary-opacity' : 'bg-primary'}`}
                  onClick={() => setShowAIChat(!showAIChat)}
                >
                  <span className="btn-text">{showAIChat ? 'Hide AI' : 'Study with AI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="inner">
        {showAIChat ? (
          <div
            className="ai-chat-container"
            style={{
              height: 'calc(100vh - 250px)',
              minHeight: '600px',
              maxHeight: 'calc(100vh - 250px)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <AIChat
              activeText={lessonParts[0].description || ''}
              lessonPartName={lessonParts[0].name}
              mode="learning"
              courseCategory={courseDetails?.category}
            />
          </div>
        ) : (
          <>
            {materials.length > 0 ? (
              <div className="materials-content p-4">
                {selectedPart?.name !== 'Practice' && materials.map((material) => (
                  <MaterialRenderer
                    key={material.id}
                    material={material}
                    onVideoRef={registerVideoElement}
                    onPdfLoad={handlePdfLoad}
                    onPdfDownload={handlePdfDownload}
                    onLinkClick={handleLinkClick}
                  />
                ))}

                {(selectedPart?.name === 'Practice') && (
                  <div className="mt-4">
                    <AIChat
                      activeText={selectedLesson?.name || ''}
                      lessonPartName={selectedPart?.name}
                      mode="practice"
                      courseCategory={courseDetails?.category}
                    />
                  </div>
                )}

                {(selectedPart?.name?.toLowerCase().startsWith('example')) && (
                  <div className="mt-4">
                    <AIChat
                      activeText={selectedPart?.description || ''}
                      lessonPartName={selectedPart?.name}
                      mode="analysis"
                      courseCategory={courseDetails?.category}
                    />
                  </div>
                )}


              </div>
            ) : (
              <div className="content">
                <div className="section-title">
                  <h4>{selectedLesson?.name || 'Untitled Lesson'}</h4>
                  <p>{selectedLesson?.description || 'No content available for this lesson part.'}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed Navigation Buttons */}
      <div
        className="bg-color-extra2 ptb--15 overflow-hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: sidebarOpen ? '400px' : 0,
          right: 0,
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'left 0.3s ease',
        }}
      >
        <div className="container-fluid">
          <div className="rbt-button-group d-flex justify-content-center gap-3">
            <button
              className="rbt-btn icon-hover icon-hover-left btn-md bg-primary-opacity"
              disabled={!previousPart}
              onClick={handlePreviousPart}
            >
              <span className="btn-icon"><i className="feather-arrow-left"></i></span>
              <span className="btn-text">Previous</span>
            </button>

{
  //    <TtsService text="Matching Headings questions require you to match each paragraph in a passage to the most suitable heading from a given list. Each heading represents the main idea of the paragraph, not the details." />

}
           
            <button
              className="rbt-btn icon-hover btn-md bg-primary-opacity"
              disabled={!nextPart}
              onClick={handleNextPart}
            >
              <span className="btn-text">Next</span>
              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
            </button>
          </div>
        </div>
      </div>

     

      {/* Spacer */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}
