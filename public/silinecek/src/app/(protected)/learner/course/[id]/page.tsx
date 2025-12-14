"use client";

import CourseDetailPage from "@/components/course/course-detail";
import { useCourses } from "@/hooks/course/use-course";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useCourseLessons } from "@/hooks/course/use-course-lesson";

export default function CourseDetail() {
  const params = useParams();
  const courseId = params.id as string;
  const { selectedCourse, loading, fetchCourseById } = useCourses();

  const { courseLessonDTOs, fetchCourseLessonsByCourseId } = useCourseLessons();

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
      fetchCourseLessonsByCourseId(courseId);
    }
  }, [courseId, fetchCourseById, fetchCourseLessonsByCourseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {selectedCourse && courseLessonDTOs && (
        <CourseDetailPage
          params={{ course: selectedCourse, courseLessons: courseLessonDTOs }}
        />
      )}
    </div>
  );
}
