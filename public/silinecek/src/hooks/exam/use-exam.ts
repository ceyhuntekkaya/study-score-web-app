import { useState, useCallback, useEffect, useMemo } from 'react';
import {
    ExamDto,
    ExamPartDto,
    ExamQuestionDto,
    ExamFilterDto,
    ExamStatisticsDto,
    ExamAnswerDto
} from '@/types/exam/exam-type';
import { ECourseCategory } from '@/types/enumeration';
import { examService } from "@/services/api/exam/exam-service";

interface UseExamReturn {
    exams: ExamDto[];
    selectedExam: ExamDto | null;
    examsByCreator: ExamDto[];
    recentExams: ExamDto[];
    popularExams: ExamDto[];
    publishedExams: ExamDto[];
    draftExams: ExamDto[];
    examsRequiringValidation: ExamDto[];
    examsWithoutQuestions: ExamDto[];
    examsWithoutParts: ExamDto[];
    searchResults: ExamDto[];
    examStatistics: ExamStatisticsDto | null;
    categoryDistribution: Record<string, number> | null;
    levelDistribution: Record<string, number> | null;
    totalExamCount: number;
    totalPoints: number;
    estimatedDuration: number;
    validationErrors: string[];
    isValidExam: boolean | null;
    loading: boolean;
    error: Error | null;

    // Navigation state for exam taking
    currentPartIndex: number;
    currentQuestionIndex: number;
    currentPart: ExamPartDto | null;
    currentQuestion: ExamQuestionDto | null;
    answers: ExamAnswerDto[];
    tempAnswers: Record<string, string>; // For temporary answer storage before saving
    isLastQuestion: boolean;
    isFirstQuestion: boolean;

    // CRUD Operations
    createExam: (examDto: ExamDto) => Promise<void>;
    updateExam: (examId: string, examDto: ExamDto) => Promise<void>;
    getExamById: (examId: string) => Promise<void>;
    getAllExams: () => Promise<void>;
    deleteExam: (examId: string) => Promise<void>;
    softDeleteExam: (examId: string) => Promise<void>;

    // Exam Statistics
    getExamStatistics: (examId: string) => Promise<void>;
    calculateTotalPoints: (examId: string) => Promise<void>;
    calculateEstimatedDuration: (examId: string) => Promise<void>;

    // Search & Filter
    searchExams: (keyword: string) => Promise<void>;
    filterExams: (filter: ExamFilterDto) => Promise<void>;
    getExamsByCreator: (userId: string) => Promise<void>;
    getRecentExams: (limit?: number) => Promise<void>;
    getPopularExams: (limit?: number) => Promise<void>;

    // Analytics & Reports
    getTotalExamCount: () => Promise<void>;
    getExamDistributionByCategory: () => Promise<void>;
    getExamDistributionByLevel: () => Promise<void>;
    getPublishedExams: () => Promise<void>;
    getDraftExams: () => Promise<void>;

    // Advanced Operations
    getExamsRequiringValidation: () => Promise<void>;
    getExamsWithoutQuestions: () => Promise<void>;
    getExamsWithoutParts: () => Promise<void>;

    // Template Integration
    addQuestionsFromTemplates: (examId: string, templateIds: string[], partId?: string) => Promise<void>;
    removeQuestionsWithTemplate: (examId: string, templateId: string) => Promise<void>;

    // Bulk Operations
    createMultipleExams: (examDtos: ExamDto[]) => Promise<void>;
    deleteMultipleExams: (examIds: string[]) => Promise<void>;
    publishMultipleExams: (examIds: string[]) => Promise<void>;

    // Utility Operations
    existsByName: (name: string, category: ECourseCategory) => Promise<boolean>;
    existsByCode: (code: string) => Promise<boolean>;
    findByCode: (code: string) => Promise<void>;
    getExamsByCategory: (category: ECourseCategory) => Promise<void>;
    getExamsByLevel: (level: string) => Promise<void>;

    // Exam Management
    activateExam: (examId: string) => Promise<void>;
    deactivateExam: (examId: string) => Promise<void>;
    publishExam: (examId: string) => Promise<void>;
    unpublishExam: (examId: string) => Promise<void>;
    duplicateExam: (examId: string, newName: string) => Promise<void>;

    // Question Management
    addQuestionToExam: (examId: string, templateId: string, order?: number, points?: number) => Promise<void>;
    removeQuestionFromExam: (examId: string, questionId: string) => Promise<void>;
    reorderQuestions: (examId: string, questionIds: string[]) => Promise<void>;
    updateQuestionPoints: (examId: string, questionId: string, points: number) => Promise<void>;
    updateQuestionSettings: (examId: string, questionId: string, settings: ExamQuestionDto) => Promise<void>;

