// hooks/exam/use-exam-flow.ts
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface ExamFlowStep {
    id: string;
    name: string;
    path: string;
    completed: boolean;
    required: boolean;
    order: number;
}

export interface ExamFlowState {
    currentStep: string;
    completedSteps: string[];
    examId: string;
    sessionId: string | null;
    totalSteps: number;
    canProceed: boolean;
    canGoBack: boolean;
}

interface UseExamFlowReturn {
    flowState: ExamFlowState;
    steps: ExamFlowStep[];
    currentStepData: ExamFlowStep | null;
    progressPercentage: number;

    // Navigation methods
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (stepId: string) => void;
    completeStep: (stepId: string) => void;
    resetFlow: () => void;

    // Validation methods
    validateStep: (stepId: string) => boolean;
    isStepAccessible: (stepId: string) => boolean;
    getNextStep: (stepId?: string) => ExamFlowStep | null;
    getPreviousStep: (stepId?: string) => ExamFlowStep | null;

    // Utility methods
    getStepByPath: (path: string) => ExamFlowStep | null;
    getCompletedStepsCount: () => number;
    getRemainingStepsCount: () => number;
}

const EXAM_FLOW_STEPS: ExamFlowStep[] = [
    {
        id: 'landing',
        name: 'Sınav Bilgileri',
        path: '/start',
        completed: false,
        required: true,
        order: 1
    },
    {
        id: 'authentication',
        name: 'Kimlik Doğrulama',
        path: '/auth',
        completed: false,
        required: true,
        order: 2
    },
    {
        id: 'information',
        name: 'Sınav Bilgilendirme',
        path: '/info',
        completed: false,
        required: true,
        order: 3
    },
    {
        id: 'rules',
        name: 'Kurallar & Yönergeler',
        path: '/rules',
        completed: false,
        required: true,
        order: 4
    },
    {
        id: 'system-check',
        name: 'Sistem Kontrolleri',
        path: '/system-check',
        completed: false,
        required: true,
        order: 5
    },
    {
        id: 'demo',
        name: 'Demo & Hazırlık',
        path: '/demo',
        completed: false,
        required: false,
        order: 6
    },
    {
        id: 'final-checks',
        name: 'Final Kontroller',
        path: '/final-checks',
        completed: false,
        required: true,
        order: 7
    },
    {
        id: 'start',
        name: 'Sınav Başlatma',
        path: '/begin',
        completed: false,
        required: true,
        order: 8
    },
    {
        id: 'taking',
        name: 'Sınav',
        path: '/taking',
        completed: false,
        required: true,
        order: 9
    }
];

