import {DatabaseObject} from "@/types/base";
import {EMediaType} from "@/types/enumeration";
import {DatabaseObjectDto} from "@/types/exam/exam-type";

export interface UploadedFile extends DatabaseObject {
    path: string;
    fileOriginalName: string;
    fileName: string;
    documentType: EMediaType;

    fileSize: number | null;
    updatedAt: Date | null;
    version: number | null;
}

export interface UploadedFileFormData {
    id: string | null;
    path: string;
    fileOriginalName: string;
    fileName: string;
    documentType: EMediaType | null;
    fileSize: number | null;
    updatedAt: Date | null;
    version: number | null;
}


export interface UploadedFileDto extends DatabaseObjectDto {
    path: string;
    fileOriginalName: string;
    fileName: string;
    documentType: EMediaType;
    fileSize: number | null;
    updatedAt: Date | null;
    version: number | null;
}

export type UploadedFileFormErrors = Partial<Record<keyof UploadedFileFormData, string>>;

