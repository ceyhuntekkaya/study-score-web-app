import { useState, useCallback, useEffect } from 'react';
import {CourseLesson, CourseLessonDTO, CourseLessonFormData} from '@/types/course/course-lesson';
import { courseLessonService } from '@/services/api/course/course-lesson-service';

interface UseCourseLessonReturn {
    courseLessons: CourseLesson[];
    courseLessonDTOs: CourseLessonDTO[];
    selectedCourseLesson: CourseLesson | null;
    loading: boolean;
    error: Error | null;
    fetchCourseLessons: () => Promise<void>;
    fetchCourseLessonsByCourseId: (id: string) => Promise<void>;
    fetchCourseLessonById: (id: string) => Promise<void>;
    createCourseLesson: (lesson: CourseLessonFormData) => Promise<void>;
    updateCourseLesson: (lesson: CourseLessonFormData) => Promise<void>;
    deleteCourseLesson: (id: string) => Promise<void>;
}

export const useCourseLessons = (): UseCourseLessonReturn => {
    const [courseLessons, setCourseLessons] = useState<CourseLesson[]>([]);
    const [courseLessonDTOs, setCourseLessonDTOs] = useState<CourseLessonDTO[]>([]);
    const [selectedCourseLesson, setSelectedCourseLesson] = useState<CourseLesson | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCourseLessons = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonService.getAllCourseLessons();
            setCourseLessons(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourseLessonById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonService.getCourseLessonById(id);
            setSelectedCourseLesson(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);




    const fetchCourseLessonsByCourseId = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseLessonService.getAllCourseLessonsById(id);
            setCourseLessonDTOs(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);



    const createCourseLesson = useCallback(async (lesson: CourseLessonFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonService.createCourseLesson(lesson);
            await fetchCourseLessons();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessons]);

    const updateCourseLesson = useCallback(async (lesson: CourseLessonFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonService.updateCourseLesson(lesson.id || '', lesson);
            await fetchCourseLessons();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessons]);

    const deleteCourseLesson = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await courseLessonService.deleteCourseLessonById(id);
            await fetchCourseLessons();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourseLessons]);

    useEffect(() => {
        fetchCourseLessons();
    }, [fetchCourseLessons]);

    return {
        courseLessons,
        courseLessonDTOs,
        selectedCourseLesson,
        fetchCourseLessonsByCourseId,
        loading,
        error,
        fetchCourseLessons,
        fetchCourseLessonById,
        createCourseLesson,
        updateCourseLesson,
        deleteCourseLesson
    };
};