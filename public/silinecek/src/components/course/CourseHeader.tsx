import React from "react";
import Link from "next/link";
import { HelpCircle, Code, Calculator } from "lucide-react";
import { Course } from "@/types/course/course";
import { CourseLessonDTO } from "@/types/course/course-lesson";
import { ECourseCategory } from "@/types/enumeration";
import "@/style.css";

// Yardımcı fonksiyonlar
const getCategoryInfo = (category: ECourseCategory | undefined) => {
  switch (category) {
    case ECourseCategory.TOEFL:
      return {
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        text: "TOEFL",
        icon: Code,
      };
    case ECourseCategory.IELTS:
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "IELTS",
        icon: Calculator,
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        text: "Other",
        icon: HelpCircle,
      };
  }
};

const getLevelInfo = (level: string | undefined) => {
  switch (level?.toLowerCase()) {
    case "beginner":
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        text: "beginner",
      };
    case "intermediate":
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        text: "intermediate",
      };
    case "advanced":
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        text: "advanced",
      };
    default:
      return {
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        text: level || "-",
      };
  }
};

interface CourseHeaderProps {
  course: Course | null;
  courseLessons: CourseLessonDTO[] | null;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  courseLessons,
}) => {
  if (!course) return null;

  const categoryInfo = getCategoryInfo(course.category);
  const levelInfo = getLevelInfo(course.level);

  const formattedDate = course.createdAt
    ? new Date(course.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const calculateProgress = () => {
    if (courseLessons) {
      const completed = courseLessons.filter(
        (lesson) => lesson.isCompleted
      ).length;
      return (completed / courseLessons.length) * 100;
    }
    return 0;
  };

  const progressPercentage = calculateProgress();

  const getProgressLevel = () => {
    if (progressPercentage >= 70) return "high";
    if (progressPercentage >= 30) return "medium";
    return "low";
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        background: "#f1f1f1",
        borderRadius: "12px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      className="mb-4"
    >
      {/* Top Image Section */}
      <div
        className="dashboardTopImage"
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          margin: "0",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundImage: course.imageUrl
            ? `url(${
                course.imageUrl.startsWith("/")
                  ? course.imageUrl
                  : `/${"assets/" + course.imageUrl}`
              })`
            : "url(/assets/ielts6.webp)",
        }}
      >
        <Link
          href={`/learner/course/${course.id}/start`}
          className="btn btn-primary"
          style={{ marginLeft: "20px", marginTop: "80px" }}
        >
          ➜ Start Lesson
        </Link>
      </div>

      {/* Content Wrapper */}
      <div style={{ padding: "20px" }}>
        {/* Lesson Container */}
        <div style={{ marginTop: "0" }}>
          <h1 style={{ marginBottom: "10px", color: "#092e5e" }}>
            <b>{categoryInfo.text}</b> {course.name}
          </h1>
          <div
            className="description"
            style={{ color: "#777", marginBottom: "20px" }}
          >
            Course Code: {course.code} - Language: {course.language} - Level:{" "}
            {levelInfo.text} - Created At: {formattedDate}
          </div>

          {/* Progress Section */}
          <div className="lesson-section" style={{ marginBottom: "20px" }}>
            <h2>Progress</h2>
            <div className="lesson-progress-bar">
              <div className="progress-bar" data-progress={getProgressLevel()}>
                <span style={{ width: `${progressPercentage}%` }}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
