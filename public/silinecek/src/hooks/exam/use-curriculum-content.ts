import { useState, useCallback } from 'react';
import { CurriculumContentDto } from '@/types/exam/exam-type';
import { ECurriculumLevel } from '@/types/enumeration';
import {ContentDistribution, curriculumContentService} from '@/services/api/exam/curriculum-content-service';

interface UseCurriculumContentReturn {
    contents: CurriculumContentDto[];
    selectedContent: CurriculumContentDto | null;
    contentChildren: CurriculumContentDto[];
    contentParent: CurriculumContentDto | null;
    contentHierarchy: CurriculumContentDto[];
    rootContents: CurriculumContentDto[];
    contentPath: CurriculumContentDto[];
    searchResults: CurriculumContentDto[];
    contentDistribution: ContentDistribution | null;
    totalCount: number;
    maxDepth: number;
    loading: boolean;
    error: Error | null;

    // CRUD Operations
    createContent: (contentDto: CurriculumContentDto) => Promise<void>;
    updateContent: (contentId: string, contentDto: CurriculumContentDto) => Promise<void>;
    getContentById: (contentId: string) => Promise<void>;
    getContentsByCurriculumId: (curriculumId: string) => Promise<void>;
    getContentsByLevel: (level: ECurriculumLevel) => Promise<void>;
    getContentsByCurriculumAndLevel: (curriculumId: string, level: ECurriculumLevel) => Promise<void>;
    deleteContent: (contentId: string) => Promise<void>;

    // Hierarchy Management
    addChildContent: (parentId: string, childDto: CurriculumContentDto) => Promise<void>;
    removeChildContent: (parentId: string, childId: string) => Promise<void>;
    getChildrenContents: (parentId: string) => Promise<void>;
    getParentContent: (contentId: string) => Promise<void>;
    getContentHierarchy: (curriculumId: string) => Promise<void>;
    getRootContents: (curriculumId: string) => Promise<void>;
    getContentsByParent: (parentId: string) => Promise<void>;

    // Content Management
    updateContentOrder: (contentId: string, newOrder: number) => Promise<void>;
    reorderContents: (parentId: string, contentIds: string[]) => Promise<void>;
    moveContent: (contentId: string, newParentId?: string) => Promise<void>;

    // Search & Navigation
    searchContents: (keyword: string) => Promise<void>;
    searchContentsByCurriculum: (curriculumId: string, keyword: string) => Promise<void>;
    getContentsByCode: (code: string) => Promise<void>;
    getContentPath: (contentId: string) => Promise<void>;
    findContentByPath: (pathString: string) => Promise<void>;

    // Analytics & Statistics
    getTotalContentCount: () => Promise<void>;
    getContentCountByCurriculum: (curriculumId: string) => Promise<number>;
    getContentCountByLevel: (level: ECurriculumLevel) => Promise<number>;
    getContentDistributionByLevel: (curriculumId: string) => Promise<void>;
    getMaxDepth: (curriculumId: string) => Promise<void>;

    // Utility Operations
    isContentInUse: (contentId: string) => Promise<boolean>;

    // Reset functions
    resetSearchResults: () => void;
    resetSelectedContent: () => void;
    resetError: () => void;
}

