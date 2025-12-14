import {useState, useCallback} from 'react';
import {
    ExamQuestionDto,
    QuestionFilterDto,
    QuestionStatisticsDto,
    ESkill, QuestionAnalyticsDto, EQuestionTemplateType,
} from '@/types/exam/exam-type';
import {examQuestionService} from '@/services/api/exam/exam-question-service';

interface PaginatedQuestionsResponse {
    content: ExamQuestionDto[];
    totalElements: number;
    totalPages: number;
}

interface UseExamQuestionReturn {
    examQuestions: ExamQuestionDto[];
    selectedExamQuestion: ExamQuestionDto | null;
    paginatedQuestions: PaginatedQuestionsResponse | null;
    questionsByExam: ExamQuestionDto[];
    questionsByPart: ExamQuestionDto[];
    searchResults: ExamQuestionDto[];
    recentQuestions: ExamQuestionDto[];
    recentlyUpdated: ExamQuestionDto[];
    activeQuestions: ExamQuestionDto[];
    mainQuestions: ExamQuestionDto[];
    questionsWithoutTemplate: ExamQuestionDto[];
    questionsByTemplate: ExamQuestionDto[];
    questionStatistics: QuestionStatisticsDto | null;
    questionAnalytics: Record<string, QuestionAnalyticsDto> | null;
    typeDistribution: Record<string, number> | null;
    skillDistribution: Record<string, number> | null;
    totalQuestionCount: number;
    loading: boolean;
    error: Error | null;

    // CRUD Operations
    createExamQuestion: (questionDto: ExamQuestionDto) => Promise<void>;
    updateExamQuestion: (questionId: string, questionDto: ExamQuestionDto) => Promise<void>;
    getExamQuestionById: (questionId: string) => Promise<void>;
    deleteExamQuestion: (questionId: string) => Promise<void>;

    // Question Retrieval
    getQuestionsByExamId: (examId: string) => Promise<void>;
    getQuestionsByPartId: (partId: string) => Promise<void>;
    getQuestionsPaginated: (page?: number, size?: number, sortBy?: string, sortDirection?: string) => Promise<void>;

    // Question Management
    linkTemplate: (questionId: string, templateId: string) => Promise<void>;
    unlinkTemplate: (questionId: string) => Promise<void>;
    updateQuestionOrder: (questionId: string, newOrder: number) => Promise<void>;
    toggleQuestionStatus: (questionId: string) => Promise<void>;
    shuffleQuestionOptions: (questionId: string, shuffle: boolean) => Promise<void>;

    // Question Settings
    updateTimeLimit: (questionId: string, timeLimit: number) => Promise<void>;
    updatePoints: (questionId: string, points: number) => Promise<void>;
    addTag: (questionId: string, tag: string) => Promise<void>;
    removeTag: (questionId: string, tag: string) => Promise<void>;
    setCurriculumContent: (questionId: string, curriculumContentIds: Set<string>) => Promise<void>;

    // Question Analysis
    getQuestionsByDifficulty: (examId: string, difficulty: string) => Promise<void>;
    getQuestionsByType: (examId: string, type: EQuestionTemplateType) => Promise<void>;
    getQuestionsBySkill: (examId: string, skill: ESkill) => Promise<void>;
    getQuestionTypeDistribution: (examId: string) => Promise<void>;
    getQuestionSkillDistribution: (examId: string) => Promise<void>;

    // Bulk Operations
    bulkUpdatePoints: (questionIds: string[], points: number) => Promise<void>;
    bulkUpdateTimeLimit: (questionIds: string[], timeLimit: number) => Promise<void>;
    bulkDeleteQuestions: (questionIds: string[]) => Promise<void>;
    duplicateQuestions: (questionIds: string[], targetExamId: string) => Promise<void>;

    // Search & Filter
    searchQuestions: (keyword: string) => Promise<void>;
    filterQuestions: (filter: QuestionFilterDto) => Promise<void>;

