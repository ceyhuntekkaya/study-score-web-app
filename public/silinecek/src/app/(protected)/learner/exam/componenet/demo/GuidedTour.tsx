'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Grid3X3, Flag, Settings, Volume2, Calculator, PenTool, ZoomIn, Save, CheckCircle, Target } from 'lucide-react';

interface TourStep {
    id: string;
    title: string;
    description: string;
    target: string;
    position: 'top' | 'bottom' | 'left' | 'right';
    content: string;
    action?: string;
    spotlight?: boolean;
}

interface GuidedTourProps {
    onCompleted: () => void;
}

type DemoAnswer = string | number | boolean;

export function GuidedTour({ onCompleted }: GuidedTourProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [highlightedElement, setHighlightedElement] = useState<string>('');
    const [tourCompleted, setTourCompleted] = useState(false);

    // Demo state
    const [demoAnswers, setDemoAnswers] = useState<Record<string, DemoAnswer>>({});
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timerVisible, setTimerVisible] = useState(true);

    // Tour adımları
    const tourSteps: TourStep[] = [
        {
            id: 'welcome',
            title: 'Sınav Arayüzü Rehberli Turu',
            description: 'Sınav ekranının tüm özelliklerini keşfedelim',
            target: 'main-container',
            position: 'bottom',
            content: 'Bu tur sırasında sınav arayüzünün her bölümünü detaylı olarak inceleyeceğiz. Her adımı dikkatlice takip edin.',
            spotlight: true
        },
        {
            id: 'header',
            title: 'Üst Bilgi Çubuğu',
            description: 'Sınav bilgileri ve durum göstergeleri',
            target: 'exam-header',
            position: 'bottom',
            content: 'Üst çubukta sınavın adı, kalan süre ve genel ilerleme bilgileriniz yer alır. Bu bilgiler sürekli güncel tutulur.',
            spotlight: true
        },
        {
            id: 'timer',
            title: 'Zaman Göstergesi',
            description: 'Kalan sürenizi takip edin',
            target: 'timer-display',
            position: 'bottom',
            content: 'Sınav süreniz burada görünür. Son 10 dakikada renk değişerek uyarı verir. İsterseniz gizleyebilirsiniz.',
            action: 'Timer\'a tıklayarak gizleme/gösterme özelliğini deneyin'
        },
        {
            id: 'progress',
            title: 'İlerleme Çubuğu',
            description: 'Sınavınızdaki genel ilerlemeniz',
            target: 'progress-bar',
            position: 'bottom',
            content: 'Cevaplanmış soru sayısına göre ilerlemeniz otomatik hesaplanır. Hedef %100 tamamlamadır.',
            spotlight: true
        },
        {
            id: 'question-area',
            title: 'Soru Bölgesi',
            description: 'Ana soru içeriği burada görünür',
            target: 'question-content',
            position: 'right',
            content: 'Soru metni, seçenekler ve tüm soru içeriği bu alanda yer alır. Scroll yaparak uzun soruları okuyabilirsiniz.',
            spotlight: true
        },
        {
            id: 'answer-section',
            title: 'Cevap Bölümü',
            description: 'Cevaplarınızı buraya işaretleyin',
            target: 'answer-options',
            position: 'left',
            content: 'Soru tipine göre farklı cevap alanları görünür. Seçiminizi yaparak devam edebilirsiniz.',
            action: 'Bir seçenek işaretleyerek deneyin'
        },
        {
            id: 'question-tools',
            title: 'Soru Araçları',
            description: 'İşaretleme ve yardımcı araçlar',
            target: 'question-actions',
            position: 'top',
            content: 'Soruyu işaretleme, not alma, hesap makinesi gibi yardımcı araçlara buradan erişebilirsiniz.',
            action: 'İşaretle butonuna tıklayın'
        },
        {
            id: 'navigation',
            title: 'Soru Navigasyonu',
            description: 'Sorular arası geçiş butonları',
            target: 'navigation-buttons',
            position: 'top',
            content: 'Önceki/Sonraki butonları ile sorular arasında serbestçe geçiş yapabilirsiniz. Klavye ok tuşları da kullanılabilir.',
            action: 'Sonraki butonu ile bir sonraki soruya geçin'
        },
        {
            id: 'question-palette',
            title: 'Soru Paleti',
            description: 'Tüm soruların görsel haritası',
            target: 'question-palette',
            position: 'left',
            content: 'Hangi soruların cevaplanıp cevaplanmadığını görebilir, istediğiniz soruya direkt geçiş yapabilirsiniz.',
            action: 'Farklı bir soru numarasına tıklayın'
        },
        {
            id: 'sidebar-tools',
            title: 'Yan Panel Araçları',
            description: 'Hesap makinesi, not defteri ve diğer araçlar',
            target: 'sidebar-tools',
            position: 'left',
            content: 'Sınav sırasında ihtiyaç duyabileceğiniz tüm araçlar yan panelde bulunur. Kolayca açıp kapatabilirsiniz.',
            spotlight: true
        },
        {
            id: 'help-section',
            title: 'Yardım ve Destek',
            description: 'Teknik sorun durumunda yardım alın',
            target: 'help-button',
            position: 'left',
            content: 'Sınav sırasında teknik sorun yaşarsanız yardım butonundan destek alabilirsiniz.',
            spotlight: true
        },
        {
            id: 'completion',
            title: 'Tur Tamamlandı!',
            description: 'Sınav arayüzünü başarıyla öğrendiniz',
            target: 'main-container',
            position: 'bottom',
            content: 'Tebrikler! Sınav arayüzünün tüm özelliklerini öğrendiniz. Artık rahatça sınava girebilirsiniz.',
            spotlight: true
        }
    ];

    const currentTourStep = tourSteps[currentStep];

    // Demo cevap verme
    const handleDemoAnswer = (questionId: string, answer: DemoAnswer) => {
        setDemoAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    // Soru işaretleme
    const toggleFlag = (questionId: string) => {
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

    // Sonraki adım
    const nextStep = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTour();
        }
    };

    // Önceki adım
    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    // Turu atla
    const skipTour = () => {
        setIsActive(false);
        onCompleted();
    };

    // Turu tamamla
    const completeTour = () => {
        setTourCompleted(true);
        setIsActive(false);
        onCompleted();
    };

    // Belirli soruya git
    const goToQuestion = (index: number) => {
        setCurrentQuestion(index);
    };

    // Highlighted element'i güncelle
    useEffect(() => {
        setHighlightedElement(currentTourStep?.target || '');
    }, [currentStep, currentTourStep]);

    // Demo soruları
    const demoQuestions = [
        { id: 'tour-q1', text: 'Demo Soru 1', answered: !!demoAnswers['tour-q1'] },
        { id: 'tour-q2', text: 'Demo Soru 2', answered: !!demoAnswers['tour-q2'] },
        { id: 'tour-q3', text: 'Demo Soru 3', answered: !!demoAnswers['tour-q3'] },
        { id: 'tour-q4', text: 'Demo Soru 4', answered: !!demoAnswers['tour-q4'] },
        { id: 'tour-q5', text: 'Demo Soru 5', answered: !!demoAnswers['tour-q5'] }
    ];

    const currentQuestionData = demoQuestions[currentQuestion];

    if (!isActive && !tourCompleted) {
        return null;
    }

    return (
        <div className="relative">
            {/* Demo Exam Interface */}
            <div id="main-container" className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div
                    id="exam-header"
                    className={`bg-white shadow-sm border-b p-4 ${
                        highlightedElement === 'exam-header' ? 'ring-2 ring-blue-500 ring-opacity-50 relative z-30' : ''
                    }`}
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Demo Sınav - Rehberli Tur</h1>
                            <p className="text-sm text-gray-600">5 soru • 30 dakika</p>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Timer */}
                            <div
                                id="timer-display"
                                className={`text-center cursor-pointer ${
                                    highlightedElement === 'timer-display' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-2 relative z-30' : ''
                                } ${timerVisible ? '' : 'opacity-50'}`}
                                onClick={() => setTimerVisible(!timerVisible)}
                            >
                                <div className="text-2xl font-mono font-bold text-blue-600">
                                    {timerVisible ? '28:45' : '--:--'}
                                </div>
                                <div className="text-xs text-gray-500">Kalan Süre</div>
                            </div>

                            {/* Progress */}
                            <div
                                id="progress-bar"
                                className={`min-w-[200px] ${
                                    highlightedElement === 'progress-bar' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-2 relative z-30' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                    <span>İlerleme</span>
                                    <span>{Object.keys(demoAnswers).length}/5</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(Object.keys(demoAnswers).length / 5) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto p-4">
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Question */}
                            <div className="bg-white rounded-lg shadow-sm border">
                                {/* Question Header */}
                                <div className="border-b p-4">
                                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Soru {currentQuestion + 1} / {demoQuestions.length}
                    </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      5 puan
                    </span>
                                    </div>
                                </div>

                                {/* Question Content */}
                                <div
                                    id="question-content"
                                    className={`p-6 ${
                                        highlightedElement === 'question-content' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg relative z-30' : ''
                                    }`}
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Demo Soru {currentQuestion + 1}: Rehberli Tur Örneği
                                    </h3>
                                    <p className="text-gray-700 mb-6">
                                        Bu sadece rehberli tur için hazırlanmış bir demo sorudur.
                                        Gerçek sınavda bu tür sorularla karşılaşabilirsiniz.
                                        Aşağıdaki seçeneklerden en uygun olanını seçiniz.
                                    </p>

                                    {/* Answer Options */}
                                    <div
                                        id="answer-options"
                                        className={`space-y-3 ${
                                            highlightedElement === 'answer-options' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-3 relative z-30' : ''
                                        }`}
                                    >
                                        {['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'].map((option, index) => (
                                            <label
                                                key={index}
                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                                    demoAnswers[currentQuestionData.id] === index
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={currentQuestionData.id}
                                                    value={index}
                                                    checked={demoAnswers[currentQuestionData.id] === index}
                                                    onChange={() => handleDemoAnswer(currentQuestionData.id, index)}
                                                    className="sr-only"
                                                />
                                                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                    demoAnswers[currentQuestionData.id] === index
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {demoAnswers[currentQuestionData.id] === index && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                                <span className="text-gray-900">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Question Actions */}
                                <div
                                    id="question-actions"
                                    className={`border-t p-4 ${
                                        highlightedElement === 'question-actions' ? 'ring-2 ring-blue-500 ring-opacity-50 relative z-30' : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => toggleFlag(currentQuestionData.id)}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                                                    flaggedQuestions.has(currentQuestionData.id)
                                                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                                                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                <Flag className="w-4 h-4" />
                                                {flaggedQuestions.has(currentQuestionData.id) ? 'İşaretli' : 'İşaretle'}
                                            </button>

                                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:border-gray-400">
                                                <Save className="w-4 h-4" />
                                                Kaydet
                                            </button>
                                        </div>

                                        <div
                                            id="navigation-buttons"
                                            className={`flex items-center gap-3 ${
                                                highlightedElement === 'navigation-buttons' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-2 relative z-30' : ''
                                            }`}
                                        >
                                            <button
                                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                                disabled={currentQuestion === 0}
                                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Önceki
                                            </button>

                                            <button
                                                onClick={() => setCurrentQuestion(Math.min(demoQuestions.length - 1, currentQuestion + 1))}
                                                disabled={currentQuestion === demoQuestions.length - 1}
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
                                id="question-palette"
                                className={`bg-white rounded-lg shadow-sm border p-4 ${
                                    highlightedElement === 'question-palette' ? 'ring-2 ring-blue-500 ring-opacity-50 relative z-30' : ''
                                }`}
                            >
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                    <Grid3X3 className="w-4 h-4" />
                                    Soru Paleti
                                </h4>
                                <div className="grid grid-cols-10 gap-2">
                                    {demoQuestions.map((question, index) => (
                                        <button
                                            key={question.id}
                                            onClick={() => goToQuestion(index)}
                                            className={`w-10 h-10 rounded-lg border font-medium text-sm relative transition-colors ${
                                                currentQuestion === index
                                                    ? 'border-blue-500 bg-blue-500 text-white'
                                                    : question.answered
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
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div
                                id="sidebar-tools"
                                className={`bg-white rounded-lg shadow-sm border p-4 sticky top-4 ${
                                    highlightedElement === 'sidebar-tools' ? 'ring-2 ring-blue-500 ring-opacity-50 relative z-30' : ''
                                }`}
                            >
                                <h4 className="font-medium text-gray-900 mb-4">Sınav Araçları</h4>

                                <div className="space-y-3">
                                    <button className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                                        <Calculator className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm">Hesap Makinesi</span>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                                        <PenTool className="w-4 h-4 text-green-600" />
                                        <span className="text-sm">Not Defteri</span>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                                        <ZoomIn className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm">Yakınlaştırma</span>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 text-left border rounded-lg hover:bg-gray-50">
                                        <Volume2 className="w-4 h-4 text-orange-600" />
                                        <span className="text-sm">Ses Kontrolü</span>
                                    </button>
                                </div>

                                <div
                                    id="help-button"
                                    className={`mt-6 pt-4 border-t ${
                                        highlightedElement === 'help-button' ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg p-2 relative z-30' : ''
                                    }`}
                                >
                                    <button className="w-full flex items-center gap-3 p-3 text-left bg-red-50 border border-red-200 rounded-lg hover:bg-red-100">
                                        <Settings className="w-4 h-4 text-red-600" />
                                        <span className="text-sm text-red-700">Teknik Destek</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tour Overlay */}
            {isActive && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    {/* Tour Tooltip */}
                    <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 relative z-50">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                    {currentStep + 1}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{currentTourStep?.title}</h3>
                                    <p className="text-sm text-gray-600">{currentTourStep?.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={skipTour}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-gray-700 mb-4">{currentTourStep?.content}</p>

                            {currentTourStep?.action && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                    <div className="flex items-center gap-2 text-blue-800">
                                        <Target className="w-4 h-4" />
                                        <span className="font-medium text-sm">Yapılacak:</span>
                                    </div>
                                    <p className="text-blue-700 text-sm mt-1">{currentTourStep.action}</p>
                                </div>
                            )}

                            {/* Progress */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>{currentStep + 1} / {tourSteps.length}</span>
                                <div className="flex gap-1">
                                    {tourSteps.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`w-2 h-2 rounded-full ${
                                                index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Önceki
                            </button>

                            <button
                                onClick={skipTour}
                                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Turu Atla
                            </button>

                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {currentStep === tourSteps.length - 1 ? (
                                    <>
                                        Tamamla
                                        <CheckCircle className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        Sonraki
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Completion Message */}
            {tourCompleted && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Rehberli Tur Tamamlandı!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Sınav arayüzünün tüm özelliklerini başarıyla öğrendiniz.
                            Artık gerçek sınava hazırsınız!
                        </p>
                        <button
                            onClick={onCompleted}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Devam Et
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}