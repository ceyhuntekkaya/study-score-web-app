import { useState, useCallback, useEffect, useRef } from 'react';
import { ExamAnswerDto } from '@/types/exam/exam-type';
import {examAnswerService} from "@/services/api/exam/exam-answer-service";

interface SessionProgress {
    totalQuestions: number;
    answeredQuestions: number;
    unansweredQuestions: number;
    markedQuestions: number;
    skippedQuestions: number;
    completionPercentage: number;
    totalTimeSpent: number;
    averageTimePerQuestion: number;
}

interface QuestionStatus {
    isAnswered: boolean;
    isMarkedForReview: boolean;
    timeSpent: number;
    modificationCount: number;
    lastModified: string | null;
}

interface AutoSaveState {
    isAutoSaving: boolean;
    lastAutoSaveTime: Date | null;
    autoSaveInterval: number; // in milliseconds
    pendingChanges: Record<string, string>;
}

interface UseExamAnswerReturn {
    sessionAnswers: ExamAnswerDto[];
    currentAnswer: ExamAnswerDto | null;
    answeredQuestions: ExamAnswerDto[];
    unansweredQuestions: ExamAnswerDto[];
    markedQuestions: ExamAnswerDto[];
    sessionProgress: SessionProgress | null;
    answerStatistics: Record<string, number> | null;
    timeSpentByQuestion: Record<string, number> | null;
    validationErrors: string[];
    autoSaveState: AutoSaveState;
    loading: boolean;
    saving: boolean;
    error: Error | null;

    // Core Answer Operations
    saveAnswer: (sessionId: string, questionId: string, answerData: string) => Promise<void>;
    submitAnswer: (sessionId: string, questionId: string, answerData: string) => Promise<void>;
    clearAnswer: (sessionId: string, questionId: string) => Promise<void>;

    // Mark for Review Operations
    markForReview: (sessionId: string, questionId: string, marked: boolean) => Promise<void>;

    // Answer Retrieval
    getAnswer: (sessionId: string, questionId: string) => Promise<void>;
    getSessionAnswers: (sessionId: string) => Promise<void>;
    getAnsweredQuestions: (sessionId: string) => Promise<void>;
    getUnansweredQuestions: (sessionId: string) => Promise<void>;
    getMarkedQuestions: (sessionId: string) => Promise<void>;

    // Bulk Operations
    saveMultipleAnswers: (sessionId: string, answerMap: Record<string, string>) => Promise<void>;
    clearAllAnswers: (sessionId: string) => Promise<void>;

    // Answer Statistics
    getAnswerStatistics: (sessionId: string) => Promise<void>;
    getCompletionPercentage: (sessionId: string) => Promise<number>;
    getSessionProgress: (sessionId: string) => Promise<void>;

    // Time Tracking
    updateTimeSpent: (sessionId: string, questionId: string, timeSpentSeconds: number) => Promise<void>;
    getTimeSpentByQuestion: (sessionId: string) => Promise<void>;

    // Answer Validation
    validateSessionAnswers: (sessionId: string) => Promise<void>;

    // Auto-save Operations
    enableAutoSave: (sessionId: string, interval?: number) => void;
    disableAutoSave: () => void;
    autoSaveAnswer: (sessionId: string, questionId: string, answerData: string) => Promise<void>;
    triggerAutoSave: (sessionId: string) => Promise<void>;

    // Navigation Helpers
    getNextUnansweredQuestion: (sessionId: string, currentQuestionId?: string) => Promise<ExamAnswerDto | null>;
    getPreviousAnsweredQuestion: (sessionId: string, currentQuestionId?: string) => Promise<ExamAnswerDto | null>;

    // Status Helpers
    isQuestionAnswered: (sessionId: string, questionId: string) => Promise<boolean>;
    isQuestionMarkedForReview: (sessionId: string, questionId: string) => Promise<boolean>;
    hasAnyAnswers: (sessionId: string) => Promise<boolean>;
    isSessionComplete: (sessionId: string) => Promise<boolean>;
    getQuestionStatus: (sessionId: string, questionId: string) => Promise<QuestionStatus | null>;

    // Reset Functions
    resetCurrentAnswer: () => void;
    resetSessionData: () => void;
    resetValidationErrors: () => void;
    resetError: () => void;
    resetAll: () => void;

