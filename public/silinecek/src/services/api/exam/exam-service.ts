import api from '../base-api';
import {
    ExamDto,
    ExamPartDto,
    ExamQuestionDto,
    ExamFilterDto,
    ExamStatisticsDto
} from '@/types/exam/exam-type';
import {ECourseCategory} from "@/types/enumeration";

class ExamService {
    private readonly baseUrl = '/exam/exams';

    // CRUD Operations
    async createExam(examDto: ExamDto): Promise<ExamDto> {
        const response = await api.post<ExamDto>(`${this.baseUrl}/`, examDto);
        return response.data;
    }

    async updateExam(examId: string, examDto: ExamDto): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}`, examDto);
        return response.data;
    }

    async getExamById(examId: string): Promise<ExamDto> {
        const response = await api.get<ExamDto>(`${this.baseUrl}/${examId}`);
        return response.data;
    }

    async getAllExams(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async deleteExam(examId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${examId}`);
        return response.data;
    }

    async softDeleteExam(examId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${examId}/soft-delete`);
        return response.data;
    }

    // Exam Statistics
    async getExamStatistics(examId: string): Promise<ExamStatisticsDto> {
        const response = await api.get<ExamStatisticsDto>(`${this.baseUrl}/${examId}/statistics`);
        return response.data;
    }

    async calculateTotalPoints(examId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${examId}/total-points`);
        return response.data;
    }

    async calculateEstimatedDuration(examId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${examId}/estimated-duration`);
        return response.data;
    }

    // Search & Filter
    async searchExams(keyword: string): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async filterExams(filter: ExamFilterDto): Promise<ExamDto[]> {
        const response = await api.post<ExamDto[]>(`${this.baseUrl}/filter`, filter);
        return response.data;
    }

    async getExamsByCreator(userId: string): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/by-creator/${userId}`);
        return response.data;
    }

    async getRecentExams(limit: number = 10): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getPopularExams(limit: number = 10): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/popular`, {
            params: { limit }
        });
        return response.data;
    }

    // Analytics & Reports
    async getTotalExamCount(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-count`);
        return response.data;
    }

    async getExamDistributionByCategory(): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/distribution-by-category`);
        return response.data;
    }

    async getExamDistributionByLevel(): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/distribution-by-level`);
        return response.data;
    }

    async getPublishedExams(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/published`);
        return response.data;
    }

    async getDraftExams(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/drafts`);
        return response.data;
    }

    // Advanced Operations
    async getExamsRequiringValidation(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/requiring-validation`);
        return response.data;
    }

    async getExamsWithoutQuestions(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/without-questions`);
        return response.data;
    }

    async getExamsWithoutParts(): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/without-parts`);
        return response.data;
    }

    // Template Integration
    async addQuestionsFromTemplates(examId: string, templateIds: string[], partId?: string): Promise<ExamDto> {
        const params = partId ? { partId } : {};
        const response = await api.post<ExamDto>(`${this.baseUrl}/${examId}/questions-from-templates`, templateIds, {
            params
        });
        return response.data;
    }

    async removeQuestionsWithTemplate(examId: string, templateId: string): Promise<ExamDto> {
        const response = await api.delete<ExamDto>(`${this.baseUrl}/${examId}/questions-with-template/${templateId}`);
        return response.data;
    }

    // Bulk Operations
    async createMultipleExams(examDtos: ExamDto[]): Promise<ExamDto[]> {
        const response = await api.post<ExamDto[]>(`${this.baseUrl}/bulk-create`, examDtos);
        return response.data;
    }

    async deleteMultipleExams(examIds: string[]): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/bulk-delete`, {
            data: examIds
        });
        return response.data;
    }

    async publishMultipleExams(examIds: string[]): Promise<ExamDto[]> {
        const response = await api.put<ExamDto[]>(`${this.baseUrl}/bulk-publish`, examIds);
        return response.data;
    }

    // Utility Operations
    async existsByName(name: string, category: ECourseCategory): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/exists-by-name`, {
            params: { name, category }
        });
        return response.data;
    }

    async existsByCode(code: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/exists-by-code`, {
            params: { code }
        });
        return response.data;
    }

    async findByCode(code: string): Promise<ExamDto> {
        const response = await api.get<ExamDto>(`${this.baseUrl}/find-by-code`, {
            params: { code }
        });
        return response.data;
    }

    async getExamsByCategory(category: ECourseCategory): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/by-category/${category}`);
        return response.data;
    }

    async getExamsByLevel(level: string): Promise<ExamDto[]> {
        const response = await api.get<ExamDto[]>(`${this.baseUrl}/by-level/${level}`);
        return response.data;
    }

    // Exam Management
    async activateExam(examId: string): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/activate`);
        return response.data;
    }

    async deactivateExam(examId: string): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/deactivate`);
        return response.data;
    }

    async publishExam(examId: string): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/publish`);
        return response.data;
    }

    async unpublishExam(examId: string): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/unpublish`);
        return response.data;
    }

    async duplicateExam(examId: string, newName: string): Promise<ExamDto> {
        const response = await api.post<ExamDto>(`${this.baseUrl}/${examId}/duplicate`, null, {
            params: { newName }
        });
        return response.data;
    }

    // Question Management
    async addQuestionToExam(examId: string, templateId: string, order?: number, points?: number): Promise<ExamDto> {
        const params: Record<string, string | number> = { templateId };
        if (order !== undefined) params.order = order;
        if (points !== undefined) params.points = points;

        const response = await api.post<ExamDto>(`${this.baseUrl}/${examId}/questions`, null, {
            params
        });
        return response.data;
    }

    async removeQuestionFromExam(examId: string, questionId: string): Promise<ExamDto> {
        const response = await api.delete<ExamDto>(`${this.baseUrl}/${examId}/questions/${questionId}`);
        return response.data;
    }

    async reorderQuestions(examId: string, questionIds: string[]): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/questions/reorder`, questionIds);
        return response.data;
    }

    async updateQuestionPoints(examId: string, questionId: string, points: number): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/questions/${questionId}/points`, null, {
            params: { points }
        });
        return response.data;
    }

    async updateQuestionSettings(examId: string, questionId: string, settings: ExamQuestionDto): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/questions/${questionId}/settings`, settings);
        return response.data;
    }

    // Part Management
    async addExamPart(examId: string, partDto: ExamPartDto): Promise<ExamDto> {
        const response = await api.post<ExamDto>(`${this.baseUrl}/${examId}/parts`, partDto);
        return response.data;
    }

    async updateExamPart(examId: string, partId: string, partDto: ExamPartDto): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/parts/${partId}`, partDto);
        return response.data;
    }

    async removeExamPart(examId: string, partId: string): Promise<ExamDto> {
        const response = await api.delete<ExamDto>(`${this.baseUrl}/${examId}/parts/${partId}`);
        return response.data;
    }

    async reorderParts(examId: string, partIds: string[]): Promise<ExamDto> {
        const response = await api.put<ExamDto>(`${this.baseUrl}/${examId}/parts/reorder`, partIds);
        return response.data;
    }

    // Validation & Statistics
    async validateExam(examId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${examId}/validate`);
        return response.data;
    }

    async getExamValidationErrors(examId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/${examId}/validation-errors`);
        return response.data;
    }
}

export const examService = new ExamService();