import { useState, useCallback, useEffect, useRef } from 'react';

interface TimerState {
    totalDuration: number; // Total exam duration in seconds
    remainingTime: number; // Remaining time in seconds
    elapsedTime: number; // Elapsed time in seconds
    isRunning: boolean;
    isPaused: boolean;
    isExpired: boolean;
    startTime: Date | null;
    pausedTime: number; // Total paused time in seconds
    lastPauseStart: Date | null;
}

interface UseExamTimerReturn {
    // Timer State
    totalDuration: number;
    remainingTime: number;
    elapsedTime: number;
    isRunning: boolean;
    isPaused: boolean;
    isExpired: boolean;
    pausedTime: number;

    // Formatted Time
    getRemainingTimeFormatted: () => string;
    getElapsedTimeFormatted: () => string;
    getTotalDurationFormatted: () => string;
    getPausedTimeFormatted: () => string;

    // Timer Controls
    startTimer: (durationInSeconds: number) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    addTime: (seconds: number) => void;
    subtractTime: (seconds: number) => void;

    // Timer Utilities
    formatTime: (seconds: number) => string;
    formatTimeDetailed: (seconds: number) => string;
    getProgressPercentage: () => number;
    getRemainingPercentage: () => number;

    // Warning System
    isWarningTime: (warningMinutes?: number) => boolean;
    isCriticalTime: (criticalMinutes?: number) => boolean;
    getTimeStatus: () => 'normal' | 'warning' | 'critical' | 'expired';

    // Callbacks
    onTimeExpired?: () => void;
    onWarning?: (remainingSeconds: number) => void;
    onCritical?: (remainingSeconds: number) => void;

    // Event Handlers
    setOnTimeExpired: (callback: () => void) => void;
    setOnWarning: (callback: (remainingSeconds: number) => void) => void;
    setOnCritical: (callback: (remainingSeconds: number) => void) => void;
}

