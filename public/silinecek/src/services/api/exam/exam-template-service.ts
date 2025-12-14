import api from '../base-api';
import {
    BaseQuestionTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    MatchingTemplateDto,
    EssayTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto,
    AudioResponseTemplateDto,
    VideoResponseTemplateDto,
    ImageResponseTemplateDto,
    TemplateFilterDto,
    TemplateUsageStatsDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';

class ExamTemplateService {
    private readonly baseUrl = '/exam/exam-templates';

    // Generic Template Operations
    async createTemplate(templateDto: BaseQuestionTemplateDto): Promise<BaseQuestionTemplateDto> {
        const response = await api.post<BaseQuestionTemplateDto>(`${this.baseUrl}/`, templateDto);
        return response.data;
    }

    async updateTemplate(templateId: string, templateDto: BaseQuestionTemplateDto): Promise<BaseQuestionTemplateDto> {
        const response = await api.put<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}`, templateDto);
        return response.data;
    }

    async getTemplateById(templateId: string): Promise<BaseQuestionTemplateDto> {
        const response = await api.get<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}`);
        return response.data;
    }

    async getTemplateByIdAndType(templateId: string, type: EQuestionTemplateType): Promise<BaseQuestionTemplateDto> {
        const response = await api.get<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}/type/${type}`);
        return response.data;
    }

    async getAllTemplates(): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getTemplatesByType(type: EQuestionTemplateType): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/by-type/${type}`);
        return response.data;
    }

    async deleteTemplate(templateId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${templateId}`);
        return response.data;
    }

    // Template Management
    async activateTemplate(templateId: string): Promise<BaseQuestionTemplateDto> {
        const response = await api.put<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}/activate`);
        return response.data;
    }

    async deactivateTemplate(templateId: string): Promise<BaseQuestionTemplateDto> {
        const response = await api.put<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}/deactivate`);
        return response.data;
    }

    async duplicateTemplate(templateId: string, newTitle: string): Promise<BaseQuestionTemplateDto> {
        const response = await api.post<BaseQuestionTemplateDto>(`${this.baseUrl}/${templateId}/duplicate`, null, {
            params: { newTitle }
        });
        return response.data;
    }

    async getTemplateMap(templateIds: string[]): Promise<Record<string, BaseQuestionTemplateDto>> {
        const response = await api.post<Record<string, BaseQuestionTemplateDto>>(`${this.baseUrl}/bulk-get`, templateIds);
        return response.data;
    }

    // Template Validation
    async validateTemplate(templateId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${templateId}/validate`);
        return response.data;
    }

    async getTemplateValidationErrors(templateId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/${templateId}/validation-errors`);
        return response.data;
    }

    async isTemplateInUse(templateId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${templateId}/in-use`);
        return response.data;
    }

    async getExamsUsingTemplate(templateId: string): Promise<string[]> {
        const response = await api.get<string[]>(`${this.baseUrl}/${templateId}/exams-using`);
        return response.data;
    }

    // Search & Filter
    async searchTemplates(keyword: string): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async filterTemplates(filter: TemplateFilterDto): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.post<BaseQuestionTemplateDto[]>(`${this.baseUrl}/filter`, filter);
        return response.data;
    }

    async getTemplatesBySubject(subject: string): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/by-subject/${subject}`);
        return response.data;
    }

    async getTemplatesByDifficulty(difficulty: string): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/by-difficulty/${difficulty}`);
        return response.data;
    }

    async getTemplatesByCreator(userId: string): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/by-creator/${userId}`);
        return response.data;
    }

    // Specific Template Type Operations - Multiple Choice
    async createMultipleChoiceTemplate(dto: MultipleChoiceTemplateDto): Promise<MultipleChoiceTemplateDto> {
        const response = await api.post<MultipleChoiceTemplateDto>(`${this.baseUrl}/multiple-choice`, dto);
        return response.data;
    }

    // Specific Template Type Operations - True/False
    async createTrueFalseTemplate(dto: TrueFalseTemplateDto): Promise<TrueFalseTemplateDto> {
        const response = await api.post<TrueFalseTemplateDto>(`${this.baseUrl}/true-false`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Fill in the Blanks
    async createFillInTheBlanksTemplate(dto: FillInTheBlanksTemplateDto): Promise<FillInTheBlanksTemplateDto> {
        const response = await api.post<FillInTheBlanksTemplateDto>(`${this.baseUrl}/fill-in-blanks`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Short Answer
    async createShortAnswerTemplate(dto: ShortAnswerTemplateDto): Promise<ShortAnswerTemplateDto> {
        const response = await api.post<ShortAnswerTemplateDto>(`${this.baseUrl}/short-answer`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Matching
    async createMatchingTemplate(dto: MatchingTemplateDto): Promise<MatchingTemplateDto> {
        const response = await api.post<MatchingTemplateDto>(`${this.baseUrl}/matching`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Essay
    async createEssayTemplate(dto: EssayTemplateDto): Promise<EssayTemplateDto> {
        const response = await api.post<EssayTemplateDto>(`${this.baseUrl}/essay`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Ordering
    async createOrderingTemplate(dto: OrderingTemplateDto): Promise<OrderingTemplateDto> {
        const response = await api.post<OrderingTemplateDto>(`${this.baseUrl}/ordering`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Multiple Response
    async createMultipleResponseTemplate(dto: MultipleResponseTemplateDto): Promise<MultipleResponseTemplateDto> {
        const response = await api.post<MultipleResponseTemplateDto>(`${this.baseUrl}/multiple-response`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Hot Spot
    async createHotSpotTemplate(dto: HotSpotTemplateDto): Promise<HotSpotTemplateDto> {
        const response = await api.post<HotSpotTemplateDto>(`${this.baseUrl}/hot-spot`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Drag and Drop
    async createDragAndDropTemplate(dto: DragAndDropTemplateDto): Promise<DragAndDropTemplateDto> {
        const response = await api.post<DragAndDropTemplateDto>(`${this.baseUrl}/drag-drop`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Audio Response
    async createAudioResponseTemplate(dto: AudioResponseTemplateDto): Promise<AudioResponseTemplateDto> {
        const response = await api.post<AudioResponseTemplateDto>(`${this.baseUrl}/audio-response`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Video Response
    async createVideoResponseTemplate(dto: VideoResponseTemplateDto): Promise<VideoResponseTemplateDto> {
        const response = await api.post<VideoResponseTemplateDto>(`${this.baseUrl}/video-response`, dto);
        return response.data;
    }

    // Specific Template Type Operations - Image Response
    async createImageResponseTemplate(dto: ImageResponseTemplateDto): Promise<ImageResponseTemplateDto> {
        const response = await api.post<ImageResponseTemplateDto>(`${this.baseUrl}/image-response`, dto);
        return response.data;
    }

    // Template Analytics
    async getTemplateTypeStatistics(): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/type-distribution`);
        return response.data;
    }

    async getMostUsedTemplates(limit: number = 10): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/most-used`, {
            params: { limit }
        });
        return response.data;
    }

    async getRecentTemplates(limit: number = 10): Promise<BaseQuestionTemplateDto[]> {
        const response = await api.get<BaseQuestionTemplateDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getTemplateUsageStats(templateId: string): Promise<TemplateUsageStatsDto> {
        const response = await api.get<TemplateUsageStatsDto>(`${this.baseUrl}/${templateId}/usage-stats`);
        return response.data;
    }
}

export const examTemplateService = new ExamTemplateService();