    // Utility Functions
    getAnswerById: (questionId: string) => ExamAnswerDto | undefined;
    getAnswerProgress: () => number;
    getTimeSpentOnCurrentQuestion: (questionId: string) => number;
    isAnswerModified: (questionId: string, newAnswer: string) => boolean;
    getTotalAnsweredCount: () => number;
    getTotalUnansweredCount: () => number;
    getTotalMarkedCount: () => number;
    canSubmitExam: () => boolean;
    getAnswerSummary: () => {
        total: number;
        answered: number;
        unanswered: number;
        marked: number;
        percentage: number;
    };
}

export const useExamAnswer = (): UseExamAnswerReturn => {
    // State management
    const [sessionAnswers, setSessionAnswers] = useState<ExamAnswerDto[]>([]);
    const [currentAnswer, setCurrentAnswer] = useState<ExamAnswerDto | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState<ExamAnswerDto[]>([]);
    const [unansweredQuestions, setUnansweredQuestions] = useState<ExamAnswerDto[]>([]);
    const [markedQuestions, setMarkedQuestions] = useState<ExamAnswerDto[]>([]);
    const [sessionProgress, setSessionProgress] = useState<SessionProgress | null>(null);
    const [answerStatistics, setAnswerStatistics] = useState<Record<string, number> | null>(null);
    const [timeSpentByQuestion, setTimeSpentByQuestion] = useState<Record<string, number> | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [autoSaveState, setAutoSaveState] = useState<AutoSaveState>({
        isAutoSaving: false,
        lastAutoSaveTime: null,
        autoSaveInterval: 30000, // 30 seconds default
        pendingChanges: {}
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Refs for auto-save
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const currentSessionRef = useRef<string | null>(null);

    // Helper function for error handling
    const handleError = (err: unknown) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
    };

    // Helper function to update answer in all relevant states
    const updateAnswerInStates = useCallback((updatedAnswer: ExamAnswerDto) => {
        const updateInArray = (arr: ExamAnswerDto[]) =>
            arr.map(answer => answer.questionId === updatedAnswer.questionId ? updatedAnswer : answer);

        setSessionAnswers(prev => updateInArray(prev));

        // Update specific lists based on answer status
        if (updatedAnswer.isAnswered) {
            setAnsweredQuestions(prev => {
                const filtered = prev.filter(a => a.questionId !== updatedAnswer.questionId);
                return [...filtered, updatedAnswer];
            });
            setUnansweredQuestions(prev => prev.filter(a => a.questionId !== updatedAnswer.questionId));
        } else {
            setUnansweredQuestions(prev => {
                const filtered = prev.filter(a => a.questionId !== updatedAnswer.questionId);
                return [...filtered, updatedAnswer];
            });
            setAnsweredQuestions(prev => prev.filter(a => a.questionId !== updatedAnswer.questionId));
        }

        if (updatedAnswer.isMarkedForReview) {
            setMarkedQuestions(prev => {
                const filtered = prev.filter(a => a.questionId !== updatedAnswer.questionId);
                return [...filtered, updatedAnswer];
            });
        } else {
            setMarkedQuestions(prev => prev.filter(a => a.questionId !== updatedAnswer.questionId));
        }

        if (currentAnswer?.questionId === updatedAnswer.questionId) {
            setCurrentAnswer(updatedAnswer);
        }
    }, [currentAnswer]);

    // Core Answer Operations
    const saveAnswer = useCallback(async (sessionId: string, questionId: string, answerData: string) => {
        try {
            setSaving(true);
            setError(null);
            const updatedAnswer = await examAnswerService.saveAnswer(sessionId, questionId, answerData);
            updateAnswerInStates(updatedAnswer);
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [updateAnswerInStates]);

    const submitAnswer = useCallback(async (sessionId: string, questionId: string, answerData: string) => {
        try {
            setSaving(true);
            setError(null);
            const updatedAnswer = await examAnswerService.submitAnswer(sessionId, questionId, answerData);
            updateAnswerInStates(updatedAnswer);
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [updateAnswerInStates]);

    const clearAnswer = useCallback(async (sessionId: string, questionId: string) => {
        try {
            setSaving(true);
            setError(null);
            const updatedAnswer = await examAnswerService.clearAnswer(sessionId, questionId);
            updateAnswerInStates(updatedAnswer);
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [updateAnswerInStates]);

    // Mark for Review Operations
    const markForReview = useCallback(async (sessionId: string, questionId: string, marked: boolean) => {
        try {
            setSaving(true);
            setError(null);
            const updatedAnswer = await examAnswerService.markForReview(sessionId, questionId, marked);
            updateAnswerInStates(updatedAnswer);
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [updateAnswerInStates]);

    // Answer Retrieval
    const getAnswer = useCallback(async (sessionId: string, questionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const answer = await examAnswerService.getAnswer(sessionId, questionId);
            setCurrentAnswer(answer);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionAnswers = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const answers = await examAnswerService.getSessionAnswers(sessionId);
            setSessionAnswers(answers);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getAnsweredQuestions = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const answers = await examAnswerService.getAnsweredQuestions(sessionId);
            setAnsweredQuestions(answers);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUnansweredQuestions = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const answers = await examAnswerService.getUnansweredQuestions(sessionId);
            setUnansweredQuestions(answers);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMarkedQuestions = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const answers = await examAnswerService.getMarkedQuestions(sessionId);
            setMarkedQuestions(answers);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Bulk Operations
    const saveMultipleAnswers = useCallback(async (sessionId: string, answerMap: Record<string, string>) => {
        try {
            setSaving(true);
            setError(null);
            const updatedAnswers = await examAnswerService.saveMultipleAnswers(sessionId, answerMap);
            updatedAnswers.forEach(answer => updateAnswerInStates(answer));
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [updateAnswerInStates]);

    const clearAllAnswers = useCallback(async (sessionId: string) => {
        try {
            setSaving(true);
            setError(null);
            await examAnswerService.clearAllAnswers(sessionId);
            // Refresh session data after clearing
            await getSessionAnswers(sessionId);
        } catch (err) {
            handleError(err);
        } finally {
            setSaving(false);
        }
    }, [getSessionAnswers]);

    // Answer Statistics
    const getAnswerStatistics = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const statistics = await examAnswerService.getAnswerStatistics(sessionId);
            setAnswerStatistics(statistics);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCompletionPercentage = useCallback(async (sessionId: string): Promise<number> => {
        try {
            setLoading(true);
            setError(null);
            return await examAnswerService.getCompletionPercentage(sessionId);
        } catch (err) {
            handleError(err);
            return 0;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSessionProgress = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const progress = await examAnswerService.getSessionProgress(sessionId);
            setSessionProgress(progress);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Time Tracking
    const updateTimeSpent = useCallback(async (sessionId: string, questionId: string, timeSpentSeconds: number) => {
        try {
            setError(null);
            const updatedAnswer = await examAnswerService.updateTimeSpent(sessionId, questionId, timeSpentSeconds);
            updateAnswerInStates(updatedAnswer);
        } catch (err) {
            handleError(err);
        }
    }, [updateAnswerInStates]);

    const getTimeSpentByQuestion = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const timeSpent = await examAnswerService.getTimeSpentByQuestion(sessionId);
            setTimeSpentByQuestion(timeSpent);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Answer Validation
    const validateSessionAnswers = useCallback(async (sessionId: string) => {
        try {
            setLoading(true);
            setError(null);
            const errors = await examAnswerService.validateSessionAnswers(sessionId);
            setValidationErrors(errors);
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Auto-save Operations
    const enableAutoSave = useCallback((sessionId: string, interval: number = 30000) => {
        currentSessionRef.current = sessionId;
        setAutoSaveState(prev => ({
            ...prev,
            autoSaveInterval: interval
        }));

        // Clear existing timer
        if (autoSaveTimerRef.current) {
            clearInterval(autoSaveTimerRef.current);
        }

        // Set up new timer
        autoSaveTimerRef.current = setInterval(async () => {
            if (Object.keys(autoSaveState.pendingChanges).length > 0) {
                await triggerAutoSave(sessionId);
            }
        }, interval);
    }, [autoSaveState.pendingChanges]);

    const disableAutoSave = useCallback(() => {
        if (autoSaveTimerRef.current) {
            clearInterval(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }
        currentSessionRef.current = null;
        setAutoSaveState(prev => ({
            ...prev,
            isAutoSaving: false,
            pendingChanges: {}
        }));
    }, []);

    const autoSaveAnswer = useCallback(async (sessionId: string, questionId: string, answerData: string) => {
        // Add to pending changes
        setAutoSaveState(prev => ({
            ...prev,
            pendingChanges: {
                ...prev.pendingChanges,
                [questionId]: answerData
            }
        }));

        // If not already auto-saving, trigger immediate save
        if (!autoSaveState.isAutoSaving) {
            try {
                setAutoSaveState(prev => ({ ...prev, isAutoSaving: true }));
                const updatedAnswer = await examAnswerService.autoSaveAnswer(sessionId, questionId, answerData);
                updateAnswerInStates(updatedAnswer);

                setAutoSaveState(prev => ({
                    ...prev,
                    isAutoSaving: false,
                    lastAutoSaveTime: new Date(),
                    pendingChanges: Object.fromEntries(
                        Object.entries(prev.pendingChanges).filter(([key]) => key !== questionId)
                    )
                }));
            } catch (err) {
                setAutoSaveState(prev => ({ ...prev, isAutoSaving: false }));
                handleError(err);
            }
        }
    }, [autoSaveState.isAutoSaving, updateAnswerInStates]);

    const triggerAutoSave = useCallback(async (sessionId: string) => {
        if (Object.keys(autoSaveState.pendingChanges).length === 0) return;

        try {
            setAutoSaveState(prev => ({ ...prev, isAutoSaving: true }));
            const updatedAnswers = await examAnswerService.autoSaveMultipleAnswers(sessionId, autoSaveState.pendingChanges);
            updatedAnswers.forEach(answer => updateAnswerInStates(answer));

            setAutoSaveState(prev => ({
                ...prev,
                isAutoSaving: false,
                lastAutoSaveTime: new Date(),
                pendingChanges: {}
            }));
        } catch (err) {
            setAutoSaveState(prev => ({ ...prev, isAutoSaving: false }));
            handleError(err);
        }
    }, [autoSaveState.pendingChanges, updateAnswerInStates]);

    // Navigation Helpers
    const getNextUnansweredQuestion = useCallback(async (sessionId: string, currentQuestionId?: string): Promise<ExamAnswerDto | null> => {
        try {
            setError(null);
            return await examAnswerService.getNextUnansweredQuestion(sessionId, currentQuestionId);
        } catch (err) {
            handleError(err);
            return null;
        }
    }, []);

    const getPreviousAnsweredQuestion = useCallback(async (sessionId: string, currentQuestionId?: string): Promise<ExamAnswerDto | null> => {
        try {
            setError(null);
            return await examAnswerService.getPreviousAnsweredQuestion(sessionId, currentQuestionId);
        } catch (err) {
            handleError(err);
            return null;
        }
    }, []);

    // Status Helpers
    const isQuestionAnswered = useCallback(async (sessionId: string, questionId: string): Promise<boolean> => {
        try {
            setError(null);
            return await examAnswerService.isQuestionAnswered(sessionId, questionId);
        } catch (err) {
            handleError(err);
            return false;
        }
    }, []);

    const isQuestionMarkedForReview = useCallback(async (sessionId: string, questionId: string): Promise<boolean> => {
        try {
            setError(null);
            return await examAnswerService.isQuestionMarkedForReview(sessionId, questionId);
        } catch (err) {
            handleError(err);
            return false;
        }
    }, []);

    const hasAnyAnswers = useCallback(async (sessionId: string): Promise<boolean> => {
        try {
            setError(null);
            return await examAnswerService.hasAnyAnswers(sessionId);
        } catch (err) {
            handleError(err);
            return false;
        }
    }, []);

    const isSessionComplete = useCallback(async (sessionId: string): Promise<boolean> => {
        try {
            setError(null);
            return await examAnswerService.isSessionComplete(sessionId);
        } catch (err) {
            handleError(err);
            return false;
        }
    }, []);

    const getQuestionStatus = useCallback(async (sessionId: string, questionId: string): Promise<QuestionStatus | null> => {
        try {
            setError(null);
            return await examAnswerService.getQuestionStatus(sessionId, questionId);
        } catch (err) {
            handleError(err);
            return null;
        }
    }, []);

    // Reset Functions
    const resetCurrentAnswer = useCallback(() => {
        setCurrentAnswer(null);
    }, []);

    const resetSessionData = useCallback(() => {
        setSessionAnswers([]);
        setAnsweredQuestions([]);
        setUnansweredQuestions([]);
        setMarkedQuestions([]);
        setSessionProgress(null);
        setAnswerStatistics(null);
        setTimeSpentByQuestion(null);
    }, []);

    const resetValidationErrors = useCallback(() => {
        setValidationErrors([]);
    }, []);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    const resetAll = useCallback(() => {
        resetCurrentAnswer();
        resetSessionData();
        resetValidationErrors();
        resetError();
        disableAutoSave();
    }, [resetCurrentAnswer, resetSessionData, resetValidationErrors, resetError, disableAutoSave]);

    // Utility Functions
    const getAnswerById = useCallback((questionId: string): ExamAnswerDto | undefined => {
        return sessionAnswers.find(answer => answer.questionId === questionId);
    }, [sessionAnswers]);

    const getAnswerProgress = useCallback((): number => {
        if (sessionProgress) {
            return sessionProgress.completionPercentage;
        }
        if (sessionAnswers.length === 0) return 0;
        const answeredCount = sessionAnswers.filter(answer => answer.isAnswered).length;
        return Math.round((answeredCount / sessionAnswers.length) * 100);
    }, [sessionProgress, sessionAnswers]);

    const getTimeSpentOnCurrentQuestion = useCallback((questionId: string): number => {
        return timeSpentByQuestion?.[questionId] || 0;
    }, [timeSpentByQuestion]);

    const isAnswerModified = useCallback((questionId: string, newAnswer: string): boolean => {
        const existingAnswer = getAnswerById(questionId);
        return existingAnswer?.answer !== newAnswer;
    }, [getAnswerById]);

    const getTotalAnsweredCount = useCallback((): number => {
        return answeredQuestions.length;
    }, [answeredQuestions]);

    const getTotalUnansweredCount = useCallback((): number => {
        return unansweredQuestions.length;
    }, [unansweredQuestions]);

    const getTotalMarkedCount = useCallback((): number => {
        return markedQuestions.length;
    }, [markedQuestions]);

    const canSubmitExam = useCallback((): boolean => {
        return sessionAnswers.length > 0 && sessionAnswers.every(answer => answer.isAnswered);
    }, [sessionAnswers]);

    const getAnswerSummary = useCallback(() => {
        const total = sessionAnswers.length;
        const answered = answeredQuestions.length;
        const unanswered = unansweredQuestions.length;
        const marked = markedQuestions.length;
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

        return {
            total,
            answered,
            unanswered,
            marked,
            percentage
        };
    }, [sessionAnswers, answeredQuestions, unansweredQuestions, markedQuestions]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disableAutoSave();
        };
    }, [disableAutoSave]);

    return {
        // State
        sessionAnswers,
        currentAnswer,
        answeredQuestions,
        unansweredQuestions,
        markedQuestions,
        sessionProgress,
        answerStatistics,
        timeSpentByQuestion,
        validationErrors,
        autoSaveState,
        loading,
        saving,
        error,

        // Core Answer Operations
        saveAnswer,
        submitAnswer,
        clearAnswer,

        // Mark for Review Operations
        markForReview,

        // Answer Retrieval
        getAnswer,
        getSessionAnswers,
        getAnsweredQuestions,
        getUnansweredQuestions,
        getMarkedQuestions,

        // Bulk Operations
        saveMultipleAnswers,
        clearAllAnswers,

        // Answer Statistics
        getAnswerStatistics,
        getCompletionPercentage,
        getSessionProgress,

        // Time Tracking
        updateTimeSpent,
        getTimeSpentByQuestion,

        // Answer Validation
        validateSessionAnswers,

        // Auto-save Operations
        enableAutoSave,
        disableAutoSave,
        autoSaveAnswer,
        triggerAutoSave,

        // Navigation Helpers
        getNextUnansweredQuestion,
        getPreviousAnsweredQuestion,

        // Status Helpers
        isQuestionAnswered,
        isQuestionMarkedForReview,
        hasAnyAnswers,
        isSessionComplete,
        getQuestionStatus,

        // Reset Functions
        resetCurrentAnswer,
        resetSessionData,
        resetValidationErrors,
        resetError,
        resetAll,

        // Utility Functions
        getAnswerById,
        getAnswerProgress,
        getTimeSpentOnCurrentQuestion,
        isAnswerModified,
        getTotalAnsweredCount,
        getTotalUnansweredCount,
        getTotalMarkedCount,
        canSubmitExam,
        getAnswerSummary
    };
};