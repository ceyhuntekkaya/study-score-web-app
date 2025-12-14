import { useState, useCallback, useEffect } from 'react';
import { Branch, BranchFormData } from '@/types/management/branch';
import { branchService } from '@/services/api/management/branch-service';

interface UseBranchReturn {
    branches: Branch[];
    selectedBranch: Branch | null;
    loading: boolean;
    error: Error | null;
    fetchBranches: () => Promise<void>;
    fetchBranchById: (id: string) => Promise<void>;
    createBranch: (branch: BranchFormData) => Promise<void>;
    updateBranch: (id: string, branch: BranchFormData) => Promise<void>;
    deleteBranch: (id: string) => Promise<void>;
}

export const useBranches = (): UseBranchReturn => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchBranches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await branchService.getAllBranches();
            setBranches(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchBranchById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await branchService.getBranchById(id);
            setSelectedBranch(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createBranch = useCallback(async (branch: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            await branchService.createBranch(branch);
            await fetchBranches();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBranches]);

    const updateBranch = useCallback(async (id: string, branch: BranchFormData) => {
        try {
            setLoading(true);
            setError(null);
            await branchService.updateBranch(id, branch);
            await fetchBranches();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBranches]);

    const deleteBranch = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await branchService.deleteBranchById(id);
            await fetchBranches();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchBranches]);

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return {
        branches,
        selectedBranch,
        loading,
        error,
        fetchBranches,
        fetchBranchById,
        createBranch,
        updateBranch,
        deleteBranch
    };
};