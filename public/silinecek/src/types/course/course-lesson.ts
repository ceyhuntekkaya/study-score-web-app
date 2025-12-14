import { DatabaseObject } from "@/types/base";
import { ELessonLevel } from "@/types/enumeration";
import {Course, CourseLessonDetailDTO} from "@/types/course/course";
import {RecordType} from "@/types/table";

export interface CourseLesson extends DatabaseObject {
    name: string;
    course: Course | null;
    description: string;
    lessonLevel: ELessonLevel;
    orderNumber: number | null;
    parentLesson: CourseLesson | null;
}

export interface CourseLessonFormData extends RecordType{
    id: string | null;
    name: string;
    courseId: string | null;
    description: string;
    lessonLevel: ELessonLevel | null;
    orderNumber: number | null;
    parentLessonId: string | null;
}

export interface CourseLessonDTO {
    id: string;
    name: string;
    courseId: string;
    courseName: string;
    description: string;
    lessonLevel: ELessonLevel;
    orderNumber: number;
    parentLessonId: string | null;
    isCompleted: boolean;
    childLessons: CourseLessonDTO[];
}





export function courseLessonConvert(
    formData: CourseLessonDetailDTO
): CourseLessonFormData {
    return {
        id: formData.id || "",
        name: formData.name,
        courseId:formData.courseId || '',
        description:formData.description || '',
        lessonLevel: formData.lessonLevel,
        orderNumber: formData.orderNumber || 0,
        parentLessonId: formData.parentLessonId,

    } as CourseLessonFormData;
}

export type CourseLessonFormErrors = Partial<Record<keyof CourseLessonFormData, string>>;