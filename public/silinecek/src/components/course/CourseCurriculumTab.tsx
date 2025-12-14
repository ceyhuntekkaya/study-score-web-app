import React, { useEffect } from "react";
import {
  Play,
  CheckCircle,
  GraduationCap,
  BookOpen,
  FileText,
} from "lucide-react";
import { CourseLessonDTO } from "@/types/course/course-lesson";
import { ELessonLevel } from "@/types/enumeration";
import { useParams } from "next/navigation";
import { useCourses } from "@/hooks/course/use-course";
import { CourseLessonDetailDTO } from "@/types/course/course";
import "@/style.css";

interface CourseCurriculumTabProps {
  courseLessons: CourseLessonDTO[];
  onLessonClick: (lesson: CourseLessonDetailDTO) => void;
}

// Union type for lesson data
type LessonData = CourseLessonDTO | CourseLessonDetailDTO;

const CourseCurriculumTab: React.FC<CourseCurriculumTabProps> = ({
  courseLessons,
  onLessonClick,
}) => {
  const params = useParams();
  const id = params.id as string;
  const { courseDetailDTO, fetchCourseDetailById } = useCourses();

  useEffect(() => {
    fetchCourseDetailById(id);
  }, [id, fetchCourseDetailById]);

  // Ders seviyesi için yardımcı fonksiyonlar
  const getLevelText = (level: ELessonLevel): string => {
    switch (level) {
      case ELessonLevel.UNIT:
        return "UNIT";
      case ELessonLevel.TOPIC:
        return "TOPIC";
      case ELessonLevel.LESSON:
        return "LESSON";
      default:
        return "UNKNOWN";
    }
  };

  const getLevelIcon = (level: ELessonLevel) => {
    switch (level) {
      case ELessonLevel.UNIT:
        return GraduationCap;
      case ELessonLevel.TOPIC:
        return BookOpen;
      case ELessonLevel.LESSON:
        return FileText;
      default:
        return FileText;
    }
  };

  // Lesson Card Component
  const LessonCard: React.FC<{
    lesson: LessonData;
    index: number;
    level: number;
    parentNumbers?: string;
    onLessonClick: (lesson: CourseLessonDetailDTO) => void;
  }> = ({ lesson, index, level, parentNumbers = "", onLessonClick }) => {
    const LevelIcon = getLevelIcon(lesson.lessonLevel);
    const numberPrefix = parentNumbers
      ? `${parentNumbers}.${index + 1}`
      : `${index + 1}`;

    // Type guard to check if lesson is CourseLessonDetailDTO
    const isDetailedLesson = (
      lesson: LessonData
    ): lesson is CourseLessonDetailDTO => {
      return "lessonParts" in lesson;
    };

    const handleLessonClick = () => {
      if (isDetailedLesson(lesson)) {
        onLessonClick(lesson);
      } else {
        // Convert CourseLessonDTO to CourseLessonDetailDTO format for modal
        const detailedLesson: CourseLessonDetailDTO = {
          ...lesson,
          lessonParts: [], // Default empty array
          description:
            lesson.description ||
            `In this lesson, ${lesson.name.toLowerCase()} topic will be comprehensively covered.`,
          childLessons:
            lesson.childLessons as unknown as CourseLessonDetailDTO[], // Double assertion for type compatibility
        };
        onLessonClick(detailedLesson);
      }
    };

    const indentStyle = {
      paddingLeft: level === 0 ? "0px" : level === 1 ? "20px" : "40px",
    };

    return (
      <>
        <div
          className="lesson-example-item"
          style={{
            ...indentStyle,
            cursor: "pointer",
            marginBottom: "10px",
          }}
          onClick={handleLessonClick}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "24px",
              }}
            >
              <LevelIcon
                size={18}
                style={{
                  marginRight: "24px",
                  // paddingLeft: "20px",
                  color:
                    level === 0 ? "#0a2e5e" : level === 1 ? "#666" : "#999",
                }}
              />
              <div>
                <b>
                  {level > 0 && `${numberPrefix} `}
                  {lesson.name}
                </b>
                <br />
                <small style={{ color: "#666" }}>
                  {getLevelText(lesson.lessonLevel)} - Order:{" "}
                  {lesson.orderNumber}
                </small>
                {lesson.description && (
                  <>
                    <br />
                    <span style={{ color: "#333", fontSize: "14px" }}>
                      {lesson.description}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#0a2e5e",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                }}
                title="Go to Lesson"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLessonClick();
                }}
              >
                <Play size={16} />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#28a745",
                  cursor: "pointer",
                  padding: "4px",
                  borderRadius: "4px",
                }}
                title="Mark as Completed"
                onClick={(e) => e.stopPropagation()}
              >
                <CheckCircle size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Render child lessons */}
        {lesson.childLessons &&
          lesson.childLessons.length > 0 &&
          lesson.childLessons.map((childLesson, childIndex) => (
            <React.Fragment key={`child-${childLesson.id}`}>
              <LessonCard
                lesson={childLesson}
                index={childIndex}
                level={level + 1}
                parentNumbers={numberPrefix}
                onLessonClick={onLessonClick}
              />

              {/* Render grandchild lessons */}
              {childLesson.childLessons &&
                childLesson.childLessons.length > 0 &&
                childLesson.childLessons.map(
                  (grandChildLesson, grandChildIndex) => (
                    <LessonCard
                      key={`grandchild-${grandChildLesson.id}`}
                      lesson={grandChildLesson}
                      index={grandChildIndex}
                      level={level + 2}
                      parentNumbers={`${numberPrefix}.${childIndex + 1}`}
                      onLessonClick={onLessonClick}
                    />
                  )
                )}
            </React.Fragment>
          ))}
      </>
    );
  };

  return (
    <div className="">
      <h2 className="textColor" style={{ marginTop: "20px" }}>
        Course Curriculum
      </h2>

      <div className="lesson-content">
        {(courseDetailDTO?.lessons || courseLessons).map((lesson, index) => (
          <LessonCard
            key={`main-${lesson.id}`}
            lesson={lesson}
            index={index}
            level={0}
            onLessonClick={onLessonClick}
          />
        ))}
      </div>

      {/* Course Info */}
      <p className="textColor" style={{ marginTop: "30px", color: "#b7113d" }}>
        <b>Curriculum Info</b>
        <br />
        <br />
        You can click on the course name to see course details and start
        learning step by step.
      </p>
    </div>
  );
};

export default CourseCurriculumTab;