    // Part Management
    addExamPart: (examId: string, partDto: ExamPartDto) => Promise<void>;
    updateExamPart: (examId: string, partId: string, partDto: ExamPartDto) => Promise<void>;
    removeExamPart: (examId: string, partId: string) => Promise<void>;
    reorderParts: (examId: string, partIds: string[]) => Promise<void>;

    // Validation & Statistics
    validateExam: (examId: string) => Promise<void>;
    getExamValidationErrors: (examId: string) => Promise<void>;

    // Navigation functions for exam taking
    goToQuestion: (partIndex: number, questionIndex: number) => void;
    goToNextQuestion: () => void;
    goToPreviousQuestion: () => void;
    goToFirstQuestion: () => void;
    goToLastQuestion: () => void;
    setCurrentPart: (partIndex: number) => void;

    // Answer management for exam taking
    setAnswer: (questionId: string, answer: string) => void;
    setTempAnswer: (questionId: string, answer: string) => void;
    getTempAnswer: (questionId: string) => string | undefined;
    getAnswer: (questionId: string) => ExamAnswerDto | undefined;
    getAnswerByQuestionAndPart: (questionId: string, partId?: string) => ExamAnswerDto | undefined;
    clearAnswer: (questionId: string) => void;
    clearAllAnswers: () => void;
    hasAnswer: (questionId: string, partId?: string) => boolean;
    isQuestionAnswered: (questionId: string, partId?: string) => boolean;

    // Exam completion
    finishExam: (sessionId?: string) => Promise<{
        success: boolean;
        message: string;
        examSummary: {
            totalQuestions: number;
            answeredQuestions: number;
            unansweredQuestions: number;
            markedQuestions: number;
            totalTimeSpent: number;
            completionPercentage: number;
        };
    }>;

    // Exam timing utilities
    getExamDuration: () => number; // Returns duration in seconds
    getFormattedExamDuration: () => string; // Returns formatted duration (HH:MM:SS)
    isExamInProgress: () => boolean;

    // Reset Functions
    resetSelectedExam: () => void;
    resetExamsByCreator: () => void;
    resetSearchResults: () => void;
    resetValidation: () => void;
    resetStatistics: () => void;
    resetError: () => void;
    resetAll: () => void;

    // Utility Functions
    getExamByIdFromCache: (id: string) => ExamDto | undefined;
    getExamsByStatus: (status: string) => ExamDto[];
    getExamsByRange: (startDate: Date, endDate: Date) => ExamDto[];
    hasExamsInCategory: (category: ECourseCategory) => boolean;
    getActiveExamsCount: () => number;
    getInactiveExamsCount: () => number;
    getPublishedExamsCount: () => number;
    getDraftExamsCount: () => number;
    getTotalQuestionsCount: () => number;
    getAverageExamDuration: () => number;
    getExamComplexityScore: (examId: string) => number;
    isExamComplete: (examId: string) => boolean;
    canPublishExam: (examId: string) => boolean;
}

