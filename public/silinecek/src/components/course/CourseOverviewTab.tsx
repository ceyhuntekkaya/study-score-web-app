import React, { useEffect } from "react";
import { Course } from "@/types/course/course";
import { useCourses } from "@/hooks/course/use-course";
import { useParams } from "next/navigation";
import "@/style.css";

interface CourseOverviewTabProps {
  course: Course;
}

const CourseOverviewTab: React.FC<CourseOverviewTabProps> = ({ course }) => {
  const params = useParams();
  const id = params.id as string;
  const { courseDetailDTO, fetchCourseDetailById } = useCourses();

  useEffect(() => {
    fetchCourseDetailById(id);
  }, [id, fetchCourseDetailById]);

  return (
    <div className="">
      {/* Course Description Section */}
      <h2 className="textColor" style={{ marginTop: "20px" }}>
        Course Description
      </h2>
      <p className="textColor">
        {course.description ||
          "Comprehensive course preparation designed to help students achieve their target goals. This course covers all essential skills with extensive practice materials, expert strategies, and comprehensive tests."}
      </p>

      {/* What You Will Learn Section */}
      <h3 className="textColor" style={{ marginTop: "20px" }}>
        What You Will Learn
      </h3>

      <div className="lesson-content">
        {courseDetailDTO?.lessons && courseDetailDTO.lessons.length > 0 ? (
          courseDetailDTO.lessons.map((lesson) => (
            <div key={lesson.id} className="lesson-example-item">
              <b>{lesson.name}</b>
              <br />
              <br />
              {lesson.description ||
                "Comprehensive lesson content designed to enhance your understanding and practical skills in this subject area."}
            </div>
          ))
        ) : (
          <>
            <div className="lesson-example-item">
              <b>Skill Mastery Module 1</b>
              <br />
              <br />
              Master all fundamental aspects including different techniques,
              strategic approaches, and practical applications.
            </div>
            <div className="lesson-example-item">
              <b>Advanced Techniques Module 2</b>
              <br />
              <br />
              Develop advanced skills with focus on practical implementation and
              real-world applications.
            </div>
            <div className="lesson-example-item">
              <b>Professional Excellence Module 3</b>
              <br />
              <br />
              Achieve professional-level competency with comprehensive practice
              and expert guidance.
            </div>
            <div className="lesson-example-item">
              <b>Practical Application Module 4</b>
              <br />
              <br />
              Apply learned concepts in real scenarios with hands-on practice
              and immediate feedback.
            </div>
            <div className="lesson-example-item">
              <b>Assessment & Certification Module 5</b>
              <br />
              <br />
              Complete comprehensive assessments and receive certification upon
              successful completion.
            </div>
          </>
        )}
      </div>

      {/* Course Info Section */}
      <p className="textColor" style={{ marginTop: "30px", color: "#b7113d" }}>
        <b>Course Info</b>
        <br />
        <br />
        This course is a comprehensive training program designed to match your
        level. Each lesson progresses step by step, helping you learn the topics
        effectively.
      </p>
    </div>
  );
};

export default CourseOverviewTab;
