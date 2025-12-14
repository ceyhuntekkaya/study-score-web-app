import React from "react";
import { X, Play } from "lucide-react";
import { ELessonLevel } from "@/types/enumeration";
import type { CourseLessonDetailDTO } from "@/types/course/course";
import "@/style.css";

interface LessonDetailModalProps {
  lesson: CourseLessonDetailDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  // Prevent body scroll when modal is open and hide/show logo and menu
  React.useEffect(() => {
    const logoElements = document.querySelectorAll(".logo");
    const menuWrapElements = document.querySelectorAll(".menu-wrap");

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
      document.body.classList.add("modal-open"); // Add modal-open class

      // Hide logo elements
      logoElements.forEach((logo) => {
        const element = logo as HTMLElement;
        element.style.display = "none";
      });

      // Hide menu-wrap elements
      menuWrapElements.forEach((menuWrap) => {
        const element = menuWrap as HTMLElement;
        element.style.display = "none";
      });
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open"); // Remove modal-open class

      // Show logo elements (restore to original state)
      logoElements.forEach((logo) => {
        const element = logo as HTMLElement;
        element.style.display = "";
      });

      // Show menu-wrap elements (restore to original state)
      menuWrapElements.forEach((menuWrap) => {
        const element = menuWrap as HTMLElement;
        element.style.display = "";
      });
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open"); // Clean up

      // Restore logo elements display in cleanup
      logoElements.forEach((logo) => {
        const element = logo as HTMLElement;
        element.style.display = "";
      });

      // Restore menu-wrap elements display in cleanup
      menuWrapElements.forEach((menuWrap) => {
        const element = menuWrap as HTMLElement;
        element.style.display = "";
      });
    };
  }, [isOpen]);

  if (!isOpen || !lesson) return null;

  const getLevelText = (level: ELessonLevel) => {
    switch (level) {
      case ELessonLevel.UNIT:
        return "Unit";
      case ELessonLevel.TOPIC:
        return "Topic";
      case ELessonLevel.LESSON:
        return "Lesson";
      default:
        return "Unknown";
    }
  };

  // Modal overlay click handler
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 modal-overlay"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        position: "fixed",
      }}
      onClick={handleOverlayClick}
    >
      {/* Modal Container */}
      <div
        className="lesson-section"
        style={{
          maxWidth: "90vw",
          width: "600px",
          maxHeight: "90vh",
          margin: "0",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          zIndex: 10000,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e5e5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
            position: "relative",
            zIndex: 10001,
            backgroundColor: "white",
          }}
        >
          <h2 className="textColor" style={{ margin: 0, fontSize: "20px" }}>
            {lesson.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 10002,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Level and Order Badges */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            <div
              className="lesson-example-item"
              style={{
                padding: "4px 12px",
                marginBottom: "0",
                display: "inline-block",
                fontSize: "12px",
                backgroundColor: "#e8f4fd",
                border: "1px solid #b3d9ff",
              }}
            >
              <b>{getLevelText(lesson.lessonLevel)}</b>
            </div>
            <div
              className="lesson-example-item"
              style={{
                padding: "4px 12px",
                marginBottom: "0",
                display: "inline-block",
                fontSize: "12px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
              }}
            >
              Order: {lesson.orderNumber}
            </div>
          </div>

          {/* Lesson Description */}
          <div style={{ marginBottom: "20px" }}>
            <h3
              className="textColor"
              style={{ fontSize: "16px", marginBottom: "10px" }}
            >
              Lesson Description
            </h3>
            <div className="lesson-example-item" style={{ marginBottom: "0" }}>
              {lesson.description ||
                `In this lesson, ${lesson.name.toLowerCase()} topic will be comprehensively covered with practical examples and exercises.`}
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3
              className="textColor"
              style={{ fontSize: "16px", marginBottom: "10px" }}
            >
              Learning Objectives
            </h3>
            <div className="lesson-content">
              <div className="lesson-example-item">
                <b>Master Core Concepts</b>
                <br />
                <br />
                You will learn fundamental principles and key concepts essential
                for understanding this topic.
              </div>
              <div className="lesson-example-item">
                <b>Practical Application</b>
                <br />
                <br />
                Apply your knowledge through hands-on exercises and real-world
                scenarios.
              </div>
              <div className="lesson-example-item">
                <b>Problem-Solving Skills</b>
                <br />
                <br />
                Develop critical thinking abilities to solve complex problems in
                this domain.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #e5e5e5",
            backgroundColor: "#f8f9fa",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            flexShrink: 0,
            position: "relative",
            zIndex: 10001,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              color: "#666",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              position: "relative",
              zIndex: 10002,
            }}
          >
            Close
          </button>
          <button
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              color: "white",
              backgroundColor: "#0a2e5e",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              position: "relative",
              zIndex: 10002,
            }}
          >
            <Play size={14} />
            Start Lesson
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailModal;
