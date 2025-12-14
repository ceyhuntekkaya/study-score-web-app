// 4. Lesson Tree Component
// components/course/LessonTree.tsx

import { CourseDetailDTO } from "@/types/course/course";
import { SelectionState } from "@/types/course/selectionState";

interface LessonTreeProps {
  course: CourseDetailDTO;
  selectionState: SelectionState; // SelectionState interface'ini import edin
}

export function LessonTree2({ course, selectionState }: LessonTreeProps) {
  const {
    selectedLessonId,
    selectedChildLessonId,
    selectedGrandChildLessonId,
    setSelectedLessonId,
    setSelectedChildLessonId,
    setSelectedGrandChildLessonId,
    setSelectedLessonPartId,
  } = selectionState;

  if (!course.lessons) return null;

  return (
    <div className="card">
      <div className="card-header bg-light">
        <i className="bi bi-book me-2"></i>
        Lessons
      </div>
      <div className="list-group list-group-flush">
        {course.lessons.map((lesson) => (
          <div key={lesson.id}>
            <button
              className={`list-group-item list-group-item-action ${
                selectedLessonId === lesson.id && !selectedChildLessonId
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSelectedLessonId(lesson.id);
                setSelectedChildLessonId(null);
                setSelectedGrandChildLessonId(null);
                if (lesson.lessonParts && lesson.lessonParts.length > 0) {
                  setSelectedLessonPartId(lesson.lessonParts[0].id);
                } else {
                  setSelectedLessonPartId(null);
                }
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>
                    {lesson.orderNumber || ""}. {lesson.name}
                  </strong>
                </span>
                {lesson.childLessons && lesson.childLessons.length > 0 && (
                  <i
                    className={`bi ${
                      selectedLessonId === lesson.id
                        ? "bi-chevron-down"
                        : "bi-chevron-right"
                    }`}
                  ></i>
                )}
              </div>
            </button>

            {/* Child Lessons */}
            {selectedLessonId === lesson.id &&
              lesson.childLessons &&
              lesson.childLessons.length > 0 && (
                <div className="ps-3">
                  {lesson.childLessons.map((childLesson) => (
                    <div key={childLesson.id}>
                      <button
                        className={`list-group-item list-group-item-action ${
                          selectedChildLessonId === childLesson.id &&
                          !selectedGrandChildLessonId
                            ? "active"
                            : ""
                        }`}
                        onClick={() => {
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
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            {childLesson.orderNumber || ""}. {childLesson.name}
                          </span>
                          {childLesson.childLessons &&
                            childLesson.childLessons.length > 0 && (
                              <i
                                className={`bi ${
                                  selectedChildLessonId === childLesson.id
                                    ? "bi-chevron-down"
                                    : "bi-chevron-right"
                                }`}
                              ></i>
                            )}
                        </div>
                      </button>

                      {/* Grand Child Lessons */}
                      {selectedChildLessonId === childLesson.id &&
                        childLesson.childLessons &&
                        childLesson.childLessons.length > 0 && (
                          <div className="ps-3">
                            {childLesson.childLessons.map(
                              (grandChildLesson) => (
                                <button
                                  key={grandChildLesson.id}
                                  className={`list-group-item list-group-item-action ${
                                    selectedGrandChildLessonId ===
                                    grandChildLesson.id
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={() => {
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
                                    {grandChildLesson.orderNumber || ""}.{" "}
                                    {grandChildLesson.name}
                                  </span>
                                </button>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
