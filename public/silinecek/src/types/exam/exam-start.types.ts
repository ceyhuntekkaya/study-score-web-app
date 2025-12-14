// types/exam-start.types.ts

export interface ExamStartState {
    isReady: boolean;
    countdownStarted: boolean;
    examStarted: boolean;
    remainingTime: number;
    userConfirmed: boolean;
    finalChecksCompleted: boolean;
}

export interface CountdownConfig {
    initialSeconds: number;
    showBreathingExercise: boolean;
    autoStart: boolean;
    warningAt: number; // seconds
}

export interface ExamStartConfirmation {
    userId: string;
    examId: string;
    sessionId: string;
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
}

export interface ReadinessCheck {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    required: boolean;
    icon: string;
}

export interface ExamStartNotification {
    id?: string; // Optional because it's added dynamically
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
    duration?: number;
    persistent?: boolean;
}

export interface BreathingExerciseConfig {
    enabled: boolean;
    duration: number; // seconds
    inhaleTime: number;
    holdTime: number;
    exhaleTime: number;
    cycles: number;
}

export interface ExamStartProps {
    examData: {
        id: string;
        name: string;
        duration: number;
        totalQuestions: number;
        maxScore: number;
        category: string;
        level: string;
    };
    onExamStart: (sessionId: string) => void;
    onCancel: () => void;
    readinessChecks: ReadinessCheck[];
}