    // Question Statistics
    getQuestionStatistics: (questionId: string) => Promise<void>;
    getTotalQuestionCount: () => Promise<void>;
    getQuestionCountByType: (type: EQuestionTemplateType) => Promise<number>;
    getQuestionCountByPart: (partId: string) => Promise<number>;
    getTotalPointsByExam: (examId: string) => Promise<number>;
    getTotalTimeLimitByExam: (examId: string) => Promise<number>;

    // Reordering Operations
    reorderQuestions: (examId: string, questionIds: string[]) => Promise<void>;
    reorderQuestionsByPart: (partId: string, questionIds: string[]) => Promise<void>;

    // Specialized Queries
    getQuestionsWithoutTemplate: () => Promise<void>;
    getQuestionsByTemplate: (templateId: string) => Promise<void>;
    getMainQuestions: () => Promise<void>;
    getActiveQuestions: () => Promise<void>;
    getQuestionsByTag: (tag: string) => Promise<void>;
    getQuestionsByCurriculumContent: (curriculumContentId: string) => Promise<void>;

    // Advanced Analytics
    getQuestionAnalytics: (examId: string) => Promise<void>;
    getRecentQuestions: (limit?: number) => Promise<void>;
    getMostRecentlyUpdated: (limit?: number) => Promise<void>;

    // Template Integration Methods
    getQuestionWithTemplate: (questionId: string) => Promise<void>;
    getQuestionsWithTemplates: (questionIds: string[]) => Promise<void>;
    createQuestionFromTemplate: (templateId: string, partId?: string, order?: number, points?: number) => Promise<void>;
    createQuestionsFromTemplates: (templateIds: string[], partId?: string) => Promise<void>;
    updateTemplateReferences: (oldTemplateId: string, newTemplateId: string) => Promise<string>;

    // Utility Operations
    isQuestionInUse: (questionId: string) => Promise<boolean>;
    hasTemplate: (questionId: string) => Promise<boolean>;

    // Reset Functions
    resetSelectedExamQuestion: () => void;
    resetQuestionsByExam: () => void;
    resetQuestionsByPart: () => void;
    resetSearchResults: () => void;
    resetError: () => void;
    resetPaginatedData: () => void;
    resetAnalytics: () => void;

    // Utility Functions
    getQuestionById: (id: string) => ExamQuestionDto | undefined;
    getQuestionsByExamIdFromCache: (examId: string) => ExamQuestionDto[];
    getQuestionsByPartIdFromCache: (partId: string) => ExamQuestionDto[];
    hasQuestionsForExam: (examId: string) => boolean;
    hasQuestionsForPart: (partId: string) => boolean;
    getActiveQuestionsCount: () => number;
    getInactiveQuestionsCount: () => number;
    getQuestionsByTypeFromCache: (type: EQuestionTemplateType) => ExamQuestionDto[];
    getQuestionsBySkillFromCache: (skill: ESkill) => ExamQuestionDto[];
    getTotalPointsFromCache: () => number;
    getQuestionsWithTemplateFromCache: () => ExamQuestionDto[];
    getQuestionsWithoutTemplateFromCache: () => ExamQuestionDto[];
}

