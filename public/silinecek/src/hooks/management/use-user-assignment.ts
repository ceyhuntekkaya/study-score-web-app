import { useState, useCallback, useEffect } from 'react';
import { UserAssignment, UserAssignmentFormData } from '@/types/management/user-assignment';
import { userAssignmentService } from '@/services/api/management/user-assignment-service';

interface UseUserAssignmentReturn {
    userAssignments: UserAssignment[];
    selectedUserAssignment: UserAssignment | null;
    loading: boolean;
    error: Error | null;
    fetchUserAssignments: () => Promise<void>;
    fetchUserAssignmentById: (id: string) => Promise<void>;
    createUserAssignment: (assignment: UserAssignmentFormData) => Promise<void>;
    updateUserAssignment: (id: string, assignment: UserAssignmentFormData) => Promise<void>;
    deleteUserAssignment: (id: string) => Promise<void>;
}

export const useUserAssignments = (): UseUserAssignmentReturn => {
    const [userAssignments, setUserAssignments] = useState<UserAssignment[]>([]);
    const [selectedUserAssignment, setSelectedUserAssignment] = useState<UserAssignment | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchUserAssignments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userAssignmentService.getAllUserAssignments();
            setUserAssignments(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserAssignmentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await userAssignmentService.getUserAssignmentById(id);
            setSelectedUserAssignment(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createUserAssignment = useCallback(async (assignment: UserAssignmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await userAssignmentService.createUserAssignment(assignment);
            await fetchUserAssignments();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUserAssignments]);

    const updateUserAssignment = useCallback(async (id: string, assignment: UserAssignmentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await userAssignmentService.updateUserAssignment(id, assignment);
            await fetchUserAssignments();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUserAssignments]);

    const deleteUserAssignment = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await userAssignmentService.deleteUserAssignmentById(id);
            await fetchUserAssignments();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchUserAssignments]);

    useEffect(() => {
        fetchUserAssignments();
    }, [fetchUserAssignments]);

    return {
        userAssignments,
        selectedUserAssignment,
        loading,
        error,
        fetchUserAssignments,
        fetchUserAssignmentById,
        createUserAssignment,
        updateUserAssignment,
        deleteUserAssignment
    };
};