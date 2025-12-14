import { DatabaseObject } from "@/types/base";
import { Campus } from "@/types/management/campus";

export interface Institution extends DatabaseObject {
    name: string;
    campus: Campus | null;
}

export interface InstitutionFormData {
    id: string | null;
    name: string;
    campusId: string | null;
}

export type InstitutionFormErrors = Partial<Record<keyof InstitutionFormData, string>>;