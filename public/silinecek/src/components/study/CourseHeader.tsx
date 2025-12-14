// 2. Course Header Component
// components/course/CourseHeader.tsx
import Link from "next/link";
import { CourseDetailDTO } from "@/types/course/course";

interface CourseHeaderProps {
  course: CourseDetailDTO;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  return (
    <div className="course-header bg-primary text-white p-3 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <h1 className="h3 mb-0">{course.name}</h1>
          <div className="d-flex align-items-center mt-2">
            <span className="badge me-2">{course.level}</span>
            <span className="badge me-2">{course.language}</span>
            <span className="badge me-2">{course.category}</span>
            <span className="me-2">•</span>
            <span>{course.code}</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Link href="/learner" className="btn btn-outline-light text-white">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
