'use client';

import { useMemo } from 'react';
import {ExamProgressInfo} from "@/types/exam/exam-taking.types";

interface ExamProgressProps {
    progressInfo: ExamProgressInfo;
    showDetails?: boolean;
    size?: 'small' | 'medium' | 'large';
    orientation?: 'horizontal' | 'vertical';
    showPercentage?: boolean;
    showCounts?: boolean;
    className?: string;
}

export function ExamProgress({
                                 progressInfo,
                                 showDetails = true,
                                 size = 'medium',
                                 orientation = 'horizontal',
                                 showPercentage = true,
                                 showCounts = true,
                                 className = ''
                             }: ExamProgressProps) {
    const {
        totalQuestions,
        answeredCount,
        markedCount,
        skippedCount,
        visitedCount,
        completionPercentage,
        questionsRemaining
    } = progressInfo;

    const progressSegments = useMemo(() => {
        const segments = [];
        const answeredPercentage = (answeredCount / totalQuestions) * 100;
        const markedPercentage = (markedCount / totalQuestions) * 100;
        const skippedPercentage = (skippedCount / totalQuestions) * 100;
        const visitedNotAnsweredCount = visitedCount - answeredCount - markedCount - skippedCount;
        const visitedPercentage = (visitedNotAnsweredCount / totalQuestions) * 100;
        const notVisitedPercentage = 100 - answeredPercentage - markedPercentage - skippedPercentage - visitedPercentage;

        if (answeredPercentage > 0) {
            segments.push({
                type: 'answered',
                percentage: answeredPercentage,
                color: 'bg-green-500',
                label: 'Cevaplanmış',
                count: answeredCount
            });
        }

        if (markedPercentage > 0) {
            segments.push({
                type: 'marked',
                percentage: markedPercentage,
                color: 'bg-yellow-500',
                label: 'İşaretlenmiş',
                count: markedCount
            });
        }

        if (skippedPercentage > 0) {
            segments.push({
                type: 'skipped',
                percentage: skippedPercentage,
                color: 'bg-orange-500',
                label: 'Atlanmış',
                count: skippedCount
            });
        }

        if (visitedPercentage > 0) {
            segments.push({
                type: 'visited',
                percentage: visitedPercentage,
                color: 'bg-blue-300',
                label: 'Görüntülenmiş',
                count: visitedNotAnsweredCount
            });
        }

        if (notVisitedPercentage > 0) {
            segments.push({
                type: 'not-visited',
                percentage: notVisitedPercentage,
                color: 'bg-gray-300',
                label: 'Görüntülenmemiş',
                count: totalQuestions - visitedCount
            });
        }

        return segments;
    }, [totalQuestions, answeredCount, markedCount, skippedCount, visitedCount]);

    const getSizeClasses = () => {
        switch (size) {
            case 'small':
                return {
                    container: 'text-xs',
                    bar: orientation === 'horizontal' ? 'h-2' : 'w-2 min-h-[100px]',
                    text: 'text-xs',
                    icon: 'w-3 h-3'
                };
            case 'large':
                return {
                    container: 'text-base',
                    bar: orientation === 'horizontal' ? 'h-6' : 'w-6 min-h-[200px]',
                    text: 'text-base',
                    icon: 'w-5 h-5'
                };
            default: // medium
                return {
                    container: 'text-sm',
                    bar: orientation === 'horizontal' ? 'h-4' : 'w-4 min-h-[150px]',
                    text: 'text-sm',
                    icon: 'w-4 h-4'
                };
        }
    };

    const sizeClasses = getSizeClasses();

    const getStatusIcon = (type: string) => {
        switch (type) {
            case 'answered':
                return (
                    <svg className={`${sizeClasses.icon} text-green-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'marked':
                return (
                    <svg className={`${sizeClasses.icon} text-yellow-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                    </svg>
                );
            case 'skipped':
                return (
                    <svg className={`${sizeClasses.icon} text-orange-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                );
            case 'visited':
                return (
                    <svg className={`${sizeClasses.icon} text-blue-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                );
            default: // not-visited
                return (
                    <svg className={`${sizeClasses.icon} text-gray-600`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    if (orientation === 'vertical') {
        return (
            <div className={`${sizeClasses.container} ${className}`}>
                {/* Main Progress Bar - Vertical */}
                <div className={`${sizeClasses.bar} bg-gray-200 rounded-full overflow-hidden flex flex-col`}>
                    {progressSegments.map((segment) => (
                        <div
                            key={segment.type}
                            className={`${segment.color} transition-all duration-500 ease-in-out`}
                            style={{ height: `${segment.percentage}%` }}
                            title={`${segment.label}: ${segment.count} soru (${segment.percentage.toFixed(1)}%)`}
                        />
                    ))}
                </div>

                {/* Percentage Display */}
                {showPercentage && (
                    <div className="mt-2 text-center">
                        <div className="font-bold text-green-600">
                            {completionPercentage.toFixed(1)}%
                        </div>
                        <div className="text-gray-600 text-xs">
                            Tamamlandı
                        </div>
                    </div>
                )}

                {/* Detailed Stats */}
                {showDetails && (
                    <div className="mt-3 space-y-2">
                        {progressSegments.map((segment) => (
                            <div key={segment.type} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(segment.type)}
                                    <span className={sizeClasses.text}>{segment.label}</span>
                                </div>
                                {showCounts && (
                                    <span className={`${sizeClasses.text} font-semibold`}>
                    {segment.count}
                  </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Horizontal orientation (default)
    return (
        <div className={`${sizeClasses.container} ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Sınav İlerlemesi</h3>
                {showPercentage && (
                    <div className="flex items-center space-x-2">
            <span className="font-bold text-green-600">
              {completionPercentage.toFixed(1)}%
            </span>
                        <span className="text-gray-600">tamamlandı</span>
                    </div>
                )}
            </div>

            {/* Main Progress Bar - Horizontal */}
            <div className={`w-full ${sizeClasses.bar} bg-gray-200 rounded-full overflow-hidden flex`}>
                {progressSegments.map((segment) => (
                    <div
                        key={segment.type}
                        className={`${segment.color} transition-all duration-500 ease-in-out`}
                        style={{ width: `${segment.percentage}%` }}
                        title={`${segment.label}: ${segment.count} soru (${segment.percentage.toFixed(1)}%)`}
                    />
                ))}
            </div>

            {/* Quick Stats */}
            {showCounts && (
                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                    <span>{answeredCount}/{totalQuestions} cevaplanmış</span>
                    <span>{questionsRemaining} kalan</span>
                </div>
            )}

            {/* Detailed Stats */}
            {showDetails && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                    {progressSegments.map((segment) => (
                        <div key={segment.type} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            {getStatusIcon(segment.type)}
                            <div className="flex-1">
                                <div className={`${sizeClasses.text} font-medium`}>{segment.label}</div>
                                {showCounts && (
                                    <div className="text-xs text-gray-600">
                                        {segment.count} soru ({segment.percentage.toFixed(1)}%)
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-800">
                        <div className="font-semibold">Genel Durum</div>
                        <div>
                            {answeredCount > 0 && `${answeredCount} cevaplanmış, `}
                            {markedCount > 0 && `${markedCount} işaretlenmiş, `}
                            {questionsRemaining} kalan
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                            {answeredCount}/{totalQuestions}
                        </div>
                        <div className="text-xs text-blue-600">soru</div>
                    </div>
                </div>
            </div>
        </div>
    );
}