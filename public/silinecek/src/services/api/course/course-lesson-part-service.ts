
import api from '../base-api';
import { CourseLessonPart, CourseLessonPartFormData } from "@/types/course/course-lesson-part";


class CourseLessonPartService {
    private readonly baseUrl = '/course-part';

    async createCourseLessonPart(part: CourseLessonPartFormData): Promise<CourseLessonPart> {
        // Note: In the frontend we just send the form data
        // Server-side logic for handling curriculum contents is handled by the backend
        const response = await api.post<CourseLessonPart>(`${this.baseUrl}/`, part);
        return response.data;
    }

    async updateCourseLessonPart(partId: string, part: CourseLessonPartFormData): Promise<CourseLessonPart> {
        const response = await api.put<CourseLessonPart>(`${this.baseUrl}/${partId}`, part);
        return response.data;
    }

    async deleteCourseLessonPartById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCourseLessonPartById(id: string): Promise<CourseLessonPart> {
        const response = await api.get<CourseLessonPart>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCourseLessonParts(): Promise<CourseLessonPart[]> {
        const response = await api.get<CourseLessonPart[]>(`${this.baseUrl}/`);
        return response.data;
    }

    // Additional method to handle curriculum content relationships
    async updateCourseLessonPartCurriculumContents(partId: string, curriculumContentIds: string[]): Promise<CourseLessonPart> {
        const response = await api.post<CourseLessonPart>(
            `${this.baseUrl}/${partId}/curriculum-contents`,
            { curriculumContentIds }
        );
        return response.data;
    }
}

export const courseLessonPartService = new CourseLessonPartService();