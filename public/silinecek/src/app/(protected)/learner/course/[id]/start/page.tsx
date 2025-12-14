"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCourses } from "@/hooks/course/use-course";

import {
  NavigationItem,
  buildNavigationItems,
} from "@/components/study/navigationUtils";
import { CourseHeader } from "@/components/study/CourseHeader";
import { CourseSidebar } from "@/components/study/CourseSidebar";
import { CourseContent } from "@/components/study/CourseContent";

export default function CoursePage() {
  const params = useParams();
  const id = params.id as string;
  const { courseDetailDTO, fetchCourseDetailById } = useCourses();

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedChildLessonId, setSelectedChildLessonId] = useState<
    string | null
  >(null);
  const [selectedGrandChildLessonId, setSelectedGrandChildLessonId] = useState<
    string | null
  >(null);
  const [selectedLessonPartId, setSelectedLessonPartId] = useState<
    string | null
  >(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  // Load course data
  useEffect(() => {
    setLoading(true);
    fetchCourseDetailById(id)
      .then(() => setLoading(false))
      .catch((err) => {
        console.error("An error occurred while loading the course:", err);
        setError(
          "There was an issue loading the course data. Please try again later."
        );
        setLoading(false);
      });
  }, [id, fetchCourseDetailById]);

  // Build navigation items
  useEffect(() => {
    if (courseDetailDTO) {
      const items = buildNavigationItems(courseDetailDTO);
      setNavigationItems(items);
    }
  }, [courseDetailDTO]);

  // Set initial selections
  useEffect(() => {
    if (courseDetailDTO && navigationItems.length > 0) {
      const firstItem = navigationItems[0];
      if (firstItem) {
        setSelectedLessonId(firstItem.lessonId || null);
        setSelectedChildLessonId(firstItem.childLessonId || null);
        setSelectedGrandChildLessonId(firstItem.grandChildLessonId || null);
        setSelectedLessonPartId(firstItem.lessonPartId || null);
      }
    }
  }, [courseDetailDTO, navigationItems]);

  const selectionState = {
    selectedLessonId,
    selectedChildLessonId,
    selectedGrandChildLessonId,
    selectedLessonPartId,
    selectedMaterialId,
    setSelectedLessonId,
    setSelectedChildLessonId,
    setSelectedGrandChildLessonId,
    setSelectedLessonPartId,
    setSelectedMaterialId,
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Course content is loading, please wait...</p>
      </div>
    );
  }

  if (error || !courseDetailDTO) {
    return <div className="container mt-5">Error or No Course Found</div>;
  }

  return (
    <div className="container-fluid p-0">
      {courseDetailDTO && (
        <>
          <CourseHeader course={courseDetailDTO} />
          <div className="course-layout">
            <CourseSidebar
              course={courseDetailDTO}
              selectionState={selectionState}
              navigationItems={navigationItems}
            />
            <div className="course-content-area">
              <CourseContent
                course={courseDetailDTO}
                selectionState={selectionState}
                navigationItems={navigationItems}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
