// types/exam-taking.types.ts

import { EQuestionTemplateType, ExamQuestionReadyDto, ExamAnswerDto } from '@/types/exam/exam-type';

export interface ExamTakingState {
    sessionId: string;
    examId: string;
    currentPartIndex: number;
    currentQuestionIndex: number;
    totalQuestions: number;
    answeredQuestions: Set<string>;
    markedQuestions: Set<string>;
    skippedQuestions: Set<string>;
    visitedQuestions: Set<string>;
    timeRemaining: number;
    isPaused: boolean;
    isExpired: boolean;
    isSubmitted: boolean;
    lastActivity: Date;
    answers: Record<string, ExamAnswerDto>;
}

export interface QuestionNavigationInfo {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
    nextQuestionId?: string;
    previousQuestionId?: string;
}

export interface QuestionDisplayProps {
    question: ExamQuestionReadyDto;
    questionNumber: number;
    totalQuestions: number;
    answer?: ExamAnswerDto;
    isMarkedForReview: boolean;
    timeLimit?: number;
    onAnswerChange: (questionId: string, answer: string) => void;
    onMarkForReview: (questionId: string, marked: boolean) => void;
    readonly?: boolean;
}

export interface AnswerInputProps {
    questionId: string;
    questionType: EQuestionTemplateType;
    templateData: Record<string, unknown>;
    currentAnswer?: string;
    onChange: (answer: string) => void;
    readonly?: boolean;
    timeLimit?: number;
}

export interface ExamTimerState {
    totalDuration: number; // seconds
    remainingTime: number; // seconds
    elapsedTime: number; // seconds
    isRunning: boolean;
    isPaused: boolean;
    isExpired: boolean;
    warningThreshold: number; // seconds
    criticalThreshold: number; // seconds
}

export interface ExamProgressInfo {
    totalQuestions: number;
    answeredCount: number;
    markedCount: number;
    skippedCount: number;
    visitedCount: number;
    completionPercentage: number;
    questionsRemaining: number;
}

export interface QuestionPaletteItem {
    id: string;
    number: number;
    status: 'not-visited' | 'visited' | 'answered' | 'marked' | 'skipped';
    partName?: string;
    partIndex?: number;
}

export interface ExamToolbarAction {
    id: string;
    label: string;
    icon: string;
    action: () => void;
    disabled?: boolean;
    visible?: boolean;
    shortcut?: string;
}

export interface QuestionStatusColors {
    'not-visited': string;
    'visited': string;
    'answered': string;
    'marked': string;
    'skipped': string;
    'current': string;
}

export interface ExamNotification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    persistent?: boolean;
    duration?: number;
    actions?: {
        label: string;
        action: () => void;
        primary?: boolean;
    }[];
}

export interface AutoSaveStatus {
    isEnabled: boolean;
    isSaving: boolean;
    lastSaveTime?: Date;
    failedAttempts: number;
    nextSaveIn?: number; // seconds
}

// Question type specific answer structures
export interface MultipleChoiceAnswer {
    selectedOption: number;
    timestamp: string;
}

export interface TrueFalseAnswer {
    selectedAnswer: boolean;
    timestamp: string;
}

export interface FillInTheBlanksAnswer {
    blankAnswers: string[];
    timestamp: string;
}

export interface ShortAnswerAnswer {
    textAnswer: string;
    wordCount: number;
    timestamp: string;
}

export interface MatchingAnswer {
    matchedPairs: Record<string, string>;
    timestamp: string;
}

export interface EssayAnswer {
    textAnswer: string;
    wordCount: number;
    timestamp: string;
}

export interface OrderingAnswer {
    orderedItems: string[];
    timestamp: string;
}

export interface MultipleResponseAnswer {
    selectedOptions: number[];
    timestamp: string;
}

export interface HotSpotAnswer {
    selectedAreas: number[];
    coordinates: number[][];
    timestamp: string;
}

export interface DragAndDropAnswer {
    dropMappings: Record<string, string>;
    timestamp: string;
}

export interface AudioResponseAnswer {
    audioFileUrl: string;
    recordingDuration: number;
    timestamp: string;
}

export interface VideoResponseAnswer {
    videoFileUrl: string;
    recordingDuration: number;
    timestamp: string;
}

export interface ImageResponseAnswer {
    imageFileUrl?: string;
    drawingData?: string;
    timestamp: string;
}

// Union type for all answer types
export type QuestionAnswer =
    | MultipleChoiceAnswer
    | TrueFalseAnswer
    | FillInTheBlanksAnswer
    | ShortAnswerAnswer
    | MatchingAnswer
    | EssayAnswer
    | OrderingAnswer
    | MultipleResponseAnswer
    | HotSpotAnswer
    | DragAndDropAnswer
    | AudioResponseAnswer
    | VideoResponseAnswer
    | ImageResponseAnswer;

export interface ExamSubmissionData {
    sessionId: string;
    examId: string;
    answers: Record<string, ExamAnswerDto>;
    timeSpent: number;
    submitTime: string;
    submitType: 'manual' | 'auto' | 'time-expired';
    finalReview?: {
        totalQuestions: number;
        answeredQuestions: number;
        markedQuestions: number;
        skippedQuestions: number;
        confidence: 'low' | 'medium' | 'high';
    };
}


export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
    shiftKey?: boolean;
    action: () => void;
    description: string;
}
export const QUESTION_STATUSES = {
    NOT_VISITED: 'not-visited' as const,
    VISITED: 'visited' as const,
    ANSWERED: 'answered' as const,
    MARKED: 'marked' as const,
    SKIPPED: 'skipped' as const,
} as const;

export const SUBMIT_TYPES = {
    MANUAL: 'manual' as const,
    AUTO: 'auto' as const,
    TIME_EXPIRED: 'time-expired' as const,
} as const;

export const NOTIFICATION_TYPES = {
    INFO: 'info' as const,
    WARNING: 'warning' as const,
    SUCCESS: 'success' as const,
    ERROR: 'error' as const,
} as const;