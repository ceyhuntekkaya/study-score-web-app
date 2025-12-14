'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CountdownTimer } from './CountdownTimer';
import { ExamStartConfirmation } from './ExamStartConfirmation';
import LoadingSpinner from "@/components/ui/loading-spinner";
import { AlertNotification } from "@/app/(protected)/learner/exam/componenet/AlertNotification";
import { useExams } from '@/hooks/exam/use-exam';
import { useExamReady } from '@/hooks/exam/use-exam-ready';
import {
    CountdownConfig,
    ExamStartConfirmation as ExamStartConfirmationType,
    ReadinessCheck,
    ExamStartNotification,
    BreathingExerciseConfig
} from "@/types/exam/exam-start.types";

interface ExamStartPageProps {
    examId: string;
}

// Notification type with required id for state management
interface NotificationWithId extends ExamStartNotification {
    id: string;
}

export function ExamStartPage({ examId }: ExamStartPageProps) {
    const router = useRouter();
    const { selectedExam, getExamById, loading: examLoading } = useExams();
    const { examReady, buildExamReady, loading: examReadyLoading } = useExamReady();

    const [currentStep, setCurrentStep] = useState<'confirmation' | 'countdown' | 'starting'>('confirmation');
    const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Countdown configuration
    const countdownConfig: CountdownConfig = {
        initialSeconds: 10,
        showBreathingExercise: true,
        autoStart: false,
        warningAt: 5
    };

    // Breathing exercise configuration
    const breathingExercise: BreathingExerciseConfig = {
        enabled: true,
        duration: 30,
        inhaleTime: 4,
        holdTime: 2,
        exhaleTime: 6,
        cycles: 3
    };

    // Mock readiness checks - gerçek uygulamada bu veriler API'den gelecek
    const readinessChecks: ReadinessCheck[] = [
        {
            id: 'system-check',
            name: 'Sistem Kontrolleri',
            description: 'İnternet bağlantısı, tarayıcı uyumluluğu ve ekran çözünürlüğü kontrol edildi',
            completed: true,
            required: true,
            icon: 'desktop'
        },
        {
            id: 'camera-microphone',
            name: 'Kamera ve Mikrofon',
            description: 'Kamera ve mikrofon erişimi test edildi ve çalışıyor',
            completed: true,
            required: true,
            icon: 'camera'
        },
        {
            id: 'identity-verification',
            name: 'Kimlik Doğrulama',
            description: 'Kimlik doğrulama işlemi tamamlandı',
            completed: true,
            required: true,
            icon: 'identification'
        },
        {
            id: 'rules-acceptance',
            name: 'Kurallar Kabul Edildi',
            description: 'Sınav kuralları okundu ve kabul edildi',
            completed: true,
            required: true,
            icon: 'document'
        },
        {
            id: 'demo-completed',
            name: 'Demo Tamamlandı',
            description: 'Sınav arayüzü demo\'su tamamlandı',
            completed: true,
            required: false,
            icon: 'play'
        },
        {
            id: 'environment-check',
            name: 'Çevre Kontrolü',
            description: 'Sınav ortamı uygun olarak değerlendirildi',
            completed: true,
            required: true,
            icon: 'eye'
        }
    ];



    // Load exam data
    useEffect(() => {
        if (examId && !selectedExam) {
            console.log(examId)
            getExamById(examId);
        }
    }, [examId, selectedExam, getExamById]);

    // Build exam ready data
    useEffect(() => {
        if (selectedExam && !examReady) {
            buildExamReady(selectedExam.id!);
        }
    }, [selectedExam, examReady, buildExamReady]);

    // Check if all requirements are met
    useEffect(() => {
        const allRequiredCompleted = readinessChecks
            .filter(check => check.required)
            .every(check => check.completed);

        const examDataReady = selectedExam !== null && examReady !== null;
        setIsReady(allRequiredCompleted && examDataReady);
    }, [readinessChecks, selectedExam, examReady]);

    const addNotification = useCallback((notification: ExamStartNotification) => {
        const notificationWithId: NotificationWithId = {
            ...notification,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };

        setNotifications(prev => [...prev, notificationWithId]);

        if (!notification.persistent && notification.duration !== -1) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notificationWithId.id));
            }, notification.duration || 5000);
        }
    }, []);

    const removeNotification = useCallback((notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, []);

    const handleConfirmStart = useCallback((confirmation: ExamStartConfirmationType) => {
        setSessionId(confirmation.sessionId);
        setCurrentStep('countdown');

        addNotification({
            type: 'success',
            title: 'Onay Alındı',
            message: 'Sınavınız başlatılıyor...',
            duration: 3000
        });
    }, [addNotification]);

    const handleCountdownComplete = useCallback(() => {
        setCurrentStep('starting');

        addNotification({
            type: 'success',
            title: 'Sınav Başladı',
            message: 'Sınavınız başarıyla başlatıldı. Yönlendiriliyorsunuz...',
            duration: 2000
        });

        // 2 saniye sonra sınav sayfasına yönlendir
        setTimeout(() => {
            router.push(`${examId}/taking?session=${sessionId}`);
        }, 2000);
    }, [examId, sessionId, router, addNotification]);

    const handleCancel = useCallback(() => {
        addNotification({
            type: 'info',
            title: 'Sınav İptal Edildi',
            message: 'Ana sayfaya yönlendiriliyorsunuz...',
            duration: 3000
        });

        setTimeout(() => {
            router.push(`/exam/${examId}/final-checks`);
        }, 1000);
    }, [examId, router, addNotification]);

    const handleGoBack = useCallback(() => {
        router.push(`/exam/${examId}/final-checks`);
    }, [examId, router]);

    const isLoading = examLoading || examReadyLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <div className="mt-4 text-gray-600">
                        <div className="text-lg font-medium">Sınav Hazırlanıyor</div>
                        <div className="text-sm">Sınav verileri yükleniyor, lütfen bekleyiniz...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!selectedExam || !examReady) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Sınav Bulunamadı</h2>
                        <p className="text-gray-600 mb-6">
                            Aradığınız sınav bulunamadı veya erişim yetkiniz bulunmuyor.
                        </p>
                        <button
                            onClick={() => router.push('/exams')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Sınav Listesine Dön
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map((notification) => (
                    <AlertNotification
                        key={notification.id}
                        type={notification.type}
                        title={notification.title}
                        message={notification.message}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>

            {/* Step Content */}
            {currentStep === 'confirmation' && (
                <ExamStartConfirmation
                    examData={{
                        id: selectedExam.id!,
                        name: selectedExam.name!,
                        duration: selectedExam.duration || 0,
                        totalQuestions: examReady.totalQuestions,
                        maxScore: selectedExam.maxScore || 0
                    }}
                    readinessChecks={readinessChecks}
                    onConfirm={handleConfirmStart}
                    onCancel={handleGoBack}
                    isLoading={!isReady}
                />
            )}

            {currentStep === 'countdown' && (
                <CountdownTimer
                    config={countdownConfig}
                    onCountdownComplete={handleCountdownComplete}
                    onCancel={handleCancel}
                    isActive={true}
                    breathingExercise={breathingExercise}
                />
            )}

            {currentStep === 'starting' && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <div className="text-green-500 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Sınavınız Başladı!
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Sınav arayüzüne yönlendiriliyorsunuz...
                            </p>
                            <div className="flex items-center justify-center">
                                <LoadingSpinner />
                                <span className="ml-3 text-gray-500">Yükleniyor...</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
                <div className="flex items-center space-x-2 text-sm">
                    <div className={`w-3 h-3 rounded-full ${
                        currentStep === 'confirmation' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-gray-600">
                        {currentStep === 'confirmation' && 'Onay Bekleniyor'}
                        {currentStep === 'countdown' && 'Sınav Başlatılıyor'}
                        {currentStep === 'starting' && 'Sınav Başladı'}
                    </span>
                </div>
            </div>
        </div>
    );
}