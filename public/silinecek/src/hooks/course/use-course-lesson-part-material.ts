import { useState, useCallback } from 'react';
import { CourseLessonPartMaterial, CourseLessonPartMaterialFormData } from '@/types/course/course-lesson-part-material';
import { courseLessonPartMaterialService } from '@/services/api/course/course-lesson-part-material-service';

interface UseCourseLessonPartMaterialReturn {
    courseLessonPartMaterials: CourseLessonPartMaterial[];
    selectedCourseLessonPartMaterial: CourseLessonPartMaterial | null;
    loading: boolean;
    error: Error | null;
    fetchCourseLessonPartMaterials: () => Promise<void>;
    fetchCourseLessonPartMaterialById: (id: string) => Promise<void>;
    createCourseLessonPartMaterial: (material: CourseLessonPartMaterialFormData) => Promise<void>;
    updateCourseLessonPartMaterial: (material: CourseLessonPartMaterialFormData) => Promise<void>;
    deleteCourseLessonPartMaterial: (id: string) => Promise<void>;
    fetchCourseLessonPartMaterialByCourseLessonId: (id: string) => Promise<void>;
}

export const useCourseLessonPartMaterials = (): UseCourseLessonPartMaterialReturn => {
    const [courseLessonPartMaterials, setCourseLessonPartMaterials] = useState<CourseLessonPartMaterial[]>([]);
    const [selectedCourseLessonPartMaterial, setSelectedCourseLessonPartMaterial] = useState<CourseLessonPartMaterial | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCourseLessonPartMaterials = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonPartMaterialService.getAllCourseLessonPartMaterials();
            setCourseLessonPartMaterials(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);






    const fetchCourseLessonPartMaterialByCourseLessonId = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonPartMaterialService.fetchCourseLessonPartMaterialByCourseLessonId(id);
            setCourseLessonPartMaterials(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);





    const fetchCourseLessonPartMaterialById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonPartMaterialService.getCourseLessonPartMaterialById(id);
            setSelectedCourseLessonPartMaterial(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCourseLessonPartMaterial = useCallback(async (material: CourseLessonPartMaterialFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartMaterialService.createCourseLessonPartMaterial(material);
            await fetchCourseLessonPartMaterials();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonPartMaterials]);

    const updateCourseLessonPartMaterial = useCallback(async (material: CourseLessonPartMaterialFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartMaterialService.updateCourseLessonPartMaterial(material.id || '', material);
            await fetchCourseLessonPartMaterials();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonPartMaterials]);

    const deleteCourseLessonPartMaterial = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartMaterialService.deleteCourseLessonPartMaterialById(id);
            await fetchCourseLessonPartMaterials();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonPartMaterials]);


    return {
        courseLessonPartMaterials,
        selectedCourseLessonPartMaterial,
        loading,
        error,
        fetchCourseLessonPartMaterials,
        fetchCourseLessonPartMaterialById,
        createCourseLessonPartMaterial,
        updateCourseLessonPartMaterial,
        deleteCourseLessonPartMaterial,
        fetchCourseLessonPartMaterialByCourseLessonId
    };
};