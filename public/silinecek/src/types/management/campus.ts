import { DatabaseObject } from "@/types/base";
import { Brand } from "@/types/management/brand";

export interface Campus extends DatabaseObject {
    name: string;
    brand: Brand | null;
}

export interface CampusFormData {
    id: string | null;
    name: string;
    brandId: string | null;
}

export type CampusFormErrors = Partial<Record<keyof CampusFormData, string>>;