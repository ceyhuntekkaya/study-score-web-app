import {DatabaseObject} from "@/types/base";
import {ECourseCategory, ELessonLevel, EMediaType} from "@/types/enumeration";
import {Curriculum} from "@/types/definition/curriculum";
import {UserProgressCourseLessonPartMaterial} from "@/types/course/course-use-progress";

export interface Course extends DatabaseObject {
    name: string;
    category: ECourseCategory;
    imageUrl: string;
    description: string;
    code: string;
    language: string;
    level: string;
    curriculum: Curriculum | null;
}

export interface CourseFormData {
    id: string | null;
    name: string;
    category: ECourseCategory | null;
    imageUrl: string;
    description: string;
    code: string;
    language: string;
    level: string;
    curriculumId: string | null;
}


// CourseDetailDTO
export interface CourseDetailDTO {
    id: string;
    name: string;
    category: ECourseCategory;
    imageUrl: string | null;
    description: string | null;
    code: string | null;
    language: string | null;
    level: string | null;
    curriculumId: string | null;
    curriculumName: string | null;
    lessons: CourseLessonDetailDTO[];
    curriculum: Curriculum | null;
}

// CourseLessonDetailDTO
export interface CourseLessonDetailDTO {
    id: string;
    name: string;
    description: string | null;
    lessonLevel: ELessonLevel;
    orderNumber: number | null;
    parentLessonId: string | null;
    childLessons: CourseLessonDetailDTO[];
    lessonParts: CourseLessonPartDetailDTO[];
    courseId: string;
}

// CourseLessonDTO
export interface CourseLessonDTO {
    id: string;
    name: string;
    courseId: string | null;
    courseName: string | null;
    description: string | null;
    lessonLevel: ELessonLevel;
    orderNumber: number | null;
    parentLessonId: string | null;
    childLessons: CourseLessonDTO[];
}

// CourseLessonPartDetailDTO
export interface CourseLessonPartDetailDTO {
    id: string;
    name: string;
    description: string | null;
    orderNumber: number | null;
    curriculumContentIds: string[];
    materials: CourseLessonPartMaterialDetailDTO[];
    courseLessonId: string;
}

// CourseLessonPartMaterialDetailDTO
export interface CourseLessonPartMaterialDetailDTO {
    id: string;
    name: string;
    description: string | null;
    content: string | null;
    mediaType: EMediaType;
    orderNumber: number | null;
    duration: number | null;
    uploadedFileId: string | null;
    uploadedFileName: string | null;
    courseLessonPartId: string | null;
    userProgress: UserProgressCourseLessonPartMaterial | null;
}

export function courseDetailToCourse(
    formData: CourseDetailDTO
): Course {
    return {
        id: formData.id,
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl,
        description: formData.description,
        code: formData.code,
        language: formData.language,
        level: formData.level,
        curriculum: formData.curriculum,
    } as Course;
}


export type CourseFormErrors = Partial<Record<keyof CourseFormData, string>>;