export const useCurriculumContent = (): UseCurriculumContentReturn => {
    // State management
    const [contents, setContents] = useState<CurriculumContentDto[]>([]);
    const [selectedContent, setSelectedContent] = useState<CurriculumContentDto | null>(null);
    const [contentChildren, setContentChildren] = useState<CurriculumContentDto[]>([]);
    const [contentParent, setContentParent] = useState<CurriculumContentDto | null>(null);
    const [contentHierarchy, setContentHierarchy] = useState<CurriculumContentDto[]>([]);
    const [rootContents, setRootContents] = useState<CurriculumContentDto[]>([]);
    const [contentPath, setContentPath] = useState<CurriculumContentDto[]>([]);
    const [searchResults, setSearchResults] = useState<CurriculumContentDto[]>([]);
    const [contentDistribution, setContentDistribution] = useState<ContentDistribution | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [maxDepth, setMaxDepth] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // CRUD Operations
    const createContent = useCallback(async (contentDto: CurriculumContentDto) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.createContent(contentDto);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateContent = useCallback(async (contentId: string, contentDto: CurriculumContentDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedContent = await curriculumContentService.updateContent(contentId, contentDto);
            setSelectedContent(updatedContent);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentById = useCallback(async (contentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentById(contentId);
            setSelectedContent(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentsByCurriculumId = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentsByCurriculumId(curriculumId);
            setContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentsByLevel = useCallback(async (level: ECurriculumLevel) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentsByLevel(level);
            setContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentsByCurriculumAndLevel = useCallback(async (curriculumId: string, level: ECurriculumLevel) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentsByCurriculumAndLevel(curriculumId, level);
            setContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteContent = useCallback(async (contentId: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.deleteContent(contentId);
            setContents(prev => prev.filter(content => content.id !== contentId));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hierarchy Management
    const addChildContent = useCallback(async (parentId: string, childDto: CurriculumContentDto) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.addChildContent(parentId, childDto);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeChildContent = useCallback(async (parentId: string, childId: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.removeChildContent(parentId, childId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getChildrenContents = useCallback(async (parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getChildrenContents(parentId);
            setContentChildren(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getParentContent = useCallback(async (contentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getParentContent(contentId);
            setContentParent(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentHierarchy = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentHierarchy(curriculumId);
            setContentHierarchy(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRootContents = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getRootContents(curriculumId);
            setRootContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentsByParent = useCallback(async (parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentsByParent(parentId);
            setContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Content Management
    const updateContentOrder = useCallback(async (contentId: string, newOrder: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedContent = await curriculumContentService.updateContentOrder(contentId, newOrder);
            setSelectedContent(updatedContent);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const reorderContents = useCallback(async (parentId: string, contentIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const reorderedContents = await curriculumContentService.reorderContents(parentId, contentIds);
            setContents(reorderedContents);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const moveContent = useCallback(async (contentId: string, newParentId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const movedContent = await curriculumContentService.moveContent(contentId, newParentId);
            setSelectedContent(movedContent);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search & Navigation
    const searchContents = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.searchContents(keyword);
            setSearchResults(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchContentsByCurriculum = useCallback(async (curriculumId: string, keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.searchContentsByCurriculum(curriculumId, keyword);
            setSearchResults(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentsByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentsByCode(code);
            setContents(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentPath = useCallback(async (contentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getContentPath(contentId);
            setContentPath(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const findContentByPath = useCallback(async (pathString: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.findContentByPath(pathString);
            setSelectedContent(data);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Analytics & Statistics
    const getTotalContentCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const count = await curriculumContentService.getTotalContentCount();
            setTotalCount(count);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentCountByCurriculum = useCallback(async (curriculumId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumContentService.getContentCountByCurriculum(curriculumId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentCountByLevel = useCallback(async (level: ECurriculumLevel): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumContentService.getContentCountByLevel(level);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getContentDistributionByLevel = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await curriculumContentService.getContentDistributionByLevel(curriculumId);
            setContentDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMaxDepth = useCallback(async (curriculumId: string) => {
        try {
            setLoading(true);
            setError(null);
            const depth = await curriculumContentService.getMaxDepth(curriculumId);
            setMaxDepth(depth);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Utility Operations
    const isContentInUse = useCallback(async (contentId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await curriculumContentService.isContentInUse(contentId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset functions
    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetSelectedContent = useCallback(() => {
        setSelectedContent(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        // State
        contents,
        selectedContent,
        contentChildren,
        contentParent,
        contentHierarchy,
        rootContents,
        contentPath,
        searchResults,
        contentDistribution,
        totalCount,
        maxDepth,
        loading,
        error,

        // CRUD Operations
        createContent,
        updateContent,
        getContentById,
        getContentsByCurriculumId,
        getContentsByLevel,
        getContentsByCurriculumAndLevel,
        deleteContent,

        // Hierarchy Management
        addChildContent,
        removeChildContent,
        getChildrenContents,
        getParentContent,
        getContentHierarchy,
        getRootContents,
        getContentsByParent,

        // Content Management
        updateContentOrder,
        reorderContents,
        moveContent,

        // Search & Navigation
        searchContents,
        searchContentsByCurriculum,
        getContentsByCode,
        getContentPath,
        findContentByPath,

        // Analytics & Statistics
        getTotalContentCount,
        getContentCountByCurriculum,
        getContentCountByLevel,
        getContentDistributionByLevel,
        getMaxDepth,

        // Utility Operations
        isContentInUse,

        // Reset functions
        resetSearchResults,
        resetSelectedContent,
        resetError
    };
};