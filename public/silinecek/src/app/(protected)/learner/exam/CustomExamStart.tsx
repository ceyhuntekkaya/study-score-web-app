'use client';

// ==========================================
// Hook kullanım örneği: Custom component
// ==========================================



import { useExamFlow } from '@/hooks/exam/use-exam-flow';
import {ProgressSteps} from "@/app/(protected)/learner/exam/componenet/pre-start/ProgressSteps";

interface CustomExamStartProps {
    examId: string;
}

export function CustomExamStart({ examId }: CustomExamStartProps) {
    const {
        flowState,
        steps,
        currentStepData,
        progressPercentage,
        goToNextStep,
        goToPreviousStep,
        completeStep,
        isStepAccessible
    } = useExamFlow(examId, 'start');

    const handleStartExam = () => {
        // Mevcut adımı tamamla
        completeStep('start');

        // Sınav adımına geç
        if (isStepAccessible('taking')) {
            goToNextStep();
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Progress göstergesi */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Sınav Başlatma</h1>
                    <div className="text-sm text-gray-600">
                        {Math.round(progressPercentage)}% tamamlandı
                    </div>
                </div>

                <ProgressSteps
                    steps={steps}
                    currentStepId={flowState.currentStep}
                    orientation="horizontal"
                    size="medium"
                />
            </div>

            {/* Ana içerik */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    {currentStepData?.name}
                </h2>

                <div className="space-y-4">
                    <p className="text-gray-600">
                        Sınavınız başlamak üzere. Tüm kontroller tamamlandı.
                    </p>

                    {/* Progress bilgisi */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">İlerleme Durumu</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-blue-600 font-semibold">
                                    {flowState.completedSteps.length}
                                </div>
                                <div className="text-blue-800">Tamamlanan</div>
                            </div>
                            <div>
                                <div className="text-blue-600 font-semibold">
                                    {steps.length - flowState.completedSteps.length}
                                </div>
                                <div className="text-blue-800">Kalan</div>
                            </div>
                            <div>
                                <div className="text-blue-600 font-semibold">
                                    {steps.length}
                                </div>
                                <div className="text-blue-800">Toplam</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={goToPreviousStep}
                        disabled={!flowState.canGoBack}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Geri
                    </button>

                    <button
                        onClick={handleStartExam}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Sınavı Başlat
                    </button>
                </div>
            </div>
        </div>
    );
}