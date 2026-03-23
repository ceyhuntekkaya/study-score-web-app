"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContent } from "@/contexts/ContentContext";
import { useGetCourseWithAllDetails } from "@/generated/api/course-rest-controller/course-rest-controller";
import { useGetCourseProgress } from "@/generated/api/learner-activity-rest-controller/learner-activity-rest-controller";
import type { CourseLessonDetailDTO } from "@/generated/api/openAPIDefinition.schemas";
import { LessonSection, LessonItem } from "@/lib/menus";

// Extended type to include childLessons (may come from API but not in type definition)
interface CourseLessonDetailDTOWithChildren extends CourseLessonDetailDTO {
  childLessons?: CourseLessonDetailDTOWithChildren[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────

type ProgressColor = "orange" | "blue";

/** SVG pie chart shown in the RIGHT TRACK column for unit / topic header rows */
function SsProgressCircle({
  completed,
  total,
  color = "orange",
}: {
  completed: number;
  total: number;
  color?: ProgressColor;
}) {
  const pct = total > 0 ? completed / total : 0;
  const cx = 14;
  const cy = 14;
  const r = 11;
  const fillColor = color === "orange" ? "#f97316" : "#3b82f6";

  // 0% — empty grey circle
  if (pct === 0) {
    return (
      <svg
        className="ss-progress-circle"
        viewBox="0 0 28 28"
        width="28"
        height="28"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="white"
          stroke="#d1d5db"
          strokeWidth="2"
        />
      </svg>
    );
  }

  // 100% — green filled with checkmark
  if (pct >= 1) {
    return (
      <svg
        className="ss-progress-circle"
        viewBox="0 0 28 28"
        width="28"
        height="28"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="#22c55e"
          stroke="#22c55e"
          strokeWidth="2"
        />
        <polyline
          points="9,14 12,17.5 19,10"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Partial — pie chart wedge
  const angle = pct * 360;
  const rad = (a: number) => ((a - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(0));
  const y1 = cy + r * Math.sin(rad(0));
  const x2 = cx + r * Math.cos(rad(angle));
  const y2 = cy + r * Math.sin(rad(angle));
  const largeArc = angle > 180 ? 1 : 0;
  const piePath = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`;

  return (
    <svg
      className="ss-progress-circle"
      viewBox="0 0 28 28"
      width="28"
      height="28"
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="white"
        stroke="#d1d5db"
        strokeWidth="2"
      />
      <path d={piePath} fill={fillColor} />
    </svg>
  );
}

/** Small filled/empty circle in the RIGHT TRACK column for lesson rows */
function SsStatusCircle({
  completed,
  active,
}: {
  completed: boolean;
  active: boolean;
}) {
  if (completed || active) {
    return (
      <span className="ss-status-circle ss-status-circle--done">
        <svg viewBox="0 0 14 14" width="10" height="10" fill="none">
          <polyline
            points="2.5,7 5.5,10 11.5,4"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return <span className="ss-status-circle" />;
}

// ──────────────────────────────────────────────────────────────────────────────

/**
 * Lesson Sidebar Component
 * Converted from template - course content sidebar
 * Uses pathname to parse route params (layout can't use useParams)
 */
export default function LessonSidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useContent();
  const [searchQuery, setSearchQuery] = useState("");

  // Parse courseId and lessonId from pathname
  // Path format: /learner/content/[courseId] or /learner/content/[courseId]/[lessonId]
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const courseId = pathParts[2]; // learner, content, [courseId]
  const lessonId = pathParts[3]; // [lessonId] if exists

  // API call to fetch course with all details
  const { data: courseDetails, isLoading } = useGetCourseWithAllDetails(
    courseId || "",
    {
      query: {
        enabled: !!courseId, // Only fetch if we have a courseId
      },
    },
  );

  // API call to fetch course progress
  const { data: courseProgress } = useGetCourseProgress(courseId || "", {
    query: {
      enabled: !!courseId, // Only fetch if we have a courseId
    },
  });

  // Accordion state'i localStorage'dan restore et veya default değer kullan
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lesson-accordion-state");
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
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lesson-topics-state");
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
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "lesson-accordion-state",
        JSON.stringify(Array.from(openSections)),
      );
    }
  }, [openSections]);

  // Topics state değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "lesson-topics-state",
        JSON.stringify(Array.from(openTopics)),
      );
    }
  }, [openTopics]);

  // Helper function to recursively get all child lessons
  const getChildLessons = (
    lesson: CourseLessonDetailDTOWithChildren,
  ): CourseLessonDetailDTOWithChildren[] => {
    // First check if childLessons array exists (from API)
    if (lesson.childLessons && lesson.childLessons.length > 0) {
      return lesson.childLessons as CourseLessonDetailDTOWithChildren[];
    }
    // Fallback: use parentLessonId relationship if childLessons not available
    return [];
  };

  // Helper function to recursively count all LESSONs in a tree
  const countLessonsInTree = (
    lesson: CourseLessonDetailDTOWithChildren,
    allLessons: CourseLessonDetailDTOWithChildren[],
  ): number => {
    let count = 0;

    // If this is a LESSON, count it
    if (lesson.lessonLevel === "LESSON") {
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
      const childrenById = allLessons.filter(
        (l) => l.parentLessonId === lesson.id,
      );
      childrenById.forEach((child) => {
        count += countLessonsInTree(child, allLessons);
      });
    }

    return count;
  };

  // Helper function to build a map of partId -> lessonId from courseDetails
  const buildPartToLessonMap = useMemo(() => {
    if (!courseDetails?.lessons) {
      return new Map<string, string>();
    }

    const partToLessonMap = new Map<string, string>();

    // Recursively find all lessons and their parts
    const processLesson = (lesson: CourseLessonDetailDTOWithChildren) => {
      if (!lesson.id) return;

      // If this is a LESSON level, process its parts
      if (lesson.lessonLevel === "LESSON" && lesson.lessonParts && lesson.id) {
        const lessonId = lesson.id; // TypeScript guard
        lesson.lessonParts.forEach((part) => {
          if (part.id && lessonId) {
            partToLessonMap.set(part.id, lessonId);
          }
        });
      }

      // Process child lessons
      const children = getChildLessons(lesson);
      children.forEach((child) => {
        processLesson(child);
      });

      // Fallback: find children by parentLessonId
      const allLessons = (courseDetails?.lessons || [])
        .filter((l): l is CourseLessonDetailDTO => !!l)
        .map((l) => l as CourseLessonDetailDTOWithChildren);

      const childrenById = allLessons.filter(
        (l) => l.parentLessonId === lesson.id,
      );
      childrenById.forEach((child) => {
        processLesson(child);
      });
    };

    courseDetails.lessons.forEach((lesson) => {
      processLesson(lesson as CourseLessonDetailDTOWithChildren);
    });

    return partToLessonMap;
  }, [courseDetails]);

  // Helper function to check if a lesson is completed
  // A lesson is completed if ALL its parts are COMPLETED
  const isLessonCompleted = useMemo(() => {
    // Wait for courseDetails to load
    if (isLoading || !courseDetails?.lessons || !courseProgress) {
      return new Map<string, boolean>();
    }

    const lessonCompletionMap = new Map<string, boolean>();

    // Get part progresses from courseProgress
    const partProgresses = (courseProgress as any)?.partProgresses || [];

    // Build map: partId -> completionStatus
    const partProgressMap = new Map<string, string>();
    partProgresses.forEach((pp: any) => {
      if (pp.partId && pp.completionStatus) {
        partProgressMap.set(pp.partId, pp.completionStatus);
      }
    });

    // Recursive function to find all LESSON level items
    const findAllLessons = (
      lesson: CourseLessonDetailDTOWithChildren,
    ): CourseLessonDetailDTOWithChildren[] => {
      const lessons: CourseLessonDetailDTOWithChildren[] = [];

      if (lesson.lessonLevel === "LESSON") {
        lessons.push(lesson);
      }

      // Get children from childLessons array or by parentLessonId
      const children = getChildLessons(lesson);
      children.forEach((child) => {
        lessons.push(...findAllLessons(child));
      });

      return lessons;
    };

    // Find all LESSON level items recursively
    const allLessons: CourseLessonDetailDTOWithChildren[] = [];
    courseDetails.lessons.forEach((lesson) => {
      allLessons.push(
        ...findAllLessons(lesson as CourseLessonDetailDTOWithChildren),
      );
    });

    // Check each LESSON
    allLessons.forEach((lesson) => {
      if (!lesson.id) {
        return;
      }

      // Get all parts in this lesson from courseDetails
      const parts = lesson.lessonParts || [];

      if (parts.length === 0) {
        lessonCompletionMap.set(lesson.id, false);
        return;
      }

      // Check if all parts are COMPLETED
      const allPartsCompleted = parts.every((part) => {
        if (!part.id) return false;
        const status = partProgressMap.get(part.id);
        return status === "COMPLETED";
      });

      lessonCompletionMap.set(lesson.id, allPartsCompleted);
    });

    return lessonCompletionMap;
  }, [courseDetails, courseProgress, buildPartToLessonMap, isLoading]);

  // Helper function to check if a UNIT is completed
  // A UNIT is completed if ALL its LESSONs are completed
  const isUnitCompleted = useMemo(() => {
    if (!courseDetails?.lessons || !isLessonCompleted.size) {
      return new Map<string, boolean>();
    }

    const unitCompletionMap = new Map<string, boolean>();

    const allLessons = courseDetails.lessons
      .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
      .map((lesson) => lesson as CourseLessonDetailDTOWithChildren)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

    // Get all UNITs
    const units = allLessons.filter(
      (lesson) => lesson.lessonLevel === "UNIT" && !lesson.parentLessonId,
    );

    units.forEach((unit) => {
      if (!unit.id) return;

      // Get all LESSONs in this UNIT (recursively)
      const getAllLessonsInUnit = (
        lesson: CourseLessonDetailDTOWithChildren,
      ): CourseLessonDetailDTOWithChildren[] => {
        const lessons: CourseLessonDetailDTOWithChildren[] = [];

        if (lesson.lessonLevel === "LESSON") {
          lessons.push(lesson);
        }

        const children = getChildLessons(lesson);
        if (children.length > 0) {
          children.forEach((child) => {
            lessons.push(...getAllLessonsInUnit(child));
          });
        } else {
          const childrenById = allLessons.filter(
            (l) => l.parentLessonId === lesson.id,
          );
          childrenById.forEach((child) => {
            lessons.push(...getAllLessonsInUnit(child));
          });
        }

        return lessons;
      };

      const unitLessons = getAllLessonsInUnit(unit);
      const lessonLevelLessons = unitLessons.filter(
        (l) => l.lessonLevel === "LESSON",
      );

      if (lessonLevelLessons.length === 0) {
        unitCompletionMap.set(unit.id, false);
        return;
      }

      // Check if all LESSONs are completed
      const allLessonsCompleted = lessonLevelLessons.every((lesson) => {
        if (!lesson.id) return false;
        return isLessonCompleted.get(lesson.id) === true;
      });

      unitCompletionMap.set(unit.id, allLessonsCompleted);
    });

    return unitCompletionMap;
  }, [courseDetails, isLessonCompleted]);

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
      (lesson) => lesson.lessonLevel === "UNIT" && !lesson.parentLessonId,
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
          .filter((child) => child.lessonLevel === "TOPIC")
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

        directLessons = unitChildren
          .filter((child) => child.lessonLevel === "LESSON")
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      } else {
        // Fallback: use parentLessonId relationship
        topics = allLessons
          .filter(
            (lesson) =>
              lesson.lessonLevel === "TOPIC" &&
              lesson.parentLessonId === unit.id,
          )
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

        directLessons = allLessons
          .filter(
            (lesson) =>
              lesson.lessonLevel === "LESSON" &&
              lesson.parentLessonId === unit.id,
          )
          .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
      }

      // Calculate total lessons count recursively
      const totalLessonsCount = countLessonsInTree(unit, allLessons);

      // Calculate completed count
      const getAllLessonsInUnit = (
        lesson: CourseLessonDetailDTOWithChildren,
      ): CourseLessonDetailDTOWithChildren[] => {
        const lessons: CourseLessonDetailDTOWithChildren[] = [];

        if (lesson.lessonLevel === "LESSON") {
          lessons.push(lesson);
        }

        const children = getChildLessons(lesson);
        if (children.length > 0) {
          children.forEach((child) => {
            lessons.push(...getAllLessonsInUnit(child));
          });
        } else {
          const childrenById = allLessons.filter(
            (l) => l.parentLessonId === lesson.id,
          );
          childrenById.forEach((child) => {
            lessons.push(...getAllLessonsInUnit(child));
          });
        }

        return lessons;
      };

      const unitLessons = getAllLessonsInUnit(unit);
      const lessonLevelLessons = unitLessons.filter(
        (l) => l.lessonLevel === "LESSON",
      );
      const completedCount = lessonLevelLessons.filter((lesson) => {
        if (!lesson.id) return false;
        return isLessonCompleted.get(lesson.id) === true;
      }).length;

      return {
        id: `unit-${unit.id || unitIndex}`,
        title: unit.name || `Unit ${unitIndex + 1}`,
        completedCount: completedCount,
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
  }, [courseDetails, isLessonCompleted, isUnitCompleted]);

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
            topicLessons = topicChildLessons.filter(
              (child) => child.lessonLevel === "LESSON",
            );
          } else {
            const allLessons = (courseDetails?.lessons || [])
              .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
              .map((lesson) => lesson as CourseLessonDetailDTOWithChildren);

            topicLessons = allLessons.filter(
              (lesson) =>
                lesson.lessonLevel === "LESSON" &&
                lesson.parentLessonId === topic.id,
            );
          }

          if (topicLessons.some((lesson) => lesson.id === lessonId)) {
            return section.id;
          }
        }
      }
      return null;
    };

    // Also find which TOPIC contains the active lesson (for multi-lesson topics)
    const findTopicForLesson = (): string | null => {
      for (const section of sections) {
        const sectionWithData = section as LessonSection & {
          topics?: CourseLessonDetailDTOWithChildren[];
        };
        const topics = sectionWithData.topics || [];
        for (const topic of topics) {
          const topicWithChildren = topic as CourseLessonDetailDTOWithChildren;
          const topicChildLessons = getChildLessons(topicWithChildren);
          let topicLessons: CourseLessonDetailDTOWithChildren[] = [];
          if (topicChildLessons.length > 0) {
            topicLessons = topicChildLessons.filter(
              (child) => child.lessonLevel === "LESSON",
            );
          } else {
            const allLessons = (courseDetails?.lessons || [])
              .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
              .map((lesson) => lesson as CourseLessonDetailDTOWithChildren);
            topicLessons = allLessons.filter(
              (lesson) =>
                lesson.lessonLevel === "LESSON" &&
                lesson.parentLessonId === topic.id,
            );
          }
          // Only for multi-lesson topics (single-lesson topics are rendered flat)
          if (
            topicLessons.length > 1 &&
            topicLessons.some((l) => l.id === lessonId)
          ) {
            return topic.id || null;
          }
        }
      }
      return null;
    };

    const sectionId = findSectionForLesson();
    const topicId = findTopicForLesson();

    // Only open if the section is not already open (to avoid interfering with user interactions)
    if (sectionId) {
      setOpenSections((prev) => {
        if (!prev.has(sectionId)) {
          return new Set([sectionId]);
        }
        return prev;
      });
    }

    // Auto-open the topic containing the active lesson
    if (topicId) {
      setOpenTopics((prev) => {
        if (!prev.has(topicId)) {
          const next = new Set(prev);
          next.add(topicId);
          return next;
        }
        return prev;
      });
    }
  }, [lessonId, sections, courseDetails]); // Removed openSections from dependencies to prevent infinite loop

  // Scroll to active lesson when lessonId changes or accordion opens
  useEffect(() => {
    if (lessonId && openSections.size > 0) {
      // Wait for accordion to fully open and DOM to update
      const timeoutId = setTimeout(() => {
        const activeLessonElement = document.getElementById(
          `active-lesson-${lessonId}`,
        );
        if (activeLessonElement) {
          activeLessonElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500); // Increased timeout to wait for accordion animation

      return () => clearTimeout(timeoutId);
    }
  }, [lessonId, openSections]);

  // Overall course completion percentage (for the bottom progress bar)
  const overallProgress = useMemo(() => {
    let total = 0;
    let done = 0;
    isLessonCompleted.forEach((val) => {
      total++;
      if (val) done++;
    });
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [isLessonCompleted]);

  // Get all LESSON-level children of a TOPIC
  const getTopicLessons = (
    topic: CourseLessonDetailDTOWithChildren,
  ): CourseLessonDetailDTOWithChildren[] => {
    const children = getChildLessons(topic);
    if (children.length > 0) {
      return children
        .filter((c) => c.lessonLevel === "LESSON")
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
    }
    return (courseDetails?.lessons || [])
      .filter((l): l is CourseLessonDetailDTO => !!l)
      .map((l) => l as CourseLessonDetailDTOWithChildren)
      .filter(
        (l) => l.lessonLevel === "LESSON" && l.parentLessonId === topic.id,
      )
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
  };

  return (
    <div
      className={`rbt-lesson-leftsidebar ${!sidebarOpen ? "sibebar-none" : ""}`}
    >
      {/* Green-bordered outer frame */}
      <div className="ss-frame">
        {/* Green logo header */}
        <div className="ss-logo-header">
          <Link href="/learner">
            <Image
              src="/assets/images/logo/logo.png"
              alt="StudyScore"
              width={130}
              height={40}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>
        </div>

        {/* Scrollable content area */}
        <div className="ss-frame-body">
          <div className="rbt-course-feature-inner">
            {isLoading ? (
              <div className="ss-state-msg">Loading course content...</div>
            ) : sections.length === 0 ? (
              <div className="ss-state-msg">No course content available.</div>
            ) : (
              /*
               * Two-column flat layout:
               *   LEFT  (flex:1)  — all accordion content (headers + lesson links)
               *   RIGHT (44px)    — progress track: pie charts for units/topics,
               *                     status circles for lessons, vertical connecting line
               *
               * Every "row" is a flex div: [content | track-cell].
               * Rows are emitted as a flat list so the connecting line flows unbroken.
               */
              <div className="ss-sidebar-body">
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
                    <Fragment key={section.id}>
                      {/* ── UNIT header row ────────────────────────────────── */}
                      <div className="ss-row ss-unit-row">
                        <button
                          className={`ss-unit-content${isOpen ? " ss-unit-content--open" : ""}`}
                          type="button"
                          onClick={() =>
                            setOpenSections(
                              isOpen ? new Set() : new Set([section.id]),
                            )
                          }
                          aria-expanded={isOpen}
                        >
                          <span className="ss-unit-label">{section.title}</span>
                          <span className="ss-unit-meta">
                            <span className="ss-count">
                              {section.completedCount}/{section.totalCount}
                            </span>
                            <span className="ss-toggle">
                              {isOpen ? "−" : "+"}
                            </span>
                          </span>
                        </button>
                        {/* RIGHT TRACK: orange pie for unit */}
                        <div
                          className={`ss-track-cell ss-track-first${!isOpen ? " ss-track-closed" : ""}`}
                        >
                          <SsProgressCircle
                            completed={section.completedCount}
                            total={section.totalCount}
                            color="orange"
                          />
                        </div>
                      </div>

                      {/* ── OPEN: direct lessons + topic sub-accordions ────── */}
                      {isOpen &&
                        (() => {
                          // Build flat list of all visible rows to find the last one
                          type RowItem = {
                            type:
                              | "direct"
                              | "singleTopic"
                              | "topicHeader"
                              | "topicLesson";
                            key: string;
                          };
                          const visibleRows: RowItem[] = [];
                          directLessons.forEach((l) =>
                            visibleRows.push({
                              type: "direct",
                              key: l.id || "",
                            }),
                          );
                          topics.forEach((topic) => {
                            const tLessons = getTopicLessons(topic);
                            if (tLessons.length <= 1) {
                              visibleRows.push({
                                type: "singleTopic",
                                key: topic.id || "",
                              });
                            } else {
                              visibleRows.push({
                                type: "topicHeader",
                                key: topic.id || "",
                              });
                              if (openTopics.has(topic.id || "")) {
                                tLessons.forEach((l) =>
                                  visibleRows.push({
                                    type: "topicLesson",
                                    key: `${topic.id}-${l.id}`,
                                  }),
                                );
                              }
                            }
                          });
                          const lastRowKey =
                            visibleRows.length > 0
                              ? visibleRows[visibleRows.length - 1].key
                              : "";

                          return (
                            <>
                              {/* Direct lessons */}
                              {directLessons.map((lesson) => {
                                const isActive =
                                  !!lessonId && lesson.id === lessonId;
                                const isCompleted = !!(
                                  lesson.id && isLessonCompleted.get(lesson.id)
                                );
                                const isLast = (lesson.id || "") === lastRowKey;
                                return (
                                  <div key={lesson.id} className="ss-row">
                                    <Link
                                      href={`/learner/content/${courseId}/${lesson.id}`}
                                      className={`ss-lesson-content${isActive ? " ss-lesson-content--active" : ""}`}
                                      id={
                                        isActive
                                          ? `active-lesson-${lesson.id}`
                                          : undefined
                                      }
                                    >
                                      <span
                                        className="ss-play-btn-icon"
                                        aria-hidden="true"
                                      >
                                        <svg
                                          viewBox="0 0 10 12"
                                          width="8"
                                          height="9"
                                          fill="white"
                                        >
                                          <polygon points="0,0 10,6 0,12" />
                                        </svg>
                                      </span>
                                      <span className="ss-lesson-title">
                                        {lesson.name || "Untitled Lesson"}
                                      </span>
                                    </Link>
                                    {/* RIGHT TRACK: status circle */}
                                    <div
                                      className={`ss-track-cell${isLast ? " ss-track-last" : ""}`}
                                    >
                                      <SsStatusCircle
                                        completed={isCompleted}
                                        active={isActive}
                                      />
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Topics */}
                              {topics.map((topic) => {
                                const tid = topic.id || "";
                                const topicLessons = getTopicLessons(topic);
                                const doneInTopic = topicLessons.filter(
                                  (l) => l.id && isLessonCompleted.get(l.id),
                                ).length;

                                /* ── Single-lesson topic → render as flat lesson row ── */
                                if (topicLessons.length <= 1) {
                                  const lesson = topicLessons[0];
                                  if (!lesson) return null;
                                  const isActive =
                                    !!lessonId && lesson.id === lessonId;
                                  const isCompleted = !!(
                                    lesson.id &&
                                    isLessonCompleted.get(lesson.id)
                                  );
                                  const isLast = tid === lastRowKey;
                                  return (
                                    <div key={topic.id} className="ss-row">
                                      <Link
                                        href={`/learner/content/${courseId}/${lesson.id}`}
                                        className={`ss-lesson-content${isActive ? " ss-lesson-content--active" : ""}`}
                                        id={
                                          isActive
                                            ? `active-lesson-${lesson.id}`
                                            : undefined
                                        }
                                      >
                                        <span
                                          className="ss-play-btn-icon"
                                          aria-hidden="true"
                                        >
                                          <svg
                                            viewBox="0 0 10 12"
                                            width="8"
                                            height="9"
                                            fill="white"
                                          >
                                            <polygon points="0,0 10,6 0,12" />
                                          </svg>
                                        </span>
                                        <span className="ss-lesson-title">
                                          {topic.name ||
                                            lesson.name ||
                                            "Untitled Lesson"}
                                        </span>
                                      </Link>
                                      {/* RIGHT TRACK: status circle */}
                                      <div
                                        className={`ss-track-cell${isLast ? " ss-track-last" : ""}`}
                                      >
                                        <SsStatusCircle
                                          completed={isCompleted}
                                          active={isActive}
                                        />
                                      </div>
                                    </div>
                                  );
                                }

                                /* ── Multi-lesson topic → collapsible ── */
                                const topicOpen = openTopics.has(tid);

                                return (
                                  <Fragment key={topic.id}>
                                    {/* ── TOPIC header row ────────────────────── */}
                                    <div className="ss-row ss-topic-row">
                                      <button
                                        className="ss-topic-content"
                                        type="button"
                                        onClick={() => {
                                          setOpenTopics((prev) => {
                                            const next = new Set(prev);
                                            if (next.has(tid)) next.delete(tid);
                                            else next.add(tid);
                                            return next;
                                          });
                                        }}
                                      >
                                        <span className="ss-topic-label">
                                          {topic.name}
                                        </span>
                                        <span className="ss-unit-meta">
                                          <span className="ss-count">
                                            {doneInTopic}/{topicLessons.length}
                                          </span>
                                          <span className="ss-toggle">
                                            {topicOpen ? "−" : "+"}
                                          </span>
                                        </span>
                                      </button>
                                      {/* RIGHT TRACK: blue pie for topic */}
                                      <div
                                        className={`ss-track-cell${tid === lastRowKey ? " ss-track-last" : ""}`}
                                      >
                                        <SsProgressCircle
                                          completed={doneInTopic}
                                          total={topicLessons.length}
                                          color="blue"
                                        />
                                      </div>
                                    </div>

                                    {/* ── Topic lessons ───────────────────────── */}
                                    {topicOpen &&
                                      topicLessons.map((lesson) => {
                                        const isActive =
                                          !!lessonId && lesson.id === lessonId;
                                        const isCompleted = !!(
                                          lesson.id &&
                                          isLessonCompleted.get(lesson.id)
                                        );
                                        const isLast =
                                          `${tid}-${lesson.id}` === lastRowKey;
                                        return (
                                          <div
                                            key={lesson.id}
                                            className="ss-row ss-lesson-indented"
                                          >
                                            <Link
                                              href={`/learner/content/${courseId}/${lesson.id}`}
                                              className={`ss-lesson-content${isActive ? " ss-lesson-content--active" : ""}`}
                                              id={
                                                isActive
                                                  ? `active-lesson-${lesson.id}`
                                                  : undefined
                                              }
                                            >
                                              <span
                                                className="ss-play-btn-icon"
                                                aria-hidden="true"
                                              >
                                                <svg
                                                  viewBox="0 0 10 12"
                                                  width="8"
                                                  height="9"
                                                  fill="white"
                                                >
                                                  <polygon points="0,0 10,6 0,12" />
                                                </svg>
                                              </span>
                                              <span className="ss-lesson-title">
                                                {lesson.name ||
                                                  "Untitled Lesson"}
                                              </span>
                                            </Link>
                                            {/* RIGHT TRACK: status circle */}
                                            <div
                                              className={`ss-track-cell${isLast ? " ss-track-last" : ""}`}
                                            >
                                              <SsStatusCircle
                                                completed={isCompleted}
                                                active={isActive}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </Fragment>
                                );
                              })}
                            </>
                          );
                        })()}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
          {/* end rbt-course-feature-inner */}

          {/* Overall progress bar — pinned at bottom of white card */}
          <div className="ss-progress-footer">
            <div className="ss-progress-track">
              <div
                className="ss-progress-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
        {/* end ss-frame-body */}
      </div>
    </div>
  );
}
