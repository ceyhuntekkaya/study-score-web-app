import { useState, useCallback, useEffect } from 'react';
import { Curriculum, CurriculumFormData } from '@/types/definition/curriculum';
import { curriculumService } from '@/services/api/defination/curriculum-service';

interface UseCurriculumReturn {
    curriculums: Curriculum[];
    selectedCurriculum: Curriculum | null;
    loading: boolean;
    error: Error | null;
    fetchCurriculums: () => Promise<void>;
    fetchCurriculumById: (id: string) => Promise<void>;
    createCurriculum: (curriculum: CurriculumFormData) => Promise<void>;
    updateCurriculum: (id: string, curriculum: CurriculumFormData) => Promise<void>;
    deleteCurriculum: (id: string) => Promise<void>;
}

export const useCurriculums = (): UseCurriculumReturn => {
    const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCurriculums = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumService.getAllCurriculums();
            setCurriculums(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurriculumById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumService.getCurriculumById(id);
            setSelectedCurriculum(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCurriculum = useCallback(async (curriculum: CurriculumFormData) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumService.createCurriculum(curriculum);
            await fetchCurriculums();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculums]);

    const updateCurriculum = useCallback(async (id: string, curriculum: CurriculumFormData) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumService.updateCurriculum(id, curriculum);
            await fetchCurriculums();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculums]);

    const deleteCurriculum = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumService.deleteCurriculumById(id);
            await fetchCurriculums();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculums]);

    useEffect(() => {
        fetchCurriculums();
    }, [fetchCurriculums]);

    return {
        curriculums,
        selectedCurriculum,
        loading,
        error,
        fetchCurriculums,
        fetchCurriculumById,
        createCurriculum,
        updateCurriculum,
        deleteCurriculum
    };
};