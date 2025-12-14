

// branch.service.ts
import api from '../base-api';
import { Branch, BranchFormData } from "@/types/management/branch";

class BranchService {
    private readonly baseUrl = '/branch';

    async createBranch(branch: BranchFormData): Promise<Branch> {
        const response = await api.post<Branch>(`${this.baseUrl}/`, branch);
        return response.data;
    }

    async updateBranch(branchId: string, branch: BranchFormData): Promise<Branch> {
        const response = await api.put<Branch>(`${this.baseUrl}/${branchId}`, branch);
        return response.data;
    }

    async deleteBranchById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getBranchById(id: string): Promise<Branch> {
        const response = await api.get<Branch>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllBranches(): Promise<Branch[]> {
        const response = await api.get<Branch[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const branchService = new BranchService();
