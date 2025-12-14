'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExamTimer } from './ExamTimer';
import { ExamProgress } from './ExamProgress';
import { QuestionPalette } from './QuestionPalette';
import { ExamToolbar } from './ExamToolbar';
import { QuestionNavigation } from './QuestionNavigation';
import { QuestionDisplay } from './QuestionDisplay';
import LoadingSpinner from "@/components/ui/loading-spinner";
import { AlertNotification } from "@/app/(protected)/learner/exam/componenet/AlertNotification";
import { useExams } from '@/hooks/exam/use-exam';
import { useExamReady } from '@/hooks/exam/use-exam-ready';
import { useExamAnswer } from '@/hooks/exam/use-exam-answer';
import { useExamTimer } from '@/hooks/exam/use-exam-timer';
import {
    // ExamTakingState,
    QuestionNavigationInfo,
    ExamProgressInfo,
    QuestionPaletteItem,
    ExamToolbarAction,
    ExamNotification,
    ExamSubmissionData,
    KeyboardShortcut,
    QUESTION_STATUSES,
    SUBMIT_TYPES,
    NOTIFICATION_TYPES
} from "@/types/exam/exam-taking.types";
import { ExamAnswerDto, ExamExecutionSettingsDto } from '@/types/exam/exam-type';
import {useAuth} from "@/hooks/use-auth";

interface ExamTakingPageProps {
    examId: string;
}

interface NotificationWithId extends ExamNotification {
    id: string;
}