export const useExamTimer = (): UseExamTimerReturn => {
    // Timer state
    const [timerState, setTimerState] = useState<TimerState>({
        totalDuration: 0,
        remainingTime: 0,
        elapsedTime: 0,
        isRunning: false,
        isPaused: false,
        isExpired: false,
        startTime: null,
        pausedTime: 0,
        lastPauseStart: null
    });

    // Callback refs
    const onTimeExpiredRef = useRef<(() => void) | null>(null);
    const onWarningRef = useRef<((remainingSeconds: number) => void) | null>(null);
    const onCriticalRef = useRef<((remainingSeconds: number) => void) | null>(null);

    // Timer interval ref
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Warning flags to prevent multiple calls
    const warningTriggeredRef = useRef(false);
    const criticalTriggeredRef = useRef(false);

    // Clear interval helper
    const clearTimerInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Format time utility
    const formatTime = useCallback((seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Detailed format time utility
    const formatTimeDetailed = useCallback((seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

        return parts.join(' ');
    }, []);

    // Start timer
    const startTimer = useCallback((durationInSeconds: number) => {
        clearTimerInterval();

        const now = new Date();
        setTimerState({
            totalDuration: durationInSeconds,
            remainingTime: durationInSeconds,
            elapsedTime: 0,
            isRunning: true,
            isPaused: false,
            isExpired: false,
            startTime: now,
            pausedTime: 0,
            lastPauseStart: null
        });

        // Reset warning flags
        warningTriggeredRef.current = false;
        criticalTriggeredRef.current = false;

        // Start interval
        intervalRef.current = setInterval(() => {
            setTimerState(prevState => {
                if (!prevState.isRunning || prevState.isPaused || prevState.isExpired) {
                    return prevState;
                }

                const now = new Date();
                const timeSinceStart = Math.floor((now.getTime() - (prevState.startTime?.getTime() || 0)) / 1000);
                const elapsedTime = timeSinceStart - prevState.pausedTime;
                const remainingTime = Math.max(0, prevState.totalDuration - elapsedTime);
                const isExpired = remainingTime <= 0;

                // Trigger callbacks
                if (isExpired && !prevState.isExpired && onTimeExpiredRef.current) {
                    onTimeExpiredRef.current();
                }

                // Warning callback (5 minutes)
                if (!warningTriggeredRef.current && remainingTime <= 300 && remainingTime > 60 && onWarningRef.current) {
                    warningTriggeredRef.current = true;
                    onWarningRef.current(remainingTime);
                }

                // Critical callback (1 minute)
                if (!criticalTriggeredRef.current && remainingTime <= 60 && remainingTime > 0 && onCriticalRef.current) {
                    criticalTriggeredRef.current = true;
                    onCriticalRef.current(remainingTime);
                }

                return {
                    ...prevState,
                    elapsedTime,
                    remainingTime,
                    isExpired
                };
            });
        }, 1000);
    }, [clearTimerInterval]);

    // Pause timer
    const pauseTimer = useCallback(() => {
        if (!timerState.isRunning || timerState.isPaused) return;

        clearTimerInterval();
        const now = new Date();

        setTimerState(prevState => ({
            ...prevState,
            isPaused: true,
            lastPauseStart: now
        }));
    }, [timerState.isRunning, timerState.isPaused, clearTimerInterval]);

    // Resume timer
    const resumeTimer = useCallback(() => {
        if (!timerState.isRunning || !timerState.isPaused) return;

        const now = new Date();
        const pauseDuration = timerState.lastPauseStart
            ? Math.floor((now.getTime() - timerState.lastPauseStart.getTime()) / 1000)
            : 0;

        setTimerState(prevState => ({
            ...prevState,
            isPaused: false,
            pausedTime: prevState.pausedTime + pauseDuration,
            lastPauseStart: null
        }));

        // Restart interval
        intervalRef.current = setInterval(() => {
            setTimerState(prevState => {
                if (!prevState.isRunning || prevState.isPaused || prevState.isExpired) {
                    return prevState;
                }

                const now = new Date();
                const timeSinceStart = Math.floor((now.getTime() - (prevState.startTime?.getTime() || 0)) / 1000);
                const elapsedTime = timeSinceStart - prevState.pausedTime;
                const remainingTime = Math.max(0, prevState.totalDuration - elapsedTime);
                const isExpired = remainingTime <= 0;

                if (isExpired && !prevState.isExpired && onTimeExpiredRef.current) {
                    onTimeExpiredRef.current();
                }

                return {
                    ...prevState,
                    elapsedTime,
                    remainingTime,
                    isExpired
                };
            });
        }, 1000);
    }, [timerState.isRunning, timerState.isPaused, timerState.lastPauseStart]);

    // Stop timer
    const stopTimer = useCallback(() => {
        clearTimerInterval();
        setTimerState(prevState => ({
            ...prevState,
            isRunning: false,
            isPaused: false
        }));
    }, [clearTimerInterval]);

    // Reset timer
    const resetTimer = useCallback(() => {
        clearTimerInterval();
        setTimerState({
            totalDuration: 0,
            remainingTime: 0,
            elapsedTime: 0,
            isRunning: false,
            isPaused: false,
            isExpired: false,
            startTime: null,
            pausedTime: 0,
            lastPauseStart: null
        });
        warningTriggeredRef.current = false;
        criticalTriggeredRef.current = false;
    }, [clearTimerInterval]);

    // Add time
    const addTime = useCallback((seconds: number) => {
        setTimerState(prevState => ({
            ...prevState,
            totalDuration: prevState.totalDuration + seconds,
            remainingTime: Math.max(0, prevState.remainingTime + seconds)
        }));
    }, []);

    // Subtract time
    const subtractTime = useCallback((seconds: number) => {
        setTimerState(prevState => {
            const newTotalDuration = Math.max(0, prevState.totalDuration - seconds);
            const newRemainingTime = Math.max(0, prevState.remainingTime - seconds);

            return {
                ...prevState,
                totalDuration: newTotalDuration,
                remainingTime: newRemainingTime,
                isExpired: newRemainingTime <= 0
            };
        });
    }, []);

    // Formatted time getters
    const getRemainingTimeFormatted = useCallback(() => {
        return formatTime(timerState.remainingTime);
    }, [timerState.remainingTime, formatTime]);

    const getElapsedTimeFormatted = useCallback(() => {
        return formatTime(timerState.elapsedTime);
    }, [timerState.elapsedTime, formatTime]);

    const getTotalDurationFormatted = useCallback(() => {
        return formatTime(timerState.totalDuration);
    }, [timerState.totalDuration, formatTime]);

    const getPausedTimeFormatted = useCallback(() => {
        return formatTime(timerState.pausedTime);
    }, [timerState.pausedTime, formatTime]);

    // Progress calculations
    const getProgressPercentage = useCallback((): number => {
        if (timerState.totalDuration === 0) return 0;
        return Math.round((timerState.elapsedTime / timerState.totalDuration) * 100);
    }, [timerState.elapsedTime, timerState.totalDuration]);

    const getRemainingPercentage = useCallback((): number => {
        if (timerState.totalDuration === 0) return 0;
        return Math.round((timerState.remainingTime / timerState.totalDuration) * 100);
    }, [timerState.remainingTime, timerState.totalDuration]);

    // Warning system
    const isWarningTime = useCallback((warningMinutes: number = 5): boolean => {
        return timerState.remainingTime <= (warningMinutes * 60) && timerState.remainingTime > 60;
    }, [timerState.remainingTime]);

    const isCriticalTime = useCallback((criticalMinutes: number = 1): boolean => {
        return timerState.remainingTime <= (criticalMinutes * 60) && timerState.remainingTime > 0;
    }, [timerState.remainingTime]);

    const getTimeStatus = useCallback((): 'normal' | 'warning' | 'critical' | 'expired' => {
        if (timerState.isExpired) return 'expired';
        if (isCriticalTime()) return 'critical';
        if (isWarningTime()) return 'warning';
        return 'normal';
    }, [timerState.isExpired, isCriticalTime, isWarningTime]);

    // Callback setters
    const setOnTimeExpired = useCallback((callback: () => void) => {
        onTimeExpiredRef.current = callback;
    }, []);

    const setOnWarning = useCallback((callback: (remainingSeconds: number) => void) => {
        onWarningRef.current = callback;
    }, []);

    const setOnCritical = useCallback((callback: (remainingSeconds: number) => void) => {
        onCriticalRef.current = callback;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearTimerInterval();
        };
    }, [clearTimerInterval]);

    return {
        // Timer State
        totalDuration: timerState.totalDuration,
        remainingTime: timerState.remainingTime,
        elapsedTime: timerState.elapsedTime,
        isRunning: timerState.isRunning,
        isPaused: timerState.isPaused,
        isExpired: timerState.isExpired,
        pausedTime: timerState.pausedTime,

        // Formatted Time
        getRemainingTimeFormatted,
        getElapsedTimeFormatted,
        getTotalDurationFormatted,
        getPausedTimeFormatted,

        // Timer Controls
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
        addTime,
        subtractTime,

        // Timer Utilities
        formatTime,
        formatTimeDetailed,
        getProgressPercentage,
        getRemainingPercentage,

        // Warning System
        isWarningTime,
        isCriticalTime,
        getTimeStatus,

        // Event Handlers
        setOnTimeExpired,
        setOnWarning,
        setOnCritical
    };
};