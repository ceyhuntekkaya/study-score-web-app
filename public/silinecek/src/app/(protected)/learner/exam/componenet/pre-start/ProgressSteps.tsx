'use client';

import {ExamFlowStep} from '@/hooks/exam/use-exam-flow';

interface ProgressStepsProps {
    steps: ExamFlowStep[];
    currentStepId: string;
    onStepClick?: (stepId: string) => void;
    showLabels?: boolean;
    orientation?: 'horizontal' | 'vertical';
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export function ProgressSteps({
                                  steps,
                                  currentStepId,
                                  onStepClick,
                                  showLabels = true,
                                  orientation = 'horizontal',
                                  size = 'medium',
                                  className = ''
                              }: ProgressStepsProps) {
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
    const currentStepIndex = sortedSteps.findIndex(step => step.id === currentStepId);

    const sizeClasses = {
        small: {
            circle: 'w-6 h-6',
            text: 'text-xs',
            connector: orientation === 'horizontal' ? 'h-0.5' : 'w-0.5'
        },
        medium: {
            circle: 'w-8 h-8',
            text: 'text-sm',
            connector: orientation === 'horizontal' ? 'h-1' : 'w-1'
        },
        large: {
            circle: 'w-10 h-10',
            text: 'text-base',
            connector: orientation === 'horizontal' ? 'h-1.5' : 'w-1.5'
        }
    };

    const getCurrentClasses = sizeClasses[size];

    const getStepStatus = (step: ExamFlowStep, index: number) => {
        if (step.completed) return 'completed';
        if (step.id === currentStepId) return 'current';
        if (index < currentStepIndex) return 'accessible';
        return 'upcoming';
    };

    const getStepIcon = (step: ExamFlowStep, status: string) => {
        if (status === 'completed') {
            return (
                <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"/>
                </svg>
            );
        }

        return (
            <span className="text-sm font-semibold">
        {step.order}
      </span>
        );
    };

    const getStepColors = (status: string, isClickable: boolean) => {
        const baseClasses = isClickable ? 'cursor-pointer transition-all duration-200 hover:scale-105' : '';

        switch (status) {
            case 'completed':
                return `${baseClasses} bg-green-500 text-white border-green-500`;
            case 'current':
                return `${baseClasses} bg-blue-500 text-white border-blue-500 ring-4 ring-blue-200`;
            case 'accessible':
                return `${baseClasses} bg-white text-blue-600 border-blue-300 hover:border-blue-500`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-400 border-gray-300`;
        }
    };

    const getConnectorColors = (prevStatus: string, currentStatus: string) => {
        if (prevStatus === 'completed' && (currentStatus === 'completed' || currentStatus === 'current')) {
            return 'bg-green-500';
        }
        if (prevStatus === 'completed' || prevStatus === 'current') {
            return 'bg-blue-300';
        }
        return 'bg-gray-200';
    };

    const handleStepClick = (step: ExamFlowStep, status: string) => {
        if (onStepClick && (status === 'completed' || status === 'current' || status === 'accessible')) {
            onStepClick(step.id);
        }
    };

    if (orientation === 'vertical') {
        return (
            <div className={`flex flex-col space-y-4 ${className}`}>
                {sortedSteps.map((step, index) => {
                    const status = getStepStatus(step, index);
                    const isClickable = onStepClick && (status === 'completed' || status === 'current' || status === 'accessible');

                    return (
                        <div key={step.id} className="flex items-start">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                    ${getCurrentClasses.circle}
                    ${getStepColors(status, isClickable || false)}
                    rounded-full border-2 flex items-center justify-center
                  `}
                                    onClick={() => handleStepClick(step, status)}
                                >
                                    {getStepIcon(step, status)}
                                </div>

                                {/* Connector Line */}
                                {index < sortedSteps.length - 1 && (
                                    <div
                                        className={`
                      ${getCurrentClasses.connector}
                      h-8 mt-2 rounded-full
                      ${getConnectorColors(status, getStepStatus(sortedSteps[index + 1], index + 1))}
                    `}
                                    />
                                )}
                            </div>

                            {/* Step Label */}
                            {showLabels && (
                                <div className="ml-4 flex-1">
                                    <div
                                        className={`
                      ${getCurrentClasses.text}
                      font-medium
                      ${status === 'current' ? 'text-blue-600' : ''}
                      ${status === 'completed' ? 'text-green-600' : ''}
                      ${status === 'upcoming' ? 'text-gray-400' : ''}
                      ${status === 'accessible' ? 'text-gray-600' : ''}
                      ${isClickable ? 'cursor-pointer hover:underline' : ''}
                    `}
                                        onClick={() => handleStepClick(step, status)}
                                    >
                                        {step.name}
                                        {step.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </div>
                                    {status === 'current' && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Mevcut adım
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // Horizontal orientation
    return (
        <div className={`flex items-center justify-between w-full ${className}`}>
            {sortedSteps.map((step, index) => {
                const status = getStepStatus(step, index);
                const isClickable = onStepClick && (status === 'completed' || status === 'current' || status === 'accessible');

                return (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Circle and Label */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`
                  ${getCurrentClasses.circle}
                  ${getStepColors(status, isClickable || false)}
                  rounded-full border-2 flex items-center justify-center
                `}
                                onClick={() => handleStepClick(step, status)}
                            >
                                {getStepIcon(step, status)}
                            </div>

                            {/* Step Label */}
                            {showLabels && (
                                <div className="mt-2 text-center">
                                    <div
                                        className={`
                      ${getCurrentClasses.text}
                      font-medium max-w-20 truncate
                      ${status === 'current' ? 'text-blue-600' : ''}
                      ${status === 'completed' ? 'text-green-600' : ''}
                      ${status === 'upcoming' ? 'text-gray-400' : ''}
                      ${status === 'accessible' ? 'text-gray-600' : ''}
                      ${isClickable ? 'cursor-pointer hover:underline' : ''}
                    `}
                                        onClick={() => handleStepClick(step, status)}
                                        title={step.name}
                                    >
                                        {step.name}
                                        {step.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </div>
                                    {status === 'current' && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            Mevcut
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Connector Line */}
                        {index < sortedSteps.length - 1 && (
                            <div
                                className={`
                  ${getCurrentClasses.connector}
                  flex-1 mx-2 rounded-full
                  ${getConnectorColors(status, getStepStatus(sortedSteps[index + 1], index + 1))}
                `}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}