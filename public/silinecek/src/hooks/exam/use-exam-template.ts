import { useState, useCallback, useEffect } from 'react';
import {
    BaseQuestionTemplateDto,
    MultipleChoiceTemplateDto,
    TrueFalseTemplateDto,
    FillInTheBlanksTemplateDto,
    ShortAnswerTemplateDto,
    MatchingTemplateDto,
    EssayTemplateDto,
    OrderingTemplateDto,
    MultipleResponseTemplateDto,
    HotSpotTemplateDto,
    DragAndDropTemplateDto,
    AudioResponseTemplateDto,
    VideoResponseTemplateDto,
    ImageResponseTemplateDto,
    TemplateFilterDto,
    TemplateUsageStatsDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';
import { examTemplateService } from '@/services/api/exam/exam-template-service';

interface UseExamTemplateReturn {
    templates: BaseQuestionTemplateDto[];
    selectedTemplate: BaseQuestionTemplateDto | null;
    templatesByType: BaseQuestionTemplateDto[];
    templatesByCreator: BaseQuestionTemplateDto[];
    templatesBySubject: BaseQuestionTemplateDto[];
    templatesByDifficulty: BaseQuestionTemplateDto[];
    searchResults: BaseQuestionTemplateDto[];
    recentTemplates: BaseQuestionTemplateDto[];
    mostUsedTemplates: BaseQuestionTemplateDto[];
    templateMap: Record<string, BaseQuestionTemplateDto> | null;
    templateUsageStats: TemplateUsageStatsDto | null;
    typeStatistics: Record<string, number> | null;
    validationErrors: string[];
    isValidTemplate: boolean | null;
    isTemplateInUse: boolean | null;
    examsUsingTemplate: string[];
    loading: boolean;
    error: Error | null;

    // Generic Template Operations
    createTemplate: (templateDto: BaseQuestionTemplateDto) => Promise<void>;
    updateTemplate: (templateId: string, templateDto: BaseQuestionTemplateDto) => Promise<void>;
    getTemplateById: (templateId: string) => Promise<void>;
    getTemplateByIdAndType: (templateId: string, type: EQuestionTemplateType) => Promise<void>;
    getAllTemplates: () => Promise<void>;
    getTemplatesByType: (type: EQuestionTemplateType) => Promise<void>;
    deleteTemplate: (templateId: string) => Promise<void>;

    // Template Management
    activateTemplate: (templateId: string) => Promise<void>;
    deactivateTemplate: (templateId: string) => Promise<void>;
    duplicateTemplate: (templateId: string, newTitle: string) => Promise<void>;
    getTemplateMap: (templateIds: string[]) => Promise<void>;

    // Template Validation
    validateTemplate: (templateId: string) => Promise<void>;
    getTemplateValidationErrors: (templateId: string) => Promise<void>;
    checkTemplateInUse: (templateId: string) => Promise<void>;
    getExamsUsingTemplate: (templateId: string) => Promise<void>;

    // Search & Filter
    searchTemplates: (keyword: string) => Promise<void>;
    filterTemplates: (filter: TemplateFilterDto) => Promise<void>;
    getTemplatesBySubject: (subject: string) => Promise<void>;
    getTemplatesByDifficulty: (difficulty: string) => Promise<void>;
    getTemplatesByCreator: (userId: string) => Promise<void>;

    // Specific Template Type Operations
    createMultipleChoiceTemplate: (dto: MultipleChoiceTemplateDto) => Promise<void>;
    createTrueFalseTemplate: (dto: TrueFalseTemplateDto) => Promise<void>;
    createFillInTheBlanksTemplate: (dto: FillInTheBlanksTemplateDto) => Promise<void>;
    createShortAnswerTemplate: (dto: ShortAnswerTemplateDto) => Promise<void>;
    createMatchingTemplate: (dto: MatchingTemplateDto) => Promise<void>;
    createEssayTemplate: (dto: EssayTemplateDto) => Promise<void>;
    createOrderingTemplate: (dto: OrderingTemplateDto) => Promise<void>;
    createMultipleResponseTemplate: (dto: MultipleResponseTemplateDto) => Promise<void>;
    createHotSpotTemplate: (dto: HotSpotTemplateDto) => Promise<void>;
    createDragAndDropTemplate: (dto: DragAndDropTemplateDto) => Promise<void>;
    createAudioResponseTemplate: (dto: AudioResponseTemplateDto) => Promise<void>;
    createVideoResponseTemplate: (dto: VideoResponseTemplateDto) => Promise<void>;
    createImageResponseTemplate: (dto: ImageResponseTemplateDto) => Promise<void>;

    // Template Analytics
    getTemplateTypeStatistics: () => Promise<void>;
    getMostUsedTemplates: (limit?: number) => Promise<void>;
    getRecentTemplates: (limit?: number) => Promise<void>;
    getTemplateUsageStats: (templateId: string) => Promise<void>;

    // Reset Functions
    resetSelectedTemplate: () => void;
    resetTemplatesByType: () => void;
    resetTemplatesByCreator: () => void;
    resetSearchResults: () => void;
    resetValidation: () => void;
    resetUsageStats: () => void;
    resetError: () => void;
    resetAll: () => void;

    // Utility Functions
    getTemplateByIdFromCache: (id: string) => BaseQuestionTemplateDto | undefined;
    getTemplatesByTypeFromCache: (type: EQuestionTemplateType) => BaseQuestionTemplateDto[];
    getActiveTemplatesCount: () => number;
    getInactiveTemplatesCount: () => number;
    getTemplatesBySubjectFromCache: (subject: string) => BaseQuestionTemplateDto[];
    getTemplatesByDifficultyFromCache: (difficulty: string) => BaseQuestionTemplateDto[];
    hasTemplatesOfType: (type: EQuestionTemplateType) => boolean;
    getTemplateTypesInUse: () => EQuestionTemplateType[];
    getTemplatesCreatedInRange: (startDate: Date, endDate: Date) => BaseQuestionTemplateDto[];
    calculateTemplateComplexityScore: (templateId: string) => number;
    isTemplateComplete: (templateId: string) => boolean;
    canDeleteTemplate: (templateId: string) => boolean;
}

export const useExamTemplate = (): UseExamTemplateReturn => {
    // State management
    const [templates, setTemplates] = useState<BaseQuestionTemplateDto[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<BaseQuestionTemplateDto | null>(null);
    const [templatesByType, setTemplatesByType] = useState<BaseQuestionTemplateDto[]>([]);
    const [templatesByCreator, setTemplatesByCreator] = useState<BaseQuestionTemplateDto[]>([]);
    const [templatesBySubject, setTemplatesBySubject] = useState<BaseQuestionTemplateDto[]>([]);
    const [templatesByDifficulty, setTemplatesByDifficulty] = useState<BaseQuestionTemplateDto[]>([]);
    const [searchResults, setSearchResults] = useState<BaseQuestionTemplateDto[]>([]);
    const [recentTemplates, setRecentTemplates] = useState<BaseQuestionTemplateDto[]>([]);
    const [mostUsedTemplates, setMostUsedTemplates] = useState<BaseQuestionTemplateDto[]>([]);
    const [templateMap, setTemplateMap] = useState<Record<string, BaseQuestionTemplateDto> | null>(null);
    const [templateUsageStats, setTemplateUsageStats] = useState<TemplateUsageStatsDto | null>(null);
    const [typeStatistics, setTypeStatistics] = useState<Record<string, number> | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isValidTemplate, setIsValidTemplate] = useState<boolean | null>(null);
    const [isTemplateInUse, setIsTemplateInUse] = useState<boolean | null>(null);
    const [examsUsingTemplate, setExamsUsingTemplate] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Helper function to update template in all relevant states
    const updateTemplateInStates = useCallback((updatedTemplate: BaseQuestionTemplateDto) => {
        const updateInArray = (arr: BaseQuestionTemplateDto[]) =>
            arr.map(template => template.id === updatedTemplate.id ? updatedTemplate : template);

        setTemplates(prev => updateInArray(prev));
        setTemplatesByType(prev => updateInArray(prev));
        setTemplatesByCreator(prev => updateInArray(prev));
        setTemplatesBySubject(prev => updateInArray(prev));
        setTemplatesByDifficulty(prev => updateInArray(prev));
        setSearchResults(prev => updateInArray(prev));
        setRecentTemplates(prev => updateInArray(prev));
        setMostUsedTemplates(prev => updateInArray(prev));

        if (selectedTemplate?.id === updatedTemplate.id) {
            setSelectedTemplate(updatedTemplate);
        }

        // Update template map if it exists
        if (templateMap && templateMap[updatedTemplate.id]) {
            setTemplateMap(prev => ({
                ...prev,
                [updatedTemplate.id]: updatedTemplate
            }));
        }
    }, [selectedTemplate, templateMap]);

    // Helper function to remove template from all relevant states
    const removeTemplateFromStates = useCallback((templateId: string) => {
        const removeFromArray = (arr: BaseQuestionTemplateDto[]) =>
            arr.filter(template => template.id !== templateId);

        setTemplates(prev => removeFromArray(prev));
        setTemplatesByType(prev => removeFromArray(prev));
        setTemplatesByCreator(prev => removeFromArray(prev));
        setTemplatesBySubject(prev => removeFromArray(prev));
        setTemplatesByDifficulty(prev => removeFromArray(prev));
        setSearchResults(prev => removeFromArray(prev));
        setRecentTemplates(prev => removeFromArray(prev));
        setMostUsedTemplates(prev => removeFromArray(prev));

        if (selectedTemplate?.id === templateId) {
            setSelectedTemplate(null);
        }

        // Remove from template map if it exists
        if (templateMap && templateMap[templateId]) {
            setTemplateMap(prev => {
                const newMap = { ...prev };
                delete newMap[templateId];
                return newMap;
            });
        }
    }, [selectedTemplate, templateMap]);

    // Generic Template Operations
    const createTemplate = useCallback(async (templateDto: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createTemplate(templateDto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplate = useCallback(async (templateId: string, templateDto: BaseQuestionTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedTemplate = await examTemplateService.updateTemplate(templateId, templateDto);
            updateTemplateInStates(updatedTemplate);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateTemplateInStates]);

    const getTemplateById = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const template = await examTemplateService.getTemplateById(templateId);
            setSelectedTemplate(template);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateByIdAndType = useCallback(async (templateId: string, type: EQuestionTemplateType) => {
        try {
            setLoading(true);
            setError(null);
            const template = await examTemplateService.getTemplateByIdAndType(templateId, type);
            setSelectedTemplate(template);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllTemplates = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getAllTemplates();
            setTemplates(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByType = useCallback(async (type: EQuestionTemplateType) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getTemplatesByType(type);
            setTemplatesByType(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            await examTemplateService.deleteTemplate(templateId);
            removeTemplateFromStates(templateId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeTemplateFromStates]);

    // Template Management
    const activateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const activatedTemplate = await examTemplateService.activateTemplate(templateId);
            updateTemplateInStates(activatedTemplate);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateTemplateInStates]);

    const deactivateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const deactivatedTemplate = await examTemplateService.deactivateTemplate(templateId);
            updateTemplateInStates(deactivatedTemplate);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateTemplateInStates]);

    const duplicateTemplate = useCallback(async (templateId: string, newTitle: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedTemplate = await examTemplateService.duplicateTemplate(templateId, newTitle);
            setTemplates(prev => [duplicatedTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateMap = useCallback(async (templateIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const map = await examTemplateService.getTemplateMap(templateIds);
            setTemplateMap(map);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Template Validation
    const validateTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const isValid = await examTemplateService.validateTemplate(templateId);
            setIsValidTemplate(isValid);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateValidationErrors = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const errors = await examTemplateService.getTemplateValidationErrors(templateId);
            setValidationErrors(errors);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const checkTemplateInUse = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const inUse = await examTemplateService.isTemplateInUse(templateId);
            setIsTemplateInUse(inUse);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsUsingTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const examIds = await examTemplateService.getExamsUsingTemplate(templateId);
            setExamsUsingTemplate(examIds);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search & Filter
    const searchTemplates = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examTemplateService.searchTemplates(keyword);
            setSearchResults(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterTemplates = useCallback(async (filter: TemplateFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examTemplateService.filterTemplates(filter);
            setTemplates(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesBySubject = useCallback(async (subject: string) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getTemplatesBySubject(subject);
            setTemplatesBySubject(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByDifficulty = useCallback(async (difficulty: string) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getTemplatesByDifficulty(difficulty);
            setTemplatesByDifficulty(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplatesByCreator = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getTemplatesByCreator(userId);
            setTemplatesByCreator(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Specific Template Type Operations
    const createMultipleChoiceTemplate = useCallback(async (dto: MultipleChoiceTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createMultipleChoiceTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createTrueFalseTemplate = useCallback(async (dto: TrueFalseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createTrueFalseTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createFillInTheBlanksTemplate = useCallback(async (dto: FillInTheBlanksTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createFillInTheBlanksTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createShortAnswerTemplate = useCallback(async (dto: ShortAnswerTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createShortAnswerTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createMatchingTemplate = useCallback(async (dto: MatchingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createMatchingTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createEssayTemplate = useCallback(async (dto: EssayTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createEssayTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createOrderingTemplate = useCallback(async (dto: OrderingTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createOrderingTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createMultipleResponseTemplate = useCallback(async (dto: MultipleResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createMultipleResponseTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createHotSpotTemplate = useCallback(async (dto: HotSpotTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createHotSpotTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createDragAndDropTemplate = useCallback(async (dto: DragAndDropTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createDragAndDropTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createAudioResponseTemplate = useCallback(async (dto: AudioResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createAudioResponseTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createVideoResponseTemplate = useCallback(async (dto: VideoResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createVideoResponseTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createImageResponseTemplate = useCallback(async (dto: ImageResponseTemplateDto) => {
        try {
            setLoading(true);
            setError(null);
            const newTemplate = await examTemplateService.createImageResponseTemplate(dto);
            setTemplates(prev => [newTemplate, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Template Analytics
    const getTemplateTypeStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examTemplateService.getTemplateTypeStatistics();
            setTypeStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMostUsedTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getMostUsedTemplates(limit);
            setMostUsedTemplates(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentTemplates = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const templateList = await examTemplateService.getRecentTemplates(limit);
            setRecentTemplates(templateList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTemplateUsageStats = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const stats = await examTemplateService.getTemplateUsageStats(templateId);
            setTemplateUsageStats(stats);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset Functions
    const resetSelectedTemplate = useCallback(() => {
        setSelectedTemplate(null);
    }, []);

    const resetTemplatesByType = useCallback(() => {
        setTemplatesByType([]);
    }, []);

    const resetTemplatesByCreator = useCallback(() => {
        setTemplatesByCreator([]);
    }, []);

    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetValidation = useCallback(() => {
        setValidationErrors([]);
        setIsValidTemplate(null);
        setIsTemplateInUse(null);
        setExamsUsingTemplate([]);
    }, []);

    const resetUsageStats = useCallback(() => {
        setTemplateUsageStats(null);
        setTypeStatistics(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetAll = useCallback(() => {
        setTemplates([]);
        setSelectedTemplate(null);
        setTemplatesByType([]);
        setTemplatesByCreator([]);
        setTemplatesBySubject([]);
        setTemplatesByDifficulty([]);
        setSearchResults([]);
        setRecentTemplates([]);
        setMostUsedTemplates([]);
        setTemplateMap(null);
        setTemplateUsageStats(null);
        setTypeStatistics(null);
        setValidationErrors([]);
        setIsValidTemplate(null);
        setIsTemplateInUse(null);
        setExamsUsingTemplate([]);
        setError(null);
    }, []);

    // Utility Functions
    const getTemplateByIdFromCache = useCallback((id: string): BaseQuestionTemplateDto | undefined => {
        return templates.find(template => template.id === id);
    }, [templates]);

    const getTemplatesByTypeFromCache = useCallback((type: EQuestionTemplateType): BaseQuestionTemplateDto[] => {
        return templates.filter(template => template.templateType === type);
    }, [templates]);

    const getActiveTemplatesCount = useCallback((): number => {
        return templates.filter(template => template.isActive !== false).length;
    }, [templates]);

    const getInactiveTemplatesCount = useCallback((): number => {
        return templates.filter(template => template.isActive === false).length;
    }, [templates]);

    const getTemplatesBySubjectFromCache = useCallback((subject: string): BaseQuestionTemplateDto[] => {
        return templates.filter(template => template.subject === subject);
    }, [templates]);

    const getTemplatesByDifficultyFromCache = useCallback((difficulty: string): BaseQuestionTemplateDto[] => {
        return templates.filter(template => template.difficulty === difficulty);
    }, [templates]);

    const hasTemplatesOfType = useCallback((type: EQuestionTemplateType): boolean => {
        return templates.some(template => template.templateType === type);
    }, [templates]);

    const getTemplateTypesInUse = useCallback((): EQuestionTemplateType[] => {
        const typesSet = new Set<EQuestionTemplateType>();
        templates.forEach(template => {
            if (template.templateType) {
                typesSet.add(template.templateType);
            }
        });
        return Array.from(typesSet);
    }, [templates]);

    const getTemplatesCreatedInRange = useCallback((startDate: Date, endDate: Date): BaseQuestionTemplateDto[] => {
        return templates.filter(template => {
            if (!template.createdAt) return false;
            const templateDate = new Date(template.createdAt);
            return templateDate >= startDate && templateDate <= endDate;
        });
    }, [templates]);

    const calculateTemplateComplexityScore = useCallback((templateId: string): number => {
        const template = getTemplateByIdFromCache(templateId);
        if (!template) return 0;

        let complexityScore = 0;

        // Base score based on template type
        const typeComplexityMap: Record<EQuestionTemplateType, number> = {
            [EQuestionTemplateType.MULTIPLE_CHOICE]: 3,
            [EQuestionTemplateType.TRUE_FALSE]: 1,
            [EQuestionTemplateType.FILL_IN_THE_BLANKS]: 4,
            [EQuestionTemplateType.SHORT_ANSWER]: 5,
            [EQuestionTemplateType.MATCHING]: 6,
            [EQuestionTemplateType.ESSAY]: 8,
            [EQuestionTemplateType.ORDERING]: 5,
            [EQuestionTemplateType.MULTIPLE_RESPONSE]: 4,
            [EQuestionTemplateType.HOT_SPOT]: 7,
            [EQuestionTemplateType.DRAG_AND_DROP]: 7,
            [EQuestionTemplateType.AUDIO_RESPONSE]: 9,
            [EQuestionTemplateType.VIDEO_RESPONSE]: 10,
            [EQuestionTemplateType.IMAGE_RESPONSE]: 6,
        };

        if (template.templateType) {
            complexityScore += typeComplexityMap[template.templateType] || 3;
        }

        // Add score based on difficulty
        const difficultyScoreMap: Record<string, number> = {
            'easy': 1,
            'medium': 3,
            'hard': 5,
            'expert': 7
        };

        if (template.difficulty) {
            complexityScore += difficultyScoreMap[template.difficulty.toLowerCase()] || 3;
        }
/*
        // Add score for multimedia content
        if (template.hasImage) complexityScore += 2;
        if (template.hasAudio) complexityScore += 3;
        if (template.hasVideo) complexityScore += 4;

 */

        return Math.round(complexityScore);
    }, [getTemplateByIdFromCache]);

    const isTemplateComplete = useCallback((templateId: string): boolean => {
        const template = getTemplateByIdFromCache(templateId);
        if (!template) return false;

        return !!(
            template.title &&
           // template.question &&
            template.templateType &&
            template.difficulty &&
            template.subject
        );
    }, [getTemplateByIdFromCache]);

    const canDeleteTemplate = useCallback((templateId: string): boolean => {
        console.log(templateId)
        // Template can be deleted if it's not in use and user has permission
        return isTemplateInUse === false;
    }, [isTemplateInUse]);

    // Initial data loading
    useEffect(() => {
        getAllTemplates();
    }, [getAllTemplates]);

    return {
        // State
        templates,
        selectedTemplate,
        templatesByType,
        templatesByCreator,
        templatesBySubject,
        templatesByDifficulty,
        searchResults,
        recentTemplates,
        mostUsedTemplates,
        templateMap,
        templateUsageStats,
        typeStatistics,
        validationErrors,
        isValidTemplate,
        isTemplateInUse,
        examsUsingTemplate,
        loading,
        error,

        // Generic Template Operations
        createTemplate,
        updateTemplate,
        getTemplateById,
        getTemplateByIdAndType,
        getAllTemplates,
        getTemplatesByType,
        deleteTemplate,

        // Template Management
        activateTemplate,
        deactivateTemplate,
        duplicateTemplate,
        getTemplateMap,

        // Template Validation
        validateTemplate,
        getTemplateValidationErrors,
        checkTemplateInUse,
        getExamsUsingTemplate,

        // Search & Filter
        searchTemplates,
        filterTemplates,
        getTemplatesBySubject,
        getTemplatesByDifficulty,
        getTemplatesByCreator,

        // Specific Template Type Operations
        createMultipleChoiceTemplate,
        createTrueFalseTemplate,
        createFillInTheBlanksTemplate,
        createShortAnswerTemplate,
        createMatchingTemplate,
        createEssayTemplate,
        createOrderingTemplate,
        createMultipleResponseTemplate,
        createHotSpotTemplate,
        createDragAndDropTemplate,
        createAudioResponseTemplate,
        createVideoResponseTemplate,
        createImageResponseTemplate,

        // Template Analytics
        getTemplateTypeStatistics,
        getMostUsedTemplates,
        getRecentTemplates,
        getTemplateUsageStats,

        // Reset Functions
        resetSelectedTemplate,
        resetTemplatesByType,
        resetTemplatesByCreator,
        resetSearchResults,
        resetValidation,
        resetUsageStats,
        resetError,
        resetAll,

        // Utility Functions
        getTemplateByIdFromCache,
        getTemplatesByTypeFromCache,
        getActiveTemplatesCount,
        getInactiveTemplatesCount,
        getTemplatesBySubjectFromCache,
        getTemplatesByDifficultyFromCache,
        hasTemplatesOfType,
        getTemplateTypesInUse,
        getTemplatesCreatedInRange,
        calculateTemplateComplexityScore,
        isTemplateComplete,
        canDeleteTemplate
    };
};