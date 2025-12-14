import { DatabaseObject } from "@/types/base";
import {CourseLesson} from "@/types/course/course-lesson";
import { CurriculumContent } from "@/types/definition/curriculum-content";
import {CourseLessonPartDetailDTO} from "@/types/course/course";

export interface CourseLessonPart extends DatabaseObject {
    name: string;
    courseLesson: CourseLesson | null;
    description: string;
    orderNumber: number | null;
    curriculumContents: Set<CurriculumContent>;
}

export interface CourseLessonPartFormData {
    id: string | null;
    name: string;
    courseLessonId: string | null;
    description: string;
    orderNumber: number | null;
    curriculumContentIds: string[];
}




export function courseLessonPartDetailDTOToCourseLessonPartFormData(
    formData: CourseLessonPartDetailDTO
): CourseLessonPartFormData {
    return {
        id: formData.id || "",
        name: formData.name,
        description: formData.description || '',
        courseLessonId: formData.courseLessonId || '',
        orderNumber: formData.orderNumber || 0,
        curriculumContentIds: formData.curriculumContentIds || [],

    } as CourseLessonPartFormData;
}


export type CourseLessonPartFormErrors = Partial<Record<keyof CourseLessonPartFormData, string>>;