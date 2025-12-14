import { useState, useCallback, useEffect } from 'react';
import { CurriculumDto, CurriculumFilterDto } from '@/types/exam/exam-type';
import { ECourseCategory } from '@/types/enumeration';
import {curriculumService, PaginatedResponse, PaginationParams} from '@/services/api/exam/curriculum-service';


interface UseCurriculumReturn {
    curriculums: CurriculumDto[];
    selectedCurriculum: CurriculumDto | null;
    paginatedCurriculums: PaginatedResponse<CurriculumDto> | null;
    curriculumVersions: CurriculumDto[];
    searchResults: CurriculumDto[];
    recentCurriculums: CurriculumDto[];
    recentlyUpdated: CurriculumDto[];
    activeCurriculums: CurriculumDto[];
    inactiveCurriculums: CurriculumDto[];
    totalCount: number;
    loading: boolean;
    error: Error | null;

    // CRUD Operations
    createCurriculum: (curriculumDto: CurriculumDto) => Promise<void>;
    updateCurriculum: (curriculumId: string, curriculumDto: CurriculumDto) => Promise<void>;
    getCurriculumById: (curriculumId: string) => Promise<void>;
    getAllCurriculums: () => Promise<void>;
    getCurriculumsByCategory: (category: ECourseCategory) => Promise<void>;
    getCurriculumsPaginated: (params?: PaginationParams) => Promise<void>;
    deleteCurriculum: (curriculumId: string) => Promise<void>;

    // Version Management
    createNewVersion: (curriculumId: string) => Promise<void>;
    getCurriculumVersions: (baseName: string, category: ECourseCategory) => Promise<void>;
    getLatestVersion: (baseName: string, category: ECourseCategory) => Promise<void>;
    revertToVersion: (curriculumId: string, version: number) => Promise<void>;

    // Search & Filter Operations
    searchCurriculums: (keyword: string) => Promise<void>;
    searchCurriculumsPaginated: (keyword: string, params?: PaginationParams) => Promise<void>;
    filterCurriculums: (filter: CurriculumFilterDto) => Promise<void>;

    // Management Operations
    activateCurriculum: (curriculumId: string) => Promise<void>;
    deactivateCurriculum: (curriculumId: string) => Promise<void>;
    duplicateCurriculum: (curriculumId: string, newName: string) => Promise<void>;

    // Analytics Operations
    getTotalCurriculumCount: () => Promise<void>;
    getCurriculumCountByCategory: (category: ECourseCategory) => Promise<number>;
    getRecentCurriculums: (limit?: number) => Promise<void>;
    getMostRecentlyUpdated: (limit?: number) => Promise<void>;

    // Utility Operations
    existsByName: (name: string, category: ECourseCategory) => Promise<boolean>;
    findByNameAndCategory: (name: string, category: ECourseCategory) => Promise<CurriculumDto | null>;
    isCurriculumInUse: (curriculumId: string) => Promise<boolean>;

    // Helper Operations
    getCurriculumsByFilters: (filters: {
        category?: ECourseCategory;
        isActive?: boolean;
        keyword?: string;
        limit?: number;
    }) => Promise<void>;
    getActiveCurriculums: () => Promise<void>;
    getInactiveCurriculums: () => Promise<void>;

    // Reset Functions
    resetSearchResults: () => void;
    resetSelectedCurriculum: () => void;
    resetError: () => void;
    resetPaginatedData: () => void;
}

