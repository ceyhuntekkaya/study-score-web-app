import {ESkill, ExamPartDto, PartStatisticsDto} from '@/types/exam/exam-type';
import api from '../base-api';


class ExamPartService {
    private readonly baseUrl = '/exam/exam-parts';

    // CRUD Operations
    async createExamPart(partDto: ExamPartDto): Promise<ExamPartDto> {
        const response = await api.post<ExamPartDto>(`${this.baseUrl}/`, partDto);
        return response.data;
    }

    async updateExamPart(partId: string, partDto: ExamPartDto): Promise<ExamPartDto> {
        const response = await api.put<ExamPartDto>(`${this.baseUrl}/${partId}`, partDto);
        return response.data;
    }

    async deleteExamPart(partId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${partId}`);
        return response.data;
    }

    async getExamPartById(partId: string): Promise<ExamPartDto> {
        const response = await api.get<ExamPartDto>(`${this.baseUrl}/${partId}`);
        return response.data;
    }

    async getAllParts(): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/`);
        return response.data;
    }

    async getPartsPaginated(
        page: number = 0,
        size: number = 10,
        sortBy: string = "orderNumber",
        sortDirection: string = "asc"
    ): Promise<{ content: ExamPartDto[], totalElements: number, totalPages: number }> {
        const response = await api.get(`${this.baseUrl}/paginated`, {
            params: { page, size, sortBy, sortDirection }
        });
        return response.data;
    }

    // Status Management
    async activatePart(partId: string): Promise<ExamPartDto> {
        const response = await api.put<ExamPartDto>(`${this.baseUrl}/${partId}/activate`);
        return response.data;
    }

    async deactivatePart(partId: string): Promise<ExamPartDto> {
        const response = await api.put<ExamPartDto>(`${this.baseUrl}/${partId}/deactivate`);
        return response.data;
    }

    // Utility Operations
    async isPartInUse(partId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${partId}/in-use`);
        return response.data;
    }

    async existsByName(name: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/exists`, {
            params: { name }
        });
        return response.data;
    }

    async findByName(name: string): Promise<ExamPartDto> {
        const response = await api.get<ExamPartDto>(`${this.baseUrl}/find-by-name`, {
            params: { name }
        });
        return response.data;
    }

    // Specialized Getters
    async getRecentParts(limit: number = 10): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getPartsWithoutQuestions(): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/without-questions`);
        return response.data;
    }

    async getPartsWithQuestions(): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/with-questions`);
        return response.data;
    }

    async getPartsByExamId(examId: string): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/by-exam/${examId}`);
        return response.data;
    }

    // Part Management
    async updatePartOrder(partId: string, newOrder: number): Promise<ExamPartDto> {
        const response = await api.put<ExamPartDto>(`${this.baseUrl}/${partId}/order`, null, {
            params: { newOrder }
        });
        return response.data;
    }

    async assignSkill(partId: string, skill: ESkill): Promise<ExamPartDto> {
        const response = await api.put<ExamPartDto>(`${this.baseUrl}/${partId}/skill`, null, {
            params: { skill }
        });
        return response.data;
    }

    async reorderParts(examId: string, partIds: string[]): Promise<ExamPartDto[]> {
        const response = await api.put<ExamPartDto[]>(`${this.baseUrl}/reorder`, partIds, {
            params: { examId }
        });
        return response.data;
    }

    async reorderAllParts(partIds: string[]): Promise<ExamPartDto[]> {
        const response = await api.put<ExamPartDto[]>(`${this.baseUrl}/reorder-all`, partIds);
        return response.data;
    }

    // Part Queries
    async getPartsBySkill(skill: ESkill): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/by-skill/${skill}`);
        return response.data;
    }

    async searchParts(keyword: string): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async getPartsByName(name: string): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/by-name/${name}`);
        return response.data;
    }

    // Part Statistics
    async getPartQuestionCount(partId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${partId}/question-count`);
        return response.data;
    }

    async getPartTotalPoints(partId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${partId}/total-points`);
        return response.data;
    }

    async getPartEstimatedDuration(partId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${partId}/estimated-duration`);
        return response.data;
    }

    async getPartQuestionTypes(partId: string): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/${partId}/question-types`);
        return response.data;
    }

    async getPartStatistics(partId: string): Promise<PartStatisticsDto> {
        const response = await api.get<PartStatisticsDto>(`${this.baseUrl}/${partId}/statistics`);
        return response.data;
    }

    // Bulk Operations
    async createMultipleParts(partDtos: ExamPartDto[]): Promise<ExamPartDto[]> {
        const response = await api.post<ExamPartDto[]>(`${this.baseUrl}/bulk-create`, partDtos);
        return response.data;
    }

    async updateMultipleParts(partDtos: ExamPartDto[]): Promise<ExamPartDto[]> {
        const response = await api.put<ExamPartDto[]>(`${this.baseUrl}/bulk-update`, partDtos);
        return response.data;
    }

    async deleteMultipleParts(partIds: string[]): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/bulk-delete`, {
            data: partIds
        });
        return response.data;
    }

    // Copy & Duplicate Operations
    async duplicatePart(partId: string, newName: string): Promise<ExamPartDto> {
        const response = await api.post<ExamPartDto>(`${this.baseUrl}/${partId}/duplicate`, null, {
            params: { newName }
        });
        return response.data;
    }

    async duplicateMultipleParts(partIds: string[], namePrefix?: string): Promise<ExamPartDto[]> {
        const params = namePrefix ? { namePrefix } : {};
        const response = await api.post<ExamPartDto[]>(`${this.baseUrl}/bulk-duplicate`, partIds, {
            params
        });
        return response.data;
    }

    // Analytics & Reports
    async getTotalPartCount(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-count`);
        return response.data;
    }

    async getPartDistributionBySkill(): Promise<Record<string, number>> {
        const response = await api.get<Record<string, number>>(`${this.baseUrl}/statistics/distribution-by-skill`);
        return response.data;
    }

    async getMostUsedParts(limit: number = 10): Promise<ExamPartDto[]> {
        const response = await api.get<ExamPartDto[]>(`${this.baseUrl}/most-used`, {
            params: { limit }
        });
        return response.data;
    }
}

export const examPartService = new ExamPartService();