import {useCallback, useEffect, useState} from 'react';
import {ESkill, ExamPartDto, PartStatisticsDto} from '@/types/exam/exam-type';
import {examPartService} from '@/services/api/exam/exam-part-service';
import {EStatus} from "@/types/enumeration";


interface PaginatedPartsResponse {
    content: ExamPartDto[];
    totalElements: number;
    totalPages: number;
}

interface UseExamPartReturn {
    examParts: ExamPartDto[];
    selectedExamPart: ExamPartDto | null;
    paginatedParts: PaginatedPartsResponse | null;
    partsByExam: ExamPartDto[];
    recentParts: ExamPartDto[];
    partsWithoutQuestions: ExamPartDto[];
    partsWithQuestions: ExamPartDto[];
    searchResults: ExamPartDto[];
    partStatistics: PartStatisticsDto | null;
    totalPartCount: number;
    skillDistribution: Record<string, number> | null;
    mostUsedParts: ExamPartDto[];
    loading: boolean;
    error: Error | null;

    // CRUD Operations
    createExamPart: (partDto: ExamPartDto) => Promise<void>;
    updateExamPart: (partId: string, partDto: ExamPartDto) => Promise<void>;
    deleteExamPart: (partId: string) => Promise<void>;
    getExamPartById: (partId: string) => Promise<void>;
    getAllParts: () => Promise<void>;
    getPartsPaginated: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;

    // Status Management
    activatePart: (partId: string) => Promise<void>;
    deactivatePart: (partId: string) => Promise<void>;

    // Utility Operations
    isPartInUse: (partId: string) => Promise<boolean>;
    existsByName: (name: string) => Promise<boolean>;
    findByName: (name: string) => Promise<void>;

    // Specialized Getters
    getRecentParts: (limit?: number) => Promise<void>;
    getPartsWithoutQuestions: () => Promise<void>;
    getPartsWithQuestions: () => Promise<void>;
    getPartsByExamId: (examId: string) => Promise<void>;

    // Part Management
    updatePartOrder: (partId: string, newOrder: number) => Promise<void>;
    assignSkill: (partId: string, skill: ESkill) => Promise<void>;
    reorderParts: (examId: string, partIds: string[]) => Promise<void>;
    reorderAllParts: (partIds: string[]) => Promise<void>;

    // Part Queries
    getPartsBySkill: (skill: ESkill) => Promise<void>;
    searchParts: (keyword: string) => Promise<void>;
    getPartsByName: (name: string) => Promise<void>;

    // Part Statistics
    getPartQuestionCount: (partId: string) => Promise<number>;
    getPartTotalPoints: (partId: string) => Promise<number>;
    getPartEstimatedDuration: (partId: string) => Promise<number>;
    getPartQuestionTypes: (partId: string) => Promise<Record<string, number>>;
    getPartStatistics: (partId: string) => Promise<void>;

    // Bulk Operations
    createMultipleParts: (partDtos: ExamPartDto[]) => Promise<void>;
    updateMultipleParts: (partDtos: ExamPartDto[]) => Promise<void>;
    deleteMultipleParts: (partIds: string[]) => Promise<void>;

    // Copy & Duplicate Operations
    duplicatePart: (partId: string, newName: string) => Promise<void>;
    duplicateMultipleParts: (partIds: string[], namePrefix?: string) => Promise<void>;

    // Analytics & Reports
    getTotalPartCount: () => Promise<void>;
    getPartDistributionBySkill: () => Promise<void>;
    getMostUsedParts: (limit?: number) => Promise<void>;

    // Reset Functions
    resetSelectedExamPart: () => void;
    resetPartsByExam: () => void;
    resetSearchResults: () => void;
    resetError: () => void;
    resetPaginatedData: () => void;

    // Utility Functions
    getPartById: (id: string) => ExamPartDto | undefined;
    getPartsByExamIdFromCache: (examId: string) => ExamPartDto[];
    hasPartsForExam: (examId: string) => boolean;
    getActivePartsCount: () => number;
    getInactivePartsCount: () => number;
    getPartsBySkillFromCache: (skill: ESkill) => ExamPartDto[];
}

