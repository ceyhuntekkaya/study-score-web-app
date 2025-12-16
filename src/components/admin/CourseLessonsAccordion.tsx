"use client";
import React, { useMemo, useState } from "react";
import {
  CourseLessonDetailDTO,
  CourseLessonPartDetailDTO,
} from "@/generated/api/openAPIDefinition.schemas";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ChevronDown,
  DiamondPlus,
  Pencil,
  Presentation,
} from "lucide-react";

interface CourseLessonsAccordionProps {
  lessons?: CourseLessonDetailDTO[];
}

interface CourseLessonDetailDTOWithChildren extends CourseLessonDetailDTO {
  childLessons?: CourseLessonDetailDTOWithChildren[];
}

type LessonLevel = "UNIT" | "TOPIC" | "LESSON";

export default function CourseLessonsAccordion({
  lessons = [],
}: CourseLessonsAccordionProps) {
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);

  // Transform lessons to hierarchical structure
  const hierarchicalLessons = useMemo(() => {
    if (!lessons || lessons.length === 0) return [];

    const allLessons = lessons
      .filter((lesson): lesson is CourseLessonDetailDTO => !!lesson)
      .map((lesson) => lesson as CourseLessonDetailDTOWithChildren)
      .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

    // Get UNIT level lessons (top level, no parent)
    const units = allLessons.filter(
      (lesson) => lesson.lessonLevel === "UNIT" && !lesson.parentLessonId
    );

    return units;
  }, [lessons]);

  // Toggle accordion function
  const toggleUnit = (unitId: string) => {
    setOpenUnitId((prevId) => (prevId === unitId ? null : unitId));
  };

  // Helper function to get child lessons
  const getChildLessons = (
    parent: CourseLessonDetailDTOWithChildren
  ): CourseLessonDetailDTOWithChildren[] => {
    if (parent.childLessons && parent.childLessons.length > 0) {
      return parent.childLessons;
    }
    if (!lessons) return [];
    return lessons.filter(
      (lesson) => lesson.parentLessonId === parent.id
    ) as CourseLessonDetailDTOWithChildren[];
  };

  // Helper functions for level styling
  const getLevelBadgeStyle = (
    level: LessonLevel | string
  ): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 10px",
      borderRadius: "9999px",
      fontSize: "16px",
      fontWeight: 500,
      fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
      textTransform: "uppercase",
      letterSpacing: "0.025em",
    };

    switch (level) {
      case "UNIT":
        return { ...baseStyle, backgroundColor: "#dcfce7", color: "#166534" };
      case "TOPIC":
        return { ...baseStyle, backgroundColor: "#dbeafe", color: "#1e40af" };
      case "LESSON":
        return { ...baseStyle, backgroundColor: "#fef9c3", color: "#854d0e" };
      default:
        return { ...baseStyle, backgroundColor: "#f3f4f6", color: "#1f2937" };
    }
  };

  const getLevelText = (level: LessonLevel | string): string => {
    switch (level) {
      case "UNIT":
        return "UNIT";
      case "TOPIC":
        return "TOPIC";
      case "LESSON":
        return "LESSON";
      default:
        return "PART";
    }
  };

  const getLevelIcon = (level: LessonLevel | string) => {
    switch (level) {
      case "UNIT":
        return GraduationCap;
      case "TOPIC":
        return BookOpen;
      case "LESSON":
        return FileText;
      default:
        return Presentation;
    }
  };

  // Lesson Part Row Component
  const LessonPartRow: React.FC<{
    lesson: CourseLessonPartDetailDTO;
    index: number;
    level: number;
    parentNumbers?: string;
  }> = ({ lesson, index, level, parentNumbers = "" }) => {
    const LevelIcon = Presentation;
    const [isHovered, setIsHovered] = useState(false);

    const paddingLeft =
      level === 0
        ? "0"
        : level === 1
          ? "1.5rem"
          : level === 2
            ? "3rem"
            : "5rem";
    const bgColor = level === 0 ? "#f9fafb" : "#ffffff";
    const hoverBgColor = "#f3f4f6";
    const numberPrefix = parentNumbers
      ? `${parentNumbers}.${index + 1}`
      : `${index + 1}`;

    return (
      <>
        <tr
          style={{
            backgroundColor: isHovered ? hoverBgColor : bgColor,
            transition: "background-color 0.15s",
            borderBottom: "1px solid #e5e7eb",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <td
            style={{
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
              color: "#111827",
            }}
          >
            {level === 0 ? index + 1 : ""}
          </td>
          <td style={{ padding: "16px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                paddingLeft,
              }}
            >
              <LevelIcon
                size={18}
                style={{
                  marginRight: "0.75rem",
                  color:
                    level === 0
                      ? "#3b82f6"
                      : level === 1
                        ? "#6b7280"
                        : level === 2
                          ? "#f59e0b"
                          : "#ef4444",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: level === 0 ? 600 : 400,
                  fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                  color: level === 0 ? "#111827" : "#374151",
                }}
              >
                {level > 0 && `${numberPrefix} `}
                {lesson.name}
              </span>
            </div>
          </td>
          <td style={{ padding: "16px 24px", textAlign: "center" }}>
            <span style={getLevelBadgeStyle("PART")}>PART</span>
          </td>
          <td style={{ padding: "16px 24px", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.375rem",
                  color: "#3b82f6",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                title="Materyal Ekle"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Handle add material
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#2563eb";
                  e.currentTarget.style.backgroundColor = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#3b82f6";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <DiamondPlus size={16} />
              </button>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.375rem",
                  color: "#10b981",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                title="Düzenle"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Handle edit
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#059669";
                  e.currentTarget.style.backgroundColor = "#d1fae5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#10b981";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Pencil size={16} />
              </button>
            </div>
          </td>
        </tr>
      </>
    );
  };

  // Lesson Row Component (Recursive)
  const LessonRow: React.FC<{
    lesson: CourseLessonDetailDTOWithChildren;
    index: number;
    level: number;
    parentNumbers?: string;
  }> = ({ lesson, index, level, parentNumbers = "" }) => {
    const LevelIcon = getLevelIcon(lesson.lessonLevel || "");
    const [isHovered, setIsHovered] = useState(false);

    const paddingLeft =
      level === 0
        ? "0"
        : level === 1
          ? "1.5rem"
          : level === 2
            ? "3rem"
            : "5rem";
    const bgColor = level === 0 ? "#f9fafb" : "#ffffff";
    const hoverBgColor = "#f3f4f6";
    const numberPrefix = parentNumbers
      ? `${parentNumbers}.${index + 1}`
      : `${index + 1}`;

    // UNIT seviyesinde mi kontrol et
    const isUnit = lesson.lessonLevel === "UNIT" && level === 0;
    const isOpen = openUnitId === lesson.id;

    const children = getChildLessons(lesson);

    const handleLessonClick = () => {
      // Eğer UNIT seviyesindeyse, accordion toggle yap
      if (isUnit) {
        toggleUnit(lesson.id || "");
        return;
      }
      // Diğer seviyeler için normal düzenleme işlemi
      // TODO: Handle edit
    };

    return (
      <>
        <tr
          style={{
            backgroundColor: isHovered ? hoverBgColor : bgColor,
            transition: "background-color 0.15s",
            borderBottom: "1px solid #e5e7eb",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <td
            style={{
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: 500,
              fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
              color: "#111827",
            }}
          >
            {level === 0 ? index + 1 : ""}
          </td>
          <td style={{ padding: "16px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                paddingLeft,
              }}
              onClick={handleLessonClick}
            >
              {isUnit && (
                <ChevronDown
                  size={18}
                  style={{
                    marginRight: "0.5rem",
                    color: "#1f2937",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              )}
              <LevelIcon
                size={18}
                style={{
                  marginRight: "0.75rem",
                  color:
                    level === 0
                      ? "#3b82f6"
                      : level === 1
                        ? "#6b7280"
                        : level === 2
                          ? "#f59e0b"
                          : "#ef4444",
                }}
              />
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: level === 0 ? 600 : 400,
                  fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                  color: level === 0 ? "#111827" : "#374151",
                }}
              >
                {level > 0 && `${numberPrefix} `}
                {lesson.name}
              </span>
            </div>
          </td>
          <td style={{ padding: "16px 24px", textAlign: "center" }}>
            <span style={getLevelBadgeStyle(lesson.lessonLevel || "")}>
              {getLevelText(lesson.lessonLevel || "")}
            </span>
          </td>
          <td style={{ padding: "16px 24px", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {getLevelText(lesson.lessonLevel || "") !== "LESSON" && (
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.375rem",
                    color: "#3b82f6",
                    backgroundColor: "transparent",
                    border: "none",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  title="Alt Seviye Ekle"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Handle add sublevel
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#2563eb";
                    e.currentTarget.style.backgroundColor = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#3b82f6";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <DiamondPlus size={16} />
                </button>
              )}
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.375rem",
                  color: "#10b981",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                title="Düzenle"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Handle edit
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#059669";
                  e.currentTarget.style.backgroundColor = "#d1fae5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#10b981";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Pencil size={16} />
              </button>
            </div>
          </td>
        </tr>

        {/* Render child lessons - Sadece UNIT açıksa göster */}
        {(!isUnit || isOpen) &&
          children &&
          children.length > 0 &&
          children.map((childLesson, childIndex) => (
            <React.Fragment key={`child-${childLesson.id}`}>
              <LessonRow
                lesson={childLesson}
                index={childIndex}
                level={level + 1}
                parentNumbers={numberPrefix}
              />
            </React.Fragment>
          ))}

        {/* Render lesson parts - Sadece UNIT açıksa göster */}
        {(!isUnit || isOpen) &&
          lesson.lessonParts &&
          lesson.lessonParts.length > 0 &&
          lesson.lessonParts
            .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
            .map((lessonPart, partIndex) => (
              <React.Fragment key={`part-${lessonPart.id}`}>
                <LessonPartRow
                  lesson={lessonPart}
                  index={partIndex}
                  level={level + 2}
                  parentNumbers={numberPrefix}
                />
              </React.Fragment>
            ))}

        {/* Spacer between main lessons */}
        {level === 0 && index < hierarchicalLessons.length - 1 && (
          <tr>
            <td
              colSpan={4}
              style={{
                padding: 0,
                height: "1rem",
                backgroundColor: "#f3f4f6",
              }}
            ></td>
          </tr>
        )}
      </>
    );
  };

  // Empty state
  if (hierarchicalLessons.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            padding: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Course Curriculum
          </h2>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#6b7280" }}>Henüz ders içeriği eklenmemiş.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          padding: "1rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "0.5rem",
          }}
        >
          Course Curriculum
        </h2>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          paddingLeft: "1rem",
          paddingRight: "1rem",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              minWidth: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#092E5E" }}>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "64px",
                    cursor: "pointer",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "left",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  DERS ADI
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "128px",
                    cursor: "pointer",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  SEVIYE
                </th>
                <th
                  style={{
                    padding: "16px 24px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 500,
                    fontFamily: 'Montserrat, "Montserrat Fallback", sans-serif',
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: "128px",
                    cursor: "pointer",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Handle add unit
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.375rem",
                      backgroundColor: "transparent",
                      border: "none",
                      cursor: "pointer",
                      color: "#ffffff",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#f3f4f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    <DiamondPlus size={16} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                backgroundColor: "#ffffff",
              }}
            >
              {hierarchicalLessons.map((lesson, index) => (
                <LessonRow
                  key={`main-${lesson.id}`}
                  lesson={lesson}
                  index={index}
                  level={0}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
