

// institution.service.ts
import api from '../base-api';
import { Institution, InstitutionFormData } from "@/types/management/institution";

class InstitutionService {
    private readonly baseUrl = '/institution';

    async createInstitution(institution: InstitutionFormData): Promise<Institution> {
        const response = await api.post<Institution>(`${this.baseUrl}/`, institution);
        return response.data;
    }

    async updateInstitution(institutionId: string, institution: InstitutionFormData): Promise<Institution> {
        const response = await api.put<Institution>(`${this.baseUrl}/${institutionId}`, institution);
        return response.data;
    }

    async deleteInstitutionById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getInstitutionById(id: string): Promise<Institution> {
        const response = await api.get<Institution>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllInstitutions(): Promise<Institution[]> {
        const response = await api.get<Institution[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const institutionService = new InstitutionService();