export const useExamPart = (): UseExamPartReturn => {
    // State management
    const [examParts, setExamParts] = useState<ExamPartDto[]>([]);
    const [selectedExamPart, setSelectedExamPart] = useState<ExamPartDto | null>(null);
    const [paginatedParts, setPaginatedParts] = useState<PaginatedPartsResponse | null>(null);
    const [partsByExam, setPartsByExam] = useState<ExamPartDto[]>([]);
    const [recentParts, setRecentParts] = useState<ExamPartDto[]>([]);
    const [partsWithoutQuestions, setPartsWithoutQuestions] = useState<ExamPartDto[]>([]);
    const [partsWithQuestions, setPartsWithQuestions] = useState<ExamPartDto[]>([]);
    const [searchResults, setSearchResults] = useState<ExamPartDto[]>([]);
    const [partStatistics, setPartStatistics] = useState<PartStatisticsDto | null>(null);
    const [totalPartCount, setTotalPartCount] = useState<number>(0);
    const [skillDistribution, setSkillDistribution] = useState<Record<string, number> | null>(null);
    const [mostUsedParts, setMostUsedParts] = useState<ExamPartDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Helper function to update part in all relevant states
    const updatePartInStates = useCallback((updatedPart: ExamPartDto) => {
        const updateInArray = (arr: ExamPartDto[]) =>
            arr.map(part => part.id === updatedPart.id ? updatedPart : part);

        setExamParts(prev => updateInArray(prev));
        setPartsByExam(prev => updateInArray(prev));
        setRecentParts(prev => updateInArray(prev));
        setPartsWithoutQuestions(prev => updateInArray(prev));
        setPartsWithQuestions(prev => updateInArray(prev));
        setSearchResults(prev => updateInArray(prev));
        setMostUsedParts(prev => updateInArray(prev));

        if (selectedExamPart?.id === updatedPart.id) {
            setSelectedExamPart(updatedPart);
        }
    }, [selectedExamPart]);

    // Helper function to remove part from all relevant states
    const removePartFromStates = useCallback((partId: string) => {
        const removeFromArray = (arr: ExamPartDto[]) => arr.filter(part => part.id !== partId);

        setExamParts(prev => removeFromArray(prev));
        setPartsByExam(prev => removeFromArray(prev));
        setRecentParts(prev => removeFromArray(prev));
        setPartsWithoutQuestions(prev => removeFromArray(prev));
        setPartsWithQuestions(prev => removeFromArray(prev));
        setSearchResults(prev => removeFromArray(prev));
        setMostUsedParts(prev => removeFromArray(prev));

        if (selectedExamPart?.id === partId) {
            setSelectedExamPart(null);
        }
    }, [selectedExamPart]);

    // CRUD Operations
    const createExamPart = useCallback(async (partDto: ExamPartDto) => {
        try {
            setLoading(true);
            setError(null);
            const newPart = await examPartService.createExamPart(partDto);
            setExamParts(prev => [newPart, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamPart = useCallback(async (partId: string, partDto: ExamPartDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedPart = await examPartService.updateExamPart(partId, partDto);
            updatePartInStates(updatedPart);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const deleteExamPart = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            await examPartService.deleteExamPart(partId);
            removePartFromStates(partId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removePartFromStates]);

    const getExamPartById = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const part = await examPartService.getExamPartById(partId);
            setSelectedExamPart(part);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllParts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getAllParts();
            setExamParts(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartsPaginated = useCallback(async (
        page: number = 0,
        size: number = 10,
        sortBy: string = "orderNumber",
        sortDirection: string = "asc"
    ) => {
        try {
            setLoading(true);
            setError(null);
            const paginatedData = await examPartService.getPartsPaginated(page, size, sortBy, sortDirection);
            setPaginatedParts(paginatedData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Status Management
    const activatePart = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const activatedPart = await examPartService.activatePart(partId);
            updatePartInStates(activatedPart);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const deactivatePart = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const deactivatedPart = await examPartService.deactivatePart(partId);
            updatePartInStates(deactivatedPart);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    // Utility Operations
    const isPartInUse = useCallback(async (partId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.isPartInUse(partId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const existsByName = useCallback(async (name: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.existsByName(name);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const findByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const part = await examPartService.findByName(name);
            setSelectedExamPart(part);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Specialized Getters
    const getRecentParts = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getRecentParts(limit);
            setRecentParts(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartsWithoutQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getPartsWithoutQuestions();
            setPartsWithoutQuestions(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartsWithQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getPartsWithQuestions();
            setPartsWithQuestions(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartsByExamId = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getPartsByExamId(examId);
            setPartsByExam(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Part Management
    const updatePartOrder = useCallback(async (partId: string, newOrder: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedPart = await examPartService.updatePartOrder(partId, newOrder);
            updatePartInStates(updatedPart);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const assignSkill = useCallback(async (partId: string, skill: ESkill) => {
        try {
            setLoading(true);
            setError(null);
            const updatedPart = await examPartService.assignSkill(partId, skill);
            updatePartInStates(updatedPart);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const reorderParts = useCallback(async (examId: string, partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const reorderedParts = await examPartService.reorderParts(examId, partIds);
            setPartsByExam(reorderedParts);
            // Update main list as well
            reorderedParts.forEach(part => updatePartInStates(part));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const reorderAllParts = useCallback(async (partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const reorderedParts = await examPartService.reorderAllParts(partIds);
            setExamParts(reorderedParts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Part Queries
    const getPartsBySkill = useCallback(async (skill: ESkill) => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getPartsBySkill(skill);
            setExamParts(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchParts = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examPartService.searchParts(keyword);
            setSearchResults(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartsByName = useCallback(async (name: string) => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getPartsByName(name);
            setExamParts(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Part Statistics
    const getPartQuestionCount = useCallback(async (partId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.getPartQuestionCount(partId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartTotalPoints = useCallback(async (partId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.getPartTotalPoints(partId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartEstimatedDuration = useCallback(async (partId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.getPartEstimatedDuration(partId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartQuestionTypes = useCallback(async (partId: string): Promise<Record<string, number>> => {
        try {
            setLoading(true);
            setError(null);
            return await examPartService.getPartQuestionTypes(partId);
        } catch (err) {
            handleError(err);
            return {};
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartStatistics = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examPartService.getPartStatistics(partId);
            setPartStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Bulk Operations
    const createMultipleParts = useCallback(async (partDtos: ExamPartDto[]) => {
        try {
            setLoading(true);
            setError(null);
            const newParts = await examPartService.createMultipleParts(partDtos);
            setExamParts(prev => [...newParts, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateMultipleParts = useCallback(async (partDtos: ExamPartDto[]) => {
        try {
            setLoading(true);
            setError(null);
            const updatedParts = await examPartService.updateMultipleParts(partDtos);
            updatedParts.forEach(part => updatePartInStates(part));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updatePartInStates]);

    const deleteMultipleParts = useCallback(async (partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await examPartService.deleteMultipleParts(partIds);
            partIds.forEach(partId => removePartFromStates(partId));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removePartFromStates]);

    // Copy & Duplicate Operations
    const duplicatePart = useCallback(async (partId: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedPart = await examPartService.duplicatePart(partId, newName);
            setExamParts(prev => [duplicatedPart, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const duplicateMultipleParts = useCallback(async (partIds: string[], namePrefix?: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedParts = await examPartService.duplicateMultipleParts(partIds, namePrefix);
            setExamParts(prev => [...duplicatedParts, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Analytics & Reports
    const getTotalPartCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const count = await examPartService.getTotalPartCount();
            setTotalPartCount(count);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPartDistributionBySkill = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await examPartService.getPartDistributionBySkill();
            setSkillDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMostUsedParts = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const parts = await examPartService.getMostUsedParts(limit);
            setMostUsedParts(parts);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset Functions
    const resetSelectedExamPart = useCallback(() => {
        setSelectedExamPart(null);
    }, []);

    const resetPartsByExam = useCallback(() => {
        setPartsByExam([]);
    }, []);

    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetPaginatedData = useCallback(() => {
        setPaginatedParts(null);
    }, []);

    // Utility Functions
    const getPartById = useCallback((id: string): ExamPartDto | undefined => {
        return examParts.find(part => part.id === id);
    }, [examParts]);

    const getPartsByExamIdFromCache = useCallback((examId: string): ExamPartDto[] => {
        console.log(examId)
        return []; // return examParts.filter(part => part.examId === examId);
    }, [examParts]);

    const hasPartsForExam = useCallback((examId: string): boolean => {
        console.log(examId)
        return true; // examParts.some(part => part.examId === examId);
    }, [examParts]);

    const getActivePartsCount = useCallback((): number => {
        return examParts.filter(part => part.status === EStatus.ACTIVE).length;
    }, [examParts]);

    const getInactivePartsCount = useCallback((): number => {
        return examParts.filter(part => part.status === EStatus.ACTIVE).length;
    }, [examParts]);

    const getPartsBySkillFromCache = useCallback((skill: ESkill): ExamPartDto[] => {
        return examParts.filter(part => part.skill === skill);
    }, [examParts]);

    // Initial data loading
    useEffect(() => {
        getAllParts();
    }, [getAllParts]);

    return {
        // State
        examParts,
        selectedExamPart,
        paginatedParts,
        partsByExam,
        recentParts,
        partsWithoutQuestions,
        partsWithQuestions,
        searchResults,
        partStatistics,
        totalPartCount,
        skillDistribution,
        mostUsedParts,
        loading,
        error,

        // CRUD Operations
        createExamPart,
        updateExamPart,
        deleteExamPart,
        getExamPartById,
        getAllParts,
        getPartsPaginated,

        // Status Management
        activatePart,
        deactivatePart,

        // Utility Operations
        isPartInUse,
        existsByName,
        findByName,

        // Specialized Getters
        getRecentParts,
        getPartsWithoutQuestions,
        getPartsWithQuestions,
        getPartsByExamId,

        // Part Management
        updatePartOrder,
        assignSkill,
        reorderParts,
        reorderAllParts,

        // Part Queries
        getPartsBySkill,
        searchParts,
        getPartsByName,

        // Part Statistics
        getPartQuestionCount,
        getPartTotalPoints,
        getPartEstimatedDuration,
        getPartQuestionTypes,
        getPartStatistics,

        // Bulk Operations
        createMultipleParts,
        updateMultipleParts,
        deleteMultipleParts,

        // Copy & Duplicate Operations
        duplicatePart,
        duplicateMultipleParts,

        // Analytics & Reports
        getTotalPartCount,
        getPartDistributionBySkill,
        getMostUsedParts,

        // Reset Functions
        resetSelectedExamPart,
        resetPartsByExam,
        resetSearchResults,
        resetError,
        resetPaginatedData,

        // Utility Functions
        getPartById,
        getPartsByExamIdFromCache,
        hasPartsForExam,
        getActivePartsCount,
        getInactivePartsCount,
        getPartsBySkillFromCache
    };
};