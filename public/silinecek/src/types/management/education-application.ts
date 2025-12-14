import { DatabaseObject } from "@/types/base";
import { Brand } from "@/types/management/brand";
import { Institution } from "@/types/management/institution";
import { Campus } from "@/types/management/campus";
import { Branch } from "@/types/management/branch";
import { User } from "@/types/auth";
import { Course } from "@/types/course/course";
import { AcademicYear } from "@/types/definition/academic-year";
import {ExamDto} from "@/types/exam/exam-type";

export interface EducationApplication extends DatabaseObject {
    brand: Brand | null;
    institution: Institution | null;
    campus: Campus | null;
    branch: Branch | null;
    user: User | null;
    course: Course | null;
    exam: ExamDto | null;
    academicYear: AcademicYear | null;
    startDate: Date | null;
    endDate: Date | null;
}

export interface EducationApplicationFormData {
    id: string | null;
    brandId: string | null;
    institutionId: string | null;
    campusId: string | null;
    branchId: string | null;
    userId: string | null;
    courseId: string | null;
    examId: string | null;
    academicYearId: string | null;
    startDate: Date | null;
    endDate: Date | null;
}

export type EducationApplicationFormErrors = Partial<Record<keyof EducationApplicationFormData, string>>;