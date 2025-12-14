'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Flag, RotateCcw, Eye, AlertTriangle } from 'lucide-react';

interface DemoQuestion {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
    title: string;
    question: string;
    options?: string[];
    correctAnswer: string | number | boolean;
    explanation: string;
    points: number;
    timeLimit: number; // saniye
    difficulty: 'easy' | 'medium' | 'hard';
}

// Answer tiplerini union type olarak tanımlayalım
type DemoAnswerValue = string | number | boolean | undefined;

interface DemoQuestionsProps {
    onCompleted: () => void;
}

export function DemoQuestions({ onCompleted }: DemoQuestionsProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, DemoAnswerValue>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 dakika demo süresi
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);

    // Demo soruları
    const demoQuestions: DemoQuestion[] = [
        {
            id: 'demo-1',
            type: 'multiple_choice',
            title: 'Çoktan Seçmeli Soru Örneği',
            question: 'Aşağıdakilerden hangisi bir programlama dili değildir?',
            options: [
                'JavaScript',
                'Python',
                'HTML',
                'Java'
            ],
            correctAnswer: 2,
            explanation: 'HTML (HyperText Markup Language) bir işaretleme dilidir, programlama dili değildir. Web sayfalarının yapısını tanımlamak için kullanılır.',
            points: 5,
            timeLimit: 120,
            difficulty: 'easy'
        },
        {
            id: 'demo-2',
            type: 'true_false',
            title: 'Doğru/Yanlış Soru Örneği',
            question: 'TypeScript, JavaScript\'in bir üst kümesi (superset) olarak kabul edilir.',
            correctAnswer: true,
            explanation: 'Doğru. TypeScript, JavaScript\'e tip güvenliği ve ek özellikler ekleyen bir üst kümesidir. Tüm geçerli JavaScript kodu aynı zamanda geçerli TypeScript kodudur.',
            points: 3,
            timeLimit: 60,
            difficulty: 'medium'
        },
        {
            id: 'demo-3',
            type: 'fill_blank',
            title: 'Boşluk Doldurma Soru Örneği',
            question: 'React\'te bileşenler arası veri aktarımı için _____ kullanılır.',
            correctAnswer: 'props',
            explanation: 'Props (properties), React bileşenleri arasında veri aktarımı için kullanılan temel mekanizmadır.',
            points: 4,
            timeLimit: 90,
            difficulty: 'medium'
        },
        {
            id: 'demo-4',
            type: 'essay',
            title: 'Açık Uçlu Soru Örneği',
            question: 'Web geliştirmede responsive tasarımın önemini açıklayın. (En az 100 kelime)',
            correctAnswer: 'Responsive tasarım, web sitelerinin farklı ekran boyutlarına uyum sağlaması için kritik öneme sahiptir...',
            explanation: 'Bu tür sorularda yaratıcılığınız ve bilginizi detaylı şekilde ifade etme beceriniz değerlendirilir.',
            points: 10,
            timeLimit: 300,
            difficulty: 'hard'
        }
    ];

    const currentQuestion = demoQuestions[currentQuestionIndex];

    // Timer
    useEffect(() => {
        if (!isTimerActive || isCompleted) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setIsTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerActive, isCompleted]);

    // Süre formatı
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Cevap verme - tip güvenli hale getirildi
    const handleAnswer = (questionId: string, answer: DemoAnswerValue): void => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Soruyu işaretle
    const toggleFlag = (questionId: string): void => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });
    };

    // Açıklamayı göster/gizle
    const toggleExplanation = (questionId: string): void => {
        setShowExplanation(prev => ({
            ...prev,
            [questionId]: !prev[questionId]
        }));
    };

    // Sonraki soru
    const nextQuestion = (): void => {
        if (currentQuestionIndex < demoQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    // Önceki soru
    const prevQuestion = (): void => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Demo'yu tamamla
    const completeDemo = (): void => {
        setIsCompleted(true);
        setIsTimerActive(false);
        onCompleted();
    };

    // Kelime sayısını hesaplama fonksiyonu - tip güvenli
    const countWords = (text: string): number => {
        return text.split(' ').filter((word: string) => word.length > 0).length;
    };

    // İlerleme yüzdesi
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = Math.round((answeredCount / demoQuestions.length) * 100);

    return (
        <div className="space-y-6">
            {/* Demo Uyarısı */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-amber-800 font-medium">Bu sadece bir demo!</h4>
                        <p className="text-amber-700 text-sm mt-1">
                            Bu sorular gerçek sınav değildir. Sadece sınav arayüzüne alışmanız için tasarlanmıştır.
                            Cevaplarınız kaydedilmez ve değerlendirilmez.
                        </p>
                    </div>
                </div>
            </div>

            {/* Timer ve İlerleme */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Kalan Süre</span>
                    </div>
                    <div className={`text-2xl font-bold ${
                        timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                        {formatTime(timeRemaining)}
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">İlerleme</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {answeredCount}/{demoQuestions.length}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                        <Flag className="w-4 h-4" />
                        <span className="text-sm font-medium">İşaretlenen</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                        {flaggedQuestions.size}
                    </div>
                </div>
            </div>

            {/* Soru */}
            <div className="bg-white border rounded-lg">
                {/* Soru Header */}
                <div className="border-b p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">
                            Soru {currentQuestionIndex + 1} / {demoQuestions.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                                {currentQuestion.difficulty === 'easy' ? 'Kolay' :
                                    currentQuestion.difficulty === 'medium' ? 'Orta' : 'Zor'}
                            </span>
                            <span className="text-sm text-gray-500">
                                {currentQuestion.points} puan
                            </span>
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {currentQuestion.title}
                    </h3>
                </div>

                {/* Soru İçerik */}
                <div className="p-6">
                    <div className="mb-6">
                        <p className="text-gray-900 text-lg leading-relaxed">
                            {currentQuestion.question}
                        </p>
                    </div>

                    {/* Cevap Alanı */}
                    <div className="space-y-4">
                        {currentQuestion.type === 'multiple_choice' && (
                            <div className="space-y-3">
                                {currentQuestion.options?.map((option, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            answers[currentQuestion.id] === index
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={index}
                                            checked={answers[currentQuestion.id] === index}
                                            onChange={() => handleAnswer(currentQuestion.id, index)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                            answers[currentQuestion.id] === index
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {answers[currentQuestion.id] === index && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className="text-gray-900">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === 'true_false' && (
                            <div className="space-y-3">
                                {[
                                    { value: true, label: 'Doğru' },
                                    { value: false, label: 'Yanlış' }
                                ].map((option) => (
                                    <label
                                        key={option.value.toString()}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            answers[currentQuestion.id] === option.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={currentQuestion.id}
                                            value={option.value.toString()}
                                            checked={answers[currentQuestion.id] === option.value}
                                            onChange={() => handleAnswer(currentQuestion.id, option.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                            answers[currentQuestion.id] === option.value
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {answers[currentQuestion.id] === option.value && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className="text-gray-900">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {currentQuestion.type === 'fill_blank' && (
                            <div>
                                <input
                                    type="text"
                                    value={(answers[currentQuestion.id] as string) || ''}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    placeholder="Cevabınızı buraya yazın..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}

                        {currentQuestion.type === 'essay' && (
                            <div>
                                <textarea
                                    value={(answers[currentQuestion.id] as string) || ''}
                                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                    placeholder="Cevabınızı detaylı olarak yazın..."
                                    rows={6}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="text-sm text-gray-500 mt-2">
                                    Kelime sayısı: {countWords((answers[currentQuestion.id] as string) || '')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Açıklama */}
                    {showExplanation[currentQuestion.id] && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Açıklama:</h4>
                            <p className="text-blue-800 text-sm">{currentQuestion.explanation}</p>
                        </div>
                    )}
                </div>

                {/* Soru Aksiyonları */}
                <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleFlag(currentQuestion.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                    flaggedQuestions.has(currentQuestion.id)
                                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                }`}
                            >
                                <Flag className="w-4 h-4" />
                                {flaggedQuestions.has(currentQuestion.id) ? 'İşaretli' : 'İşaretle'}
                            </button>

                            <button
                                onClick={() => toggleExplanation(currentQuestion.id)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400"
                            >
                                <Eye className="w-4 h-4" />
                                {showExplanation[currentQuestion.id] ? 'Açıklamayı Gizle' : 'Açıklamayı Göster'}
                            </button>

                            <button
                                onClick={() => handleAnswer(currentQuestion.id, undefined)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Sıfırla
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={prevQuestion}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Önceki
                            </button>

                            {currentQuestionIndex === demoQuestions.length - 1 ? (
                                <button
                                    onClick={completeDemo}
                                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Demoyu Tamamla
                                </button>
                            ) : (
                                <button
                                    onClick={nextQuestion}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Sonraki
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Soru Paleti */}
            <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Soru Paleti</h4>
                <div className="grid grid-cols-8 gap-2">
                    {demoQuestions.map((question, index) => (
                        <button
                            key={question.id}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className={`w-10 h-10 rounded-lg border font-medium text-sm relative ${
                                currentQuestionIndex === index
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : answers[question.id] !== undefined
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                            }`}
                        >
                            {index + 1}
                            {flaggedQuestions.has(question.id) && (
                                <div className="absolute -top-1 -right-1">
                                    <Flag className="w-3 h-3 text-orange-500 fill-current" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-blue-500 bg-blue-500 rounded"></div>
                        <span>Mevcut soru</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-green-500 bg-green-50 rounded"></div>
                        <span>Cevaplanmış</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        <span>Cevaplanmamış</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4 text-orange-500" />
                        <span>İşaretlenmiş</span>
                    </div>
                </div>
            </div>
        </div>
    );
}