export function ExamTakingPage({ examId }: ExamTakingPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session') || '';
    const {user} = useAuth();

    console.log(user)

    // Hooks
    const { selectedExam, getExamById } = useExams();
    const { examReady, buildExamReadyForUser } = useExamReady();
    const {
        sessionAnswers,
        saveAnswer,
        markForReview,
        getSessionAnswers,
        enableAutoSave,
        disableAutoSave,
        autoSaveState,
        loading: answersLoading
    } = useExamAnswer();

    const {
        remainingTime,
        isRunning,
        isPaused,
        isExpired,
        startTimer,
        pauseTimer,
        resumeTimer,
        setOnTimeExpired,
        setOnWarning,
        setOnCritical,
        resetTimer
    } = useExamTimer();

    // Core State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
    const [showQuestionPalette, setShowQuestionPalette] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [lastActivity, setLastActivity] = useState<Date>(new Date());

    console.log("ExamTakingPage rendered with lastActivity:", lastActivity,
        "isExpired:", isExpired);

    // Refs for cleanup
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const initializationRef = useRef<boolean>(false);

    // Type-safe execution settings
    const executionSettings = useMemo(() => {
        return selectedExam?.executionSettings as ExamExecutionSettingsDto | undefined;
    }, [selectedExam]);

    // Derived state from hooks (memoized for performance)
    const answeredQuestions = useMemo(() => {
        return new Set(sessionAnswers.filter(answer => answer.isAnswered).map(answer => answer.questionId));
    }, [sessionAnswers]);

    const markedQuestions = useMemo(() => {
        return new Set(sessionAnswers.filter(answer => answer.isMarkedForReview).map(answer => answer.questionId));
    }, [sessionAnswers]);

    const skippedQuestions = useMemo(() => {
        return new Set(sessionAnswers.filter(answer => answer.isSkipped).map(answer => answer.questionId));
    }, [sessionAnswers]);

    const answersMap = useMemo(() => {
        return sessionAnswers.reduce((acc, answer) => {
            acc[answer.questionId] = answer;
            return acc;
        }, {} as Record<string, ExamAnswerDto>);
    }, [sessionAnswers]);

    // Visited questions tracking
    const [visitedQuestions, setVisitedQuestions] = useState<Set<string>>(new Set());

    // Current question and answer (memoized)
    const currentQuestion = useMemo(() => {


        console.log("1 ====================")
        console.log(examReady)

        if (!examReady?.questions || currentQuestionIndex >= examReady.questions.length) {
            return null;
        }

        console.log("2 ====================")
        console.log(examReady.questions[currentQuestionIndex]);
        return examReady.questions[currentQuestionIndex];
    }, [examReady, currentQuestionIndex]);





    const currentAnswer = useMemo(() => {
        if (!currentQuestion) return undefined;
        return answersMap[currentQuestion.id];
    }, [currentQuestion, answersMap]);

    // Navigation info (memoized)
    const navigationInfo: QuestionNavigationInfo = useMemo(() => {
        const totalQuestions = examReady?.questions?.length || 0;
        return {
            current: currentQuestionIndex + 1,
            total: totalQuestions,
            hasNext: currentQuestionIndex < totalQuestions - 1,
            hasPrevious: currentQuestionIndex > 0,
            nextQuestionId: examReady?.questions?.[currentQuestionIndex + 1]?.id,
            previousQuestionId: examReady?.questions?.[currentQuestionIndex - 1]?.id
        };
    }, [examReady, currentQuestionIndex]);

    // Progress info (memoized)
    const progressInfo: ExamProgressInfo = useMemo(() => {
        const totalQuestions = examReady?.questions?.length || 0;
        const answeredCount = answeredQuestions.size;
        const markedCount = markedQuestions.size;
        const skippedCount = skippedQuestions.size;
        const visitedCount = visitedQuestions.size;

        return {
            totalQuestions,
            answeredCount,
            markedCount,
            skippedCount,
            visitedCount,
            completionPercentage: totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0,
            questionsRemaining: totalQuestions - answeredCount
        };
    }, [examReady, answeredQuestions, markedQuestions, skippedQuestions, visitedQuestions]);

    // Question palette items (memoized)
    const paletteItems: QuestionPaletteItem[] = useMemo(() => {
        return examReady?.questions?.map((question, index) => {
            let status: QuestionPaletteItem['status'] = QUESTION_STATUSES.NOT_VISITED;

            if (answeredQuestions.has(question.id)) {
                status = QUESTION_STATUSES.ANSWERED;
            } else if (markedQuestions.has(question.id)) {
                status = QUESTION_STATUSES.MARKED;
            } else if (skippedQuestions.has(question.id)) {
                status = QUESTION_STATUSES.SKIPPED;
            } else if (visitedQuestions.has(question.id)) {
                status = QUESTION_STATUSES.VISITED;
            }

            return {
                id: question.id,
                number: index + 1,
                status,
                partName: question.examPart?.name,
                partIndex: question.examPart?.orderNumber
            };
        }) || [];
    }, [examReady, answeredQuestions, markedQuestions, skippedQuestions, visitedQuestions]);



    console.log(initializationRef.current)
    // Initialize exam data
    useEffect(() => {

        console.log("1")

        if (initializationRef.current) return;
        initializationRef.current = true;

        const initializeExam = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load exam data if not available
                if (!selectedExam) {
                    await getExamById(examId);
                }

                // Build exam ready data if not available
                if (!examReady && user) {
                    await buildExamReadyForUser(examId, user.id); // Replace with actual user ID
                }

                // Load session answers if sessionId is available
                if (sessionId) {
                    await getSessionAnswers(sessionId);
                    enableAutoSave(sessionId, 30000); // 30 seconds auto-save
                }

            } catch (err) {
                console.error('Failed to initialize exam:', err);
                setError('Sınav yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
            } finally {
                setLoading(false);
            }
        };

        initializeExam();
    }, [examId, sessionId]);

    // Start timer when exam data is ready
    useEffect(() => {
        if (examReady && selectedExam && selectedExam.duration && !isRunning && !isSubmitted) {
            const durationInSeconds = selectedExam.duration * 60;
            startTimer(durationInSeconds);
        }
    }, [examReady, selectedExam, isRunning, isSubmitted, startTimer]);

    // Mark first question as visited
    useEffect(() => {
        if (currentQuestion && !visitedQuestions.has(currentQuestion.id)) {
            setVisitedQuestions(prev => new Set([...prev, currentQuestion.id]));
        }
    }, [currentQuestion, visitedQuestions]);

    // Timer callbacks setup
    useEffect(() => {
        setOnTimeExpired(() => {
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Süre Doldu!',
                message: 'Sınav süresi sona erdi. Sınavınız otomatik olarak teslim edilecek.',
                persistent: true
            });
            handleExamSubmit(SUBMIT_TYPES.TIME_EXPIRED);
        });

        setOnWarning((remainingSeconds) => {
            addNotification({
                type: NOTIFICATION_TYPES.WARNING,
                title: 'Süre Uyarısı',
                message: `Sınav sürenizin ${Math.floor(remainingSeconds / 60)} dakikası kaldı.`,
                duration: 5000
            });
        });

        setOnCritical((remainingSeconds) => {
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Kritik Süre Uyarısı',
                message: `Son ${remainingSeconds} saniye! Cevaplarınızı kontrol edin.`,
                duration: 10000
            });
        });
    }, [setOnTimeExpired, setOnWarning, setOnCritical]);

    // Keyboard shortcuts


    // Activity tracking
    const updateLastActivity = useCallback(() => {
        const now = new Date();
        setLastActivity(now);

        // Clear existing timeout
        if (activityTimeoutRef.current) {
            clearTimeout(activityTimeoutRef.current);
        }

        // Set new activity timeout (5 minutes of inactivity)
        activityTimeoutRef.current = setTimeout(() => {
            addNotification({
                type: NOTIFICATION_TYPES.WARNING,
                title: 'Hareketsizlik Uyarısı',
                message: 'Uzun süredir hareketsizsiniz. Sınavınız devam ediyor.',
                duration: 5000
            });
        }, 5 * 60 * 1000); // 5 minutes
    }, []);

    // Heartbeat for session monitoring
    useEffect(() => {
        if (!sessionId || isSubmitted) return;

        const sendHeartbeat = async () => {
            // Here you would send heartbeat to server
            // await examSessionService.sendHeartbeat(sessionId);
            console.log('Heartbeat sent for session:', sessionId);
        };

        // Send heartbeat every 30 seconds
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, 30000);

        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
        };
    }, [sessionId, isSubmitted]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
            if (activityTimeoutRef.current) {
                clearTimeout(activityTimeoutRef.current);
            }
            disableAutoSave();
            resetTimer();
        };
    }, [disableAutoSave, resetTimer]);

    // Notification management
    const addNotification = useCallback((notification: Omit<ExamNotification, 'id'>) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const notificationWithId: NotificationWithId = { ...notification, id };

        setNotifications(prev => [...prev, notificationWithId]);

        if (!notification.persistent && notification.duration !== -1) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, notification.duration || 5000);
        }
    }, []);

    const removeNotification = useCallback((notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, []);

    // Navigation handlers
    function handleNextQuestion() {
        if (navigationInfo.hasNext && !isSubmitted) {
            const newIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(newIndex);

            const nextQuestion = examReady?.questions?.[newIndex];
            if (nextQuestion) {
                setVisitedQuestions(prev => new Set([...prev, nextQuestion.id]));
            }

            updateLastActivity();
        }
    }

    function handlePreviousQuestion() {
        if (navigationInfo.hasPrevious && !isSubmitted) {
            const newIndex = currentQuestionIndex - 1;
            setCurrentQuestionIndex(newIndex);
            updateLastActivity();
        }
    }



    const handleMarkForReview = useCallback(async (questionId?: string, marked?: boolean) => {
        if (isSubmitted) return;

        const targetQuestionId = questionId || currentQuestion?.id;
        if (!targetQuestionId) return;

        const isCurrentlyMarked = markedQuestions.has(targetQuestionId);
        const shouldMark = marked !== undefined ? marked : !isCurrentlyMarked;

        try {
            await markForReview(sessionId, targetQuestionId, shouldMark);
            updateLastActivity();

            addNotification({
                type: NOTIFICATION_TYPES.INFO,
                title: shouldMark ? 'Soru İşaretlendi' : 'İşaret Kaldırıldı',
                message: shouldMark ? 'Soru gözden geçirilmek üzere işaretlendi.' : 'Sorunun işareti kaldırıldı.',
                duration: 2000
            });
        } catch (error) {
            console.error('Failed to mark question:', error);
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'İşaretleme Hatası',
                message: 'Soru işaretlenemedi. Lütfen tekrar deneyin.',
                duration: 5000
            });
        }
    }, [sessionId, currentQuestion, markedQuestions, markForReview, isSubmitted, updateLastActivity, addNotification]);


    const handleSaveAnswer = useCallback(() => {
        if (isSubmitted) return;

        addNotification({
            type: NOTIFICATION_TYPES.INFO,
            title: 'Cevap Kaydediliyor',
            message: 'Mevcut cevabınız kaydediliyor...',
            duration: 2000
        });
        updateLastActivity();
    }, [isSubmitted, addNotification, updateLastActivity]);

    const keyboardShortcuts: KeyboardShortcut[] = useMemo(() => [
        {
            key: 'ArrowLeft',
            action: handlePreviousQuestion,
            description: 'Önceki soru'
        },
        {
            key: 'ArrowRight',
            action: handleNextQuestion,
            description: 'Sonraki soru'
        },
        {
            key: 'm',
            ctrlKey: true,
            action: () => handleMarkForReview(),
            description: 'Soruyu işaretle'
        },
        {
            key: 's',
            ctrlKey: true,
            action: handleSaveAnswer,
            description: 'Cevabı kaydet'
        }
    ], []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            const shortcut = keyboardShortcuts.find(shortcut =>
                shortcut.key === e.key &&
                !!shortcut.ctrlKey === (e.ctrlKey || e.metaKey) &&
                !!shortcut.altKey === e.altKey &&
                !!shortcut.shiftKey === e.shiftKey
            );

            if (shortcut) {
                e.preventDefault();
                shortcut.action();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [keyboardShortcuts]);

    const handleGoToQuestion = useCallback((questionNumber: number) => {
        const index = questionNumber - 1;
        const totalQuestions = examReady?.questions?.length || 0;

        if (index >= 0 && index < totalQuestions && !isSubmitted) {
            setCurrentQuestionIndex(index);

            const targetQuestion = examReady?.questions?.[index];
            if (targetQuestion) {
                setVisitedQuestions(prev => new Set([...prev, targetQuestion.id]));
            }

            updateLastActivity();
        }
    }, [examReady, isSubmitted, updateLastActivity]);

    // Answer handling
    const handleAnswerChange = useCallback(async (questionId: string, answerData: string) => {
        if (isSubmitted) return;

        try {
            await saveAnswer(sessionId, questionId, answerData);
            updateLastActivity();

            addNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                title: 'Cevap Kaydedildi',
                message: 'Cevabınız başarıyla kaydedildi.',
                duration: 2000
            });
        } catch (error) {
            console.error('Failed to save answer:', error);
            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Kayıt Hatası',
                message: 'Cevabınız kaydedilemedi. Lütfen tekrar deneyin.',
                duration: 5000
            });
        }
    }, [sessionId, saveAnswer, isSubmitted, updateLastActivity, addNotification]);





    // Exam submission
    const handleExamSubmit = useCallback(async (submitType: typeof SUBMIT_TYPES[keyof typeof SUBMIT_TYPES] = SUBMIT_TYPES.MANUAL) => {
        if (isSubmitted) return;

        try {
            setLoading(true);
            setIsSubmitted(true);

            const submissionData: ExamSubmissionData = {
                sessionId,
                examId,
                answers: answersMap,
                timeSpent: selectedExam?.duration ? (selectedExam.duration * 60) - remainingTime : 0,
                submitTime: new Date().toISOString(),
                submitType,
                finalReview: {
                    totalQuestions: progressInfo.totalQuestions,
                    answeredQuestions: progressInfo.answeredCount,
                    markedQuestions: progressInfo.markedCount,
                    skippedQuestions: progressInfo.skippedCount,
                    confidence: progressInfo.completionPercentage > 80 ? 'high' :
                        progressInfo.completionPercentage > 50 ? 'medium' : 'low'
                }
            };

            // Here you would call your exam submission API
            console.log('Submitting exam:', submissionData);

            // Stop timer and auto-save
            resetTimer();
            disableAutoSave();

            addNotification({
                type: NOTIFICATION_TYPES.SUCCESS,
                title: 'Sınav Teslim Edildi',
                message: 'Sınavınız başarıyla teslim edildi.',
                persistent: true
            });

            // Redirect to results page after a delay
            setTimeout(() => {
                router.push(`/exam/${examId}/results?session=${sessionId}`);
            }, 3000);

        } catch (error) {
            console.error('Failed to submit exam:', error);
            setIsSubmitted(false);

            addNotification({
                type: NOTIFICATION_TYPES.ERROR,
                title: 'Teslim Hatası',
                message: 'Sınav teslim edilirken bir hata oluştu. Lütfen tekrar deneyin.',
                duration: 10000
            });
        } finally {
            setLoading(false);
        }
    }, [sessionId, examId, answersMap, selectedExam, remainingTime, progressInfo, router, addNotification, resetTimer, disableAutoSave, isSubmitted]);

    // Toolbar actions (memoized)
    const toolbarActions: ExamToolbarAction[] = useMemo(() => [
        {
            id: 'previous',
            label: 'Önceki',
            icon: 'previous',
            action: handlePreviousQuestion,
            disabled: !navigationInfo.hasPrevious || isSubmitted,
            shortcut: '←'
        },
        {
            id: 'next',
            label: 'Sonraki',
            icon: 'next',
            action: handleNextQuestion,
            disabled: !navigationInfo.hasNext || isSubmitted,
            shortcut: '→'
        },
        {
            id: 'mark',
            label: currentQuestion && markedQuestions.has(currentQuestion.id) ? 'İşareti Kaldır' : 'İşaretle',
            icon: 'mark',
            action: () => handleMarkForReview(),
            disabled: isSubmitted,
            shortcut: 'Ctrl+M'
        },
        {
            id: 'save',
            label: 'Kaydet',
            icon: 'save',
            action: handleSaveAnswer,
            disabled: isSubmitted,
            shortcut: 'Ctrl+S'
        },
        {
            id: 'pause',
            label: isPaused ? 'Devam' : 'Duraklat',
            icon: 'pause',
            action: isPaused ? resumeTimer : pauseTimer,
            disabled: isSubmitted,
            visible: executionSettings?.allowPauseResume ?? false
        },
        {
            id: 'palette',
            label: showQuestionPalette ? 'Paleti Gizle' : 'Paleti Göster',
            icon: 'palette',
            action: () => setShowQuestionPalette(!showQuestionPalette)
        },
        {
            id: 'fullscreen',
            label: 'Tam Ekran',
            icon: 'fullscreen',
            action: () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().then(() => {
                        setIsFullscreen(true);
                    });
                } else {
                    document.exitFullscreen().then(() => {
                        setIsFullscreen(false);
                    });
                }
            }
        },
        {
            id: 'submit',
            label: 'Teslim Et',
            icon: 'submit',
            action: () => setShowSubmitConfirmation(true),
            disabled: isSubmitted,
            variant: 'danger'
        }
    ], [navigationInfo, currentQuestion, markedQuestions, isPaused, isSubmitted, executionSettings, showQuestionPalette, handlePreviousQuestion, handleNextQuestion, handleMarkForReview, handleSaveAnswer, pauseTimer, resumeTimer]);

    // Loading state
    if (loading || answersLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <div className="mt-4 text-gray-600">
                        <div className="text-lg font-medium">Sınav Yükleniyor</div>
                        <div className="text-sm">Sınav verileri hazırlanıyor, lütfen bekleyiniz...</div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full p-6">
                    <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Sınav Yüklenemedi</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No current question state
    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Soru Bulunamadı</h2>
                    <p className="text-gray-600">Görüntülenecek soru bulunmuyor.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
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

            {/* Timer */}
            {selectedExam?.duration && (
                <ExamTimer
                    totalDuration={selectedExam.duration * 60}
                    onTimeExpired={() => handleExamSubmit(SUBMIT_TYPES.TIME_EXPIRED)}
                    onTimeWarning={(seconds) => console.log('Time warning:', seconds)}
                    onTimeCritical={(seconds) => console.log('Time critical:', seconds)}
                    isPaused={isPaused}
                    position="top-right"
                    size="medium"
                    showProgress={true}
                />
            )}

            {/* Auto-save indicator */}
            {autoSaveState.isAutoSaving && (
                <div className="fixed top-4 left-4 z-50">
                    <div className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2">
                        <LoadingSpinner  />
                        <span className="text-sm">Kaydediliyor...</span>
                    </div>
                </div>
            )}

            {/* Last auto-save time */}
            {autoSaveState.lastAutoSaveTime && (
                <div className="fixed top-16 left-4 z-40">
                    <div className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                        Son kayıt: {autoSaveState.lastAutoSaveTime.toLocaleTimeString()}
                    </div>
                </div>
            )}

            <div className="flex">
                {/* Sidebar - Question Palette */}
                {showQuestionPalette && (
                    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto">
                        <div className="p-4 space-y-4">
                            {/* Progress Information */}
                            <ExamProgress
                                progressInfo={progressInfo}
                                showDetails={true}
                                size="medium"
                                orientation="horizontal"
                            />

                            {/* Question Palette */}
                            <QuestionPalette
                                questions={paletteItems}
                                currentQuestionId={currentQuestion.id}
                                onQuestionSelect={(questionId) => {
                                    const questionIndex = examReady?.questions?.findIndex(q => q.id === questionId) ?? -1;
                                    if (questionIndex >= 0) {
                                        handleGoToQuestion(questionIndex + 1);
                                    }
                                }}
                                showLegend={true}
                                showPartHeaders={true}
                                groupByPart={true}
                                size="medium"
                                columns={8}
                            />

                            {/* Quick Stats */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <h4 className="font-medium text-gray-800 mb-2">Sınav Durumu</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-center">
                                        <div className="font-bold text-green-600">{progressInfo.answeredCount}</div>
                                        <div className="text-gray-600">Cevaplanmış</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-blue-600">{progressInfo.markedCount}</div>
                                        <div className="text-gray-600">İşaretlenmiş</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-gray-600">{progressInfo.visitedCount}</div>
                                        <div className="text-gray-600">Ziyaret Edilmiş</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-red-600">{progressInfo.questionsRemaining}</div>
                                        <div className="text-gray-600">Kalan</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Question Navigation */}
                    <QuestionNavigation
                        navigationInfo={navigationInfo}
                        onPrevious={handlePreviousQuestion}
                        onNext={handleNextQuestion}
                        onGoToQuestion={handleGoToQuestion}
                        showQuestionJumper={true}
                        showProgress={true}
                        allowBackNavigation={executionSettings?.allowBackNavigation ?? true}
                        allowSkipping={executionSettings?.allowSkipping ?? true}
                        position="top"
                    />

                    {/* Question Display Area */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <QuestionDisplay
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={progressInfo.totalQuestions}
                            answer={currentAnswer}
                            isMarkedForReview={markedQuestions.has(currentQuestion.id)}
                            timeLimit={currentQuestion.timeLimit}
                            onAnswerChange={handleAnswerChange}
                            onMarkForReview={handleMarkForReview}
                            readonly={isSubmitted}
                        />
                    </div>

                    {/* Bottom Toolbar */}
                    <ExamToolbar
                        actions={toolbarActions}
                        position="bottom"
                        size="medium"
                        showLabels={true}
                        showShortcuts={false}
                    />
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Sınavı Teslim Et</h3>

                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Sınav Özeti</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div>Toplam Soru: {progressInfo.totalQuestions}</div>
                                    <div>Cevaplanmış: {progressInfo.answeredCount}</div>
                                    <div>İşaretlenmiş: {progressInfo.markedCount}</div>
                                    <div>Boş: {progressInfo.questionsRemaining}</div>
                                    <div>Tamamlanma: %{Math.round(progressInfo.completionPercentage)}</div>
                                </div>
                            </div>

                            {progressInfo.completionPercentage < 50 && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <div className="text-yellow-800 text-sm">
                                            Sınavınızın %{Math.round(100 - progressInfo.completionPercentage)} si tamamlanmadı.
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-sm text-gray-600">
                                Sınavınızı teslim ettikten sonra değişiklik yapamazsınız. Emin misiniz?
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowSubmitConfirmation(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                disabled={loading}
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubmitConfirmation(false);
                                    handleExamSubmit(SUBMIT_TYPES.MANUAL);
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner  />
                                        <span className="ml-2">Teslim Ediliyor...</span>
                                    </div>
                                ) : (
                                    'Teslim Et'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Fullscreen overlay hint */}
            {isFullscreen && (
                <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm">
                    ESC tuşuna basarak tam ekrandan çıkabilirsiniz
                </div>
            )}

            {/* Pause overlay */}
            {isPaused && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
                    <div className="bg-white rounded-2xl p-8 text-center">
                        <div className="text-blue-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Sınav Duraklatıldı</h3>
                        <p className="text-gray-600 mb-6">Devam etmek için aşağıdaki butona tıklayın.</p>
                        <button
                            onClick={resumeTimer}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Sınavı Devam Ettir
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}