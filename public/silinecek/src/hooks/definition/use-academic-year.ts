import { useState, useCallback, useEffect } from 'react';
import { AcademicYear, AcademicYearFormData } from '@/types/definition/academic-year';
import { academicYearService } from '@/services/api/defination/academic-year-service';

interface UseAcademicYearReturn {
    academicYears: AcademicYear[];
    selectedAcademicYear: AcademicYear | null;
    loading: boolean;
    error: Error | null;
    fetchAcademicYears: () => Promise<void>;
    fetchAcademicYearById: (id: string) => Promise<void>;
    createAcademicYear: (academicYear: AcademicYearFormData) => Promise<void>;
    updateAcademicYear: (id: string, academicYear: AcademicYearFormData) => Promise<void>;
    deleteAcademicYear: (id: string) => Promise<void>;
}

export const useAcademicYears = (): UseAcademicYearReturn => {
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAcademicYears = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await academicYearService.getAllAcademicYears();
            setAcademicYears(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAcademicYearById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await academicYearService.getAcademicYearById(id);
            setSelectedAcademicYear(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createAcademicYear = useCallback(async (academicYear: AcademicYearFormData) => {
        try {
            setLoading(true);
            setError(null);
            await academicYearService.createAcademicYear(academicYear);
            await fetchAcademicYears();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchAcademicYears]);

    const updateAcademicYear = useCallback(async (id: string, academicYear: AcademicYearFormData) => {
        try {
            setLoading(true);
            setError(null);
            await academicYearService.updateAcademicYear(id, academicYear);
            await fetchAcademicYears();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchAcademicYears]);

    const deleteAcademicYear = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await academicYearService.deleteAcademicYearById(id);
            await fetchAcademicYears();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchAcademicYears]);

    useEffect(() => {
        fetchAcademicYears();
    }, [fetchAcademicYears]);

    return {
        academicYears,
        selectedAcademicYear,
        loading,
        error,
        fetchAcademicYears,
        fetchAcademicYearById,
        createAcademicYear,
        updateAcademicYear,
        deleteAcademicYear
    };
};