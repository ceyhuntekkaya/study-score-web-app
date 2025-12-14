"use client";

import { useCourses } from "@/hooks/course/use-course";
import { useExams } from "@/hooks/exam/use-exam";
import { useEffect } from "react";
import { useProtectedRoute } from "@/hooks/use-auth";
import { CourseCard } from "@/components/course/course-card";
import { ExamCard } from "@/components/exam/ExamCard";
import "@/style.css";

export default function LearnerPage() {
  const { isAuthorized } = useProtectedRoute("LEARNER");

  const { courses, loading: coursesLoading, fetchCourses } = useCourses();

  const { exams, loading: examsLoading, getAllExams } = useExams();

  useEffect(() => {
    fetchCourses();
    getAllExams();
  }, [fetchCourses, getAllExams]);

  if (!isAuthorized) {
    return null;
  }

  if (coursesLoading || examsLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading courses and exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2 min-w-full">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="ielts-header-section">
          <div className="ielts-main-title">IELTS Learning Center</div>
          <div className="ielts-subtitle">
            IELTS Academic Complete Preparation Course
          </div>
        </div>

        {/* Content Section with consistent styling */}
        <div className=" px-2">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 py-1 w-full">
            {courses.map((course) => (
              <div key={course.id} className="w-full">
                <CourseCard course={course} />
              </div>
            ))}

            {exams.map((exam) => (
              <div key={exam.id} className="w-full">
                <ExamCard exam={exam} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {courses.length === 0 && exams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No content available
              </h3>
              <p className="text-gray-500">
                There are no courses or exams available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="content-info-bottom-text">
          {courses.length + exams.length} items available
        </div>
      </div>
    </div>
  );
}
