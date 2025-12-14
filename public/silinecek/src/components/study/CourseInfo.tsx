

// 5. Course Info Component
// components/course/CourseInfo.tsx

import {CourseDetailDTO} from "@/types/course/course";

interface CourseInfoProps {
    course: CourseDetailDTO;
}

export function CourseInfo({ course }: CourseInfoProps) {
    return (
        <div className="card mt-4">
            <div className="card-header bg-light">
                <i className="bi bi-info-circle me-2"></i>
                Course Information
            </div>
            <div className="card-body">
                <div className="text-center mb-3">
                    {course.imageUrl && (
                        <img
                            src={"/assets/"+course.imageUrl}
                            alt={course.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: "150px" }}
                        />
                    )}
                </div>
                <p className="mb-1"><strong>Category:</strong> {course.category}</p>
                <p className="mb-1"><strong>Language:</strong> {course.language}</p>
                <p className="mb-1"><strong>Level:</strong> {course.level}</p>
                <p className="mb-0"><strong>Code:</strong> {course.code}</p>
            </div>
        </div>
    );
}