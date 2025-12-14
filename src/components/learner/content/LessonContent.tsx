'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContent } from '@/contexts/ContentContext';
import { useGetCourseWithAllDetails } from '@/generated/api/course-rest-controller/course-rest-controller';
import { useGetCourseProgress } from '@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller';
import type { CourseLessonDetailDTO, CourseLessonPartDetailDTO, CourseLessonPartMaterialDetailDTO } from '@/generated/api/openAPIDefinition.schemas';

/**
 * Lesson Content Component
 * Converted from template - video player and lesson content
 * Uses pathname to parse route params (works in both page and layout)
 */
export default function LessonContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useContent();
  
  // Parse courseId and lessonId from pathname
  // Path format: /learner/content/[courseId]/[lessonId]
  const pathParts = pathname?.split('/').filter(Boolean) || [];
  const courseId = pathParts[2]; // learner, content, [courseId]
  const lessonId = pathParts[3]; // [lessonId]
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [pendingPartId, setPendingPartId] = useState<string | null>(null); // For navigation between lessons

  // API call to fetch course with all details
  const { data: courseDetails, isLoading, error } = useGetCourseWithAllDetails(
    courseId || '',
    {
      query: {
        enabled: !!courseId, // Only fetch if we have a courseId
      },
    }
  );

  // API call to fetch course progress
  const { data: courseProgress, isLoading: isLoadingProgress, error: progressError } = useGetCourseProgress(
    courseId || '',
    {
      query: {
        enabled: !!courseId, // Only fetch if we have a courseId
      },
    }
  );

  // Console log course progress data
  useEffect(() => {
    if (courseProgress) {
      console.log('Course Progress Data:', courseProgress);
    }
  }, [courseProgress]);

  // Find selected lesson from API data
  const selectedLesson = useMemo(() => {
    if (!courseDetails?.lessons || !lessonId) {
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

  // Get materials from selected part, sorted by orderNumber
  const materials = useMemo(() => {
    if (!selectedPart?.materials) {
      return [];
    }
    const materialsList = selectedPart.materials
      .filter((material): material is CourseLessonPartMaterialDetailDTO => !!material)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
    
    return materialsList;
  }, [selectedPart]);

  // Get all parts from all lessons in the course, sorted by lesson order and part order
  const allParts = useMemo(() => {
    if (!courseDetails?.lessons) {
      return [];
    }

    // Helper function to recursively collect all parts from lessons
    const collectParts = (lessons: CourseLessonDetailDTO[]): Array<{ part: CourseLessonPartDetailDTO; lessonId: string; lessonName: string }> => {
      const parts: Array<{ part: CourseLessonPartDetailDTO; lessonId: string; lessonName: string }> = [];
      
      for (const lesson of lessons) {
        if (lesson.lessonParts && lesson.lessonParts.length > 0) {
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
        
        // Check childLessons if available
        const lessonWithChildren = lesson as CourseLessonDetailDTO & { childLessons?: CourseLessonDetailDTO[] };
        if (lessonWithChildren.childLessons && lessonWithChildren.childLessons.length > 0) {
          const childParts = collectParts(lessonWithChildren.childLessons);
          parts.push(...childParts);
        }
      }
      
      return parts;
    };

    return collectParts(courseDetails.lessons);
  }, [courseDetails]);

  // Find current part index in all parts
  const currentPartIndex = useMemo(() => {
    if (!selectedPartId || !allParts.length) {
      return -1;
    }
    return allParts.findIndex((item) => item.part.id === selectedPartId);
  }, [selectedPartId, allParts]);

  // Get previous and next part info
  const previousPart = useMemo(() => {
    if (currentPartIndex > 0) {
      return allParts[currentPartIndex - 1];
    }
    return null;
  }, [currentPartIndex, allParts]);

  const nextPart = useMemo(() => {
    if (currentPartIndex >= 0 && currentPartIndex < allParts.length - 1) {
      return allParts[currentPartIndex + 1];
    }
    return null;
  }, [currentPartIndex, allParts]);

  // Navigate to previous/next part
  const handlePreviousPart = () => {
    if (previousPart && previousPart.lessonId && previousPart.part.id) {
      setPendingPartId(previousPart.part.id);
      router.push(`/learner/content/${courseId}/${previousPart.lessonId}`);
    }
  };

  const handleNextPart = () => {
    if (nextPart && nextPart.lessonId && nextPart.part.id) {
      setPendingPartId(nextPart.part.id);
      router.push(`/learner/content/${courseId}/${nextPart.lessonId}`);
    }
  };


  // Auto-select first part when lesson changes, or select specific part if navigating from previous/next
  useEffect(() => {
    if (lessonParts.length > 0) {
      // If we have a pending part ID (from previous/next navigation), use it
      if (pendingPartId) {
        const partExists = lessonParts.some((part) => part.id === pendingPartId);
        if (partExists) {
          setSelectedPartId(pendingPartId);
          setPendingPartId(null); // Clear pending
          return;
        }
      }
      
      // Check if current selected part is still in this lesson
      if (selectedPartId) {
        const partExists = lessonParts.some((part) => part.id === selectedPartId);
        if (partExists) {
          return; // Keep current selection
        }
      }
      
      // Otherwise, select the first part
      const firstPartId = lessonParts[0].id || null;
      setSelectedPartId(firstPartId);
    } else {
      setSelectedPartId(null);
    }
  }, [lessonId, lessonParts, pendingPartId, selectedPartId]);


  // Get header title: "Lesson Name / Part Name" or just "Lesson Name"
  const headerTitle = useMemo(() => {
    const lessonName = selectedLesson?.name || 'Untitled Lesson';
    if (selectedPart?.name) {
      return `${lessonName} / ${selectedPart.name}`;
    }
    return lessonName;
  }, [selectedLesson, selectedPart]);

  // Lesson değiştiğinde scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Part selection is handled by the lessonParts useEffect above
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
        {/* Materials Content */}
        {materials.length > 0 ? (
          <div className="materials-content p-4">
            {materials.map((material) => {
              const mediaType = material.mediaType;
              const content = material.content || '';

              // IMAGE - content is the image URL
              if (mediaType === 'IMAGE') {
                return (
                  <div key={material.id} className="material-item material-image mb--30">
                    {content && (
                      <div className="image-wrapper">
                        <img
                        src={"/assets/"+content}
                         
                          alt={material.name || 'Image'}
                          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                          onError={(e) => {
                            console.error('Image load error:', content);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              // VIDEO - content is the video URL
              if (mediaType === 'VIDEO') {
                // Check if content is a YouTube URL
                const isYouTube = content && (
                  content.includes('youtube.com') ||
                  content.includes('youtu.be') ||
                  content.startsWith('https://www.youtube.com')
                );

                // Convert YouTube watch URL to embed URL if needed
                const getYouTubeEmbedUrl = (url: string): string => {
                  if (url.includes('/embed/')) {
                    return url; // Already embed URL
                  }
                  if (url.includes('youtu.be/')) {
                    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
                    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                  }
                  if (url.includes('watch?v=')) {
                    const videoId = url.split('watch?v=')[1]?.split('&')[0];
                    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                  }
                  return url;
                };

                return (
                  <div key={material.id} className="material-item material-video mb--30">
                    {content && (
                      <div className="rbt-video-player">
                        {isYouTube ? (
                          <iframe
                            src={getYouTubeEmbedUrl(content)}
                            allowFullScreen
                            allow="autoplay; encrypted-media"
                            style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
                            title={material.name || 'Video'}
                          />
                        ) : (
                          <video
                            controls
                            style={{ width: '100%', borderRadius: '8px' }}
                            src={content}
                            onError={(e) => {
                              console.error('Video load error:', content);
                            }}
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // AUDIO - content is the audio URL
              if (mediaType === 'AUDIO') {
                return (
                  <div key={material.id} className="material-item material-audio mb--30">
                   
                    {content && (
                      <div className="audio-wrapper">
                        <audio controls style={{ width: '100%' }}>
                          <source src={content} />
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    )}
                  </div>
                );
              }

              // DOCUMENT - content may contain HTML or download link
              if (mediaType === 'DOCUMENT') {
                return (
                  <div key={material.id} className="material-item material-document mb--30">
                  
                    {content && (
                      <div
                        className="document-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    )}
                  </div>
                );
              }

              // PDF - content may contain HTML or PDF URL
              if (mediaType === 'PDF') {
                return (
                  <div key={material.id} className="material-item material-pdf mb--30">
                  
                    {content && (
                      <div className="pdf-wrapper">
                        <iframe
                          src={content}
                          style={{ width: '100%', height: '600px', border: 'none', borderRadius: '8px' }}
                          title={material.name || 'PDF Document'}
                          onError={(e) => {
                            console.error('PDF load error:', content);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              }

              // LINK - content is the URL
              if (mediaType === 'LINK') {
                return (
                  <div key={material.id} className="material-item material-link mb--30">
                  
                    {content && (
                      <div className="link-wrapper">
                        <a
                          href={content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rbt-btn btn-md bg-primary"
                        >
                          <span className="btn-text">Open Link</span>
                          <span className="btn-icon"><i className="feather-external-link"></i></span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              }

              // TEXT or OTHER - render content as HTML
              if (mediaType === 'TEXT' || mediaType === 'OTHER' || !mediaType) {
                return (
                  <div key={material.id} className="material-item material-text mb--30">
                    {content && (
                      <div
                        className="text-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    )}
                  </div>
                );
              }

              // Fallback for unknown types - render as HTML
              return (
                <div key={material.id} className="material-item material-unknown mb--30">
                
                  {content && (
                    <div
                      className="unknown-content"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Fallback content when no materials
          <div className="content">
            <div className="section-title">
              <h4>{selectedLesson?.name || 'Untitled Lesson'}</h4>
              <p>{selectedLesson?.description || 'No content available for this lesson part.'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Navigation Buttons at Bottom */}
      <div 
        className="bg-color-extra2 ptb--15 overflow-hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: sidebarOpen ? '400px' : 0, // Sidebar width is 400px when open
          right: 0,
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'left 0.3s ease',
        }}
      >
        <div className="container-fluid">
          <div className="rbt-button-group d-flex justify-content-center gap-3">
            <button
              className={`rbt-btn icon-hover icon-hover-left btn-md ${previousPart ? 'bg-primary-opacity' : 'bg-primary-opacity'}`}
              disabled={!previousPart}
              onClick={handlePreviousPart}
            >
              <span className="btn-icon"><i className="feather-arrow-left"></i></span>
              <span className="btn-text">Previous</span>
            </button>

            <button
              className={`rbt-btn icon-hover btn-md ${nextPart ? 'bg-primary-opacity' : 'bg-primary-opacity'}`}
              disabled={!nextPart}
              onClick={handleNextPart}
            >
              <span className="btn-text">Next</span>
              <span className="btn-icon"><i className="feather-arrow-right"></i></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Spacer to prevent content from being hidden behind fixed buttons */}
      <div style={{ height: '80px' }}></div>
    </div>
  );
}