export const useExamFlow = (examId: string, initialStep?: string): UseExamFlowReturn => {
    const router = useRouter();
    const [steps, setSteps] = useState<ExamFlowStep[]>(EXAM_FLOW_STEPS);
    const [flowState, setFlowState] = useState<ExamFlowState>({
        currentStep: initialStep || 'landing',
        completedSteps: [],
        examId,
        sessionId: null,
        totalSteps: EXAM_FLOW_STEPS.length,
        canProceed: false,
        canGoBack: false
    });

    // Load saved progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem(`exam-flow-${examId}`);
        if (savedProgress) {
            try {
                const { completedSteps, currentStep, sessionId } = JSON.parse(savedProgress);
                setFlowState(prev => ({
                    ...prev,
                    completedSteps: completedSteps || [],
                    currentStep: currentStep || 'landing',
                    sessionId: sessionId || null
                }));

                // Update steps completion status
                setSteps(prev => prev.map(step => ({
                    ...step,
                    completed: completedSteps?.includes(step.id) || false
                })));
            } catch (error) {
                console.warn('Failed to load exam flow progress from localStorage:', error);
            }
        }
    }, [examId]);

    // Save progress to localStorage whenever state changes
    useEffect(() => {
        const progressData = {
            completedSteps: flowState.completedSteps,
            currentStep: flowState.currentStep,
            sessionId: flowState.sessionId,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem(`exam-flow-${examId}`, JSON.stringify(progressData));
    }, [examId, flowState.completedSteps, flowState.currentStep, flowState.sessionId]);

    // Update navigation permissions
    useEffect(() => {
        const currentStepData = steps.find(step => step.id === flowState.currentStep);
        const currentOrder = currentStepData?.order || 0;

        // Can go back if not on first step and previous steps are accessible
        const canGoBack = currentOrder > 1;

        // Can proceed if current step is completed or not required
        const canProceed = currentStepData?.completed || !currentStepData?.required || false;

        setFlowState(prev => ({
            ...prev,
            canGoBack,
            canProceed
        }));
    }, [steps, flowState.currentStep, flowState.completedSteps]);

    const currentStepData = steps.find(step => step.id === flowState.currentStep) || null;
    const progressPercentage = (flowState.completedSteps.length / flowState.totalSteps) * 100;

    const validateStep = useCallback((stepId: string): boolean => {
        const step = steps.find(s => s.id === stepId);
        if (!step) return false;

        // Add step-specific validation logic here
        switch (stepId) {
            case 'authentication':
                // Check if user is authenticated
                return true; // Mock validation
            case 'rules':
                // Check if user has read and accepted rules
                return true; // Mock validation
            case 'system-check':
                // Check if all system requirements are met
                return true; // Mock validation
            default:
                return true;
        }
    }, [steps]);

    const isStepAccessible = useCallback((stepId: string): boolean => {
        const step = steps.find(s => s.id === stepId);
        if (!step) return false;

        // First step is always accessible
        if (step.order === 1) return true;

        // Check if all previous required steps are completed
        const previousRequiredSteps = steps
            .filter(s => s.order < step.order && s.required)
            .map(s => s.id);

        return previousRequiredSteps.every(id => flowState.completedSteps.includes(id));
    }, [steps, flowState.completedSteps]);

    const completeStep = useCallback((stepId: string) => {
        if (!validateStep(stepId)) {
            console.warn(`Step ${stepId} validation failed`);
            return;
        }

        setFlowState(prev => ({
            ...prev,
            completedSteps: [...new Set([...prev.completedSteps, stepId])]
        }));

        setSteps(prev => prev.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
        ));
    }, [validateStep]);

    const goToStep = useCallback((stepId: string) => {
        if (!isStepAccessible(stepId)) {
            console.warn(`Step ${stepId} is not accessible`);
            return;
        }

        const step = steps.find(s => s.id === stepId);
        if (!step) return;

        setFlowState(prev => ({ ...prev, currentStep: stepId }));
        router.push(`/exam/${examId}${step.path}`);
    }, [isStepAccessible, steps, examId, router]);

    const getNextStep = useCallback((currentStepId?: string): ExamFlowStep | null => {
        const stepId = currentStepId || flowState.currentStep;
        const currentStep = steps.find(s => s.id === stepId);
        if (!currentStep) return null;

        const nextStep = steps
            .filter(s => s.order > currentStep.order)
            .sort((a, b) => a.order - b.order)[0];

        return nextStep || null;
    }, [steps, flowState.currentStep]);

    const getPreviousStep = useCallback((currentStepId?: string): ExamFlowStep | null => {
        const stepId = currentStepId || flowState.currentStep;
        const currentStep = steps.find(s => s.id === stepId);
        if (!currentStep) return null;

        const previousStep = steps
            .filter(s => s.order < currentStep.order)
            .sort((a, b) => b.order - a.order)[0];

        return previousStep || null;
    }, [steps, flowState.currentStep]);

    const goToNextStep = useCallback(() => {
        const nextStep = getNextStep();
        if (nextStep && isStepAccessible(nextStep.id)) {
            goToStep(nextStep.id);
        }
    }, [getNextStep, isStepAccessible, goToStep]);

    const goToPreviousStep = useCallback(() => {
        const previousStep = getPreviousStep();
        if (previousStep) {
            goToStep(previousStep.id);
        }
    }, [getPreviousStep, goToStep]);

    const resetFlow = useCallback(() => {
        setFlowState({
            currentStep: 'landing',
            completedSteps: [],
            examId,
            sessionId: null,
            totalSteps: EXAM_FLOW_STEPS.length,
            canProceed: false,
            canGoBack: false
        });

        setSteps(EXAM_FLOW_STEPS.map(step => ({ ...step, completed: false })));
        localStorage.removeItem(`exam-flow-${examId}`);
    }, [examId]);

    const getStepByPath = useCallback((path: string): ExamFlowStep | null => {
        return steps.find(step => step.path === path) || null;
    }, [steps]);

    const getCompletedStepsCount = useCallback((): number => {
        return flowState.completedSteps.length;
    }, [flowState.completedSteps]);

    const getRemainingStepsCount = useCallback((): number => {
        return flowState.totalSteps - flowState.completedSteps.length;
    }, [flowState.totalSteps, flowState.completedSteps]);

    return {
        flowState,
        steps,
        currentStepData,
        progressPercentage,

        // Navigation methods
        goToNextStep,
        goToPreviousStep,
        goToStep,
        completeStep,
        resetFlow,

        // Validation methods
        validateStep,
        isStepAccessible,
        getNextStep,
        getPreviousStep,

        // Utility methods
        getStepByPath,
        getCompletedStepsCount,
        getRemainingStepsCount
    };
};