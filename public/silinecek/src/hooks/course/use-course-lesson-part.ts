import { useState, useCallback, useEffect } from 'react';
import { CourseLessonPart, CourseLessonPartFormData } from '@/types/course/course-lesson-part';
import { courseLessonPartService } from '@/services/api/course/course-lesson-part-service';

interface UseCourseLessonPartReturn {
    courseLessonParts: CourseLessonPart[];
    selectedCourseLessonPart: CourseLessonPart | null;
    loading: boolean;
    error: Error | null;
    fetchCourseLessonParts: () => Promise<void>;
    fetchCourseLessonPartById: (id: string) => Promise<void>;
    createCourseLessonPart: (part: CourseLessonPartFormData) => Promise<void>;
    updateCourseLessonPart: (part: CourseLessonPartFormData) => Promise<void>;
    deleteCourseLessonPart: (id: string) => Promise<void>;
    updateCourseLessonPartCurriculumContents: (partId: string, curriculumContentIds: string[]) => Promise<void>;
}

export const useCourseLessonParts = (): UseCourseLessonPartReturn => {
    const [courseLessonParts, setCourseLessonParts] = useState<CourseLessonPart[]>([]);
    const [selectedCourseLessonPart, setSelectedCourseLessonPart] = useState<CourseLessonPart | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCourseLessonParts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonPartService.getAllCourseLessonParts();
            setCourseLessonParts(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourseLessonPartById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonPartService.getCourseLessonPartById(id);
            setSelectedCourseLessonPart(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCourseLessonPart = useCallback(async (part: CourseLessonPartFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartService.createCourseLessonPart(part);
            await fetchCourseLessonParts();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonParts]);

    const updateCourseLessonPart = useCallback(async (part: CourseLessonPartFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartService.updateCourseLessonPart(part.id || '', part);
            await fetchCourseLessonParts();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonParts]);

    const deleteCourseLessonPart = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartService.deleteCourseLessonPartById(id);
            await fetchCourseLessonParts();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonParts]);

    const updateCourseLessonPartCurriculumContents = useCallback(async (partId: string, curriculumContentIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonPartService.updateCourseLessonPartCurriculumContents(partId, curriculumContentIds);
            await fetchCourseLessonParts();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessonParts]);

    useEffect(() => {
        fetchCourseLessonParts();
    }, [fetchCourseLessonParts]);

    return {
        courseLessonParts,
        selectedCourseLessonPart,
        loading,
        error,
        fetchCourseLessonParts,
        fetchCourseLessonPartById,
        createCourseLessonPart,
        updateCourseLessonPart,
        deleteCourseLessonPart,
        updateCourseLessonPartCurriculumContents
    };
};