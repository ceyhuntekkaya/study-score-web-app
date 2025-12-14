// components/course/LessonTree.tsx

import { useState, useEffect } from "react";
import { CourseDetailDTO, CourseLessonDetailDTO } from "@/types/course/course";
import { SelectionState } from "@/types/course/selectionState";

interface LessonTreeProps {
  course: CourseDetailDTO;
  selectionState: SelectionState;
}

export function LessonTree({ course, selectionState }: LessonTreeProps) {
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);

  const {
    selectedLessonId,
    selectedChildLessonId,
    selectedGrandChildLessonId,
    selectedLessonPartId,
    setSelectedLessonId,
    setSelectedChildLessonId,
    setSelectedGrandChildLessonId,
    setSelectedLessonPartId,
  } = selectionState;

  // Seçili item değiştiğinde ilgili lesson'ı otomatik aç
  useEffect(() => {
    if (!course.lessons) return;

    if (selectedGrandChildLessonId) {
      // Grand child lesson seçiliyse, parent lesson'ını bul ve aç
      for (const lesson of course.lessons) {
        if (lesson.childLessons) {
          for (const childLesson of lesson.childLessons) {
            if (childLesson.childLessons) {
              const foundGrandChild = childLesson.childLessons.find(
                (gc) => gc.id === selectedGrandChildLessonId
              );
              if (foundGrandChild) {
                setExpandedLessons((prev) => {
                  if (!prev.includes(lesson.id)) {
                    return [...prev, lesson.id];
                  }
                  return prev;
                });
                break;
              }
            }
          }
        }
      }
    } else if (selectedLessonPartId) {
      // Lesson part seçiliyse, parent lesson'ını bul ve aç
      for (const lesson of course.lessons) {
        const foundLessonPart = lesson.lessonParts?.find(
          (lp) => lp.id === selectedLessonPartId
        );

        if (foundLessonPart) {
          setExpandedLessons((prev) => {
            if (!prev.includes(lesson.id)) {
              return [...prev, lesson.id];
            }
            return prev;
          });
          break;
        }

        // Child lesson'larda ara
        if (lesson.childLessons) {
          for (const childLesson of lesson.childLessons) {
            const foundLessonPart = childLesson.lessonParts?.find(
              (lp) => lp.id === selectedLessonPartId
            );
            if (foundLessonPart) {
              setExpandedLessons((prev) => {
                if (!prev.includes(lesson.id)) {
                  return [...prev, lesson.id];
                }
                return prev;
              });
              break;
            }

            // Grand child lesson'larda ara
            if (childLesson.childLessons) {
              for (const grandChildLesson of childLesson.childLessons) {
                const foundLessonPart = grandChildLesson.lessonParts?.find(
                  (lp) => lp.id === selectedLessonPartId
                );
                if (foundLessonPart) {
                  setExpandedLessons((prev) => {
                    if (!prev.includes(lesson.id)) {
                      return [...prev, lesson.id];
                    }
                    return prev;
                  });
                  break;
                }
              }
            }
          }
        }
      }
    }
  }, [selectedGrandChildLessonId, selectedLessonPartId, course.lessons]);

  if (!course.lessons) return null;

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  return (
    <div className="lesson-accordion">
      {course.lessons.map((lesson: CourseLessonDetailDTO) => {
        const hasChildLessons =
          lesson.childLessons && lesson.childLessons.length > 0;

        return (
          <div key={lesson.id} className="lesson-accordion-item">
            <button
              className={`lesson-accordion-header ${
                selectedLessonId === lesson.id && !selectedGrandChildLessonId
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                toggleLesson(lesson.id);
                setSelectedLessonId(lesson.id);
                setSelectedGrandChildLessonId(null);

                // Ana dersin lesson part'ları varsa ilkini seç (child lesson yoksa)
                if (
                  !hasChildLessons &&
                  lesson.lessonParts &&
                  lesson.lessonParts.length > 0
                ) {
                  setSelectedLessonPartId(lesson.lessonParts[0].id);
                  setSelectedChildLessonId(null);
                } else {
                  setSelectedLessonPartId(null);
                  setSelectedChildLessonId(null);
                }
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>
                    {lesson.orderNumber || ""}. {lesson.name}
                  </strong>
                </span>
                {hasChildLessons && (
                  <i
                    className={`bi ${
                      expandedLessons.includes(lesson.id)
                        ? "bi-chevron-down"
                        : "bi-chevron-right"
                    }`}
                  ></i>
                )}
              </div>
            </button>

            {/* Child Lessons */}
            {hasChildLessons && (
              <div
                className={`lesson-accordion-content ${
                  expandedLessons.includes(lesson.id) ? "open" : ""
                }`}
              >
                {lesson.childLessons!.map(
                  (childLesson: CourseLessonDetailDTO) => {
                    const hasGrandChildLessons =
                      childLesson.childLessons &&
                      childLesson.childLessons.length > 0;

                    return (
                      <div key={childLesson.id}>
                        {/* Eğer grand child yoksa, child lesson'ı doğrudan göster */}
                        {!hasGrandChildLessons && (
                          <div
                            className={`lesson-inner-box lesson-child ${
                              selectedLessonId === lesson.id &&
                              selectedChildLessonId === childLesson.id &&
                              !selectedGrandChildLessonId
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setSelectedChildLessonId(childLesson.id);
                              setSelectedGrandChildLessonId(null);

                              if (
                                childLesson.lessonParts &&
                                childLesson.lessonParts.length > 0
                              ) {
                                setSelectedLessonPartId(
                                  childLesson.lessonParts[0].id
                                );
                              } else {
                                setSelectedLessonPartId(null);
                              }
                            }}
                          >
                            <span>{childLesson.name}</span>
                          </div>
                        )}

                        {/* Eğer grand child varsa, onları göster */}
                        {hasGrandChildLessons && (
                          <>
                            {childLesson.childLessons!.map(
                              (
                                grandChildLesson: CourseLessonDetailDTO,
                                index: number
                              ) => (
                                <div
                                  key={grandChildLesson.id}
                                  className={`lesson-inner-box lesson-grandchild ${
                                    selectedGrandChildLessonId ===
                                    grandChildLesson.id
                                      ? "selected"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedLessonId(lesson.id);
                                    setSelectedChildLessonId(childLesson.id);
                                    setSelectedGrandChildLessonId(
                                      grandChildLesson.id
                                    );

                                    if (
                                      grandChildLesson.lessonParts &&
                                      grandChildLesson.lessonParts.length > 0
                                    ) {
                                      setSelectedLessonPartId(
                                        grandChildLesson.lessonParts[0].id
                                      );
                                    } else {
                                      setSelectedLessonPartId(null);
                                    }
                                  }}
                                >
                                  <span>
                                    {index + 1}. {grandChildLesson.name}
                                  </span>
                                </div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Eğer child lesson yoksa, doğrudan lesson parts göster */}
            {!hasChildLessons && lesson.lessonParts && (
              <div
                className={`lesson-accordion-content ${
                  expandedLessons.includes(lesson.id) ? "open" : ""
                }`}
              >
                {lesson.lessonParts.map((lessonPart, index: number) => (
                  <div
                    key={lessonPart.id}
                    className={`lesson-inner-box lesson-part ${
                      selectedLessonPartId === lessonPart.id ? "selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedLessonId(lesson.id);
                      setSelectedChildLessonId(null);
                      setSelectedGrandChildLessonId(null);
                      setSelectedLessonPartId(lessonPart.id);
                    }}
                  >
                    <span>
                      {index + 1}. {lessonPart.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
