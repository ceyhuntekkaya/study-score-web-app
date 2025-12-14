

// brand.service.ts
import api from '../base-api';
import { Brand, BrandFormData } from "@/types/management/brand";

class BrandService {
    private readonly baseUrl = '/brand';

    async createBrand(brand: BrandFormData): Promise<Brand> {
        const response = await api.post<Brand>(`${this.baseUrl}/`, brand);
        return response.data;
    }

    async updateBrand(brandId: string, brand: BrandFormData): Promise<Brand> {
        const response = await api.put<Brand>(`${this.baseUrl}/${brandId}`, brand);
        return response.data;
    }

    async deleteBrandById(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    async getBrandById(id: string): Promise<Brand> {
        const response = await api.get<Brand>(`${this.baseUrl}/${id}`);
        return response.data;
    }

    async getAllBrands(): Promise<Brand[]> {
        const response = await api.get<Brand[]>(`${this.baseUrl}/`);
        return response.data;
    }
}

export const brandService = new BrandService();
