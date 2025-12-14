// 3. Course Sidebar Component
// components/course/CourseSidebar.tsx
import { useState } from "react";
import { LessonTree } from "./LessonTree";
// import { CourseInfo } from "./CourseInfo";
import { SelectionState } from "@/types/course/selectionState";
import { CourseDetailDTO } from "@/types/course/course";
import { NavigationButtons } from "@/components/study/NavigationButtons";
import { NavigationItem } from "@/components/study/navigationUtils";

interface CourseSidebarProps {
  course: CourseDetailDTO;
  selectionState: SelectionState;
  navigationItems: NavigationItem[];
}

export function CourseSidebar({
  course,
  selectionState,
  navigationItems,
}: CourseSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar-container ${isExpanded ? "expanded" : ""}`}>
      <div className="sidebar-vertical-text">LESSONS</div>
      <div className="sidebar-content">
        <LessonTree course={course} selectionState={selectionState} />
        <NavigationButtons
          selectionState={selectionState}
          navigationItems={navigationItems}
        />
        {/* <CourseInfo course={course} /> */}
      </div>
      <button
        className="sidebar-toggle-icon"
        onClick={toggleSidebar}
        aria-label={isExpanded ? "Sidebar'ı kapat" : "Sidebar'ı aç"}
      >
        {isExpanded ? "⮂" : "⮀"}
      </button>
    </div>
  );
}
