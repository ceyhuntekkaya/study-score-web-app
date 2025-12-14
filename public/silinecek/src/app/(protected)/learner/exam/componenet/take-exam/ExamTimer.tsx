'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {ExamTimerState} from "@/types/exam/exam-taking.types";

interface ExamTimerProps {
    totalDuration: number; // seconds
    onTimeExpired: () => void;
    onTimeWarning?: (remainingSeconds: number) => void;
    onTimeCritical?: (remainingSeconds: number) => void;
    warningThreshold?: number; // seconds (default: 300 = 5 minutes)
    criticalThreshold?: number; // seconds (default: 60 = 1 minute)
    isPaused?: boolean;
    size?: 'small' | 'medium' | 'large';
    showProgress?: boolean;
    showMilliseconds?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    className?: string;
}

export function ExamTimer({
                              totalDuration,
                              onTimeExpired,
                              onTimeWarning,
                              onTimeCritical,
                              warningThreshold = 300, // 5 minutes
                              criticalThreshold = 60,  // 1 minute
                              isPaused = false,
                              size = 'medium',
                              showProgress = true,
                              showMilliseconds = false,
                              position = 'top-right',
                              className = ''
                          }: ExamTimerProps) {
    const [timerState, setTimerState] = useState<ExamTimerState>({
        totalDuration,
        remainingTime: totalDuration,
        elapsedTime: 0,
        isRunning: false,
        isPaused: false,
        isExpired: false,
        warningThreshold,
        criticalThreshold
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const warningTriggeredRef = useRef(false);
    const criticalTriggeredRef = useRef(false);
    const startTimeRef = useRef<Date | null>(null);
    const pausedTimeRef = useRef<number>(0);

    // Timer logic
    useEffect(() => {
        if (isPaused || timerState.isExpired) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setTimerState(prev => ({ ...prev, isPaused, isRunning: false }));
            return;
        }

        if (!timerState.isRunning && !startTimeRef.current) {
            startTimeRef.current = new Date();
        }

        setTimerState(prev => ({ ...prev, isRunning: true, isPaused: false }));

        intervalRef.current = setInterval(() => {
            setTimerState(prev => {
                if (prev.isExpired) return prev;

                const now = new Date();
                const totalElapsed = startTimeRef.current
                    ? Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000) - pausedTimeRef.current
                    : prev.elapsedTime + 1;

                const newRemainingTime = Math.max(0, totalDuration - totalElapsed);
                const isExpired = newRemainingTime <= 0;

                if (isExpired && !prev.isExpired) {
                    onTimeExpired();
                }

                // Warning callback
                if (!warningTriggeredRef.current && newRemainingTime <= warningThreshold && newRemainingTime > criticalThreshold) {
                    warningTriggeredRef.current = true;
                    onTimeWarning?.(newRemainingTime);
                }

                // Critical callback
                if (!criticalTriggeredRef.current && newRemainingTime <= criticalThreshold && newRemainingTime > 0) {
                    criticalTriggeredRef.current = true;
                    onTimeCritical?.(newRemainingTime);
                }

                return {
                    ...prev,
                    remainingTime: newRemainingTime,
                    elapsedTime: totalElapsed,
                    isExpired
                };
            });
        }, showMilliseconds ? 100 : 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused, timerState.isExpired, totalDuration, warningThreshold, criticalThreshold, onTimeExpired, onTimeWarning, onTimeCritical, showMilliseconds]);

    // Handle pause changes
    useEffect(() => {
        if (isPaused && timerState.isRunning) {
            const now = new Date();
            if (startTimeRef.current) {
                pausedTimeRef.current = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000) - timerState.elapsedTime;
            }
        }
    }, [isPaused, timerState.isRunning, timerState.elapsedTime]);

    const formatTime = useCallback((seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 100);

        if (hours > 0) {
            return showMilliseconds
                ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
                : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        return showMilliseconds
            ? `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
            : `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, [showMilliseconds]);

    const getTimerStatus = useCallback((): 'normal' | 'warning' | 'critical' | 'expired' => {
        if (timerState.isExpired) return 'expired';
        if (timerState.remainingTime <= criticalThreshold) return 'critical';
        if (timerState.remainingTime <= warningThreshold) return 'warning';
        return 'normal';
    }, [timerState.remainingTime, timerState.isExpired, criticalThreshold, warningThreshold]);

    const getProgressPercentage = useCallback((): number => {
        return ((totalDuration - timerState.remainingTime) / totalDuration) * 100;
    }, [totalDuration, timerState.remainingTime]);

    const getSizeClasses = useCallback(() => {
        switch (size) {
            case 'small':
                return {
                    container: 'text-sm px-3 py-1',
                    icon: 'w-4 h-4',
                    progress: 'h-1'
                };
            case 'large':
                return {
                    container: 'text-lg px-6 py-3',
                    icon: 'w-6 h-6',
                    progress: 'h-2'
                };
            default: // medium
                return {
                    container: 'text-base px-4 py-2',
                    icon: 'w-5 h-5',
                    progress: 'h-1.5'
                };
        }
    }, [size]);

    const getStatusColors = useCallback(() => {
        const status = getTimerStatus();
        switch (status) {
            case 'expired':
                return {
                    bg: 'bg-red-600',
                    text: 'text-white',
                    border: 'border-red-600',
                    progress: 'bg-red-400'
                };
            case 'critical':
                return {
                    bg: 'bg-red-500',
                    text: 'text-white',
                    border: 'border-red-500',
                    progress: 'bg-red-300'
                };
            case 'warning':
                return {
                    bg: 'bg-orange-500',
                    text: 'text-white',
                    border: 'border-orange-500',
                    progress: 'bg-orange-300'
                };
            default:
                return {
                    bg: 'bg-blue-600',
                    text: 'text-white',
                    border: 'border-blue-600',
                    progress: 'bg-blue-300'
                };
        }
    }, [getTimerStatus]);

    const getPositionClasses = useCallback(() => {
        switch (position) {
            case 'top-left':
                return 'fixed top-4 left-4 z-50';
            case 'top-right':
                return 'fixed top-4 right-4 z-50';
            case 'bottom-left':
                return 'fixed bottom-4 left-4 z-50';
            case 'bottom-right':
                return 'fixed bottom-4 right-4 z-50';
            case 'center':
                return 'mx-auto';
            default:
                return 'fixed top-4 right-4 z-50';
        }
    }, [position]);

    const sizeClasses = getSizeClasses();
    const statusColors = getStatusColors();
    const positionClasses = getPositionClasses();
    const status = getTimerStatus();

    return (
        <div className={`${positionClasses} ${className}`}>
            <div className={`
        ${statusColors.bg} ${statusColors.text} ${statusColors.border}
        ${sizeClasses.container}
        rounded-lg border-2 shadow-lg backdrop-blur-sm
        ${status === 'critical' ? 'animate-pulse' : ''}
        ${isPaused ? 'opacity-75' : ''}
        transition-all duration-300
      `}>
                <div className="flex items-center space-x-2">
                    {/* Timer Icon */}
                    <div className={`${sizeClasses.icon} flex-shrink-0`}>
                        {isPaused ? (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>

                    {/* Time Display */}
                    <div className="font-mono font-bold">
                        {formatTime(timerState.remainingTime)}
                    </div>

                    {/* Status Indicator */}
                    {isPaused && (
                        <div className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
                            DURAKLATILDI
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="text-xs bg-black bg-opacity-20 px-2 py-1 rounded">
                            SÜRECİ SONA ERDİ
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                {showProgress && (
                    <div className="mt-2">
                        <div className={`w-full ${sizeClasses.progress} bg-black bg-opacity-20 rounded-full overflow-hidden`}>
                            <div
                                className={`${statusColors.progress} ${sizeClasses.progress} transition-all duration-1000 ease-linear`}
                                style={{
                                    width: `${getProgressPercentage()}%`
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Time Status Text */}
                {size !== 'small' && (
                    <div className="mt-1 text-xs opacity-90">
                        {status === 'expired' && 'Süre doldu!'}
                        {status === 'critical' && 'Son dakika!'}
                        {status === 'warning' && 'Süre azalıyor'}
                        {status === 'normal' && (isPaused ? 'Duraklatıldı' : 'Devam ediyor')}
                    </div>
                )}
            </div>
        </div>
    );
}