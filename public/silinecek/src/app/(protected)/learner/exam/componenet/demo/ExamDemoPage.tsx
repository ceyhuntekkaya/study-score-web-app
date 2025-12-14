"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Navigation,
  Wrench,
  Map,
  ArrowRight,
  Clock,
  Users,
  BookOpen,
} from "lucide-react";

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  completed: boolean;
  required: boolean;
  estimatedTime: number; // dakika
}

interface ExamDemoPageProps {
  examId: string;
}

export function ExamDemoPage({ examId }: ExamDemoPageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  // Demo adımları
  const demoSteps: DemoStep[] = useMemo(
    () => [
      {
        id: "demo-questions",
        title: "Demo Sorular",
        description: "Sınav formatına alışmak için örnek sorular çözün",
        icon: <BookOpen className="w-5 h-5" />,
        component: <div>Demo Questions Component</div>, // DemoQuestions component gelecek
        completed: completedSteps.has("demo-questions"),
        required: true,
        estimatedTime: 5,
      },
      {
        id: "navigation-tutorial",
        title: "Navigasyon Eğitimi",
        description: "Sınav içinde nasıl gezineceğinizi öğrenin",
        icon: <Navigation className="w-5 h-5" />,
        component: <div>Navigation Tutorial Component</div>, // NavigationTutorial component gelecek
        completed: completedSteps.has("navigation-tutorial"),
        required: true,
        estimatedTime: 3,
      },
      {
        id: "tools-introduction",
        title: "Araçlar Tanıtımı",
        description: "Sınav sırasında kullanabileceğiniz araçları keşfedin",
        icon: <Wrench className="w-5 h-5" />,
        component: <div>Tools Introduction Component</div>, // ToolsIntroduction component gelecek
        completed: completedSteps.has("tools-introduction"),
        required: true,
        estimatedTime: 4,
      },
      {
        id: "guided-tour",
        title: "Rehberli Tur",
        description: "Sınav arayüzünün tüm özelliklerini keşfedin",
        icon: <Map className="w-5 h-5" />,
        component: <div>Guided Tour Component</div>, // GuidedTour component gelecek
        completed: completedSteps.has("guided-tour"),
        required: false,
        estimatedTime: 3,
      },
    ],
    [completedSteps]
  );

  // Adım tamamlandığında çağrılır
  const handleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
  };

  // Tüm zorunlu adımların tamamlanıp tamamlanmadığını kontrol et
  useEffect(() => {
    const requiredSteps = demoSteps.filter((step) => step.required);
    const completedRequiredSteps = requiredSteps.filter((step) =>
      completedSteps.has(step.id)
    );
    setIsCompleted(completedRequiredSteps.length === requiredSteps.length);
  }, [completedSteps, demoSteps]);

  // Toplam tahmini süre
  const totalEstimatedTime = demoSteps.reduce(
    (total, step) => total + step.estimatedTime,
    0
  );
  const completedTime = demoSteps
    .filter((step) => completedSteps.has(step.id))
    .reduce((total, step) => total + step.estimatedTime, 0);

  // İlerleme yüzdesi
  const progressPercentage = Math.round(
    (completedSteps.size / demoSteps.length) * 100
  );

  // Sonraki adıma geç
  const handleNext = () => {
    if (isCompleted) {
      // Final kontroller aşamasına geç
      router.push(`/exam/${examId}/final-checks`);
    } else {
      // Bir sonraki tamamlanmamış adıma geç
      const nextIncompleteIndex = demoSteps.findIndex(
        (step) => !completedSteps.has(step.id)
      );
      if (nextIncompleteIndex !== -1) {
        setCurrentStep(nextIncompleteIndex);
      }
    }
  };

  // Adımı atla (sadece zorunlu olmayanlar için)
  const handleSkipStep = (stepId: string) => {
    const step = demoSteps.find((s) => s.id === stepId);
    if (step && !step.required) {
      handleStepCompleted(stepId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sınav Demo & Hazırlık
              </h1>
              <p className="text-gray-600 mt-1">
                Sınava başlamadan önce sistemi tanımak için demo modüllerini
                tamamlayın
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Tahmini Süre</div>
              <div className="text-lg font-semibold text-blue-600">
                ~{totalEstimatedTime} dakika
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>İlerleme</span>
              <span>
                {completedSteps.size}/{demoSteps.length} tamamlandı
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Demo Adımları */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Demo Modülleri
              </h3>

              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentStep === index
                        ? "border-blue-500 bg-blue-50"
                        : step.completed
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 ${
                          step.completed
                            ? "text-green-600"
                            : currentStep === index
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-medium ${
                              step.completed
                                ? "text-green-900"
                                : "text-gray-900"
                            }`}
                          >
                            {step.title}
                          </h4>
                          {step.required && (
                            <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded">
                              Zorunlu
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {step.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />~{step.estimatedTime} dk
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* İlerleme Özeti */}
              <div className="mt-6 pt-4 border-t">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Tamamlanan:</span>
                    <span className="font-medium">
                      {completedSteps.size}/{demoSteps.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tahmini Kalan:</span>
                    <span className="font-medium">
                      ~{totalEstimatedTime - completedTime} dk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Step Header */}
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        demoSteps[currentStep]?.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {demoSteps[currentStep]?.completed ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        demoSteps[currentStep]?.icon
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {demoSteps[currentStep]?.title}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {demoSteps[currentStep]?.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {demoSteps[currentStep] &&
                      !demoSteps[currentStep].required && (
                        <button
                          onClick={() =>
                            handleSkipStep(demoSteps[currentStep].id)
                          }
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                          disabled={demoSteps[currentStep]?.completed}
                        >
                          Atla
                        </button>
                      )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />~
                      {demoSteps[currentStep]?.estimatedTime} dakika
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="p-6">
                {demoSteps[currentStep] ? (
                  <div>
                    {demoSteps[currentStep].component}

                    {/* Step Actions */}
                    <div className="mt-8 pt-6 border-t flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {demoSteps[currentStep].completed && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">
                              Tamamlandı
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {currentStep > 0 && (
                          <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Önceki
                          </button>
                        )}

                        {currentStep < demoSteps.length - 1 ? (
                          <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
                          >
                            Sonraki
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : isCompleted ? (
                          <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                          >
                            Final Kontrollerine Geç
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            disabled
                            className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
                          >
                            Zorunlu adımları tamamlayın
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Demo Tamamlandı!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tüm demo modüllerini başarıyla tamamladınız. Artık final
                      kontrollerine geçebilirsiniz.
                    </p>
                    <button
                      onClick={handleNext}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 mx-auto"
                    >
                      Final Kontrollerine Geç
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
