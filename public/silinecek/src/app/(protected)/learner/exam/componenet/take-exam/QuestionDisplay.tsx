'use client';

import { useState, useCallback } from 'react';
import { AnswerInput } from './AnswerInput';
import { EQuestionTemplateType } from '@/types/exam/exam-type';
import {QuestionDisplayProps} from "@/types/exam/exam-taking.types";

export function QuestionDisplay({
                                    question,
                                    questionNumber,
                                    totalQuestions,
                                    answer,
                                    isMarkedForReview,
                                    timeLimit,
                                    onAnswerChange,
                                    onMarkForReview,
                                    readonly = false
                                }: QuestionDisplayProps) {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const handleAnswerChange = useCallback((questionId: string, answerValue: string) => {
        if (!readonly) {
            onAnswerChange(questionId, answerValue);
        }
    }, [readonly, onAnswerChange]);

    const handleMarkForReview = useCallback(() => {
        if (!readonly) {
            onMarkForReview(question.id, !isMarkedForReview);
        }
    }, [readonly, onMarkForReview, question.id, isMarkedForReview]);

    const getQuestionTypeLabel = (type: EQuestionTemplateType): string => {
        switch (type) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return 'Çoktan Seçmeli';
            case EQuestionTemplateType.TRUE_FALSE:
                return 'Doğru/Yanlış';
            case EQuestionTemplateType.FILL_IN_THE_BLANKS:
                return 'Boşluk Doldurma';
            case EQuestionTemplateType.SHORT_ANSWER:
                return 'Kısa Cevap';
            case EQuestionTemplateType.ESSAY:
                return 'Kompozisyon';
            case EQuestionTemplateType.MATCHING:
                return 'Eşleştirme';
            case EQuestionTemplateType.ORDERING:
                return 'Sıralama';
            case EQuestionTemplateType.MULTIPLE_RESPONSE:
                return 'Çoklu Seçim';
            case EQuestionTemplateType.HOT_SPOT:
                return 'Sıcak Nokta';
            case EQuestionTemplateType.DRAG_AND_DROP:
                return 'Sürükle Bırak';
            case EQuestionTemplateType.AUDIO_RESPONSE:
                return 'Sesli Yanıt';
            case EQuestionTemplateType.VIDEO_RESPONSE:
                return 'Video Yanıt';
            case EQuestionTemplateType.IMAGE_RESPONSE:
                return 'Görsel Yanıt';
            default:
                return 'Bilinmeyen Tip';
        }
    };

    const getQuestionTypeIcon = (type: EQuestionTemplateType) => {
        switch (type) {
            case EQuestionTemplateType.MULTIPLE_CHOICE:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case EQuestionTemplateType.TRUE_FALSE:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            case EQuestionTemplateType.ESSAY:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy':
                return 'text-green-600 bg-green-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'hard':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getAnswerStatus = () => {
        if (!answer) return 'unanswered';
        if (answer.isAnswered) return 'answered';
        if (answer.isSkipped) return 'skipped';
        return 'visited';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'answered':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                );
            case 'skipped':
                return (
                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'visited':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const status = getAnswerStatus();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Question Number */}
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                                {questionNumber}
                            </div>
                            <div className="text-sm text-gray-600">
                                / {totalQuestions}
                            </div>
                        </div>

                        {/* Question Type */}
                        <div className="flex items-center space-x-2">
                            <div className="text-blue-600">
                                {getQuestionTypeIcon(question.questionType)}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                {getQuestionTypeLabel(question.questionType)}
              </span>
                        </div>

                        {/* Points */}
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{question.points} puan</span>
                        </div>

                        {/* Difficulty */}
                        {question.questionTemplate?.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.questionTemplate.difficulty)}`}>
                {question.questionTemplate.difficulty}
              </span>
                        )}
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-3">
                        {/* Answer Status */}
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(status)}
                            <span className="text-sm font-medium capitalize text-gray-700">
                {status === 'answered' && 'Cevaplanmış'}
                                {status === 'skipped' && 'Atlanmış'}
                                {status === 'visited' && 'Görüntülenmiş'}
                                {status === 'unanswered' && 'Cevaplanmamış'}
              </span>
                        </div>

                        {/* Mark for Review */}
                        {!readonly && (
                            <button
                                onClick={handleMarkForReview}
                                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${isMarkedForReview
                                    ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200'
                                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                                }
                  focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1
                `}
                                title={isMarkedForReview ? 'İnceleme işaretini kaldır' : 'İnceleme için işaretle'}
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">
                  {isMarkedForReview ? 'İşaretli' : 'İşaretle'}
                </span>
                            </button>
                        )}

                        {/* Time Limit */}
                        {timeLimit && timeLimit > 0 && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>{Math.floor(timeLimit / 60)} dakika</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
                {/* Instructions (if available) */}
                {question.questionTemplate?.instructions && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${showInstructions ? 'rotate-90' : ''}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Yönergeler</span>
                        </button>

                        {showInstructions && (
                            <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-sm text-blue-800 whitespace-pre-wrap">
                                    {question.questionTemplate.instructions}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Question Text/Content */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 leading-relaxed mb-4">
                        {question.questionTemplate?.title || 'Soru metni bulunamadı'}
                    </h2>

                    {question.questionTemplate?.description && (
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {question.questionTemplate.description}
                        </div>
                    )}
                </div>

                {/* Extra Sections (Instructions, Hints, etc.) */}
                {question.extraSections && question.extraSections.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {question.extraSections.map((section, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg">
                                <button
                                    onClick={() => setShowHint(!showHint)}
                                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium text-gray-700">
                      {section.extraSectionType === 'HINT' ? 'İpucu' : 'Açıklama'}
                    </span>
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showHint ? 'rotate-180' : ''}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {showHint && (
                                    <div className="px-4 pb-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-600 mt-3 whitespace-pre-wrap">
                                            {section.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Answer Input */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">Cevabınız:</h3>
                    </div>

                    <AnswerInput
                        questionId={question.id}
                        questionType={question.questionType}
                        templateData={question.questionTemplate || {}}
                        currentAnswer={answer?.answerData}
                        onChange={(answerValue) => handleAnswerChange(question.id, answerValue)}
                        readonly={readonly}
                        timeLimit={timeLimit}
                    />
                </div>

                {/* Question Footer Info */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            {question.questionTemplate?.subject && (
                                <span>Konu: {question.questionTemplate.subject}</span>
                            )}
                            {question.additionalTags && question.additionalTags.length > 0 && (
                                <div className="flex items-center space-x-1">
                                    <span>Etiketler:</span>
                                    <div className="flex space-x-1">
                                        {question.additionalTags.slice(0, 3).map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-gray-100 rounded-full">
                        {tag}
                      </span>
                                        ))}
                                        {question.additionalTags.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                        +{question.additionalTags.length - 3}
                      </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            {answer?.lastModifiedAt && (
                                <span>
                  Son güncelleme: {new Date(answer.lastModifiedAt).toLocaleTimeString('tr-TR')}
                </span>
                            )}
                            <span>Soru ID: {question.id.slice(-8)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}