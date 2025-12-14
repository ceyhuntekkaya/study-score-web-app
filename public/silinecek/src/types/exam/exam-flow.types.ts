import {ExamReadyDto} from "@/types/exam/exam-type";

export interface ExamFlowStep {
    id: string;
    name: string;
    completed: boolean;
    required: boolean;
}

export interface SystemCheckResult {
    internetSpeed: boolean;
    browserCompatibility: boolean;
    cameraAccess: boolean;
    microphoneAccess: boolean;
    screenResolution: boolean;
}

export interface ExamSessionState {
    sessionId: string;
    currentStep: ExamFlowStep;
    completedSteps: string[];
    examData: ExamReadyDto;
    timeRemaining: number;
    isInterrupted: boolean;
}