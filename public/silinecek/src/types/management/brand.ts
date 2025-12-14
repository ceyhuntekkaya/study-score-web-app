import { DatabaseObject } from "@/types/base";

export interface Brand extends DatabaseObject {
    name: string;
    description: string;
    logo: string;
    website: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
}

export interface BrandFormData {
    id: string | null;
    name: string;
    description: string;
    logo: string;
    website: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
}

export type BrandFormErrors = Partial<Record<keyof BrandFormData, string>>;