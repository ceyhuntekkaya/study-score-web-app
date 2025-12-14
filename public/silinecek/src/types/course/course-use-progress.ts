import {DatabaseObject} from "@/types/base";
import {CourseLessonPartMaterial} from "@/types/course/course-lesson-part-material";

export interface UserProgressCourseLessonPartMaterial extends DatabaseObject {
    courseLessonPartMaterial:CourseLessonPartMaterial;
    completedDuration: number;
    completed: boolean;
}

export interface UserProgressCourseLessonPartMaterialDto {
    courseLessonPartMaterialId:string;
    completedDuration: number;
    completed: boolean;
}