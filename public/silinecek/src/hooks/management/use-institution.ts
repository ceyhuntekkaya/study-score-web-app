import { useState, useCallback, useEffect } from 'react';
import { Institution, InstitutionFormData } from '@/types/management/institution';
import { institutionService } from '@/services/api/management/institution-service';

interface UseInstitutionReturn {
    institutions: Institution[];
    selectedInstitution: Institution | null;
    loading: boolean;
    error: Error | null;
    fetchInstitutions: () => Promise<void>;
    fetchInstitutionById: (id: string) => Promise<void>;
    createInstitution: (institution: InstitutionFormData) => Promise<void>;
    updateInstitution: (id: string, institution: InstitutionFormData) => Promise<void>;
    deleteInstitution: (id: string) => Promise<void>;
}

export const useInstitutions = (): UseInstitutionReturn => {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchInstitutions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await institutionService.getAllInstitutions();
            setInstitutions(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchInstitutionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await institutionService.getInstitutionById(id);
            setSelectedInstitution(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createInstitution = useCallback(async (institution: InstitutionFormData) => {
        try {
            setLoading(true);
            setError(null);
            await institutionService.createInstitution(institution);
            await fetchInstitutions();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchInstitutions]);

    const updateInstitution = useCallback(async (id: string, institution: InstitutionFormData) => {
        try {
            setLoading(true);
            setError(null);
            await institutionService.updateInstitution(id, institution);
            await fetchInstitutions();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchInstitutions]);

    const deleteInstitution = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await institutionService.deleteInstitutionById(id);
            await fetchInstitutions();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchInstitutions]);

    useEffect(() => {
        fetchInstitutions();
    }, [fetchInstitutions]);

    return {
        institutions,
        selectedInstitution,
        loading,
        error,
        fetchInstitutions,
        fetchInstitutionById,
        createInstitution,
        updateInstitution,
        deleteInstitution
    };
};