export const useCurriculum = (): UseCurriculumReturn => {
    // State management
    const [curriculums, setCurriculums] = useState<CurriculumDto[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumDto | null>(null);
    const [paginatedCurriculums, setPaginatedCurriculums] = useState<PaginatedResponse<CurriculumDto> | null>(null);
    const [curriculumVersions, setCurriculumVersions] = useState<CurriculumDto[]>([]);
    const [searchResults, setSearchResults] = useState<CurriculumDto[]>([]);
    const [recentCurriculums, setRecentCurriculums] = useState<CurriculumDto[]>([]);
    const [recentlyUpdated, setRecentlyUpdated] = useState<CurriculumDto[]>([]);
    const [activeCurriculums, setActiveCurriculums] = useState<CurriculumDto[]>([]);
    const [inactiveCurriculums, setInactiveCurriculums] = useState<CurriculumDto[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // CRUD Operations
    const createCurriculum = useCallback(async (curriculumDto: CurriculumDto) => {
        try {
            setLoading(true);
            setError(null);
            const newCurriculum = await curriculumService.createCurriculum(curriculumDto);
            setCurriculums(prev => [newCurriculum, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCurriculum = useCallback(async (curriculumId: string, curriculumDto: CurriculumDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedCurriculum = await curriculumService.updateCurriculum(curriculumId, curriculumDto);
            setSelectedCurriculum(updatedCurriculum);
            setCurriculums(prev => prev.map(curriculum =>
                curriculum.id === curriculumId ? updatedCurriculum : curriculum
            ));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumById = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const curriculum = await curriculumService.getCurriculumById(curriculumId);
            setSelectedCurriculum(curriculum);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllCurriculums = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumService.getAllCurriculums();
            setCurriculums(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumsByCategory = useCallback(async (category: ECourseCategory) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumService.getCurriculumsByCategory(category);
            setCurriculums(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumsPaginated = useCallback(async (params: PaginationParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumService.getCurriculumsPaginated(params);
            setPaginatedCurriculums(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCurriculum = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumService.deleteCurriculum(curriculumId);
            setCurriculums(prev => prev.filter(curriculum => curriculum.id !== curriculumId));
            if (selectedCurriculum?.id === curriculumId) {
                setSelectedCurriculum(null);
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [selectedCurriculum]);

    // Version Management
    const createNewVersion = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const newVersion = await curriculumService.createNewVersion(curriculumId);
            setSelectedCurriculum(newVersion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumVersions = useCallback(async (baseName: string, category: ECourseCategory) => {
        try {
            setLoading(true);
            setError(null);
            const versions = await curriculumService.getCurriculumVersions(baseName, category);
            setCurriculumVersions(versions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getLatestVersion = useCallback(async (baseName: string, category: ECourseCategory) => {
        try {
            setLoading(true);
            setError(null);
            const latestVersion = await curriculumService.getLatestVersion(baseName, category);
            setSelectedCurriculum(latestVersion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const revertToVersion = useCallback(async (curriculumId: string, version: number) => {
        try {
            setLoading(true);
            setError(null);
            const revertedCurriculum = await curriculumService.revertToVersion(curriculumId, version);
            setSelectedCurriculum(revertedCurriculum);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search & Filter Operations
    const searchCurriculums = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const results = await curriculumService.searchCurriculums(keyword);
            setSearchResults(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchCurriculumsPaginated = useCallback(async (keyword: string, params: PaginationParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const results = await curriculumService.searchCurriculumsPaginated(keyword, params);
            setPaginatedCurriculums(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterCurriculums = useCallback(async (filter: CurriculumFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const results = await curriculumService.filterCurriculums(filter);
            setCurriculums(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Management Operations
    const activateCurriculum = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const activatedCurriculum = await curriculumService.activateCurriculum(curriculumId);
            setSelectedCurriculum(activatedCurriculum);
            setCurriculums(prev => prev.map(curriculum =>
                curriculum.id === curriculumId ? activatedCurriculum : curriculum
            ));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deactivateCurriculum = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const deactivatedCurriculum = await curriculumService.deactivateCurriculum(curriculumId);
            setSelectedCurriculum(deactivatedCurriculum);
            setCurriculums(prev => prev.map(curriculum =>
                curriculum.id === curriculumId ? deactivatedCurriculum : curriculum
            ));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateCurriculum = useCallback(async (curriculumId: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedCurriculum = await curriculumService.duplicateCurriculum(curriculumId, newName);
            setCurriculums(prev => [duplicatedCurriculum, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Analytics Operations
    const getTotalCurriculumCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const count = await curriculumService.getTotalCurriculumCount();
            setTotalCount(count);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurriculumCountByCategory = useCallback(async (category: ECourseCategory): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumService.getCurriculumCountByCategory(category);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentCurriculums = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const recent = await curriculumService.getRecentCurriculums(limit);
            setRecentCurriculums(recent);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMostRecentlyUpdated = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const updated = await curriculumService.getMostRecentlyUpdated(limit);
            setRecentlyUpdated(updated);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Utility Operations
    const existsByName = useCallback(async (name: string, category: ECourseCategory): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumService.existsByName(name, category);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const findByNameAndCategory = useCallback(async (name: string, category: ECourseCategory): Promise<CurriculumDto | null> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumService.findByNameAndCategory(name, category);
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const isCurriculumInUse = useCallback(async (curriculumId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumService.isCurriculumInUse(curriculumId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Helper Operations
    const getCurriculumsByFilters = useCallback(async (filters: {
        category?: ECourseCategory;
        isActive?: boolean;
        keyword?: string;
        limit?: number;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const results = await curriculumService.getCurriculumsByFilters(filters);
            setCurriculums(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveCurriculums = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const active = await curriculumService.getActiveCurriculums();
            setActiveCurriculums(active);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getInactiveCurriculums = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const inactive = await curriculumService.getInactiveCurriculums();
            setInactiveCurriculums(inactive);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset Functions
    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetSelectedCurriculum = useCallback(() => {
        setSelectedCurriculum(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetPaginatedData = useCallback(() => {
        setPaginatedCurriculums(null);
    }, []);

    // Initial data loading
    useEffect(() => {
        getAllCurriculums();
    }, [getAllCurriculums]);

    return {
        // State
        curriculums,
        selectedCurriculum,
        paginatedCurriculums,
        curriculumVersions,
        searchResults,
        recentCurriculums,
        recentlyUpdated,
        activeCurriculums,
        inactiveCurriculums,
        totalCount,
        loading,
        error,

        // CRUD Operations
        createCurriculum,
        updateCurriculum,
        getCurriculumById,
        getAllCurriculums,
        getCurriculumsByCategory,
        getCurriculumsPaginated,
        deleteCurriculum,

        // Version Management
        createNewVersion,
        getCurriculumVersions,
        getLatestVersion,
        revertToVersion,

        // Search & Filter Operations
        searchCurriculums,
        searchCurriculumsPaginated,
        filterCurriculums,

        // Management Operations
        activateCurriculum,
        deactivateCurriculum,
        duplicateCurriculum,

        // Analytics Operations
        getTotalCurriculumCount,
        getCurriculumCountByCategory,
        getRecentCurriculums,
        getMostRecentlyUpdated,

        // Utility Operations
        existsByName,
        findByNameAndCategory,
        isCurriculumInUse,

        // Helper Operations
        getCurriculumsByFilters,
        getActiveCurriculums,
        getInactiveCurriculums,

        // Reset Functions
        resetSearchResults,
        resetSelectedCurriculum,
        resetError,
        resetPaginatedData
    };
};