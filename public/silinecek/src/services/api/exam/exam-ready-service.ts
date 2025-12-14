import api from '../base-api';
import {
    ExamReadyDto,
    ExamReadyFilterDto,
    ExamQuestionDto,
    ExamQuestionReadyDto,
    ExamSettingsDto,
    ExamStatisticsDto,
    ExamComplexityDto,
    BaseQuestionTemplateDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';

class ExamReadyService {
    private readonly baseUrl = '/exam/exam-ready';

    // Complete Exam Building
    async buildExamReady(examId: string): Promise<ExamReadyDto> {
        const response = await api.get<ExamReadyDto>(`${this.baseUrl}/${examId}`);
        return response.data;
    }

    async buildExamReadyWithFilters(examId: string, filter: ExamReadyFilterDto): Promise<ExamReadyDto> {
        const response = await api.post<ExamReadyDto>(`${this.baseUrl}/${examId}/with-filters`, filter);
        return response.data;
    }

    async buildExamReadyForUser(examId: string, userId: string): Promise<ExamReadyDto> {
        const response = await api.get<ExamReadyDto>(`${this.baseUrl}/${examId}/for-user/${userId}`);
        return response.data;
    }

    async buildExamReadyPreview(examId: string): Promise<ExamReadyDto> {
        const response = await api.get<ExamReadyDto>(`${this.baseUrl}/${examId}/preview`);
        return response.data;
    }

    // Template Resolution
    async resolveTemplates(templateIds: string[]): Promise<Record<string, BaseQuestionTemplateDto>> {
        const response = await api.post<Record<string, BaseQuestionTemplateDto>>(`${this.baseUrl}/resolve-templates`, templateIds);
        return response.data;
    }

    async resolveTemplate(templateId: string, type: EQuestionTemplateType): Promise<BaseQuestionTemplateDto> {
        const response = await api.get<BaseQuestionTemplateDto>(`${this.baseUrl}/resolve-template/${templateId}/type/${type}`);
        return response.data;
    }

    async buildQuestionsWithTemplates(questions: ExamQuestionDto[]): Promise<ExamQuestionReadyDto[]> {
        const response = await api.post<ExamQuestionReadyDto[]>(`${this.baseUrl}/questions-with-templates`, questions);
        return response.data;
    }

    // Exam Preparation
    async prepareExamForTaking(examId: string, userId: string): Promise<ExamReadyDto> {
        const response = await api.get<ExamReadyDto>(`${this.baseUrl}/${examId}/prepare-for-taking/${userId}`);
        return response.data;
    }

    async shuffleExamQuestions(examId: string): Promise<ExamReadyDto> {
        const response = await api.put<ExamReadyDto>(`${this.baseUrl}/${examId}/shuffle-questions`);
        return response.data;
    }

    async applyExamSettings(examId: string, settings: ExamSettingsDto): Promise<ExamReadyDto> {
        const response = await api.post<ExamReadyDto>(`${this.baseUrl}/${examId}/apply-settings`, settings);
        return response.data;
    }

    // Validation & Statistics
    async validateExamReady(examId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${examId}/validate`);
        return response.data;
    }

    async getExamReadyValidationErrors(examId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/${examId}/validation-errors`);
        return response.data;
    }

    async calculateExamStatistics(examId: string): Promise<ExamStatisticsDto> {
        const response = await api.get<ExamStatisticsDto>(`${this.baseUrl}/${examId}/statistics`);
        return response.data;
    }

    async analyzeExamComplexity(examId: string): Promise<ExamComplexityDto> {
        const response = await api.get<ExamComplexityDto>(`${this.baseUrl}/${examId}/complexity-analysis`);
        return response.data;
    }

    // Caching & Performance
    async getCachedExamReady(examId: string): Promise<ExamReadyDto> {
        const response = await api.get<ExamReadyDto>(`${this.baseUrl}/${examId}/cached`);
        return response.data;
    }

    async invalidateExamReadyCache(examId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${examId}/cache`);
        return response.data;
    }

    async invalidateAllExamReadyCache(): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/cache/all`);
        return response.data;
    }

    async preloadExamReady(examIds: string[]): Promise<string> {
        const response = await api.post<string>(`${this.baseUrl}/preload`, examIds);
        return response.data;
    }
}

export const examReadyService = new ExamReadyService();