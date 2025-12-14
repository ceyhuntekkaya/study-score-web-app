
import api from '../base-api';
import {Course, CourseDetailDTO, CourseFormData} from "@/types/course/course";

class CourseService {
    private readonly baseUrl = '/course';

    async createCourse(course: CourseFormData): Promise<Course> {
        console.log(course);
        const response = await api.post<Course>(`${this.baseUrl}/`, course);
        return response.data;
    }

    async updateCourse(courseId: string, course: CourseFormData): Promise<Course> {
        const response = await api.put<Course>(`${this.baseUrl}/${courseId}`, course);
        return response.data;
    }

    async deleteCourseById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCourseById(id: string): Promise<CourseDetailDTO> {
        const response = await api.get<CourseDetailDTO>(`${this.baseUrl}/${id}/details`);
        return response.data;
    }

    async getAllCourses(): Promise<Course[]> {
        const response = await api.get<Course[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async fetchCourseDetailById(id: string): Promise<CourseDetailDTO> {
        const response = await api.get<CourseDetailDTO>(`${this.baseUrl}/${id}/details`);
        return response.data;
    }
}

export const courseService = new CourseService();