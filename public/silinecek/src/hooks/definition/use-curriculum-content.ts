import { useState, useCallback, useEffect } from 'react';
import { CurriculumContent, CurriculumContentFormData } from '@/types/definition/curriculum-content';
import { curriculumContentService } from '@/services/api/defination/curriculum-content-service';
import { ECurriculumLevel } from '@/types/enumeration';

interface UseCurriculumContentReturn {
    curriculumContents: CurriculumContent[];
    selectedCurriculumContent: CurriculumContent | null;
    loading: boolean;
    error: Error | null;
    fetchCurriculumContents: () => Promise<void>;
    fetchCurriculumContentById: (id: string) => Promise<void>;
    createCurriculumContent: (content: CurriculumContentFormData) => Promise<void>;
    updateCurriculumContent: (id: string, content: CurriculumContentFormData) => Promise<void>;
    deleteCurriculumContent: (id: string) => Promise<void>;
    updateParent: (contentId: string, parentId: string) => Promise<void>;
    findByLevel: (level: ECurriculumLevel) => Promise<void>;
    findByParentId: (parentId: string) => Promise<void>;
    findTopLevelContents: () => Promise<void>;
    addChild: (parentId: string, childData: CurriculumContentFormData) => Promise<void>;
    removeChild: (parentId: string, childId: string) => Promise<void>;
    updateOrder: (id: string, newOrder: number) => Promise<void>;
    moveContentToParent: (contentId: string, newParentId: string | null) => Promise<void>;
    checkHasChildren: (id: string) => Promise<boolean>;
}

export const useCurriculumContents = (): UseCurriculumContentReturn => {
    const [curriculumContents, setCurriculumContents] = useState<CurriculumContent[]>([]);
    const [selectedCurriculumContent, setSelectedCurriculumContent] = useState<CurriculumContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCurriculumContents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getAllCurriculumContents();
            setCurriculumContents(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCurriculumContentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.getCurriculumContentById(id);
            setSelectedCurriculumContent(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const createCurriculumContent = useCallback(async (content: CurriculumContentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.createCurriculumContent(content);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const updateCurriculumContent = useCallback(async (id: string, content: CurriculumContentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.updateCurriculumContent(id, content);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const deleteCurriculumContent = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.deleteCurriculumContentById(id);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const updateParent = useCallback(async (contentId: string, parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.updateParent(contentId, parentId);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const findByLevel = useCallback(async (level: ECurriculumLevel) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.findByLevel(level);
            setCurriculumContents(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const findByParentId = useCallback(async (parentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.findByParentId(parentId);
            setCurriculumContents(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const findTopLevelContents = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await curriculumContentService.findTopLevelContents();
            setCurriculumContents(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, []);

    const addChild = useCallback(async (parentId: string, childData: CurriculumContentFormData) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.addChild(parentId, childData);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const removeChild = useCallback(async (parentId: string, childId: string) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.removeChild(parentId, childId);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const updateOrder = useCallback(async (id: string, newOrder: number) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.updateOrder(id, newOrder);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const moveContentToParent = useCallback(async (contentId: string, newParentId: string | null) => {
        try {
            setLoading(true);
            setError(null);
            await curriculumContentService.moveContentToParent(contentId, newParentId);
            await fetchCurriculumContents();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    }, [fetchCurriculumContents]);

    const checkHasChildren = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            const hasChildren = await curriculumContentService.hasChildren(id);
            return hasChildren;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurriculumContents();
    }, [fetchCurriculumContents]);

    return {
        curriculumContents,
        selectedCurriculumContent,
        loading,
        error,
        fetchCurriculumContents,
        fetchCurriculumContentById,
        createCurriculumContent,
        updateCurriculumContent,
        deleteCurriculumContent,
        updateParent,
        findByLevel,
        findByParentId,
        findTopLevelContents,
        addChild,
        removeChild,
        updateOrder,
        moveContentToParent,
        checkHasChildren
    };
};