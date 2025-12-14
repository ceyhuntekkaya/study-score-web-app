'use client';

import { useState, useCallback } from 'react';
import {ExamStartConfirmation as ExamStartConfirmationType, ReadinessCheck} from "@/types/exam/exam-start.types";

interface ExamStartConfirmationProps {
    examData: {
        id: string;
        name: string;
        duration: number;
        totalQuestions: number;
        maxScore: number;
    };
    readinessChecks: ReadinessCheck[];
    onConfirm: (confirmation: ExamStartConfirmationType) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ExamStartConfirmation({
                                          examData,
                                          readinessChecks,
                                          onConfirm,
                                          onCancel,
                                          isLoading = false
                                      }: ExamStartConfirmationProps) {
    const [userConfirmed, setUserConfirmed] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [finalConfirmation, setFinalConfirmation] = useState('');

    const allChecksCompleted = readinessChecks.filter(check => check.required).every(check => check.completed);
    const canProceed = userConfirmed && agreedToTerms && finalConfirmation === 'BAŞLAT' && allChecksCompleted;

    const formatDuration = useCallback((minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        if (hours > 0) {
            return `${hours} saat ${mins} dakika`;
        }
        return `${minutes} dakika`;
    }, []);

    const handleConfirm = useCallback(() => {
        if (!canProceed || isLoading) return;

        const confirmation: ExamStartConfirmationType = {
            userId: 'current-user-id', // Bu gerçek uygulamada auth context'ten gelecek
            examId: examData.id,
            sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            ipAddress: 'unknown', // Bu gerçek uygulamada client IP'si olacak
            userAgent: navigator.userAgent
        };

        onConfirm(confirmation);
    }, [canProceed, isLoading, examData.id, onConfirm]);

    const getCheckIcon = useCallback((check: ReadinessCheck) => {
        if (check.completed) {
            return (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            );
        } else if (check.required) {
            return (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">Sınav Başlatma Onayı</h1>
                        <p className="text-blue-100">
                            Sınavınızı başlatmadan önce lütfen tüm bilgileri kontrol edin
                        </p>
                    </div>

                    <div className="p-6 space-y-6">

                        {/* Exam Summary */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h2 className="font-semibold text-gray-800 mb-3">Sınav Özeti</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Sınav Adı:</span>
                                    <div className="font-medium">{examData.name}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Süre:</span>
                                    <div className="font-medium">{formatDuration(examData.duration)}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Soru Sayısı:</span>
                                    <div className="font-medium">{examData.totalQuestions} soru</div>
                                </div>
                                <div>
                                    <span className="text-gray-600">Maksimum Puan:</span>
                                    <div className="font-medium">{examData.maxScore} puan</div>
                                </div>
                            </div>
                        </div>

                        {/* Readiness Checks */}
                        <div>
                            <h2 className="font-semibold text-gray-800 mb-3">Hazırlık Kontrolleri</h2>
                            <div className="space-y-2">
                                {readinessChecks.map((check) => (
                                    <div
                                        key={check.id}
                                        className={`flex items-center p-3 rounded-lg border ${
                                            check.completed
                                                ? 'bg-green-50 border-green-200'
                                                : check.required
                                                    ? 'bg-red-50 border-red-200'
                                                    : 'bg-yellow-50 border-yellow-200'
                                        }`}
                                    >
                                        <div className="mr-3">
                                            {getCheckIcon(check)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-800">{check.name}</div>
                                            <div className="text-sm text-gray-600">{check.description}</div>
                                        </div>
                                        {check.required && (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Zorunlu
                      </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning if checks not completed */}
                        {!allChecksCompleted && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <div className="font-medium text-red-800">Eksik Kontroller</div>
                                        <div className="text-sm text-red-700">
                                            Sınava başlamak için tüm zorunlu kontrolleri tamamlamanız gerekiyor.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Confirmation Checkboxes */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={userConfirmed}
                                    onChange={(e) => setUserConfirmed(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={!allChecksCompleted}
                                />
                                <span className={`text-sm ${!allChecksCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                  Sınav başladıktan sonra sistemden çıkamayacağımı, sınavı tamamlayana kadar
                  oturumun aktif kalacağını anlıyorum.
                </span>
                            </label>

                            <label className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={!allChecksCompleted}
                                />
                                <span className={`text-sm ${!allChecksCompleted ? 'text-gray-400' : 'text-gray-700'}`}>
                  Sınav kurallarını okudum, anladım ve tüm şartları kabul ediyorum.
                </span>
                            </label>
                        </div>

                        {/* Final Confirmation Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sınavı başlatmak için BAŞLAT yazın:
                            </label>
                            <input
                                type="text"
                                value={finalConfirmation}
                                onChange={(e) => setFinalConfirmation(e.target.value.toUpperCase())}
                                placeholder="BAŞLAT yazın..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                                disabled={!allChecksCompleted || !userConfirmed || !agreedToTerms}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                onClick={onCancel}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                disabled={isLoading}
                            >
                                İptal Et
                            </button>

                            <button
                                onClick={handleConfirm}
                                disabled={!canProceed || isLoading}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    canProceed && !isLoading
                                        ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Başlatılıyor...
                                    </div>
                                ) : (
                                    'Sınavı Başlat'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-600">
                        <div className="flex items-center justify-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Bu oturum güvenli bir şekilde şifrelenmektedir
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}