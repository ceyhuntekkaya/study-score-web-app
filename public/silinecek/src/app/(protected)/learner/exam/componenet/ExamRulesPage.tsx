'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExams } from '@/hooks/exam/use-exam';
import { ExamRulesVideo } from './ExamRulesVideo';
import { InteractiveRulesList } from './InteractiveRulesList';
import LoadingSpinner from "@/components/ui/loading-spinner";
import {AlertNotification} from "@/app/(protected)/learner/exam/componenet/AlertNotification";

interface ExamRulesPageProps {
    examId?: string;
}

export function ExamRulesPage({ examId: propExamId }: ExamRulesPageProps) {
    const params = useParams();
    const router = useRouter();
    const examId = propExamId || (params?.examId as string);

    const { selectedExam, getExamById, loading: examLoading, error: examError } = useExams();

    const [readTime, setReadTime] = useState(0);
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [videoWatched, setVideoWatched] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const [currentView, setCurrentView] = useState<'video' | 'rules' | 'summary'>('video');

    // Timer to track reading time
    useEffect(() => {
        const timer = setInterval(() => {
            setReadTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Load exam data
    useEffect(() => {
        if (examId && !selectedExam) {
            getExamById(examId);
        }
    }, [examId, selectedExam, getExamById]);

    const handleVideoComplete = () => {
        setVideoWatched(true);
        setCompletedSections(prev => new Set([...prev, 'video']));
        setCurrentView('rules');
    };

    const handleRulesComplete = (completedRuleIds: string[]) => {
        setCompletedSections(prev => new Set([...prev, ...completedRuleIds]));
    };

    const handleAcceptRules = () => {
        if (!canProceed) return;
        setRulesAccepted(true);
        setCurrentView('summary');

        // Auto proceed after 2 seconds
        setTimeout(() => {
            handleContinue();
        }, 2000);
    };

    const handleContinue = () => {
        if (!canProceed) return;
        router.push(`/exam/${examId}/system-check`);
    };

    const handleGoBack = () => {
        router.push(`/exam/${examId}/info`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Check if user can proceed (minimum requirements)
    const canProceed = videoWatched && completedSections.size >= 6; // Video + at least 5 rule sections

    const getProgressPercentage = () => {
        const totalRequiredSections = 6; // 1 video + 5 rule categories
        const completed = Math.min(completedSections.size, totalRequiredSections);
        return Math.round((completed / totalRequiredSections) * 100);
    };

    if (examLoading) {
        return <LoadingSpinner/>;
    }

    if (examError || !selectedExam) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <AlertNotification
                        type="error"
                        title="Hata"
                        message="Sınav kuralları yüklenirken bir hata oluştu."
                    />
                    <button
                        onClick={handleGoBack}
                        className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Geri Dön
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleGoBack}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Sınav Kuralları & Yönergeler
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {selectedExam.name}
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Okuma süresi: {formatTime(readTime)}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">İlerleme</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${getProgressPercentage()}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                  {getProgressPercentage()}%
                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Adım 3/7
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* View Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                        <div className="flex border-b border-gray-200">
                            {[
                                { id: 'video', name: 'Video İzle', icon: '🎥', required: true },
                                { id: 'rules', name: 'Kuralları Oku', icon: '📋', required: true },
                                { id: 'summary', name: 'Özet', icon: '✓', required: false }
                            ].map((view) => (
                                <button
                                    key={view.id}
                                    onClick={() => setCurrentView(view.id as 'video' | 'rules' | 'summary')}
                                    disabled={view.id === 'rules' && !videoWatched}
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                        currentView === view.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="mr-2">{view.icon}</span>
                                    {view.name}
                                    {view.required && !completedSections.has(view.id) && (
                                        <span className="ml-2 text-red-500">*</span>
                                    )}
                                    {completedSections.has(view.id) && (
                                        <span className="ml-2 text-green-500">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Video View */}
                            {currentView === 'video' && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Sınav Kuralları Videosunu İzleyin
                                        </h2>
                                        <p className="text-gray-600">
                                            Lütfen aşağıdaki videoyu baştan sona izleyin. Video sınavla ilgili önemli kuralları ve yönergeleri içerir.
                                        </p>
                                    </div>

                                    <ExamRulesVideo
                                        examId={examId}
                                        onComplete={handleVideoComplete}
                                        onProgress={(progress) => {
                                            // Track video progress if needed
                                            console.log(progress)
                                        }}
                                    />

                                    {!videoWatched && (
                                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm text-yellow-800">
                          Devam edebilmek için videoyu tamamen izlemeniz gerekmektedir.
                        </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rules View */}
                            {currentView === 'rules' && (
                                <div>
                                    <div className="mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Sınav Kurallarını İnceleyin
                                        </h2>
                                        <p className="text-gray-600">
                                            Aşağıdaki kuralları dikkatlice okuyun ve anladığınızı onaylamak için her bölümü işaretleyin.
                                        </p>
                                    </div>

                                    <InteractiveRulesList
                                        examId={examId}
                                        onSectionComplete={handleRulesComplete}
                                        completedSections={completedSections}
                                    />
                                </div>
                            )}

                            {/* Summary View */}
                            {currentView === 'summary' && (
                                <div>
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Kuralları Başarıyla Tamamladınız
                                        </h2>
                                        <p className="text-gray-600">
                                            Tüm kuralları okuduğunuzu ve kabul ettiğinizi beyan ediyorsunuz.
                                        </p>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                        <h3 className="font-semibold text-green-900 mb-3">
                                            Tamamlanan Bölümler:
                                        </h3>
                                        <div className="space-y-2">
                                            {videoWatched && (
                                                <div className="flex items-center text-green-800">
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Video kuralları izlendi
                                                </div>
                                            )}
                                            {Array.from(completedSections).filter(s => s !== 'video').map(section => (
                                                <div key={section} className="flex items-center text-green-800">
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {section.charAt(0).toUpperCase() + section.slice(1)} kuralları okundu
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-blue-900 mb-3">
                                            Önemli Hatırlatma:
                                        </h3>
                                        <p className="text-blue-800 text-sm">
                                            Sınav sırasında bu kurallara uymanız gerekmektedir. Kurallara aykırı davranış
                                            sınav sonucunuzun geçersiz sayılmasına neden olabilir.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Summary */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                İlerleme Özeti
                            </h3>
                            <span className="text-sm text-gray-600">
                {completedSections.size}/6 tamamlandı
              </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className={`p-3 rounded-lg border ${videoWatched ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className="flex items-center">
                                    {videoWatched ? (
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={`text-sm font-medium ${videoWatched ? 'text-green-800' : 'text-gray-600'}`}>
                    Video İzleme
                  </span>
                                </div>
                            </div>

                            {['teknik', 'davranış', 'iletişim', 'değerlendirme', 'güvenlik'].map((rule) => (
                                <div key={rule} className={`p-3 rounded-lg border ${
                                    completedSections.has(rule) ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                }`}>
                                    <div className="flex items-center">
                                        {completedSections.has(rule) ? (
                                            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <span className={`text-sm font-medium ${
                                            completedSections.has(rule) ? 'text-green-800' : 'text-gray-600'
                                        }`}>
                      {rule.charAt(0).toUpperCase() + rule.slice(1)}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        <button
                            onClick={handleGoBack}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            ← Geri Dön
                        </button>

                        <div className="space-x-3">
                            {!rulesAccepted && canProceed && (
                                <button
                                    onClick={handleAcceptRules}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    Kuralları Kabul Et
                                </button>
                            )}

                            <button
                                onClick={handleContinue}
                                disabled={!canProceed || !rulesAccepted}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    canProceed && rulesAccepted
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-gray-400 text-white cursor-not-allowed'
                                }`}
                            >
                                {!canProceed ? 'Tüm Bölümleri Tamamlayın' : 'Sistem Kontrolüne Geç →'}
                            </button>
                        </div>
                    </div>

                    {/* Requirements Notice */}
                    {!canProceed && (
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm text-yellow-800">
                  Devam edebilmek için videoyu izlemeniz ve en az 5 kural bölümünü okumanız gerekmektedir.
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}