import {DatabaseObject} from "@/types/base";
import {EMediaType} from "@/types/enumeration";
import {CourseLessonPart} from "@/types/course/course-lesson-part";
import {UploadedFile} from "@/types/definition/uploaded-file";
import {CourseLessonPartMaterialDetailDTO} from "@/types/course/course";

export interface CourseLessonPartMaterial extends DatabaseObject {
    name: string;
    courseLessonPart: CourseLessonPart | null;
    description: string;
    content: string;
    mediaType: EMediaType;
    orderNumber: number | null;
    duration: number | null;
    uploadedFile: UploadedFile | null;
}

export interface CourseLessonPartMaterialFormData {
    id: string | null;
    name: string;
    courseLessonPartId: string | null;
    description: string;
    content: string;
    mediaType: EMediaType | null;
    orderNumber: number | null;
    duration: number | null;
    uploadedFileId: string | null;
}




export function materialDTOToFormData(
    formData: CourseLessonPartMaterialDetailDTO
): CourseLessonPartMaterialFormData {
    return {
        id: formData.id || "",
        name: formData.name || "",
        description: formData.description || '',
        orderNumber: formData.orderNumber || 0,
        courseLessonPartId: formData.courseLessonPartId ||  '',
        content: formData.content || null,
        mediaType: formData.mediaType || EMediaType.DOCUMENT,
        duration: formData.duration || 0,
        uploadedFileId: formData.uploadedFileId || ''

    } as CourseLessonPartMaterialFormData;
}



export function CourseLessonPartMaterialToDto(
    formData: CourseLessonPartMaterial
): CourseLessonPartMaterialDetailDTO {
    return {
        id: formData.id || "",
        name: formData.name || "",
        description: formData.description || '',
        orderNumber: formData.orderNumber || 0,
        courseLessonPartId: formData.courseLessonPartId ||  '',
        content: formData.content || null,
        mediaType: formData.mediaType || EMediaType.DOCUMENT,
        duration: formData.duration || 0,
        uploadedFileId: formData.uploadedFileId || '',
        uploadedFileName: ''

    } as CourseLessonPartMaterialDetailDTO;
}




export type CourseLessonPartMaterialFormErrors = Partial<Record<keyof CourseLessonPartMaterialFormData, string>>;