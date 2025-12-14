// components/course/CourseDescription.tsx

import {CourseDetailDTO} from "@/types/course/course";

interface CourseDescriptionProps {
    course: CourseDetailDTO;
}

export function CourseDescription({ course }: CourseDescriptionProps) {
    if (!course.description) {
        return null;
    }

    return (
        <div className="card mb-4">
            <div className="card-header bg-light">
                <i className="bi bi-info-circle me-2"></i>
                Course Description
            </div>
            <div className="card-body">
                <div
                    className="course-description"
                    dangerouslySetInnerHTML={{
                        __html: course.description
                            .replace(/\n/g, '<br/>')
                            .replace(/\\n/g, '<br/>')
                    }}
                />

                {/* Ek kurs bilgileri */}
                <div className="row mt-4">
                    <div className="col-md-6">
                        <h6 className="text-muted mb-2">Course Details</h6>
                        <ul className="list-unstyled">
                            <li><strong>Category:</strong> {course.category}</li>
                            <li><strong>Level:</strong> {course.level}</li>
                            <li><strong>Language:</strong> {course.language}</li>
                            {course.code && <li><strong>Code:</strong> {course.code}</li>}
                        </ul>
                    </div>

                    {course.curriculumName && (
                        <div className="col-md-6">
                            <h6 className="text-muted mb-2">Curriculum</h6>
                            <p>{course.curriculumName}</p>
                        </div>
                    )}
                </div>

                {/* Ders sayısı istatistikleri */}
                <div className="mt-4 p-3 bg-light rounded">
                    <h6 className="mb-2">Course Statistics</h6>
                    <div className="row text-center">
                        <div className="col-4">
                            <div className="h4 text-primary mb-1">{course.lessons?.length || 0}</div>
                            <small className="text-muted">Lessons</small>
                        </div>
                        <div className="col-4">
                            <div className="h4 text-success mb-1">
                                {course.lessons?.reduce((total, lesson) => {
                                    const mainParts = lesson.lessonParts?.length || 0;
                                    const childParts = lesson.childLessons?.reduce((sum, child) =>
                                        sum + (child.lessonParts?.length || 0), 0) || 0;
                                    const grandChildParts = lesson.childLessons?.reduce((sum, child) =>
                                        sum + (child.childLessons?.reduce((gSum, grand) =>
                                            gSum + (grand.lessonParts?.length || 0), 0) || 0), 0) || 0;
                                    return total + mainParts + childParts + grandChildParts;
                                }, 0) || 0}
                            </div>
                            <small className="text-muted">Lesson Parts</small>
                        </div>
                        <div className="col-4">
                            <div className="h4 text-warning mb-1">
                                {course.lessons?.reduce((total, lesson) => {
                                    let materialCount = 0;

                                    // Ana ders materyalleri
                                    lesson.lessonParts?.forEach(part => {
                                        materialCount += part.materials?.length || 0;
                                    });

                                    // Alt ders materyalleri
                                    lesson.childLessons?.forEach(child => {
                                        child.lessonParts?.forEach(part => {
                                            materialCount += part.materials?.length || 0;
                                        });

                                        // Alt alt ders materyalleri
                                        child.childLessons?.forEach(grand => {
                                            grand.lessonParts?.forEach(part => {
                                                materialCount += part.materials?.length || 0;
                                            });
                                        });
                                    });

                                    return total + materialCount;
                                }, 0) || 0}
                            </div>
                            <small className="text-muted">Materials</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}