import { ECurriculumLevel } from '@/types/enumeration';
import api from '../base-api';
import { CurriculumContentDto } from '@/types/exam/exam-type';
import axios from "axios";

// Types


export interface ContentDistribution {
    [key: string]: number; // ECurriculumLevel as key, count as value
}

class CurriculumContentService {
    private readonly baseUrl = '/exam/curriculum-contents';

    // CRUD Operations

    async createContent(contentDto: CurriculumContentDto): Promise<CurriculumContentDto> {
        const response = await api.post<CurriculumContentDto>(`${this.baseUrl}`, contentDto);
        return response.data;
    }

    async updateContent(contentId: string, contentDto: CurriculumContentDto): Promise<CurriculumContentDto> {
        const response = await api.put<CurriculumContentDto>(`${this.baseUrl}/${contentId}`, contentDto);
        return response.data;
    }

    async getContentById(contentId: string): Promise<CurriculumContentDto> {
        const response = await api.get<CurriculumContentDto>(`${this.baseUrl}/${contentId}`);
        return response.data;
    }

    async getContentsByCurriculumId(curriculumId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/by-curriculum/${curriculumId}`);
        return response.data;
    }

    async getContentsByLevel(level: ECurriculumLevel): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/by-level/${level}`);
        return response.data;
    }

    async getContentsByCurriculumAndLevel(curriculumId: string, level: ECurriculumLevel): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/by-curriculum-level`, {
            params: { curriculumId, level }
        });
        return response.data;
    }

    async deleteContent(contentId: string): Promise<string> {
        const response = await api.delete<string>(`${this.baseUrl}/${contentId}`);
        return response.data;
    }

    // Hierarchy Management

    async addChildContent(parentId: string, childDto: CurriculumContentDto): Promise<CurriculumContentDto> {
        const response = await api.post<CurriculumContentDto>(`${this.baseUrl}/${parentId}/add-child`, childDto);
        return response.data;
    }

    async removeChildContent(parentId: string, childId: string): Promise<string> {
        const response = await api.put<string>(`${this.baseUrl}/${parentId}/remove-child/${childId}`);
        return response.data;
    }

    async getChildrenContents(parentId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/${parentId}/children`);
        return response.data;
    }

    async getParentContent(contentId: string): Promise<CurriculumContentDto | null> {
        try {
            const response = await api.get<CurriculumContentDto>(`${this.baseUrl}/${contentId}/parent`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    async getContentHierarchy(curriculumId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/${curriculumId}/hierarchy`);
        return response.data;
    }

    async getRootContents(curriculumId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/${curriculumId}/root-contents`);
        return response.data;
    }

    async getContentsByParent(parentId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/by-parent/${parentId}`);
        return response.data;
    }

    // Content Management

    async updateContentOrder(contentId: string, newOrder: number): Promise<CurriculumContentDto> {
        const response = await api.put<CurriculumContentDto>(`${this.baseUrl}/${contentId}/order`, null, {
            params: { newOrder }
        });
        return response.data;
    }

    async reorderContents(parentId: string, contentIds: string[]): Promise<CurriculumContentDto[]> {
        const response = await api.put<CurriculumContentDto[]>(`${this.baseUrl}/${parentId}/reorder`, contentIds);
        return response.data;
    }

    async moveContent(contentId: string, newParentId?: string): Promise<CurriculumContentDto> {
        const response = await api.put<CurriculumContentDto>(`${this.baseUrl}/${contentId}/move`, null, {
            params: { newParentId: newParentId || '' }
        });
        return response.data;
    }

    // Search & Navigation

    async searchContents(keyword: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async searchContentsByCurriculum(curriculumId: string, keyword: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/${curriculumId}/search`, {
            params: { keyword }
        });
        return response.data;
    }

    async getContentsByCode(code: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/by-code/${code}`);
        return response.data;
    }

    async getContentPath(contentId: string): Promise<CurriculumContentDto[]> {
        const response = await api.get<CurriculumContentDto[]>(`${this.baseUrl}/${contentId}/path`);
        return response.data;
    }

    async findContentByPath(pathString: string): Promise<CurriculumContentDto | null> {
        try {
            const response = await api.get<CurriculumContentDto>(`${this.baseUrl}/find-by-path`, {
                params: { pathString }
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    // Analytics & Statistics

    async getTotalContentCount(): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/total-count`);
        return response.data;
    }

    async getContentCountByCurriculum(curriculumId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/count-by-curriculum/${curriculumId}`);
        return response.data;
    }

    async getContentCountByLevel(level: ECurriculumLevel): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/statistics/count-by-level/${level}`);
        return response.data;
    }

    async getContentDistributionByLevel(curriculumId: string): Promise<ContentDistribution> {
        const response = await api.get<ContentDistribution>(`${this.baseUrl}/${curriculumId}/distribution-by-level`);
        return response.data;
    }

    async getMaxDepth(curriculumId: string): Promise<number> {
        const response = await api.get<number>(`${this.baseUrl}/${curriculumId}/max-depth`);
        return response.data;
    }

    // Utility Operations

    async isContentInUse(contentId: string): Promise<boolean> {
        const response = await api.get<boolean>(`${this.baseUrl}/${contentId}/in-use`);
        return response.data;
    }
}

export const curriculumContentService = new CurriculumContentService();