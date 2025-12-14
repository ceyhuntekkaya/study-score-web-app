import api from '../base-api';
import {CourseLesson, CourseLessonDTO, CourseLessonFormData} from "@/types/course/course-lesson";

class CourseLessonService {
    private readonly baseUrl = '/course-lesson';

    async createCourseLesson(lesson: CourseLessonFormData): Promise<CourseLesson> {
        const response = await api.post<CourseLesson>(`${this.baseUrl}/`, lesson);
        return response.data;
    }

    async updateCourseLesson(lessonId: string, lesson: CourseLessonFormData): Promise<CourseLesson> {
        const response = await api.put<CourseLesson>(`${this.baseUrl}/${lessonId}`, lesson);
        return response.data;
    }

    async deleteCourseLessonById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCourseLessonById(id: string): Promise<CourseLesson> {
        const response = await api.get<CourseLesson>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCourseLessons(): Promise<CourseLesson[]> {
        const response = await api.get<CourseLesson[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getAllCourseLessonsById(id: string): Promise<CourseLessonDTO[]> {
        const response = await api.get<CourseLessonDTO[]>(`${this.baseUrl}/course/${id}`);
        return response.data;
    }
}

export const courseLessonService = new CourseLessonService();