'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Grid3X3, Flag, CheckCircle, Keyboard, Star, Target } from 'lucide-react';

interface TutorialStep {
    id: string;
    title: string;
    description: string;
    highlightElement: string;
    content: React.ReactNode;
    action?: string;
    completed: boolean;
}

interface NavigationTutorialProps {
    onCompleted: () => void;
}

type AnswerValue = string | number | boolean;

export function NavigationTutorial({ onCompleted }: NavigationTutorialProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
    const [currentDemoQuestion, setCurrentDemoQuestion] = useState(0);
    const [demoAnswers, setDemoAnswers] = useState<Record<string, AnswerValue>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());

    // Demo sorular (sadece navigasyon için)
    const demoQuestions = [
        { id: 'nav-demo-1', title: 'Demo Soru 1', answered: false },
        { id: 'nav-demo-2', title: 'Demo Soru 2', answered: false },
        { id: 'nav-demo-3', title: 'Demo Soru 3', answered: false },
        { id: 'nav-demo-4', title: 'Demo Soru 4', answered: false },
        { id: 'nav-demo-5', title: 'Demo Soru 5', answered: false }
    ];

    // Tutorial adımları
    const tutorialSteps: TutorialStep[] = [
        {
            id: 'welcome',
            title: 'Navigasyon Eğitimine Hoş Geldiniz',
            description: 'Sınav sırasında nasıl gezineceğinizi öğrenin',
            highlightElement: '',
            completed: completedSteps.has('welcome'),
            content: (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Navigasyon Eğitimi</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Bu eğitimde sınav sırasında kullanacağınız tüm navigasyon özelliklerini öğreneceksiniz.
                        Her adımı dikkatlice takip edin ve belirtilen işlemleri yapın.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm">
                            💡 İpucu: Bu eğitim yaklaşık 3 dakika sürecektir ve sınav başarınız için çok önemlidir.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: 'question-navigation',
            title: 'Soru Arası Geçiş',
            description: 'İleri/geri butonları ile soru arası geçiş yapın',
            highlightElement: 'navigation-buttons',
            completed: completedSteps.has('question-navigation'),
            action: 'İleri ve Geri butonlarını kullanarak en az 2 soru arası geçiş yapın',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Soru Arası Geçiş</h3>
                    <p className="text-gray-600">
                        Sınav sırasında sorular arasında serbestçe geçiş yapabilirsiniz.
                        İleri ve Geri butonlarını kullanarak gezinmeyi deneyin.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Klavye Kısayolları:</h4>
                        <div className="space-y-1 text-sm text-green-700">
                            <div className="flex items-center gap-2">
                                <Keyboard className="w-4 h-4" />
                                <span><kbd className="px-2 py-1 bg-white border rounded">→</kbd> Sonraki soru</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Keyboard className="w-4 h-4" />
                                <span><kbd className="px-2 py-1 bg-white border rounded">←</kbd> Önceki soru</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'question-palette',
            title: 'Soru Paleti Kullanımı',
            description: 'Soru paletinden istediğiniz soruya direkt geçiş yapın',
            highlightElement: 'question-palette',
            completed: completedSteps.has('question-palette'),
            action: 'Soru paletinden farklı bir soruya tıklayın',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Soru Paleti</h3>
                    <p className="text-gray-600">
                        Soru paleti tüm soruları görsel olarak gösterir. Herhangi bir soruya direkt gitmek için
                        soru numarasına tıklayabilirsiniz.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-800">Soru Durumları:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 border border-blue-500 bg-blue-500 text-white rounded flex items-center justify-center text-xs">1</div>
                                    <span>Mevcut soru</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 border border-green-500 bg-green-50 text-green-700 rounded flex items-center justify-center text-xs">2</div>
                                    <span>Cevaplanmış</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 border border-gray-300 text-gray-600 rounded flex items-center justify-center text-xs">3</div>
                                    <span>Cevaplanmamış</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-gray-800">İşaretleme:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 border border-orange-300 bg-orange-50 text-orange-700 rounded flex items-center justify-center text-xs relative">
                                        4
                                        <Flag className="w-2 h-2 text-orange-500 absolute -top-0.5 -right-0.5" />
                                    </div>
                                    <span>İşaretlenmiş</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'question-flagging',
            title: 'Soru İşaretleme',
            description: 'Soruları daha sonra gözden geçirmek için işaretleyin',
            highlightElement: 'flag-button',
            completed: completedSteps.has('question-flagging'),
            action: 'İşaretle butonuna tıklayarak mevcut soruyu işaretleyin',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Soru İşaretleme</h3>
                    <p className="text-gray-600">
                        Emin olmadığınız veya daha sonra gözden geçirmek istediğiniz soruları işaretleyebilirsiniz.
                        İşaretlenen sorular turuncu renkte görünür.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg">
                        <h4 className="font-medium text-amber-800 mb-2">Ne zaman işaretlemeli?</h4>
                        <ul className="space-y-1 text-sm text-amber-700">
                            <li>• Cevabından emin olmadığınızda</li>
                            <li>• Daha sonra tekrar kontrol etmek istediğinizde</li>
                            <li>• Zaman kısıtı nedeniyle hızlıca geçtiğinizde</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: 'answer-selection',
            title: 'Cevap Verme',
            description: 'Farklı soru türlerine nasıl cevap verileceğini öğrenin',
            highlightElement: 'answer-area',
            completed: completedSteps.has('answer-selection'),
            action: 'Aşağıdaki demo soruya cevap verin',
            content: (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Cevap Verme</h3>
                    <p className="text-gray-600">
                        Sınav sırasında farklı türde sorularla karşılaşacaksınız. Her soru türü için
                        cevap verme yöntemi biraz farklıdır.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="font-medium">Çoktan Seçmeli:</h4>
                            <p className="text-gray-600">Seçeneklerden birine tıklayın</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Doğru/Yanlış:</h4>
                            <p className="text-gray-600">Doğru veya Yanlış seçin</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Boşluk Doldurma:</h4>
                            <p className="text-gray-600">Metin kutusuna yazın</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Açık Uçlu:</h4>
                            <p className="text-gray-600">Detaylı cevabınızı yazın</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'completion',
            title: 'Tebrikler!',
            description: 'Navigasyon eğitimini başarıyla tamamladınız',
            highlightElement: '',
            completed: completedSteps.has('completion'),
            content: (
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Eğitim Tamamlandı!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Navigasyon eğitimini başarıyla tamamladınız. Artık sınav sırasında rahatça
                        gezinebilir ve tüm özellikleri kullanabilirsiniz.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Öğrendikleriniz:</h4>
                        <ul className="space-y-1 text-sm text-green-700 text-left">
                            <li>✓ Sorular arası geçiş yapma</li>
                            <li>✓ Soru paletini kullanma</li>
                            <li>✓ Soruları işaretleme</li>
                            <li>✓ Cevap verme yöntemleri</li>
                            <li>✓ Klavye kısayolları</li>
                        </ul>
                    </div>
                </div>
            )
        }
    ];

    const currentTutorialStep = tutorialSteps[currentStep];

    // Adım tamamlandığında
    const completeStep = (stepId: string) => {
        setCompletedSteps(prev => new Set([...prev, stepId]));
    };

    // Demo cevap verme
    const handleDemoAnswer = (questionId: string, answer: AnswerValue) => {
        setDemoAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));

        // Answer selection adımını tamamla
        if (currentTutorialStep.id === 'answer-selection') {
            completeStep('answer-selection');
        }
    };

    // Soru işaretleme
    const toggleDemoFlag = (questionId: string) => {
        setFlaggedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionId)) {
                newSet.delete(questionId);
            } else {
                newSet.add(questionId);
            }
            return newSet;
        });

        // Question flagging adımını tamamla
        if (currentTutorialStep.id === 'question-flagging') {
            completeStep('question-flagging');
        }
    };

    // Navigasyon izleme
    const handleDemoNavigation = (direction: 'next' | 'prev' | 'direct', index?: number) => {
        if (direction === 'next' && currentDemoQuestion < demoQuestions.length - 1) {
            setCurrentDemoQuestion(prev => prev + 1);
        } else if (direction === 'prev' && currentDemoQuestion > 0) {
            setCurrentDemoQuestion(prev => prev - 1);
        } else if (direction === 'direct' && index !== undefined) {
            setCurrentDemoQuestion(index);
            // Question palette adımını tamamla
            if (currentTutorialStep.id === 'question-palette') {
                completeStep('question-palette');
            }
        }

        // Question navigation adımını tamamla
        if (currentTutorialStep.id === 'question-navigation') {
            completeStep('question-navigation');
        }
    };

    // Sonraki adım
    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
            // Welcome adımını otomatik tamamla
            if (currentTutorialStep.id === 'welcome') {
                completeStep('welcome');
            }
        } else {
            // Completion adımını tamamla ve eğitimi bitir
            completeStep('completion');
            onCompleted();
        }
    };

    // Önceki adım
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Highlight effect
    useEffect(() => {
        setHighlightedElement(currentTutorialStep.highlightElement);
    }, [currentTutorialStep]);

    // İlerleme yüzdesi
    const progressPercentage = Math.round(((currentStep + 1) / tutorialSteps.length) * 100);

    return (
        <div className="space-y-6">
            {/* Progress */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between text-sm text-blue-800 mb-2">
                    <span>Eğitim İlerlemesi</span>
                    <span>{currentStep + 1}/{tutorialSteps.length}</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Tutorial Content */}
                <div className="space-y-6">
                    <div className="bg-white border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {currentStep + 1}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {currentTutorialStep.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {currentTutorialStep.description}
                                </p>
                            </div>
                        </div>

                        {currentTutorialStep.content}

                        {currentTutorialStep.action && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 text-yellow-800">
                                    <Star className="w-4 h-4" />
                                    <span className="font-medium text-sm">Yapılacak:</span>
                                </div>
                                <p className="text-yellow-700 text-sm mt-1">
                                    {currentTutorialStep.action}
                                </p>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Önceki
                            </button>

                            <div className="flex items-center gap-2">
                                {tutorialSteps.map((step, index) => (
                                    <div
                                        key={step.id}
                                        className={`w-2 h-2 rounded-full ${
                                            index === currentStep
                                                ? 'bg-blue-600'
                                                : completedSteps.has(step.id)
                                                    ? 'bg-green-600'
                                                    : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextStep}
                                disabled={!!currentTutorialStep.action && !completedSteps.has(currentTutorialStep.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentStep === tutorialSteps.length - 1 ? 'Tamamla' : 'Sonraki'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Demo Interface */}
                <div className="space-y-4">
                    {/* Demo Exam Interface */}
                    <div className="bg-white border rounded-lg">
                        {/* Header */}
                        <div className="border-b p-4">
                            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Soru {currentDemoQuestion + 1} / {demoQuestions.length}
                </span>
                                <span className="text-sm text-gray-500">Demo Arayüz</span>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Demo Soru: Navigasyon Testi
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Bu sadece navigasyon eğitimi için bir demo sorudur.
                                Aşağıdaki seçeneklerden birini seçerek cevap vermeyi deneyin.
                            </p>

                            {/* Answer Area */}
                            <div
                                className={`space-y-3 ${
                                    highlightedElement === 'answer-area' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-3' : ''
                                }`}
                            >
                                {['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'].map((option, index) => (
                                    <label
                                        key={index}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                            demoAnswers[`demo-${currentDemoQuestion}`] === index
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`demo-${currentDemoQuestion}`}
                                            value={index}
                                            checked={demoAnswers[`demo-${currentDemoQuestion}`] === index}
                                            onChange={() => handleDemoAnswer(`demo-${currentDemoQuestion}`, index)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                            demoAnswers[`demo-${currentDemoQuestion}`] === index
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                        }`}>
                                            {demoAnswers[`demo-${currentDemoQuestion}`] === index && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <span className="text-gray-900">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Question Actions */}
                        <div className="border-t p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleDemoFlag(`demo-${currentDemoQuestion}`)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                            highlightedElement === 'flag-button' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                        } ${
                                            flaggedQuestions.has(`demo-${currentDemoQuestion}`)
                                                ? 'border-orange-300 bg-orange-50 text-orange-700'
                                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                        }`}
                                    >
                                        <Flag className="w-4 h-4" />
                                        {flaggedQuestions.has(`demo-${currentDemoQuestion}`) ? 'İşaretli' : 'İşaretle'}
                                    </button>
                                </div>

                                <div
                                    className={`flex items-center gap-3 ${
                                        highlightedElement === 'navigation-buttons' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-2' : ''
                                    }`}
                                >
                                    <button
                                        onClick={() => handleDemoNavigation('prev')}
                                        disabled={currentDemoQuestion === 0}
                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Önceki
                                    </button>

                                    <button
                                        onClick={() => handleDemoNavigation('next')}
                                        disabled={currentDemoQuestion === demoQuestions.length - 1}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sonraki
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div
                        className={`bg-white border rounded-lg p-4 ${
                            highlightedElement === 'question-palette' ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                        }`}
                    >
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Grid3X3 className="w-4 h-4" />
                            Soru Paleti
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                            {demoQuestions.map((question, index) => (
                                <button
                                    key={question.id}
                                    onClick={() => handleDemoNavigation('direct', index)}
                                    className={`w-12 h-12 rounded-lg border font-medium text-sm relative transition-colors ${
                                        currentDemoQuestion === index
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : demoAnswers[`demo-${index}`] !== undefined
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    {index + 1}
                                    {flaggedQuestions.has(`demo-${index}`) && (
                                        <div className="absolute -top-1 -right-1">
                                            <Flag className="w-3 h-3 text-orange-500 fill-current" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-gray-50 border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Gösterge</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border border-blue-500 bg-blue-500 text-white rounded flex items-center justify-center text-xs">1</div>
                                <span className="text-gray-600">Mevcut</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border border-green-500 bg-green-50 text-green-700 rounded flex items-center justify-center text-xs">2</div>
                                <span className="text-gray-600">Cevaplanmış</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border border-gray-300 text-gray-600 rounded flex items-center justify-center text-xs">3</div>
                                <span className="text-gray-600">Boş</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 border border-orange-300 bg-orange-50 text-orange-700 rounded flex items-center justify-center text-xs relative">
                                    4
                                    <Flag className="w-2 h-2 text-orange-500 absolute -top-0.5 -right-0.5" />
                                </div>
                                <span className="text-gray-600">İşaretli</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}