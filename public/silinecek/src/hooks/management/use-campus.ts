import { useState, useCallback, useEffect } from 'react';
import { Campus, CampusFormData } from '@/types/management/campus';
import { campusService } from '@/services/api/management/campus-service';

interface UseCampusReturn {
    campuses: Campus[];
    selectedCampus: Campus | null;
    loading: boolean;
    error: Error | null;
    fetchCampuses: () => Promise<void>;
    fetchCampusById: (id: string) => Promise<void>;
    createCampus: (campus: CampusFormData) => Promise<void>;
    updateCampus: (id: string, campus: CampusFormData) => Promise<void>;
    deleteCampus: (id: string) => Promise<void>;
}

export const useCampuses = (): UseCampusReturn => {
    const [campuses, setCampuses] = useState<Campus[]>([]);
    const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCampuses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await campusService.getAllCampuses();
            setCampuses(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCampusById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await campusService.getCampusById(id);
            setSelectedCampus(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCampus = useCallback(async (campus: CampusFormData) => {
        try {
            setLoading(true);
            setError(null);
            await campusService.createCampus(campus);
            await fetchCampuses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCampuses]);

    const updateCampus = useCallback(async (id: string, campus: CampusFormData) => {
        try {
            setLoading(true);
            setError(null);
            await campusService.updateCampus(id, campus);
            await fetchCampuses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCampuses]);

    const deleteCampus = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await campusService.deleteCampusById(id);
            await fetchCampuses();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCampuses]);

    useEffect(() => {
        fetchCampuses();
    }, [fetchCampuses]);

    return {
        campuses,
        selectedCampus,
        loading,
        error,
        fetchCampuses,
        fetchCampusById,
        createCampus,
        updateCampus,
        deleteCampus
    };
};