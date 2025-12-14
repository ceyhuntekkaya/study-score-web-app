import { useState, useCallback, useEffect } from 'react';
import {Course, CourseDetailDTO, courseDetailToCourse, CourseFormData} from '@/types/course/course';
import { courseService } from '@/services/api/course/course-service';

interface UseCourseReturn {
    courses: Course[];
    selectedCourse: Course | null;
    courseDetailDTO: CourseDetailDTO | null;
    courseDetail: CourseDetailDTO | null;
    loading: boolean;
    error: Error | null;
    fetchCourses: () => Promise<void>;
    fetchCourseById: (id: string) => Promise<void>;
    fetchCourseDetailById: (id: string) => Promise<void>;
    createCourse: (course: CourseFormData) => Promise<void>;
    updateCourse: (id: string, course: CourseFormData) => Promise<void>;
    deleteCourse: (id: string) => Promise<void>;
    fetchCourseDetail: (id: string) => Promise<void>;
}

export const useCourses = (): UseCourseReturn => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [courseDetailDTO, setCourseDetailDTO] = useState<CourseDetailDTO| null>(null);
    const [courseDetail, setCourseDetail ] = useState<CourseDetailDTO | null>(null);




    const fetchCourseDetail = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseService.getCourseById(id);
            setCourseDetail(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);


    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseService.getAllCourses();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourseById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseService.getCourseById(id);
            setSelectedCourse(courseDetailToCourse(data));
            setCourseDetailDTO(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCourse = useCallback(async (course: CourseFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseService.createCourse(course);
            await fetchCourses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourses]);

    const updateCourse = useCallback(async (id: string, course: CourseFormData) => {
        try {
            setLoading(true);
            setError(null);
            await courseService.updateCourse(id, course);
            await fetchCourses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourses]);

    const deleteCourse = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await courseService.deleteCourseById(id);
            await fetchCourses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCourses]);



    const fetchCourseDetailById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await courseService.fetchCourseDetailById(id);
            setCourseDetailDTO(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);




    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    return {
        courses,
        fetchCourseDetailById,
        selectedCourse,
        loading,
        courseDetailDTO,
        error,
        fetchCourses,
        fetchCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        fetchCourseDetail,
        courseDetail
    };
};