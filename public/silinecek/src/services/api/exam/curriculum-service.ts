import {CurriculumDto, CurriculumFilterDto} from '@/types/exam/exam-type';
import api from '../base-api';
import {ECourseCategory, EStatus} from "@/types/enumeration";
import axios from "axios";

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}


class CurriculumService {
    private readonly baseUrl = '/exam/curriculums';

    // CRUD Operations

    async createCurriculum(curriculumDto: CurriculumDto): Promise<CurriculumDto> {
        const response = await api.post<CurriculumDto>(`${this.baseUrl}`, curriculumDto);
        return response.data;
    }

    async updateCurriculum(curriculumId: string, curriculumDto: CurriculumDto): Promise<CurriculumDto> {
        const response = await api.put<CurriculumDto>(`${this.baseUrl}/${curriculumId}`, curriculumDto);
        return response.data;
    }

    async getCurriculumById(curriculumId: string): Promise<CurriculumDto> {
        const response = await api.get<CurriculumDto>(`${this.baseUrl}/${curriculumId}`);
        return response.data;
    }

    async getAllCurriculums(): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}`);
        return response.data;
    }

    async getCurriculumsByCategory(category: ECourseCategory): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}/by-category/${category}`);
        return response.data;
    }

    async getCurriculumsPaginated(params: PaginationParams = {}): Promise<PaginatedResponse<CurriculumDto>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = params;

        const response = await api.get<PaginatedResponse<CurriculumDto>>(`${this.baseUrl}/paginated`, {
            params: { page, size, sortBy, sortDirection }
        });
        return response.data;
    }

    async deleteCurriculum(curriculumId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${curriculumId}`);
        return response.data;
    }

    // Version Management

    async createNewVersion(curriculumId: string): Promise<CurriculumDto> {
        const response = await api.post<CurriculumDto>(`${this.baseUrl}/${curriculumId}/create-version`);
        return response.data;
    }

    async getCurriculumVersions(baseName: string, category: ECourseCategory): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}/versions`, {
            params: { baseName, category }
        });
        return response.data;
    }

    async getLatestVersion(baseName: string, category: ECourseCategory): Promise<CurriculumDto> {
        const response = await api.get<CurriculumDto>(`${this.baseUrl}/latest-version`, {
            params: { baseName, category }
        });
        return response.data;
    }

    async revertToVersion(curriculumId: string, version: number): Promise<CurriculumDto> {
        const response = await api.put<CurriculumDto>(`${this.baseUrl}/${curriculumId}/revert-version`, null, {
            params: { version }
        });
        return response.data;
    }

    // Search & Filter Operations

    async searchCurriculums(keyword: string): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async searchCurriculumsPaginated(
        keyword: string,
        params: PaginationParams = {}
    ): Promise<PaginatedResponse<CurriculumDto>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDirection = 'desc'
        } = params;

        const response = await api.get<PaginatedResponse<CurriculumDto>>(`${this.baseUrl}/search/paginated`, {
            params: { keyword, page, size, sortBy, sortDirection }
        });
        return response.data;
    }

    async filterCurriculums(filter: CurriculumFilterDto): Promise<CurriculumDto[]> {
        const response = await api.post<CurriculumDto[]>(`${this.baseUrl}/filter`, filter);
        return response.data;
    }

    // Management Operations

    async activateCurriculum(curriculumId: string): Promise<CurriculumDto> {
        const response = await api.put<CurriculumDto>(`${this.baseUrl}/${curriculumId}/activate`);
        return response.data;
    }

    async deactivateCurriculum(curriculumId: string): Promise<CurriculumDto> {
        const response = await api.put<CurriculumDto>(`${this.baseUrl}/${curriculumId}/deactivate`);
        return response.data;
    }

    async duplicateCurriculum(curriculumId: string, newName: string): Promise<CurriculumDto> {
        const response = await api.post<CurriculumDto>(`${this.baseUrl}/${curriculumId}/duplicate`, null, {
            params: { newName }
        });
        return response.data;
    }

    // Analytics Operations

    async getTotalCurriculumCount(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-count`);
        return response.data;
    }

    async getCurriculumCountByCategory(category: ECourseCategory): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/count-by-category/${category}`);
        return response.data;
    }

    async getRecentCurriculums(limit: number = 10): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}/recent`, {
            params: { limit }
        });
        return response.data;
    }

    async getMostRecentlyUpdated(limit: number = 10): Promise<CurriculumDto[]> {
        const response = await api.get<CurriculumDto[]>(`${this.baseUrl}/recently-updated`, {
            params: { limit }
        });
        return response.data;
    }

    // Utility Operations

    async existsByName(name: string, category: ECourseCategory): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/exists`, {
            params: { name, category }
        });
        return response.data;
    }

    async findByNameAndCategory(name: string, category: ECourseCategory): Promise<CurriculumDto | null> {
        try {
            const response = await api.get<CurriculumDto>(`${this.baseUrl}/find-by-name-category`, {
                params: { name, category }
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async isCurriculumInUse(curriculumId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${curriculumId}/in-use`);
        return response.data;
    }

    // Helper methods for common operations

    async getCurriculumsByFilters(filters: {
        category?: ECourseCategory;
        isActive?: boolean;
        keyword?: string;
        limit?: number;
    }): Promise<CurriculumDto[]> {
        const { category, isActive, keyword, limit } = filters;

        if (keyword) {
            return this.searchCurriculums(keyword);
        }

        if (category && isActive !== undefined) {
            const allByCategory = await this.getCurriculumsByCategory(category);
            return allByCategory.filter(curriculum => curriculum.status === EStatus.ACTIVE);
        }

        if (category) {
            return this.getCurriculumsByCategory(category);
        }

        let filtered = await this.getAllCurriculums();

        if (isActive !== undefined) {
            filtered = filtered.filter(curriculum => curriculum.status === EStatus.ACTIVE);
        }

        if (limit) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }

    async getActiveCurriculums(): Promise<CurriculumDto[]> {
        return this.getCurriculumsByFilters({ isActive: true });
    }

    async getInactiveCurriculums(): Promise<CurriculumDto[]> {
        return this.getCurriculumsByFilters({ isActive: false });
    }
}

export const curriculumService = new CurriculumService();