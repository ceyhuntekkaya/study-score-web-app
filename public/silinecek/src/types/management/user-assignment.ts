import { DatabaseObject } from "@/types/base";
import { User } from "@/types/auth";
import { AcademicYear } from "@/types/definition/academic-year";
import { Branch } from "@/types/management/branch";

export interface UserAssignment extends DatabaseObject {
    user: User | null;
    academicYear: AcademicYear | null;
    branch: Branch | null;
}

export interface UserAssignmentFormData {
    id: string | null;
    userId: string | null;
    academicYearId: string | null;
    branchId: string | null;
}

export type UserAssignmentFormErrors = Partial<Record<keyof UserAssignmentFormData, string>>;