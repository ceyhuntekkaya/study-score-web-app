"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContent } from "@/contexts/ContentContext";
import { useGetCourseWithAllDetails } from "@/generated/api/course-rest-controller/course-rest-controller";
import { useGetCourseProgress } from "@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller";
import type {
  CourseLessonDetailDTO,
  CourseLessonPartDetailDTO,
} from "@/generated/api/openAPIDefinition.schemas";
import MaterialRenderer from "./MaterialRenderer";
import { useProgressTracking } from "./useProgressTracking";
import AIChat from "./AIChat";
import TtsService from "@/components/common/TtsService";

/**
 * Lesson Content Component
 * Displays lesson content with materials and tracks user progress
 */
export default function LessonContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useContent();

  // Parse courseId and lessonId from pathname
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const courseId = pathParts[2];
  const lessonId = pathParts[3];
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);
  const [pendingPartId, setPendingPartId] = useState<string | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  const stripHtmlToText = (html: string): string => {
    if (!html) return "";
    try {
      if (typeof window !== "undefined" && "DOMParser" in window) {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return (doc.body?.textContent || "").replace(/\s+/g, " ").trim();
      }
    } catch {
      // Fall through to regex-based cleanup
    }
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // API calls
  const { data: courseDetails, isLoading: isCourseLoading } =
    useGetCourseWithAllDetails(courseId || "", {
      query: { enabled: !!courseId },
    });

  const { data: courseProgress } = useGetCourseProgress(courseId || "", {
    query: { enabled: !!courseId },
  });

  // Find selected lesson
  const selectedLesson = useMemo(() => {
    if (!courseDetails?.lessons || !lessonId) return null;

    const findLesson = (
      lessons: CourseLessonDetailDTO[],
    ): CourseLessonDetailDTO | null => {
      for (const lesson of lessons) {
        if (lesson.id === lessonId) return lesson;
        const lessonWithChildren = lesson as CourseLessonDetailDTO & {
          childLessons?: CourseLessonDetailDTO[];
        };
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
  }, [
    selectedPartId,
    selectedPart?.materials?.length || 0,
    selectedPart?.materials?.map((m) => `${m.id}-${m.orderNumber}`).join(",") ||
      "",
  ]);

  const ttsText = useMemo(() => {
    const chunks: string[] = [];

    const lessonName = selectedLesson?.name?.trim();
    const partName = selectedPart?.name?.trim();
    if (lessonName) chunks.push(lessonName);
    if (partName && partName !== lessonName) chunks.push(partName);

    const partDesc = stripHtmlToText(selectedPart?.description || "");
    if (partDesc) chunks.push(partDesc);

    const materialText = materials
      .filter((m) =>
        ["TEXT", "DOCUMENT", "OTHER"].includes((m.mediaType || "").toString()),
      )
      .map((m) => stripHtmlToText(m.content || ""))
      .filter(Boolean)
      .join("\n\n");

    if (materialText) chunks.push(materialText);

    const combined = chunks.filter(Boolean).join("\n\n").trim();
    // Limit payload size to avoid huge requests
    return combined.length > 4000 ? combined.slice(0, 4000) : combined;
  }, [
    selectedLesson?.name,
    selectedPart?.name,
    selectedPart?.description,
    materials,
  ]);

  // Progress tracking hook
  const {
    registerVideoElement,
    handlePdfLoad,
    handlePdfDownload,
    handleLinkClick,
  } = useProgressTracking({
    selectedPartId,
    materials,
  });

  // Get all parts from all lessons (for navigation)
  const allParts = useMemo(() => {
    if (!courseDetails?.lessons) return [];

    const collectParts = (
      lessons: CourseLessonDetailDTO[],
    ): Array<{
      part: CourseLessonPartDetailDTO;
      lessonId: string;
      lessonName: string;
    }> => {
      const parts: Array<{
        part: CourseLessonPartDetailDTO;
        lessonId: string;
        lessonName: string;
      }> = [];

      for (const lesson of lessons) {
        if (lesson.lessonParts?.length) {
          const sortedParts = lesson.lessonParts
            .filter((part): part is CourseLessonPartDetailDTO => !!part)
            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

          sortedParts.forEach((part) => {
            parts.push({
              part,
              lessonId: lesson.id || "",
              lessonName: lesson.name || "Untitled Lesson",
            });
          });
        }

        const lessonWithChildren = lesson as CourseLessonDetailDTO & {
          childLessons?: CourseLessonDetailDTO[];
        };
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
        const partExists = lessonParts.some(
          (part) => part.id === pendingPartId,
        );
        if (partExists) {
          setSelectedPartId(pendingPartId);
          setPendingPartId(null);
          return;
        }
      }

      if (selectedPartId) {
        const partExists = lessonParts.some(
          (part) => part.id === selectedPartId,
        );
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
    const lessonName = selectedLesson?.name || "Untitled Lesson";
    if (selectedPart?.name) {
      return `${lessonName} / ${selectedPart.name}`;
    }
    return lessonName;
  }, [selectedLesson, selectedPart]);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonId]);

  return (
    <div
      className={`rbt-lesson-rightsidebar overflow-hidden lesson-video ${!sidebarOpen ? "full-width" : ""}`}
    >
      {/* Compact Top Bar: title + tabs + close in one row */}
      <div className="lesson-top-bar ss-compact-header">
        <div className="lesson-top-left">
          <h5>{headerTitle}</h5>
        </div>
        <div className="ss-header-tabs">
          {lessonParts.map((part) => {
            const isActive = selectedPartId === part.id && !showAIChat;
            return (
              <button
                key={part.id}
                className={`ss-header-tab${isActive ? " ss-header-tab--active" : ""}`}
                onClick={() => {
                  setSelectedPartId(part.id || null);
                  setShowAIChat(false);
                }}
              >
                {part.name || `Part ${part.orderNumber || ""}`}
              </button>
            );
          })}
          <button
            className={`ss-header-tab ss-header-tab--ai${showAIChat ? " ss-header-tab--active" : ""}`}
            onClick={() => setShowAIChat(!showAIChat)}
          >
            <i className="feather-cpu"></i>
            <span>Study with AI</span>
            {showAIChat && <i className="feather-x ss-ai-close-icon"></i>}
          </button>
        </div>
        <div className="lesson-top-right">
          <div className="rbt-btn-close">
            <Link
              href="/learner/dashboard"
              title="Go Back to Dashboard"
              className="rbt-round-btn"
            >
              <i className="feather-x"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="inner ss-content-inner"
        style={{
          paddingBottom: ttsText ? 120 : undefined,
        }}
      >
        {isCourseLoading ? (
          <div className="ss-content-skeleton">
            <div className="ss-skeleton-video"></div>
            <div className="ss-skeleton-card">
              <div className="ss-skeleton-line ss-skeleton-line--title"></div>
              <div className="ss-skeleton-line ss-skeleton-line--full"></div>
              <div className="ss-skeleton-line ss-skeleton-line--full"></div>
              <div className="ss-skeleton-line ss-skeleton-line--medium"></div>
            </div>
            <div className="ss-skeleton-card">
              <div className="ss-skeleton-line ss-skeleton-line--short"></div>
              <div className="ss-skeleton-options">
                <div className="ss-skeleton-option"></div>
                <div className="ss-skeleton-option"></div>
                <div className="ss-skeleton-option"></div>
                <div className="ss-skeleton-option"></div>
              </div>
            </div>
          </div>
        ) : showAIChat ? (
          <div className="ai-chat-container ss-ai-chat-fullscreen">
            <div className="ss-ai-chat-header">
              <i className="feather-cpu"></i>
              <span>AI Study Assistant</span>
            </div>
            <AIChat
              activeText={lessonParts[0]?.description || ""}
              lessonPartName={lessonParts[0]?.name}
              mode="learning"
              courseCategory={courseDetails?.category}
            />
          </div>
        ) : (
          <>
            {materials.length > 0 ? (
              <div className="materials-content">
                {selectedPart?.name !== "Practice" &&
                  materials.map((material) => (
                    <MaterialRenderer
                      key={material.id}
                      material={material}
                      onVideoRef={registerVideoElement}
                      onPdfLoad={handlePdfLoad}
                      onPdfDownload={handlePdfDownload}
                      onLinkClick={handleLinkClick}
                      showAIChat={true}
                    />
                  ))}

                {selectedPart?.name === "Practice" && (
                  <div className="material-item ss-practice-card">
                    <AIChat
                      activeText={selectedLesson?.name || ""}
                      lessonPartName={selectedPart?.name}
                      mode="practice"
                      courseCategory={courseDetails?.category}
                    />
                  </div>
                )}

                {selectedPart?.name?.toLowerCase().startsWith("example") && (
                  <div className="material-item ss-example-card">
                    <AIChat
                      activeText={selectedPart?.description || ""}
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
                  <h4>{selectedLesson?.name || "Untitled Lesson"}</h4>
                  <p>
                    {selectedLesson?.description ||
                      "No content available for this lesson part."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom TTS Panel */}
      {ttsText && (
        <div
          className="ss-tts-panel"
          style={{
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            padding: "10px 12px",
            background: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <TtsService
            text={ttsText}
            language="tr"
            showControls={true}
            showButton={true}
            buttonText="Seslendir"
            showSpeakerSelect={false}
            showSpeedSelect={true}
            showEmotionSelect={false}
          />
        </div>
      )}

      {/* Side Navigation Arrows */}
      {previousPart && (
        <button
          className="ss-side-nav ss-side-nav--left"
          onClick={handlePreviousPart}
          title="Previous"
        >
          <i className="feather-chevron-left"></i>
        </button>
      )}

      {nextPart && (
        <button
          className="ss-side-nav ss-side-nav--right"
          onClick={handleNextPart}
          title="Next"
        >
          <i className="feather-chevron-right"></i>
        </button>
      )}
    </div>
  );
}
