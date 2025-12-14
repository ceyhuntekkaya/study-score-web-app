"use client";

import React, { useState } from "react";
import { Info, List, FileText } from "lucide-react";
import type { Course, CourseLessonDetailDTO } from "@/types/course/course";
import { CourseLessonDTO } from "@/types/course/course-lesson";
import CourseHeader from "@/components/course/CourseHeader";
import CourseOverviewTab from "@/components/course/CourseOverviewTab";
import CourseCurriculumTab from "@/components/course/CourseCurriculumTab";
import LessonDetailModal from "@/components/course/LessonDetailModal";
import CourseMaterialsTab from "@/components/course/CourseMaterialsTab";
import "@/style.css";

interface CourseDetailPageProps {
  params: {
    course: Course | null;
    courseLessons: CourseLessonDTO[];
  };
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ params }) => {
  const [course] = useState<Course | null>(params.course);
  const [courseLessons] = useState<CourseLessonDTO[] | null>(
    params.courseLessons
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedLesson, setSelectedLesson] =
    useState<CourseLessonDetailDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ders detaylarını göstermek için modal açma fonksiyonu
  const showLessonDetails = (lesson: CourseLessonDetailDTO) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  // Tab configuration
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: Info,
      component: course ? <CourseOverviewTab course={course} /> : null,
    },
    {
      id: "curriculum",
      label: "Curriculum",
      icon: List,
      component: (
        <CourseCurriculumTab
          courseLessons={courseLessons || []}
          onLessonClick={showLessonDetails}
        />
      ),
    },
    {
      id: "materials",
      label: "Materials",
      icon: FileText,
      component: <CourseMaterialsTab />,
    },
  ];

  if (!course) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Info size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-500">
            The course you are looking for does not exist or could not be
            loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-2 min-w-full">
      <div className="w-full px-2 sm:px-6 lg:px-8">
        {/* Course Header */}
        <CourseHeader course={course} courseLessons={courseLessons} />

        {/* Tab Navigation */}
        <div className=" mb-2">
          <div className="tab flex border-b border-gray-200">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <a
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tablinks ${activeTab === tab.id ? "active" : ""}`}
                  style={{
                    cursor: "pointer",
                    // flex: "1",
                    textAlign: "center",
                    float: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent
                    size={18}
                    style={{ marginRight: "8px", display: "inline" }}
                  />
                  {tab.label}
                </a>
              );
            })}
          </div>

          {/* Tab Content */}
          <div
            className="tabcontent bg-white"
            style={{ display: "block", width: "100%", minHeight: "400px" }}
          >
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>

        {/* Lesson Detail Modal */}
        <LessonDetailModal
          lesson={selectedLesson}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default CourseDetailPage;
