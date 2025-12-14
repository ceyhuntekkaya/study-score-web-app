import api from '../base-api';
import { CourseLessonPartMaterial, CourseLessonPartMaterialFormData } from "@/types/course/course-lesson-part-material";

class CourseLessonPartMaterialService {
    private readonly baseUrl = '/course-part-material';

    async createCourseLessonPartMaterial(material: CourseLessonPartMaterialFormData): Promise<CourseLessonPartMaterial> {
        const response = await api.post<CourseLessonPartMaterial>(`${this.baseUrl}/`, material);
        return response.data;
    }

    async updateCourseLessonPartMaterial(materialId: string, material: CourseLessonPartMaterialFormData): Promise<CourseLessonPartMaterial> {
        const response = await api.put<CourseLessonPartMaterial>(`${this.baseUrl}/${materialId}`, material);
        return response.data;
    }

    async deleteCourseLessonPartMaterialById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCourseLessonPartMaterialById(id: string): Promise<CourseLessonPartMaterial> {
        const response = await api.get<CourseLessonPartMaterial>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCourseLessonPartMaterials(): Promise<CourseLessonPartMaterial[]> {
        const response = await api.get<CourseLessonPartMaterial[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async fetchCourseLessonPartMaterialByCourseLessonId(id: string) {
        const response = await api.get<CourseLessonPartMaterial[]>(`${this.baseUrl}/part/${id}`);
        return response.data;
    }
}

export const courseLessonPartMaterialService = new CourseLessonPartMaterialService();