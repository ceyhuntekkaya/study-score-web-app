'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useExams } from '@/hooks/exam/use-exam';
import { useExamReady } from '@/hooks/exam/use-exam-ready';
import LoadingSpinner from "@/components/ui/loading-spinner";
import {AlertNotification} from "@/app/(protected)/learner/exam/componenet/AlertNotification";

interface ExamInformationPageProps {
    examId?: string;
}

export function ExamInformationPage({ examId: propExamId }: ExamInformationPageProps) {
    const params = useParams();
    const router = useRouter();
    const examId = propExamId || (params?.examId as string);

    const { selectedExam, getExamById, loading: examLoading, error: examError } = useExams();
    const { examReady, buildExamReady, loading: examReadyLoading, error: examReadyError } = useExamReady();

    const [currentSection, setCurrentSection] = useState<'overview' | 'details' | 'parts' | 'scoring'>('overview');
    const [readTime, setReadTime] = useState(0);

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

    // Build exam ready data
    useEffect(() => {
        if (selectedExam && !examReady) {
            buildExamReady(selectedExam.id);
        }
    }, [selectedExam, examReady, buildExamReady]);

    const handleContinue = () => {
        router.push(`/exam/${examId}/rules`);
    };

    const handleGoBack = () => {
        router.push(`/exam/${examId}/auth`);
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours} saat ${minutes} dakika`;
        }
        return `${minutes} dakika`;
    };

    const formatReadTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getQuestionTypeDistribution = () => {
        if (!examReady) return {};

        const distribution: { [key: string]: number } = {};
        examReady.questions.forEach(question => {
            const type = question.questionType;
            distribution[type] = (distribution[type] || 0) + 1;
        });
        return distribution;
    };

    const getQuestionTypeName = (type: string) => {
        const typeNames: { [key: string]: string } = {
            'MULTIPLE_CHOICE': 'Çoktan Seçmeli',
            'TRUE_FALSE': 'Doğru/Yanlış',
            'FILL_IN_THE_BLANKS': 'Boşluk Doldurma',
            'SHORT_ANSWER': 'Kısa Cevap',
            'MATCHING': 'Eşleştirme',
            'ESSAY': 'Kompozisyon',
            'ORDERING': 'Sıralama',
            'MULTIPLE_RESPONSE': 'Çoklu Seçim',
            'HOT_SPOT': 'Nokta Belirleme',
            'DRAG_AND_DROP': 'Sürükle Bırak',
            'AUDIO_RESPONSE': 'Ses Kaydı',
            'VIDEO_RESPONSE': 'Video Kaydı',
            'IMAGE_RESPONSE': 'Resim Yükleme'
        };
        return typeNames[type] || type;
    };

    if (examLoading || examReadyLoading) {
        return <LoadingSpinner  />;
    }

    if (examError || examReadyError || !selectedExam || !examReady) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <AlertNotification
                        type="error"
                        title="Bilgi Yüklenemedi"
                        message="Sınav bilgileri yüklenirken bir hata oluştu."
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

    const questionTypes = getQuestionTypeDistribution();

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
                                    Sınav Bilgilendirme
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {selectedExam.name}
                                </p>
                            </div>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Okuma süresi: {formatReadTime(readTime)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Adım 2/7
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {/* Section Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border mb-6">
                        <div className="flex border-b border-gray-200">
                            {[
                                { id: 'overview', name: 'Genel Bakış', icon: '📊' },
                                { id: 'details', name: 'Detaylar', icon: '📋' },
                                { id: 'parts', name: 'Bölümler', icon: '📑' },
                                { id: 'scoring', name: 'Puanlama', icon: '🎯' }
                            ].map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setCurrentSection(section.id as 'overview' | 'details' | 'parts' | 'scoring')}
                                    className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                                        currentSection === section.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="mr-2">{section.icon}</span>
                                    {section.name}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">
                            {/* Overview Section */}
                            {currentSection === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                            {selectedExam.name}
                                        </h2>
                                        {selectedExam.description && (
                                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                                {selectedExam.description}
                                            </p>
                                        )}
                                    </div>

                                    {selectedExam.introText && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <h3 className="font-semibold text-blue-900 mb-3">
                                                Önemli Bilgilendirme
                                            </h3>
                                            <p className="text-blue-800 leading-relaxed">
                                                {selectedExam.introText}
                                            </p>
                                        </div>
                                    )}

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-700">
                                                {examReady.totalQuestions}
                                            </div>
                                            <div className="text-sm text-blue-600">Toplam Soru</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-green-700">
                                                {examReady.totalPoints}
                                            </div>
                                            <div className="text-sm text-green-600">Toplam Puan</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-700">
                                                {Math.floor(examReady.estimatedDuration / 60)}
                                            </div>
                                            <div className="text-sm text-purple-600">Dakika</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-yellow-700">
                                                {examReady.examParts?.length || 0}
                                            </div>
                                            <div className="text-sm text-yellow-600">Bölüm</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Details Section */}
                            {currentSection === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                            Sınav Detayları
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Sınav Kodu:</span>
                                                <span className="font-medium text-gray-900">{selectedExam.code || 'Belirtilmemiş'}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Kategori:</span>
                                                <span className="font-medium text-gray-900">{selectedExam.category}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Seviye:</span>
                                                <span className="font-medium text-gray-900">{selectedExam.level || 'Belirtilmemiş'}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Dil:</span>
                                                <span className="font-medium text-gray-900">{selectedExam.language || 'Türkçe'}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Toplam Süre:</span>
                                                <span className="font-medium text-gray-900">
                          {formatDuration(examReady.estimatedDuration)}
                        </span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Soru Sayısı:</span>
                                                <span className="font-medium text-gray-900">{examReady.totalQuestions}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Maksimum Puan:</span>
                                                <span className="font-medium text-gray-900">{examReady.totalPoints}</span>
                                            </div>

                                            <div className="flex justify-between py-3 border-b border-gray-200">
                                                <span className="text-gray-600">Ortalama Süre/Soru:</span>
                                                <span className="font-medium text-gray-900">
                          {Math.round(examReady.estimatedDuration / examReady.totalQuestions)} saniye
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Types */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Soru Türü Dağılımı
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(questionTypes).map(([type, count]) => (
                                                <div key={type} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <span className="text-gray-700">
                            {getQuestionTypeName(type)}
                          </span>
                                                    <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-900">
                              {count} soru
                            </span>
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{
                                                                    width: `${(count / examReady.totalQuestions) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-gray-500 w-8">
                              {Math.round((count / examReady.totalQuestions) * 100)}%
                            </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Parts Section */}
                            {currentSection === 'parts' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                            Sınav Bölümleri
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            Sınavınız {examReady.examParts?.length || 0} bölümden oluşmaktadır.
                                            Her bölümün kendine özgü soru türleri ve süreleri vardır.
                                        </p>
                                    </div>

                                    {examReady.examParts && examReady.examParts.length > 0 ? (
                                        <div className="space-y-4">
                                            {examReady.examParts.map((part, index) => {
                                                const partQuestions = examReady.questions.filter(q => q.examPart.id === part.id);
                                                const partPoints = partQuestions.reduce((sum, q) => sum + (q.points || 0), 0);

                                                return (
                                                    <div key={part.id} className="border border-gray-200 rounded-lg p-6">
                                                        <div className="flex items-start justify-between mb-4">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900">
                                                                    {part.orderNumber || index + 1}. {part.name}
                                                                </h3>
                                                                {part.description && (
                                                                    <p className="text-gray-600 mt-2">
                                                                        {part.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {part.skill && (
                                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                  {part.skill === 'READING' ? 'Okuma' : 'Yazma'}
                                </span>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                                                <div className="text-lg font-bold text-blue-700">
                                                                    {partQuestions.length}
                                                                </div>
                                                                <div className="text-blue-600">Soru</div>
                                                            </div>

                                                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                                                <div className="text-lg font-bold text-green-700">
                                                                    {partPoints}
                                                                </div>
                                                                <div className="text-green-600">Puan</div>
                                                            </div>

                                                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                                                                <div className="text-lg font-bold text-purple-700">
                                                                    ~{Math.round(partQuestions.reduce((sum, q) => sum + (q.timeLimit || 0), 0) / 60)}
                                                                </div>
                                                                <div className="text-purple-600">Dakika</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-gray-500 mb-2">
                                                Bu sınav için özel bölüm tanımlanmamış
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Tüm sorular tek bir bölüm halinde sunulacaktır
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Scoring Section */}
                            {currentSection === 'scoring' && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                                            Puanlama Sistemi
                                        </h2>
                                        <p className="text-gray-600 mb-6">
                                            Sınavınızın puanlama kriterleri ve başarı şartları aşağıda belirtilmiştir.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">
                                                Genel Puanlama
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Toplam Puan:</span>
                                                    <span className="font-medium">{examReady.totalPoints}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Ortalama Puan/Soru:</span>
                                                    <span className="font-medium">
                            {Math.round(examReady.totalPoints / examReady.totalQuestions * 10) / 10}
                          </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">En Düşük Puan:</span>
                                                    <span className="font-medium">0</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">En Yüksek Puan:</span>
                                                    <span className="font-medium">{examReady.totalPoints}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-6">
                                            <h3 className="font-semibold text-gray-900 mb-4">
                                                Başarı Kriterleri
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Geçme Notu:</span>
                                                    <span className="font-medium text-green-700">
                            {Math.round(examReady.totalPoints * 0.6)} / {examReady.totalPoints}
                          </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Başarı Yüzdesi:</span>
                                                    <span className="font-medium text-green-700">%60</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Mükemmel:</span>
                                                    <span className="font-medium text-green-700">%90+</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">İyi:</span>
                                                    <span className="font-medium text-green-700">%75-89</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Scoring Info */}
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                        <h3 className="font-semibold text-yellow-900 mb-3">
                                            Önemli Puanlama Notları
                                        </h3>
                                        <ul className="text-sm text-yellow-800 space-y-2">
                                            <li>• Yanlış cevaplar için puan düşülmez</li>
                                            <li>• Boş bırakılan sorular 0 puan olarak değerlendirilir</li>
                                            <li>• Her soru türünün kendine özgü puanı vardır</li>
                                            <li>• Kısmi puanlama yapılan soru türleri bulunabilir</li>
                                            <li>• Sonuçlar sınav bitiminde hemen görüntülenebilir</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
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

                        <button
                            onClick={handleContinue}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Kuralları Oku →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}