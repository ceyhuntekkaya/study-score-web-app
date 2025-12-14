import { DatabaseObject } from "@/types/base";
import { EGrade } from "@/types/enumeration";
import { Institution } from "@/types/management/institution";

export interface Branch extends DatabaseObject {
    name: string;
    institution: Institution | null;
    grade: EGrade;
}

export interface BranchFormData {
    id: string | null;
    name: string;
    institutionId: string | null;
    grade: EGrade | null;
}

export type BranchFormErrors = Partial<Record<keyof BranchFormData, string>>;