import { useState, useCallback } from 'react';
import {
    ExamReadyDto,
    ExamReadyFilterDto,
    ExamQuestionDto,
    ExamQuestionReadyDto,
    ExamSettingsDto,
    ExamStatisticsDto,
    ExamComplexityDto,
    BaseQuestionTemplateDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';
import {examReadyService} from "@/services/api/exam/exam-ready-service";

interface UseExamReadyReturn {
    examReady: ExamReadyDto | null;
    examReadyPreview: ExamReadyDto | null;
    examReadyForUser: ExamReadyDto | null;
    questionsWithTemplates: ExamQuestionReadyDto[];
    resolvedTemplates: Record<string, BaseQuestionTemplateDto> | null;
    examStatistics: ExamStatisticsDto | null;
    examComplexity: ExamComplexityDto | null;
    validationErrors: string[];
    isValidExam: boolean | null;
    loading: boolean;
    error: Error | null;

    // Complete Exam Building
    buildExamReady: (examId: string) => Promise<void>;
    buildExamReadyWithFilters: (examId: string, filter: ExamReadyFilterDto) => Promise<void>;
    buildExamReadyForUser: (examId: string, userId: string) => Promise<void>;
    buildExamReadyPreview: (examId: string) => Promise<void>;

    // Template Resolution
    resolveTemplates: (templateIds: string[]) => Promise<void>;
    resolveTemplate: (templateId: string, type: EQuestionTemplateType) => Promise<BaseQuestionTemplateDto | null>;
    buildQuestionsWithTemplates: (questions: ExamQuestionDto[]) => Promise<void>;

    // Exam Preparation
    prepareExamForTaking: (examId: string, userId: string) => Promise<void>;
    shuffleExamQuestions: (examId: string) => Promise<void>;
    applyExamSettings: (examId: string, settings: ExamSettingsDto) => Promise<void>;

    // Validation & Statistics
    validateExamReady: (examId: string) => Promise<void>;
    getExamReadyValidationErrors: (examId: string) => Promise<void>;
    calculateExamStatistics: (examId: string) => Promise<void>;
    analyzeExamComplexity: (examId: string) => Promise<void>;

    // Caching & Performance
    getCachedExamReady: (examId: string) => Promise<void>;
    invalidateExamReadyCache: (examId: string) => Promise<string>;
    invalidateAllExamReadyCache: () => Promise<string>;
    preloadExamReady: (examIds: string[]) => Promise<string>;

    // Reset Functions
    resetExamReady: () => void;
    resetExamReadyPreview: () => void;
    resetExamReadyForUser: () => void;
    resetQuestionsWithTemplates: () => void;
    resetResolvedTemplates: () => void;
    resetValidation: () => void;
    resetStatistics: () => void;
    resetError: () => void;
    resetAll: () => void;

    // Utility Functions
    hasExamReady: () => boolean;
    isExamReadyValid: () => boolean;
    getQuestionsCount: () => number;
    getTotalPoints: () => number;
    getTotalDuration: () => number;
    getTemplateIds: () => string[];
    hasUnresolvedTemplates: () => boolean;
    isExamComplete: () => boolean;
    canTakeExam: () => boolean;
}

export const useExamReady = (): UseExamReadyReturn => {
    // State management
    const [examReady, setExamReady] = useState<ExamReadyDto | null>(null);
    const [examReadyPreview, setExamReadyPreview] = useState<ExamReadyDto | null>(null);
    const [examReadyForUser, setExamReadyForUser] = useState<ExamReadyDto | null>(null);
    const [questionsWithTemplates, setQuestionsWithTemplates] = useState<ExamQuestionReadyDto[]>([]);
    const [resolvedTemplates, setResolvedTemplates] = useState<Record<string, BaseQuestionTemplateDto> | null>(null);
    const [examStatistics, setExamStatistics] = useState<ExamStatisticsDto | null>(null);
    const [examComplexity, setExamComplexity] = useState<ExamComplexityDto | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isValidExam, setIsValidExam] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Complete Exam Building
    const buildExamReady = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const examReadyData = await examReadyService.buildExamReady(examId);
            setExamReady(examReadyData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const buildExamReadyWithFilters = useCallback(async (examId: string, filter: ExamReadyFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const examReadyData = await examReadyService.buildExamReadyWithFilters(examId, filter);
            setExamReady(examReadyData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const buildExamReadyForUser = useCallback(async (examId: string, userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const examReadyData = await examReadyService.buildExamReadyForUser(examId, userId);
            setExamReadyForUser(examReadyData);
            setExamReady(examReadyData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const buildExamReadyPreview = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const examReadyData = await examReadyService.buildExamReadyPreview(examId);
            setExamReadyPreview(examReadyData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Template Resolution
    const resolveTemplates = useCallback(async (templateIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const templates = await examReadyService.resolveTemplates(templateIds);
            setResolvedTemplates(templates);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const resolveTemplate = useCallback(async (templateId: string, type: EQuestionTemplateType): Promise<BaseQuestionTemplateDto | null> => {
        try {
            setLoading(true);
            setError(null);
            const template = await examReadyService.resolveTemplate(templateId, type);

            // Update resolved templates cache
            setResolvedTemplates(prev => ({
                ...prev,
                [templateId]: template
            }));

            return template;
        } catch (err) {
            handleError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const buildQuestionsWithTemplates = useCallback(async (questions: ExamQuestionDto[]) => {
        try {
            setLoading(true);
            setError(null);
            const questionsReady = await examReadyService.buildQuestionsWithTemplates(questions);
            setQuestionsWithTemplates(questionsReady);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Exam Preparation
    const prepareExamForTaking = useCallback(async (examId: string, userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const preparedExam = await examReadyService.prepareExamForTaking(examId, userId);
            setExamReadyForUser(preparedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const shuffleExamQuestions = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const shuffledExam = await examReadyService.shuffleExamQuestions(examId);
            setExamReady(shuffledExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const applyExamSettings = useCallback(async (examId: string, settings: ExamSettingsDto) => {
        try {
            setLoading(true);
            setError(null);
            const examWithSettings = await examReadyService.applyExamSettings(examId, settings);
            setExamReady(examWithSettings);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Validation & Statistics
    const validateExamReady = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const isValid = await examReadyService.validateExamReady(examId);
            setIsValidExam(isValid);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamReadyValidationErrors = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const errors = await examReadyService.getExamReadyValidationErrors(examId);
            setValidationErrors(errors);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const calculateExamStatistics = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examReadyService.calculateExamStatistics(examId);
            setExamStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const analyzeExamComplexity = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const complexity = await examReadyService.analyzeExamComplexity(examId);
            setExamComplexity(complexity);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Caching & Performance
    const getCachedExamReady = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const cachedExam = await examReadyService.getCachedExamReady(examId);
            setExamReady(cachedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const invalidateExamReadyCache = useCallback(async (examId: string): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            return await examReadyService.invalidateExamReadyCache(examId);
        } catch (err) {
            handleError(err);
            return '';
        } finally {
            setLoading(false);
        }
    }, []);

    const invalidateAllExamReadyCache = useCallback(async (): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            return await examReadyService.invalidateAllExamReadyCache();
        } catch (err) {
            handleError(err);
            return '';
        } finally {
            setLoading(false);
        }
    }, []);

    const preloadExamReady = useCallback(async (examIds: string[]): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            return await examReadyService.preloadExamReady(examIds);
        } catch (err) {
            handleError(err);
            return '';
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset Functions
    const resetExamReady = useCallback(() => {
        setExamReady(null);
    }, []);

    const resetExamReadyPreview = useCallback(() => {
        setExamReadyPreview(null);
    }, []);

    const resetExamReadyForUser = useCallback(() => {
        setExamReadyForUser(null);
    }, []);

    const resetQuestionsWithTemplates = useCallback(() => {
        setQuestionsWithTemplates([]);
    }, []);

    const resetResolvedTemplates = useCallback(() => {
        setResolvedTemplates(null);
    }, []);

    const resetValidation = useCallback(() => {
        setValidationErrors([]);
        setIsValidExam(null);
    }, []);

    const resetStatistics = useCallback(() => {
        setExamStatistics(null);
        setExamComplexity(null);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetAll = useCallback(() => {
        setExamReady(null);
        setExamReadyPreview(null);
        setExamReadyForUser(null);
        setQuestionsWithTemplates([]);
        setResolvedTemplates(null);
        setExamStatistics(null);
        setExamComplexity(null);
        setValidationErrors([]);
        setIsValidExam(null);
        setError(null);
    }, []);

    // Utility Functions
    const hasExamReady = useCallback((): boolean => {
        return examReady !== null;
    }, [examReady]);

    const isExamReadyValid = useCallback((): boolean => {
        return isValidExam === true && validationErrors.length === 0;
    }, [isValidExam, validationErrors]);

    const getQuestionsCount = useCallback((): number => {
        if (examReady?.questions) {
            return examReady.questions.length;
        }
        if (questionsWithTemplates.length > 0) {
            return questionsWithTemplates.length;
        }
        return 0;
    }, [examReady, questionsWithTemplates]);

    const getTotalPoints = useCallback((): number => {
        if (examReady?.questions) {
            return examReady.questions.reduce((total, question) => total + (question.points || 0), 0);
        }
        if (questionsWithTemplates.length > 0) {
            return questionsWithTemplates.reduce((total, question) => total + (question.points || 0), 0);
        }
        return 0;
    }, [examReady, questionsWithTemplates]);

    const getTotalDuration = useCallback((): number => {
        /*
        if (examReady?.exam?.duration) {
            return examReady.exam.duration;
        }

         */
        if (examReady?.questions) {
            return examReady.questions.reduce((total, question) => total + (question.timeLimit || 0), 0);
        }
        return 0;
    }, [examReady]);

    const getTemplateIds = useCallback((): string[] => {
        /*
        const templateIds: string[] = [];

        if (examReady?.questions) {
            examReady.questions.forEach(question => {
                if (question. .templateId) {
                    templateIds.push(question.templateId);
                }
            });
        }

        if (questionsWithTemplates.length > 0) {
            questionsWithTemplates.forEach(question => {
                if (question.templateId) {
                    templateIds.push(question.templateId);
                }
            });
        }

        return [...new Set(templateIds)]; // Remove duplicates

         */
        return [];
    }, [examReady, questionsWithTemplates]);

    const hasUnresolvedTemplates = useCallback((): boolean => {
        const templateIds = getTemplateIds();
        if (templateIds.length === 0) return false;
        if (!resolvedTemplates) return true;

        return templateIds.some(templateId => !resolvedTemplates[templateId]);
    }, [getTemplateIds, resolvedTemplates]);

    const isExamComplete = useCallback((): boolean => {
        return hasExamReady() &&
            getQuestionsCount() > 0 &&
            !hasUnresolvedTemplates() &&
            isExamReadyValid();
    }, [hasExamReady, getQuestionsCount, hasUnresolvedTemplates, isExamReadyValid]);

    const canTakeExam = useCallback((): boolean => {
        return isExamComplete() && examReadyForUser !== null;
    }, [isExamComplete, examReadyForUser]);

    return {
        // State
        examReady,
        examReadyPreview,
        examReadyForUser,
        questionsWithTemplates,
        resolvedTemplates,
        examStatistics,
        examComplexity,
        validationErrors,
        isValidExam,
        loading,
        error,

        // Complete Exam Building
        buildExamReady,
        buildExamReadyWithFilters,
        buildExamReadyForUser,
        buildExamReadyPreview,

        // Template Resolution
        resolveTemplates,
        resolveTemplate,
        buildQuestionsWithTemplates,

        // Exam Preparation
        prepareExamForTaking,
        shuffleExamQuestions,
        applyExamSettings,

        // Validation & Statistics
        validateExamReady,
        getExamReadyValidationErrors,
        calculateExamStatistics,
        analyzeExamComplexity,

        // Caching & Performance
        getCachedExamReady,
        invalidateExamReadyCache,
        invalidateAllExamReadyCache,
        preloadExamReady,

        // Reset Functions
        resetExamReady,
        resetExamReadyPreview,
        resetExamReadyForUser,
        resetQuestionsWithTemplates,
        resetResolvedTemplates,
        resetValidation,
        resetStatistics,
        resetError,
        resetAll,

        // Utility Functions
        hasExamReady,
        isExamReadyValid,
        getQuestionsCount,
        getTotalPoints,
        getTotalDuration,
        getTemplateIds,
        hasUnresolvedTemplates,
        isExamComplete,
        canTakeExam
    };
};