export const useExams = (): UseExamReturn => {
    // State management
    const [exams, setExams] = useState<ExamDto[]>([]);
    const [selectedExam, setSelectedExam] = useState<ExamDto | null>(null);
    const [examsByCreator, setExamsByCreator] = useState<ExamDto[]>([]);
    const [recentExams, setRecentExams] = useState<ExamDto[]>([]);
    const [popularExams, setPopularExams] = useState<ExamDto[]>([]);
    const [publishedExams, setPublishedExams] = useState<ExamDto[]>([]);
    const [draftExams, setDraftExams] = useState<ExamDto[]>([]);
    const [examsRequiringValidation, setExamsRequiringValidation] = useState<ExamDto[]>([]);
    const [examsWithoutQuestions, setExamsWithoutQuestions] = useState<ExamDto[]>([]);
    const [examsWithoutParts, setExamsWithoutParts] = useState<ExamDto[]>([]);
    const [searchResults, setSearchResults] = useState<ExamDto[]>([]);
    const [examStatistics, setExamStatistics] = useState<ExamStatisticsDto | null>(null);
    const [categoryDistribution, setCategoryDistribution] = useState<Record<string, number> | null>(null);
    const [levelDistribution, setLevelDistribution] = useState<Record<string, number> | null>(null);
    const [totalExamCount, setTotalExamCount] = useState<number>(0);
    const [totalPoints, setTotalPoints] = useState<number>(0);
    const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isValidExam, setIsValidExam] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Navigation state for exam taking
    const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [answers, setAnswers] = useState<ExamAnswerDto[]>([]);
    const [tempAnswers, setTempAnswers] = useState<Record<string, string>>({});
    const [examStartTime, setExamStartTime] = useState<Date | null>(null);
    const [examEndTime, setExamEndTime] = useState<Date | null>(null);
    const [isExamFinished, setIsExamFinished] = useState<boolean>(false);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Computed values for navigation
    const currentPart = useMemo(() => {
        if (!selectedExam?.examParts || currentPartIndex < 0 || currentPartIndex >= selectedExam.examParts.length) {
            return null;
        }
        return selectedExam.examParts[currentPartIndex];
    }, [selectedExam, currentPartIndex]);

    // Get questions for current part from exam questions
    const currentPartQuestions = useMemo(() => {
        if (!selectedExam?.examQuestions || !currentPart) {
            return [];
        }
        return selectedExam.examQuestions.filter(question => question.examPart.id === currentPart.id);
    }, [selectedExam, currentPart]);

    const currentQuestion = useMemo(() => {
        if (!currentPartQuestions || currentQuestionIndex < 0 || currentQuestionIndex >= currentPartQuestions.length) {
            return null;
        }
        return currentPartQuestions[currentQuestionIndex];
    }, [currentPartQuestions, currentQuestionIndex]);

    const isFirstQuestion = useMemo(() => {
        return currentPartIndex === 0 && currentQuestionIndex === 0;
    }, [currentPartIndex, currentQuestionIndex]);

    const isLastQuestion = useMemo(() => {
        if (!selectedExam?.examParts) return false;
        const lastPartIndex = selectedExam.examParts.length - 1;

        // Get questions for the last part
        const lastPart = selectedExam.examParts[lastPartIndex];
        const lastPartQuestions = selectedExam.examQuestions?.filter(q => q.examPart.id === lastPart.id) || [];
        const lastQuestionIndex = Math.max(0, lastPartQuestions.length - 1);

        return currentPartIndex === lastPartIndex && currentQuestionIndex === lastQuestionIndex;
    }, [selectedExam, currentPartIndex, currentQuestionIndex]);

    // Helper function to update exam in all relevant states
    const updateExamInStates = useCallback((updatedExam: ExamDto) => {
        const updateInArray = (arr: ExamDto[]) =>
            arr.map(exam => exam.id === updatedExam.id ? updatedExam : exam);

        setExams(prev => updateInArray(prev));
        setExamsByCreator(prev => updateInArray(prev));
        setRecentExams(prev => updateInArray(prev));
        setPopularExams(prev => updateInArray(prev));
        setPublishedExams(prev => updateInArray(prev));
        setDraftExams(prev => updateInArray(prev));
        setExamsRequiringValidation(prev => updateInArray(prev));
        setExamsWithoutQuestions(prev => updateInArray(prev));
        setExamsWithoutParts(prev => updateInArray(prev));
        setSearchResults(prev => updateInArray(prev));

        if (selectedExam?.id === updatedExam.id) {
            setSelectedExam(updatedExam);
        }
    }, []);

    // Helper function to remove exam from all relevant states
    const removeExamFromStates = useCallback((examId: string) => {
        const removeFromArray = (arr: ExamDto[]) => arr.filter(exam => exam.id !== examId);

        setExams(prev => removeFromArray(prev));
        setExamsByCreator(prev => removeFromArray(prev));
        setRecentExams(prev => removeFromArray(prev));
        setPopularExams(prev => removeFromArray(prev));
        setPublishedExams(prev => removeFromArray(prev));
        setDraftExams(prev => removeFromArray(prev));
        setExamsRequiringValidation(prev => removeFromArray(prev));
        setExamsWithoutQuestions(prev => removeFromArray(prev));
        setExamsWithoutParts(prev => removeFromArray(prev));
        setSearchResults(prev => removeFromArray(prev));

        if (selectedExam?.id === examId) {
            setSelectedExam(null);
        }
    }, []);

    // CRUD Operations
    const createExam = useCallback(async (examDto: ExamDto) => {
        try {
            setLoading(true);
            setError(null);
            const newExam = await examService.createExam(examDto);
            setExams(prev => [newExam, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateExam = useCallback(async (examId: string, examDto: ExamDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.updateExam(examId, examDto);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamById = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const exam = await examService.getExamById(examId);
            setSelectedExam(exam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllExams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getAllExams();
            setExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            await examService.deleteExam(examId);
            removeExamFromStates(examId);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeExamFromStates]);

    const softDeleteExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            await examService.softDeleteExam(examId);
            // For soft delete, we might want to update the exam status instead of removing
            const updatedExam = exams.find(e => e.id === examId);
            if (updatedExam) {
                updateExamInStates({ ...updatedExam, deletedAt: new Date() });
            }
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Exam Statistics
    const getExamStatistics = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examService.getExamStatistics(examId);
            setExamStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const calculateTotalPoints = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const points = await examService.calculateTotalPoints(examId);
            setTotalPoints(points);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const calculateEstimatedDuration = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const duration = await examService.calculateEstimatedDuration(examId);
            setEstimatedDuration(duration);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Search & Filter
    const searchExams = useCallback(async (keyword: string) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examService.searchExams(keyword);
            setSearchResults(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const filterExams = useCallback(async (filter: ExamFilterDto) => {
        try {
            setLoading(true);
            setError(null);
            const results = await examService.filterExams(filter);
            setExams(results);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByCreator = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsByCreator(userId);
            setExamsByCreator(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecentExams = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getRecentExams(limit);
            setRecentExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPopularExams = useCallback(async (limit: number = 10) => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getPopularExams(limit);
            setPopularExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Analytics & Reports
    const getTotalExamCount = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const count = await examService.getTotalExamCount();
            setTotalExamCount(count);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamDistributionByCategory = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await examService.getExamDistributionByCategory();
            setCategoryDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamDistributionByLevel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const distribution = await examService.getExamDistributionByLevel();
            setLevelDistribution(distribution);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getPublishedExams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getPublishedExams();
            setPublishedExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getDraftExams = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getDraftExams();
            setDraftExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Advanced Operations
    const getExamsRequiringValidation = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsRequiringValidation();
            setExamsRequiringValidation(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsWithoutQuestions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsWithoutQuestions();
            setExamsWithoutQuestions(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsWithoutParts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsWithoutParts();
            setExamsWithoutParts(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Template Integration
    const addQuestionsFromTemplates = useCallback(async (examId: string, templateIds: string[], partId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.addQuestionsFromTemplates(examId, templateIds, partId);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const removeQuestionsWithTemplate = useCallback(async (examId: string, templateId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.removeQuestionsWithTemplate(examId, templateId);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    // Bulk Operations
    const createMultipleExams = useCallback(async (examDtos: ExamDto[]) => {
        try {
            setLoading(true);
            setError(null);
            const newExams = await examService.createMultipleExams(examDtos);
            setExams(prev => [...newExams, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteMultipleExams = useCallback(async (examIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            await examService.deleteMultipleExams(examIds);
            examIds.forEach(examId => removeExamFromStates(examId));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [removeExamFromStates]);

    const publishMultipleExams = useCallback(async (examIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const publishedExamList = await examService.publishMultipleExams(examIds);
            publishedExamList.forEach(exam => updateExamInStates(exam));
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    // Utility Operations
    const existsByName = useCallback(async (name: string, category: ECourseCategory): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examService.existsByName(name, category);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const existsByCode = useCallback(async (code: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            return await examService.existsByCode(code);
        } catch (err) {
            handleError(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const findByCode = useCallback(async (code: string) => {
        try {
            setLoading(true);
            setError(null);
            const exam = await examService.findByCode(code);
            setSelectedExam(exam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByCategory = useCallback(async (category: ECourseCategory) => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsByCategory(category);
            setExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamsByLevel = useCallback(async (level: string) => {
        try {
            setLoading(true);
            setError(null);
            const examList = await examService.getExamsByLevel(level);
            setExams(examList);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Exam Management
    const activateExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const activatedExam = await examService.activateExam(examId);
            updateExamInStates(activatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const deactivateExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const deactivatedExam = await examService.deactivateExam(examId);
            updateExamInStates(deactivatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const publishExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const publishedExam = await examService.publishExam(examId);
            updateExamInStates(publishedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const unpublishExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const unpublishedExam = await examService.unpublishExam(examId);
            updateExamInStates(unpublishedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const duplicateExam = useCallback(async (examId: string, newName: string) => {
        try {
            setLoading(true);
            setError(null);
            const duplicatedExam = await examService.duplicateExam(examId, newName);
            setExams(prev => [duplicatedExam, ...prev]);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Question Management
    const addQuestionToExam = useCallback(async (examId: string, templateId: string, order?: number, points?: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.addQuestionToExam(examId, templateId, order, points);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const removeQuestionFromExam = useCallback(async (examId: string, questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.removeQuestionFromExam(examId, questionId);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const reorderQuestions = useCallback(async (examId: string, questionIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.reorderQuestions(examId, questionIds);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const updateQuestionPoints = useCallback(async (examId: string, questionId: string, points: number) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.updateQuestionPoints(examId, questionId, points);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const updateQuestionSettings = useCallback(async (examId: string, questionId: string, settings: ExamQuestionDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.updateQuestionSettings(examId, questionId, settings);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    // Part Management
    const addExamPart = useCallback(async (examId: string, partDto: ExamPartDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.addExamPart(examId, partDto);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const updateExamPart = useCallback(async (examId: string, partId: string, partDto: ExamPartDto) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.updateExamPart(examId, partId, partDto);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const removeExamPart = useCallback(async (examId: string, partId: string) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.removeExamPart(examId, partId);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    const reorderParts = useCallback(async (examId: string, partIds: string[]) => {
        try {
            setLoading(true);
            setError(null);
            const updatedExam = await examService.reorderParts(examId, partIds);
            updateExamInStates(updatedExam);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, [updateExamInStates]);

    // Validation & Statistics
    const validateExam = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const isValid = await examService.validateExam(examId);
            setIsValidExam(isValid);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getExamValidationErrors = useCallback(async (examId: string) => {
        try {
            setLoading(true);
            setError(null);
            const errors = await examService.getExamValidationErrors(examId);
            setValidationErrors(errors);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Navigation functions for exam taking
    const goToQuestion = useCallback((partIndex: number, questionIndex: number) => {
        if (!selectedExam?.examParts || !selectedExam?.examQuestions) return;

        const targetPart = selectedExam.examParts[partIndex];
        if (!targetPart) return;

        // Get questions for target part
        const targetPartQuestions = selectedExam.examQuestions.filter(q => q.examPart.id === targetPart.id);

        if (questionIndex >= 0 && questionIndex < targetPartQuestions.length) {
            setCurrentPartIndex(partIndex);
            setCurrentQuestionIndex(questionIndex);
        }
    }, [selectedExam]);

    const goToNextQuestion = useCallback(() => {
        if (!selectedExam?.examParts || !selectedExam?.examQuestions) return;

        const currentPart = selectedExam.examParts[currentPartIndex];
        if (!currentPart) return;

        // Get questions for current part
        const currentPartQuestions = selectedExam.examQuestions.filter(q => q.examPart.id === currentPart.id);

        // Check if we can move to next question in current part
        if (currentQuestionIndex < currentPartQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Move to first question of next part
            if (currentPartIndex < selectedExam.examParts.length - 1) {
                setCurrentPartIndex(prev => prev + 1);
                setCurrentQuestionIndex(0);
            }
        }
    }, [selectedExam, currentPartIndex, currentQuestionIndex]);

    const goToPreviousQuestion = useCallback(() => {
        if (!selectedExam?.examParts || !selectedExam?.examQuestions) return;

        // Check if we can move to previous question in current part
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            // Move to last question of previous part
            if (currentPartIndex > 0) {
                const previousPart = selectedExam.examParts[currentPartIndex - 1];
                if (previousPart) {
                    // Get questions for previous part
                    const previousPartQuestions = selectedExam.examQuestions.filter(q => q.examPart.id === previousPart.id);
                    setCurrentPartIndex(prev => prev - 1);
                    setCurrentQuestionIndex(Math.max(0, previousPartQuestions.length - 1));
                }
            }
        }
    }, [selectedExam, currentPartIndex, currentQuestionIndex]);

    const goToFirstQuestion = useCallback(() => {
        setCurrentPartIndex(0);
        setCurrentQuestionIndex(0);
    }, []);

    const goToLastQuestion = useCallback(() => {
        if (!selectedExam?.examParts || !selectedExam?.examQuestions) return;

        const lastPartIndex = selectedExam.examParts.length - 1;
        const lastPart = selectedExam.examParts[lastPartIndex];
        if (lastPart) {
            // Get questions for last part
            const lastPartQuestions = selectedExam.examQuestions.filter(q => q.examPart.id === lastPart.id);
            setCurrentPartIndex(lastPartIndex);
            setCurrentQuestionIndex(Math.max(0, lastPartQuestions.length - 1));
        }
    }, [selectedExam]);

    const setCurrentPart = useCallback((partIndex: number) => {
        if (!selectedExam?.examParts) return;

        if (partIndex >= 0 && partIndex < selectedExam.examParts.length) {
            setCurrentPartIndex(partIndex);
            setCurrentQuestionIndex(0); // Reset to first question of the part
        }
    }, [selectedExam]);

    // Answer management for exam taking
    const setAnswer = useCallback((questionId: string, answerData: string) => {
        const newAnswer: ExamAnswerDto = {
            id: `temp-${questionId}-${Date.now()}`,
            sessionId: '', // Will be set when session is created
            questionId,
            answerData,
            previousAnswerData: '',
            firstAnsweredAt: new Date().toISOString(),
            lastModifiedAt: new Date().toISOString(),
            timeSpentOnQuestion: 0,
            modificationCount: 1,
            isAnswered: true,
            isMarkedForReview: false,
            isSkipped: false,
            isAutoSaved: false,
            score: 0,
            isCorrect: false,
            feedback: '',
            createdAt: new Date(),
            deletedAt: null,
            status: null,
            createdById: null,
            deletedById: null
        };

        setAnswers(prev => {
            const existingIndex = prev.findIndex(a => a.questionId === questionId);
            if (existingIndex >= 0) {
                const updatedAnswers = [...prev];
                updatedAnswers[existingIndex] = {
                    ...updatedAnswers[existingIndex],
                    answerData,
                    lastModifiedAt: new Date().toISOString(),
                    modificationCount: (updatedAnswers[existingIndex].modificationCount || 0) + 1,
                    isAnswered: true
                };
                return updatedAnswers;
            }
            return [...prev, newAnswer];
        });
    }, []);

    const setTempAnswer = useCallback((questionId: string, answer: string) => {
        setTempAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    }, []);

    const getTempAnswer = useCallback((questionId: string): string | undefined => {
        return tempAnswers[questionId];
    }, [tempAnswers]);

    const getAnswer = useCallback((questionId: string): ExamAnswerDto | undefined => {
        return answers.find(a => a.questionId === questionId);
    }, [answers]);

    const getAnswerByQuestionAndPart = useCallback((questionId: string, partId?: string): ExamAnswerDto | undefined => {
        return answers.find(a => {
            const matchesQuestion = a.questionId === questionId;
            if (!partId) {
                return matchesQuestion && !a.questionPartId;
            }
            return matchesQuestion && a.questionPartId === partId;
        });
    }, [answers]);

    const clearAnswer = useCallback((questionId: string) => {
        setAnswers(prev => prev.filter(a => a.questionId !== questionId));
        setTempAnswers(prev => {
            const newTempAnswers = { ...prev };
            delete newTempAnswers[questionId];
            return newTempAnswers;
        });
    }, []);

    const clearAllAnswers = useCallback(() => {
        setAnswers([]);
        setTempAnswers({});
    }, []);

    const hasAnswer = useCallback((questionId: string, partId?: string): boolean => {
        if (partId) {
            return answers.some(a => a.questionId === questionId && a.questionPartId === partId);
        }
        return answers.some(a => a.questionId === questionId);
    }, [answers]);

    const isQuestionAnswered = useCallback((questionId: string, partId?: string): boolean => {
        const answer = getAnswerByQuestionAndPart(questionId, partId);
        return answer?.isAnswered || false;
    }, [getAnswerByQuestionAndPart]);

    // Exam completion
    const finishExam = useCallback(async (sessionId?: string) => {
        try {
            setLoading(true);
            setError(null);

            const currentTime = new Date();
            setExamEndTime(currentTime);

            // Auto-save any pending temp answers before finishing
            if (Object.keys(tempAnswers).length > 0) {
                Object.entries(tempAnswers).forEach(([questionId, answerData]) => {
                    setAnswer(questionId, answerData);
                });
                setTempAnswers({});
            }

            // Calculate exam summary
            const totalQuestions = selectedExam?.examQuestions?.length || 0;
            const answeredQuestions = answers.filter(a => a.isAnswered).length;
            const unansweredQuestions = totalQuestions - answeredQuestions;
            const markedQuestions = answers.filter(a => a.isMarkedForReview).length;

            // Calculate total time spent using examStartTime and current time
            const totalTimeSpent = examStartTime
                ? Math.round((currentTime.getTime() - examStartTime.getTime()) / 1000) // in seconds
                : 0;

            const completionPercentage = totalQuestions > 0
                ? Math.round((answeredQuestions / totalQuestions) * 100)
                : 0;

            const examSummary = {
                totalQuestions,
                answeredQuestions,
                unansweredQuestions,
                markedQuestions,
                totalTimeSpent,
                completionPercentage
            };

            // Mark exam as finished
            setIsExamFinished(true);

            // If sessionId is provided, you can call exam submission API here
            if (sessionId && selectedExam) {
                try {
                    // Call your exam submission service
                    // await examSessionService.submitExam(sessionId, answers);
                    console.log('Exam submitted successfully for session:', sessionId);
                } catch (submissionError) {
                    console.error('Failed to submit exam:', submissionError);
                    throw new Error('Failed to submit exam to server');
                }
            }

            return {
                success: true,
                message: `Exam completed successfully! You answered ${answeredQuestions} out of ${totalQuestions} questions.`,
                examSummary
            };

        } catch (err) {
            handleError(err);
            return {
                success: false,
                message: 'Failed to finish exam. Please try again.',
                examSummary: {
                    totalQuestions: 0,
                    answeredQuestions: 0,
                    unansweredQuestions: 0,
                    markedQuestions: 0,
                    totalTimeSpent: 0,
                    completionPercentage: 0
                }
            };
        } finally {
            setLoading(false);
        }
    }, [selectedExam, answers, tempAnswers, examStartTime, setAnswer]);

    // Exam timing utilities
    const getExamDuration = useCallback((): number => {
        if (!examStartTime) return 0;

        const endTime = examEndTime || new Date();
        return Math.round((endTime.getTime() - examStartTime.getTime()) / 1000);
    }, [examStartTime, examEndTime]);

    const getFormattedExamDuration = useCallback((): string => {
        const totalSeconds = getExamDuration();

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [getExamDuration]);

    const isExamInProgress = useCallback((): boolean => {
        return examStartTime !== null && examEndTime === null && !isExamFinished;
    }, [examStartTime, examEndTime, isExamFinished]);

    // Start exam timer when exam is selected
    useEffect(() => {
        if (selectedExam && !examStartTime && !isExamFinished) {
            setExamStartTime(new Date());
        }
    }, [selectedExam, examStartTime, isExamFinished]);

    // Reset Functions
    const resetSelectedExam = useCallback(() => {
        setSelectedExam(null);
    }, []);

    const resetExamsByCreator = useCallback(() => {
        setExamsByCreator([]);
    }, []);

    const resetSearchResults = useCallback(() => {
        setSearchResults([]);
    }, []);

    const resetValidation = useCallback(() => {
        setValidationErrors([]);
        setIsValidExam(null);
    }, []);

    const resetStatistics = useCallback(() => {
        setExamStatistics(null);
        setCategoryDistribution(null);
        setLevelDistribution(null);
        setTotalPoints(0);
        setEstimatedDuration(0);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetAll = useCallback(() => {
        setExams([]);
        setSelectedExam(null);
        setExamsByCreator([]);
        setRecentExams([]);
        setPopularExams([]);
        setPublishedExams([]);
        setDraftExams([]);
        setExamsRequiringValidation([]);
        setExamsWithoutQuestions([]);
        setExamsWithoutParts([]);
        setSearchResults([]);
        setExamStatistics(null);
        setCategoryDistribution(null);
        setLevelDistribution(null);
        setTotalExamCount(0);
        setTotalPoints(0);
        setEstimatedDuration(0);
        setValidationErrors([]);
        setIsValidExam(null);
        setError(null);
        // Reset navigation state
        setCurrentPartIndex(0);
        setCurrentQuestionIndex(0);
        setAnswers([]);
        setTempAnswers({});
        setExamStartTime(null);
        setExamEndTime(null);
        setIsExamFinished(false);
    }, []);

    // Utility Functions
    const getExamByIdFromCache = useCallback((id: string): ExamDto | undefined => {
        return exams.find(exam => exam.id === id);
    }, [exams]);

    const getExamsByStatus = useCallback((status: string): ExamDto[] => {
        return exams.filter(exam => exam.status === status);
    }, [exams]);

    const getExamsByRange = useCallback((startDate: Date, endDate: Date): ExamDto[] => {
        return exams.filter(exam => {
            const examDate = new Date(exam.createdAt || '');
            return examDate >= startDate && examDate <= endDate;
        });
    }, [exams]);

    const hasExamsInCategory = useCallback((category: ECourseCategory): boolean => {
        return exams.some(exam => exam.category === category);
    }, [exams]);

    const getActiveExamsCount = useCallback((): number => {
        return exams.filter(exam => exam.isActive !== false).length;
    }, [exams]);

    const getInactiveExamsCount = useCallback((): number => {
        return exams.filter(exam => exam.isActive === false).length;
    }, [exams]);

    const getPublishedExamsCount = useCallback((): number => {
        return exams.filter(exam => exam.isPublished === true).length;
    }, [exams]);

    const getDraftExamsCount = useCallback((): number => {
        return exams.filter(exam => exam.isPublished === false || exam.isPublished === undefined).length;
    }, [exams]);

    const getTotalQuestionsCount = useCallback((): number => {
        return exams.reduce((total, exam) => {
            return total + (exam.examQuestions?.length || 0);
        }, 0);
    }, [exams]);

    const getAverageExamDuration = useCallback((): number => {
        const validExams = exams.filter(exam => exam.duration && exam.duration > 0);
        if (validExams.length === 0) return 0;

        const totalDuration = validExams.reduce((total, exam) => total + (exam.duration || 0), 0);
        return Math.round(totalDuration / validExams.length);
    }, [exams]);

    const getExamComplexityScore = useCallback((examId: string): number => {
        const exam = getExamByIdFromCache(examId);
        if (!exam) return 0;

        let complexityScore = 0;

        // Base score from question count
        const questionCount = exam.examQuestions?.length || 0;
        complexityScore += questionCount * 2;

        // Add score based on parts
        const partCount = exam.examParts?.length || 0;
        complexityScore += partCount * 5;

        // Add score based on duration
        const duration = exam.duration || 0;
        complexityScore += Math.min(duration / 10, 20); // Max 20 points for duration

        // Add score based on total points
        const totalPoints = exam.examQuestions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;
        complexityScore += Math.min(totalPoints / 5, 30); // Max 30 points for total points

        return Math.round(complexityScore);
    }, [getExamByIdFromCache]);

    const isExamComplete = useCallback((examId: string): boolean => {
        const exam = getExamByIdFromCache(examId);
        if (!exam) return false;

        return !!(
            exam.name &&
            exam.description &&
            exam.examQuestions && exam.examQuestions.length > 0 &&
            exam.duration && exam.duration > 0
        );
    }, [getExamByIdFromCache]);

    const canPublishExam = useCallback((examId: string): boolean => {
        if (!isExamComplete(examId)) return false;

        const exam = getExamByIdFromCache(examId);
        if (!exam) return false;

        // Check if exam is already published
        if (exam.isPublished) return false;

        // Check validation status
        return isValidExam === true && validationErrors.length === 0;
    }, [isExamComplete, getExamByIdFromCache, isValidExam, validationErrors]);

    // Initial data loading
    useEffect(() => {
        getAllExams();
    }, [getAllExams]);

    return {
        // State
        exams,
        selectedExam,
        examsByCreator,
        recentExams,
        popularExams,
        publishedExams,
        draftExams,
        examsRequiringValidation,
        examsWithoutQuestions,
        examsWithoutParts,
        searchResults,
        examStatistics,
        categoryDistribution,
        levelDistribution,
        totalExamCount,
        totalPoints,
        estimatedDuration,
        validationErrors,
        isValidExam,
        loading,
        error,

        // Navigation state for exam taking
        currentPartIndex,
        currentQuestionIndex,
        currentPart,
        currentQuestion,
        answers,
        tempAnswers,
        isLastQuestion,
        isFirstQuestion,

        // CRUD Operations
        createExam,
        updateExam,
        getExamById,
        getAllExams,
        deleteExam,
        softDeleteExam,

        // Exam Statistics
        getExamStatistics,
        calculateTotalPoints,
        calculateEstimatedDuration,

        // Search & Filter
        searchExams,
        filterExams,
        getExamsByCreator,
        getRecentExams,
        getPopularExams,

        // Analytics & Reports
        getTotalExamCount,
        getExamDistributionByCategory,
        getExamDistributionByLevel,
        getPublishedExams,
        getDraftExams,

        // Advanced Operations
        getExamsRequiringValidation,
        getExamsWithoutQuestions,
        getExamsWithoutParts,

        // Template Integration
        addQuestionsFromTemplates,
        removeQuestionsWithTemplate,

        // Bulk Operations
        createMultipleExams,
        deleteMultipleExams,
        publishMultipleExams,

        // Utility Operations
        existsByName,
        existsByCode,
        findByCode,
        getExamsByCategory,
        getExamsByLevel,

        // Exam Management
        activateExam,
        deactivateExam,
        publishExam,
        unpublishExam,
        duplicateExam,

        // Question Management
        addQuestionToExam,
        removeQuestionFromExam,
        reorderQuestions,
        updateQuestionPoints,
        updateQuestionSettings,

        // Part Management
        addExamPart,
        updateExamPart,
        removeExamPart,
        reorderParts,

        // Validation & Statistics
        validateExam,
        getExamValidationErrors,

        // Navigation functions for exam taking
        goToQuestion,
        goToNextQuestion,
        goToPreviousQuestion,
        goToFirstQuestion,
        goToLastQuestion,
        setCurrentPart,

        // Answer management for exam taking
        setAnswer,
        setTempAnswer,
        getTempAnswer,
        getAnswer,
        getAnswerByQuestionAndPart,
        clearAnswer,
        clearAllAnswers,
        hasAnswer,
        isQuestionAnswered,

        // Exam completion
        finishExam,

        // Exam timing utilities
        getExamDuration,
        getFormattedExamDuration,
        isExamInProgress,

        // Reset Functions
        resetSelectedExam,
        resetExamsByCreator,
        resetSearchResults,
        resetValidation,
        resetStatistics,
        resetError,
        resetAll,

        // Utility Functions
        getExamByIdFromCache,
        getExamsByStatus,
        getExamsByRange,
        hasExamsInCategory,
        getActiveExamsCount,
        getInactiveExamsCount,
        getPublishedExamsCount,
        getDraftExamsCount,
        getTotalQuestionsCount,
        getAverageExamDuration,
        getExamComplexityScore,
        isExamComplete,
        canPublishExam
    };
};