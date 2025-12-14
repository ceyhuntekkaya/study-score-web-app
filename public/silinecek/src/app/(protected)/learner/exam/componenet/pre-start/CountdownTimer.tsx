'use client';

import { useState, useEffect, useCallback } from 'react';
import { CountdownConfig, BreathingExerciseConfig } from '@/types/exam/exam-start.types';

interface CountdownTimerProps {
    config: CountdownConfig;
    onCountdownComplete: () => void;
    onCancel: () => void;
    isActive: boolean;
    breathingExercise?: BreathingExerciseConfig;
}

export function CountdownTimer({
                                   config,
                                   onCountdownComplete,
                                   onCancel,
                                   isActive,
                                   breathingExercise
                               }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState(config.initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [showBreathing, setShowBreathing] = useState(false);
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathingCycle, setBreathingCycle] = useState(0);
    const [breathingTimer, setBreathingTimer] = useState(0);

    // Countdown logic
    useEffect(() => {
        if (!isActive || !isRunning || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    onCountdownComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, isRunning, timeLeft, onCountdownComplete]);

    // Breathing exercise logic
    useEffect(() => {
        if (!showBreathing || !breathingExercise) return;

        const breathingInterval = setInterval(() => {
            setBreathingTimer(prev => {
                const newTimer = prev + 1;

                // Phase transitions
                if (breathingPhase === 'inhale' && newTimer >= breathingExercise.inhaleTime) {
                    setBreathingPhase('hold');
                    return 0;
                } else if (breathingPhase === 'hold' && newTimer >= breathingExercise.holdTime) {
                    setBreathingPhase('exhale');
                    return 0;
                } else if (breathingPhase === 'exhale' && newTimer >= breathingExercise.exhaleTime) {
                    setBreathingCycle(cycle => {
                        if (cycle + 1 >= breathingExercise.cycles) {
                            setShowBreathing(false);
                            return 0;
                        }
                        setBreathingPhase('inhale');
                        return cycle + 1;
                    });
                    handleBreathingComplete();
                    return 0;
                }

                return newTimer;
            });
        }, 1000);

        return () => clearInterval(breathingInterval);
    }, [showBreathing, breathingPhase, breathingExercise]);

    const startCountdown = useCallback(() => {
        if (config.showBreathingExercise && breathingExercise) {
            setShowBreathing(true);
            setBreathingPhase('inhale');
            setBreathingCycle(0);
            setBreathingTimer(0);
        } else {
            setIsRunning(true);
        }
    }, [config.showBreathingExercise, breathingExercise]);

    const handleBreathingComplete = useCallback(() => {
        setShowBreathing(false);
        setIsRunning(true);
    }, []);

    const formatTime = useCallback((seconds: number): string => {
        return `${seconds}`;
    }, []);

    const getCircleProgress = useCallback((): number => {
        const progress = ((config.initialSeconds - timeLeft) / config.initialSeconds) * 100;
        return Math.min(100, Math.max(0, progress));
    }, [timeLeft, config.initialSeconds]);

    const getBreathingPhaseText = useCallback((): string => {
        switch (breathingPhase) {
            case 'inhale': return 'Nefes Al';
            case 'hold': return 'Tut';
            case 'exhale': return 'Ver';
            default: return '';
        }
    }, [breathingPhase]);

    const getBreathingProgress = useCallback((): number => {
        if (!breathingExercise) return 0;

        let totalTime = 0;
        switch (breathingPhase) {
            case 'inhale': totalTime = breathingExercise.inhaleTime; break;
            case 'hold': totalTime = breathingExercise.holdTime; break;
            case 'exhale': totalTime = breathingExercise.exhaleTime; break;
        }

        return (breathingTimer / totalTime) * 100;
    }, [breathingPhase, breathingTimer, breathingExercise]);

    // Auto-start countdown
    useEffect(() => {
        if (isActive && config.autoStart && !isRunning && !showBreathing) {
            startCountdown();
        }
    }, [isActive, config.autoStart, isRunning, showBreathing, startCountdown]);

    if (!isActive) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-md w-full">

                {/* Breathing Exercise */}
                {showBreathing && breathingExercise && (
                    <div className="text-center mb-8">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Nefes Egzersizi
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Rahatlamak için derin nefes alın
                            </p>

                            {/* Breathing Circle */}
                            <div className="relative w-48 h-48 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-1000 ease-in-out"
                                    style={{
                                        transform: `scale(${0.5 + (getBreathingProgress() / 100) * 0.5})`,
                                    }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                            {getBreathingPhaseText()}
                                        </div>
                                        <div className="text-lg text-gray-600">
                                            {breathingCycle + 1}/{breathingExercise.cycles}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500">
                                Egzersiz otomatik olarak tamamlanacak
                            </div>
                        </div>
                    </div>
                )}

                {/* Countdown Timer */}
                {isRunning && !showBreathing && (
                    <div className="text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Sınavınız Başlıyor
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Hazır olduğunuzdan emin olun
                            </p>

                            {/* Countdown Circle */}
                            <div className="relative w-48 h-48 mx-auto mb-8">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        stroke="#e5e7eb"
                                        strokeWidth="8"
                                        fill="none"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="45"
                                        stroke={timeLeft <= config.warningAt ? "#ef4444" : "#3b82f6"}
                                        strokeWidth="8"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - getCircleProgress() / 100)}`}
                                        className="transition-all duration-1000 ease-linear"
                                    />
                                </svg>

                                {/* Timer Text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className={`text-6xl font-bold ${
                                            timeLeft <= config.warningAt ? 'text-red-500' : 'text-blue-600'
                                        }`}>
                                            {formatTime(timeLeft)}
                                        </div>
                                        <div className="text-lg text-gray-600">saniye</div>
                                    </div>
                                </div>
                            </div>

                            {/* Warning Message */}
                            {timeLeft <= config.warningAt && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-red-700 font-medium">
                      Sınav çok yakında başlayacak!
                    </span>
                                    </div>
                                </div>
                            )}

                            {/* Cancel Button */}
                            <button
                                onClick={onCancel}
                                className="text-gray-500 hover:text-gray-700 underline text-sm"
                            >
                                İptal et ve ana sayfaya dön
                            </button>
                        </div>
                    </div>
                )}

                {/* Start Button (if not auto-start) */}
                {!isRunning && !showBreathing && !config.autoStart && (
                    <div className="text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Sınava Başlamaya Hazır mısınız?
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Başlatma butonuna bastığınızda {config.initialSeconds} saniye sonra sınavınız başlayacak
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={startCountdown}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    Sınavı Başlat
                                </button>

                                <button
                                    onClick={onCancel}
                                    className="w-full text-gray-500 hover:text-gray-700 py-2"
                                >
                                    İptal et
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}