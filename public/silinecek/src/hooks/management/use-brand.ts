import { useState, useCallback, useEffect } from 'react';
import { Brand, BrandFormData } from '@/types/management/brand';
import { brandService } from '@/services/api/management/brand-service';

interface UseBrandReturn {
    brands: Brand[];
    selectedBrand: Brand | null;
    loading: boolean;
    error: Error | null;
    fetchBrands: () => Promise<void>;
    fetchBrandById: (id: string) => Promise<void>;
    createBrand: (brand: BrandFormData) => Promise<void>;
    updateBrand: (id: string, brand: BrandFormData) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;
}

export const useBrands = (): UseBrandReturn => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchBrands = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getAllBrands();
            setBrands(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBrandById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await brandService.getBrandById(id);
            setSelectedBrand(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createBrand = useCallback(async (brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.createBrand(brand);
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBrands]);

    const updateBrand = useCallback(async (id: string, brand: BrandFormData) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.updateBrand(id, brand);
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBrands]);

    const deleteBrand = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await brandService.deleteBrandById(id);
            await fetchBrands();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBrands]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return {
        brands,
        selectedBrand,
        loading,
        error,
        fetchBrands,
        fetchBrandById,
        createBrand,
        updateBrand,
        deleteBrand
    };
};