
// campus.service.ts
import api from '../base-api';
import { Campus, CampusFormData } from "@/types/management/campus";

class CampusService {
    private readonly baseUrl = '/campus';

    async createCampus(campus: CampusFormData): Promise<Campus> {
        const response = await api.post<Campus>(`${this.baseUrl}/`, campus);
        return response.data;
    }

    async updateCampus(campusId: string, campus: CampusFormData): Promise<Campus> {
        const response = await api.put<Campus>(`${this.baseUrl}/${campusId}`, campus);
        return response.data;
    }

    async deleteCampusById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getCampusById(id: string): Promise<Campus> {
        const response = await api.get<Campus>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllCampuses(): Promise<Campus[]> {
        const response = await api.get<Campus[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const campusService = new CampusService();