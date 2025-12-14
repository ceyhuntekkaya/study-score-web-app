import api from '../base-api';
import {
    ExamQuestionDto,
    QuestionFilterDto,
    QuestionStatisticsDto,
    ESkill, QuestionAnalyticsDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';

class ExamQuestionService {
    private readonly baseUrl = '/exam/exam-questions';

    // CRUD Operations
    async createExamQuestion(questionDto: ExamQuestionDto): Promise<ExamQuestionDto> {
        const response = await api.post<ExamQuestionDto>(`${this.baseUrl}/`, questionDto);
        return response.data;
    }

    async updateExamQuestion(questionId: string, questionDto: ExamQuestionDto): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}`, questionDto);
        return response.data;
    }

    async getExamQuestionById(questionId: string): Promise<ExamQuestionDto> {
        const response = await api.get<ExamQuestionDto>(`${this.baseUrl}/${questionId}`);
        return response.data;
    }

    async deleteExamQuestion(questionId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${questionId}`);
        return response.data;
    }

    // Question Retrieval
    async getQuestionsByExamId(examId: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/by-exam/${examId}`);
        return response.data;
    }

    async getQuestionsByPartId(partId: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/by-part/${partId}`);
        return response.data;
    }

    async getQuestionsPaginated(
        page: number = 0,
        size: number = 20,
        sortBy: string = "createdAt",
        sortDirection: string = "desc"
    ): Promise<{ content: ExamQuestionDto[], totalElements: number, totalPages: number }> {
        const response = await api.get(`${this.baseUrl}/paginated`, {
            params: { page, size, sortBy, sortDirection }
        });
        return response.data;
    }

    // Question Management
    async linkTemplate(questionId: string, templateId: string): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/link-template`, null, {
            params: { templateId }
        });
        return response.data;
    }

    async unlinkTemplate(questionId: string): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/unlink-template`);
        return response.data;
    }

    async updateQuestionOrder(questionId: string, newOrder: number): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/order`, null, {
            params: { newOrder }
        });
        return response.data;
    }

    async toggleQuestionStatus(questionId: string): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/toggle-status`);
        return response.data;
    }

    async shuffleQuestionOptions(questionId: string, shuffle: boolean): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/shuffle-options`, null, {
            params: { shuffle }
        });
        return response.data;
    }

    // Question Settings
    async updateTimeLimit(questionId: string, timeLimit: number): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/time-limit`, null, {
            params: { timeLimit }
        });
        return response.data;
    }

    async updatePoints(questionId: string, points: number): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/points`, null, {
            params: { points }
        });
        return response.data;
    }

    async addTag(questionId: string, tag: string): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/add-tag`, null, {
            params: { tag }
        });
        return response.data;
    }

    async removeTag(questionId: string, tag: string): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/remove-tag`, null, {
            params: { tag }
        });
        return response.data;
    }

    async setCurriculumContent(questionId: string, curriculumContentIds: Set<string>): Promise<ExamQuestionDto> {
        const response = await api.put<ExamQuestionDto>(`${this.baseUrl}/${questionId}/curriculum-content`, Array.from(curriculumContentIds));
        return response.data;
    }

    // Question Analysis
    async getQuestionsByDifficulty(examId: string, difficulty: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/${examId}/by-difficulty/${difficulty}`);
        return response.data;
    }

    async getQuestionsByType(examId: string, type: EQuestionTemplateType): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/${examId}/by-type/${type}`);
        return response.data;
    }

    async getQuestionsBySkill(examId: string, skill: ESkill): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/${examId}/by-skill/${skill}`);
        return response.data;
    }

    async getQuestionTypeDistribution(examId: string): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/${examId}/type-distribution`);
        return response.data;
    }

    async getQuestionSkillDistribution(examId: string): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/${examId}/skill-distribution`);
        return response.data;
    }

    // Bulk Operations
    async bulkUpdatePoints(questionIds: string[], points: number): Promise<ExamQuestionDto[]> {
        const response = await api.put<ExamQuestionDto[]>(`${this.baseUrl}/bulk-update-points`, questionIds, {
            params: { points }
        });
        return response.data;
    }

    async bulkUpdateTimeLimit(questionIds: string[], timeLimit: number): Promise<ExamQuestionDto[]> {
        const response = await api.put<ExamQuestionDto[]>(`${this.baseUrl}/bulk-update-time-limit`, questionIds, {
            params: { timeLimit }
        });
        return response.data;
    }

    async bulkDeleteQuestions(questionIds: string[]): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/bulk-delete`, {
            data: questionIds
        });
        return response.data;
    }

    async duplicateQuestions(questionIds: string[], targetExamId: string): Promise<ExamQuestionDto[]> {
        const response = await api.post<ExamQuestionDto[]>(`${this.baseUrl}/duplicate`, questionIds, {
            params: { targetExamId }
        });
        return response.data;
    }

    // Search & Filter
    async searchQuestions(keyword: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async filterQuestions(filter: QuestionFilterDto): Promise<ExamQuestionDto[]> {
        const response = await api.post<ExamQuestionDto[]>(`${this.baseUrl}/filter`, filter);
        return response.data;
    }

    // Question Statistics
    async getQuestionStatistics(questionId: string): Promise<QuestionStatisticsDto> {
        const response = await api.get<QuestionStatisticsDto>(`${this.baseUrl}/${questionId}/statistics`);
        return response.data;
    }

    async getTotalQuestionCount(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-count`);
        return response.data;
    }

    async getQuestionCountByType(type: EQuestionTemplateType): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/count-by-type/${type}`);
        return response.data;
    }

    async getQuestionCountByPart(partId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/count-by-part/${partId}`);
        return response.data;
    }

    async getTotalPointsByExam(examId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${examId}/total-points`);
        return response.data;
    }

    async getTotalTimeLimitByExam(examId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${examId}/total-time-limit`);
        return response.data;
    }

    // Reordering Operations
    async reorderQuestions(examId: string, questionIds: string[]): Promise<ExamQuestionDto[]> {
        const response = await api.put<ExamQuestionDto[]>(`${this.baseUrl}/${examId}/reorder`, questionIds);
        return response.data;
    }

    async reorderQuestionsByPart(partId: string, questionIds: string[]): Promise<ExamQuestionDto[]> {
        const response = await api.put<ExamQuestionDto[]>(`${this.baseUrl}/${partId}/reorder-by-part`, questionIds);
        return response.data;
    }

    // Specialized Queries
    async getQuestionsWithoutTemplate(): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/without-template`);
        return response.data;
    }

    async getQuestionsByTemplate(templateId: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/by-template/${templateId}`);
        return response.data;
    }

    async getMainQuestions(): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/main-questions`);
        return response.data;
    }

    async getActiveQuestions(): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/active-questions`);
        return response.data;
    }

    async getQuestionsByTag(tag: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/by-tag/${tag}`);
        return response.data;
    }

    async getQuestionsByCurriculumContent(curriculumContentId: string): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/by-curriculum-content/${curriculumContentId}`);
        return response.data;
    }

    // Advanced Analytics
    async getQuestionAnalytics(examId: string): Promise<Record<string, QuestionAnalyticsDto>> {
        const response = await api.get<Record<string, QuestionAnalyticsDto>>(`${this.baseUrl}/${examId}/analytics`);
        return response.data;
    }

    async getRecentQuestions(limit: number = 10): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getMostRecentlyUpdated(limit: number = 10): Promise<ExamQuestionDto[]> {
        const response = await api.get<ExamQuestionDto[]>(`${this.baseUrl}/recently-updated`, {
            params: { limit }
        });
        return response.data;
    }

    // Template Integration Methods
    async getQuestionWithTemplate(questionId: string): Promise<ExamQuestionDto> {
        const response = await api.get<ExamQuestionDto>(`${this.baseUrl}/${questionId}/with-template`);
        return response.data;
    }

    async getQuestionsWithTemplates(questionIds: string[]): Promise<ExamQuestionDto[]> {
        const response = await api.post<ExamQuestionDto[]>(`${this.baseUrl}/with-templates`, questionIds);
        return response.data;
    }

    async createQuestionFromTemplate(
        templateId: string,
        partId?: string,
        order?: number,
        points?: number
    ): Promise<ExamQuestionDto> {
        const params: Record<string, string | number> = { templateId };
        if (partId) params.partId = partId;
        if (order !== undefined) params.order = order;
        if (points !== undefined) params.points = points;

        const response = await api.post<ExamQuestionDto>(`${this.baseUrl}/from-template`, null, {
            params
        });
        return response.data;
    }

    async createQuestionsFromTemplates(templateIds: string[], partId?: string): Promise<ExamQuestionDto[]> {
        const params = partId ? { partId } : {};
        const response = await api.post<ExamQuestionDto[]>(`${this.baseUrl}/from-templates`, templateIds, {
            params
        });
        return response.data;
    }

    async updateTemplateReferences(oldTemplateId: string, newTemplateId: string): Promise<string> {
        const response = await api.put<string>(`${this.baseUrl}/update-template-references`, null, {
            params: { oldTemplateId, newTemplateId }
        });
        return response.data;
    }

    // Utility Operations
    async isQuestionInUse(questionId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${questionId}/in-use`);
        return response.data;
    }

    async hasTemplate(questionId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${questionId}/has-template`);
        return response.data;
    }
}

export const examQuestionService = new ExamQuestionService();