export const useExamQuestion = (): UseExamQuestionReturn => {
    // State management
    const [examQuestions, setExamQuestions] = useState<ExamQuestionDto[]>([]);
    const [selectedExamQuestion, setSelectedExamQuestion] = useState<ExamQuestionDto | null>(null);
    const [paginatedQuestions, setPaginatedQuestions] = useState<PaginatedQuestionsResponse | null>(null);
    const [questionsByExam, setQuestionsByExam] = useState<ExamQuestionDto[]>([]);
    const [questionsByPart, setQuestionsByPart] = useState<ExamQuestionDto[]>([]);
    const [searchResults, setSearchResults] = useState<ExamQuestionDto[]>([]);
    const [recentQuestions, setRecentQuestions] = useState<ExamQuestionDto[]>([]);
    const [recentlyUpdated, setRecentlyUpdated] = useState<ExamQuestionDto[]>([]);
    const [activeQuestions, setActiveQuestions] = useState<ExamQuestionDto[]>([]);
    const [mainQuestions, setMainQuestions] = useState<ExamQuestionDto[]>([]);
    const [questionsWithoutTemplate, setQuestionsWithoutTemplate] = useState<ExamQuestionDto[]>([]);
    const [questionsByTemplate, setQuestionsByTemplate] = useState<ExamQuestionDto[]>([]);
    const [questionStatistics, setQuestionStatistics] = useState<QuestionStatisticsDto | null>(null);
    const [questionAnalytics, setQuestionAnalytics] = useState<Record<string, QuestionAnalyticsDto> | null>(null);
    const [typeDistribution, setTypeDistribution] = useState<Record<string, number> | null>(null);
    const [skillDistribution, setSkillDistribution] = useState<Record<string, number> | null>(null);
    const [totalQuestionCount, setTotalQuestionCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Helper function to update question in all relevant states
    const updateQuestionInStates = useCallback((updatedQuestion: ExamQuestionDto) => {
        const updateInArray = (arr: ExamQuestionDto[]) =>
            arr.map(question => question.id === updatedQuestion.id ? updatedQuestion : question);

        setExamQuestions(prev => updateInArray(prev));
        setQuestionsByExam(prev => updateInArray(prev));
        setQuestionsByPart(prev => updateInArray(prev));
        setSearchResults(prev => updateInArray(prev));
        setRecentQuestions(prev => updateInArray(prev));
        setRecentlyUpdated(prev => updateInArray(prev));
        setActiveQuestions(prev => updateInArray(prev));
        setMainQuestions(prev => updateInArray(prev));
        setQuestionsWithoutTemplate(prev => updateInArray(prev));
        setQuestionsByTemplate(prev => updateInArray(prev));

        if (selectedExamQuestion?.id === updatedQuestion.id) {
            setSelectedExamQuestion(updatedQuestion);
        }
    }, [selectedExamQuestion]);

    // Helper function to remove question from all relevant states
    const removeQuestionFromStates = useCallback((questionId: string) => {
        const removeFromArray = (arr: ExamQuestionDto[]) => arr.filter(question => question.id !== questionId);

        setExamQuestions(prev => removeFromArray(prev));
        setQuestionsByExam(prev => removeFromArray(prev));
        setQuestionsByPart(prev => removeFromArray(prev));
        setSearchResults(prev => removeFromArray(prev));
        setRecentQuestions(prev => removeFromArray(prev));
        setRecentlyUpdated(prev => removeFromArray(prev));
        setActiveQuestions(prev => removeFromArray(prev));
        setMainQuestions(prev => removeFromArray(prev));
        setQuestionsWithoutTemplate(prev => removeFromArray(prev));
        setQuestionsByTemplate(prev => removeFromArray(prev));

        if (selectedExamQuestion?.id === questionId) {
            setSelectedExamQuestion(null);
        }
    }, [selectedExamQuestion]);

    // CRUD Operations
    const createExamQuestion = useCallback(async (questionDto: ExamQuestionDto) => {
        try {
            setLoading(true);
            setError(null);
            const newQuestion = await examQuestionService.createExamQuestion(questionDto);
            setExamQuestions(prev => [newQuestion, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExamQuestion = useCallback(async (questionId: string, questionDto: ExamQuestionDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.updateExamQuestion(questionId, questionDto);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const getExamQuestionById = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const question = await examQuestionService.getExamQuestionById(questionId);
            setSelectedExamQuestion(question);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExamQuestion = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            await examQuestionService.deleteExamQuestion(questionId);
            removeQuestionFromStates(questionId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeQuestionFromStates]);

    // Question Retrieval
    const getQuestionsByExamId = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByExamId(examId);
            setQuestionsByExam(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByPartId = useCallback(async (partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByPartId(partId);
            setQuestionsByPart(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsPaginated = useCallback(async (
        page: number = 0,
        size: number = 20,
        sortBy: string = "createdAt",
        sortDirection: string = "desc"
    ) => {
        try {
            setLoading(true);
            setError(null);
            const paginatedData = await examQuestionService.getQuestionsPaginated(page, size, sortBy, sortDirection);
            setPaginatedQuestions(paginatedData);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Question Management
    const linkTemplate = useCallback(async (questionId: string, templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.linkTemplate(questionId, templateId);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const unlinkTemplate = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.unlinkTemplate(questionId);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const updateQuestionOrder = useCallback(async (questionId: string, newOrder: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.updateQuestionOrder(questionId, newOrder);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const toggleQuestionStatus = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.toggleQuestionStatus(questionId);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const shuffleQuestionOptions = useCallback(async (questionId: string, shuffle: boolean) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.shuffleQuestionOptions(questionId, shuffle);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    // Question Settings
    const updateTimeLimit = useCallback(async (questionId: string, timeLimit: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.updateTimeLimit(questionId, timeLimit);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const updatePoints = useCallback(async (questionId: string, points: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.updatePoints(questionId, points);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const addTag = useCallback(async (questionId: string, tag: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.addTag(questionId, tag);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const removeTag = useCallback(async (questionId: string, tag: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.removeTag(questionId, tag);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const setCurriculumContent = useCallback(async (questionId: string, curriculumContentIds: Set<string>) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestion = await examQuestionService.setCurriculumContent(questionId, curriculumContentIds);
            updateQuestionInStates(updatedQuestion);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    // Question Analysis
    const getQuestionsByDifficulty = useCallback(async (examId: string, difficulty: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByDifficulty(examId, difficulty);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByType = useCallback(async (examId: string, type: EQuestionTemplateType) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByType(examId, type);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsBySkill = useCallback(async (examId: string, skill: ESkill) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsBySkill(examId, skill);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionTypeDistribution = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await examQuestionService.getQuestionTypeDistribution(examId);
            setTypeDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionSkillDistribution = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await examQuestionService.getQuestionSkillDistribution(examId);
            setSkillDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Bulk Operations
    const bulkUpdatePoints = useCallback(async (questionIds: string[], points: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestions = await examQuestionService.bulkUpdatePoints(questionIds, points);
            updatedQuestions.forEach(question => updateQuestionInStates(question));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const bulkUpdateTimeLimit = useCallback(async (questionIds: string[], timeLimit: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedQuestions = await examQuestionService.bulkUpdateTimeLimit(questionIds, timeLimit);
            updatedQuestions.forEach(question => updateQuestionInStates(question));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const bulkDeleteQuestions = useCallback(async (questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await examQuestionService.bulkDeleteQuestions(questionIds);
            questionIds.forEach(questionId => removeQuestionFromStates(questionId));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeQuestionFromStates]);

    const duplicateQuestions = useCallback(async (questionIds: string[], targetExamId: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedQuestions = await examQuestionService.duplicateQuestions(questionIds, targetExamId);
            setExamQuestions(prev => [...duplicatedQuestions, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search & Filter
    const searchQuestions = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examQuestionService.searchQuestions(keyword);
            setSearchResults(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterQuestions = useCallback(async (filter: QuestionFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examQuestionService.filterQuestions(filter);
            setExamQuestions(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Question Statistics
    const getQuestionStatistics = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examQuestionService.getQuestionStatistics(questionId);
            setQuestionStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getTotalQuestionCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const count = await examQuestionService.getTotalQuestionCount();
            setTotalQuestionCount(count);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionCountByType = useCallback(async (type: EQuestionTemplateType): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.getQuestionCountByType(type);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionCountByPart = useCallback(async (partId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.getQuestionCountByPart(partId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTotalPointsByExam = useCallback(async (examId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.getTotalPointsByExam(examId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTotalTimeLimitByExam = useCallback(async (examId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.getTotalTimeLimitByExam(examId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reordering Operations
    const reorderQuestions = useCallback(async (examId: string, questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const reorderedQuestions = await examQuestionService.reorderQuestions(examId, questionIds);
            setQuestionsByExam(reorderedQuestions);
            reorderedQuestions.forEach(question => updateQuestionInStates(question));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    const reorderQuestionsByPart = useCallback(async (partId: string, questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const reorderedQuestions = await examQuestionService.reorderQuestionsByPart(partId, questionIds);
            setQuestionsByPart(reorderedQuestions);
            reorderedQuestions.forEach(question => updateQuestionInStates(question));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateQuestionInStates]);

    // Specialized Queries
    const getQuestionsWithoutTemplate = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsWithoutTemplate();
            setQuestionsWithoutTemplate(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByTemplate = useCallback(async (templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByTemplate(templateId);
            setQuestionsByTemplate(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMainQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getMainQuestions();
            setMainQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getActiveQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getActiveQuestions();
            setActiveQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByTag = useCallback(async (tag: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByTag(tag);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsByCurriculumContent = useCallback(async (curriculumContentId: string) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsByCurriculumContent(curriculumContentId);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Advanced Analytics
    const getQuestionAnalytics = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const analytics = await examQuestionService.getQuestionAnalytics(examId);
            setQuestionAnalytics(analytics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentQuestions = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getRecentQuestions(limit);
            setRecentQuestions(questions);
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
            const questions = await examQuestionService.getMostRecentlyUpdated(limit);
            setRecentlyUpdated(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Template Integration Methods
    const getQuestionWithTemplate = useCallback(async (questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const question = await examQuestionService.getQuestionWithTemplate(questionId);
            setSelectedExamQuestion(question);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getQuestionsWithTemplates = useCallback(async (questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const questions = await examQuestionService.getQuestionsWithTemplates(questionIds);
            setExamQuestions(questions);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createQuestionFromTemplate = useCallback(async (
        templateId: string,
        partId?: string,
        order?: number,
        points?: number
    ) => {
        try {
            setLoading(true);
            setError(null);
            const newQuestion = await examQuestionService.createQuestionFromTemplate(templateId, partId, order, points);
            setExamQuestions(prev => [newQuestion, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createQuestionsFromTemplates = useCallback(async (templateIds: string[], partId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const newQuestions = await examQuestionService.createQuestionsFromTemplates(templateIds, partId);
            setExamQuestions(prev => [...newQuestions, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTemplateReferences = useCallback(async (oldTemplateId: string, newTemplateId: string): Promise<string> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.updateTemplateReferences(oldTemplateId, newTemplateId);
        } catch (err) {
            handleError(err);
            return '';
        } finally {
            setLoading(false);
        }
    }, []);

    // Utility Operations
    const isQuestionInUse = useCallback(async (questionId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.isQuestionInUse(questionId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const hasTemplate = useCallback(async (questionId: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examQuestionService.hasTemplate(questionId);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Reset Functions
    const resetSelectedExamQuestion = useCallback(() => {
        setSelectedExamQuestion(null);
    }, []);

    const resetQuestionsByExam = useCallback(() => {
        setQuestionsByExam([]);
    }, []);

    const resetQuestionsByPart = useCallback(() => {
        setQuestionsByPart([]);
    }, []);

    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetPaginatedData = useCallback(() => {
        setPaginatedQuestions(null);
    }, []);

    const resetAnalytics = useCallback(() => {
        setQuestionAnalytics(null);
        setQuestionStatistics(null);
        setTypeDistribution(null);
        setSkillDistribution(null);
    }, []);

    // Utility Functions
    const getQuestionById = useCallback((id: string): ExamQuestionDto | undefined => {
        return examQuestions.find(question => question.id === id);
    }, [examQuestions]);

    const getQuestionsByExamIdFromCache = useCallback((examId: string): ExamQuestionDto[] => {
        // return examQuestions.filter(question => question.examId === examId);
        console.log(examId)
        return examQuestions;
    }, [examQuestions]);

    const getQuestionsByPartIdFromCache = useCallback((partId: string): ExamQuestionDto[] => {
        return examQuestions.filter(question => question.examPart.id === partId);
    }, [examQuestions]);

    const hasQuestionsForExam = useCallback((examId: string): boolean => {
        return examQuestions.some(question => question.examPart.id === examId);
    }, [examQuestions]);

    const hasQuestionsForPart = useCallback((partId: string): boolean => {
        return examQuestions.some(question => question.examPart.id === partId);
    }, [examQuestions]);

    const getActiveQuestionsCount = useCallback((): number => {
        return examQuestions.filter(question => question.isActive !== false).length;
    }, [examQuestions]);

    const getInactiveQuestionsCount = useCallback((): number => {
        return examQuestions.filter(question => question.isActive === false).length;
    }, [examQuestions]);

    const getQuestionsByTypeFromCache = useCallback((type: EQuestionTemplateType): ExamQuestionDto[] => {
        return examQuestions.filter(question => question.questionType === type);
    }, [examQuestions]);

    const getQuestionsBySkillFromCache = useCallback((skill: ESkill): ExamQuestionDto[] => {
        return examQuestions.filter(question => question.examPart.skill === skill);
    }, [examQuestions]);

    const getTotalPointsFromCache = useCallback((): number => {
        return examQuestions.reduce((total, question) => total + (question.points || 0), 0);
    }, [examQuestions]);

    const getQuestionsWithTemplateFromCache = useCallback((): ExamQuestionDto[] => {
        return examQuestions.filter(question => question.questionTemplateId);
    }, [examQuestions]);

    const getQuestionsWithoutTemplateFromCache = useCallback((): ExamQuestionDto[] => {
        return examQuestions.filter(question => !question.questionTemplateId);
    }, [examQuestions]);

    return {
        // State
        examQuestions,
        selectedExamQuestion,
        paginatedQuestions,
        questionsByExam,
        questionsByPart,
        searchResults,
        recentQuestions,
        recentlyUpdated,
        activeQuestions,
        mainQuestions,
        questionsWithoutTemplate,
        questionsByTemplate,
        questionStatistics,
        questionAnalytics,
        typeDistribution,
        skillDistribution,
        totalQuestionCount,
        loading,
        error,

        // CRUD Operations
        createExamQuestion,
        updateExamQuestion,
        getExamQuestionById,
        deleteExamQuestion,

        // Question Retrieval
        getQuestionsByExamId,
        getQuestionsByPartId,
        getQuestionsPaginated,

        // Question Management
        linkTemplate,
        unlinkTemplate,
        updateQuestionOrder,
        toggleQuestionStatus,
        shuffleQuestionOptions,

        // Question Settings
        updateTimeLimit,
        updatePoints,
        addTag,
        removeTag,
        setCurriculumContent,

        // Question Analysis
        getQuestionsByDifficulty,
        getQuestionsByType,
        getQuestionsBySkill,
        getQuestionTypeDistribution,
        getQuestionSkillDistribution,

        // Bulk Operations
        bulkUpdatePoints,
        bulkUpdateTimeLimit,
        bulkDeleteQuestions,
        duplicateQuestions,

        // Search & Filter
        searchQuestions,
        filterQuestions,

        // Question Statistics
        getQuestionStatistics,
        getTotalQuestionCount,
        getQuestionCountByType,
        getQuestionCountByPart,
        getTotalPointsByExam,
        getTotalTimeLimitByExam,

        // Reordering Operations
        reorderQuestions,
        reorderQuestionsByPart,

        // Specialized Queries
        getQuestionsWithoutTemplate,
        getQuestionsByTemplate,
        getMainQuestions,
        getActiveQuestions,
        getQuestionsByTag,
        getQuestionsByCurriculumContent,

        // Advanced Analytics
        getQuestionAnalytics,
        getRecentQuestions,
        getMostRecentlyUpdated,

        // Template Integration Methods
        getQuestionWithTemplate,
        getQuestionsWithTemplates,
        createQuestionFromTemplate,
        createQuestionsFromTemplates,
        updateTemplateReferences,

        // Utility Operations
        isQuestionInUse,
        hasTemplate,

        // Reset Functions
        resetSelectedExamQuestion,
        resetQuestionsByExam,
        resetQuestionsByPart,
        resetSearchResults,
        resetError,
        resetPaginatedData,
        resetAnalytics,

        // Utility Functions
        getQuestionById,
        getQuestionsByExamIdFromCache,
        getQuestionsByPartIdFromCache,
        hasQuestionsForExam,
        hasQuestionsForPart,
        getActiveQuestionsCount,
        getInactiveQuestionsCount,
        getQuestionsByTypeFromCache,
        getQuestionsBySkillFromCache,
        getTotalPointsFromCache,
        getQuestionsWithTemplateFromCache,
        getQuestionsWithoutTemplateFromCache
    };
};