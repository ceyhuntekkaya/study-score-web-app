"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExams } from "@/hooks/exam/use-exam";
import { useExamReady } from "@/hooks/exam/use-exam-ready";
import { ExamInfoCard } from "./ExamInfoCard";
import { ExamPreparationChecklist } from "./ExamPreparationChecklist";
import { AlertNotification } from "@/app/(protected)/learner/exam/componenet/AlertNotification";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ExamLandingPageProps {
  examId?: string;
}

export function ExamLandingPage({ examId: propExamId }: ExamLandingPageProps) {
  const params = useParams();
  const router = useRouter();
  const examId = propExamId || (params?.examId as string);

  const {
    selectedExam,
    getExamById,
    loading: examLoading,
    error: examError,
  } = useExams();
  const {
    examReady,
    buildExamReady,
    loading: examReadyLoading,
    error: examReadyError,
  } = useExamReady();

  const [isReady, setIsReady] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  // Check if everything is ready
  useEffect(() => {
    if (selectedExam && examReady && !examLoading && !examReadyLoading) {
      setIsReady(true);
    }
  }, [selectedExam, examReady, examLoading, examReadyLoading]);

  const handleStartExam = () => {
    if (!agreedToTerms) {
      alert("Sınava başlamak için şartları kabul etmelisiniz.");
      return;
    }

    // Navigate to authentication page
    router.push(`/exam/${examId}/auth`);
  };

  const handleMoreInfo = () => {
    // Open more info modal or navigate to detailed page
    router.push(`/exam/${examId}/info`);
  };

  const handleDemoQuestions = () => {
    // Navigate to demo questions
    router.push(`/exam/${examId}/demo`);
  };

  if (examLoading || examReadyLoading) {
    return <LoadingSpinner />;
  }

  if (examError || examReadyError) {
    return (
      <AlertNotification
        type="error"
        message="Sınav bilgileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
      />
    );
  }

  if (!selectedExam || !examReady) {
    return <AlertNotification type="warning" message="Sınav bulunamadı." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedExam.imageUrl && (
                <img
                  src={selectedExam.imageUrl}
                  alt="Exam Logo"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedExam.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString("tr-TR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Sınav Kodu</div>
              <div className="text-lg font-mono font-semibold text-blue-600">
                {selectedExam.code || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sınava Hoş Geldiniz
              </h2>
              {selectedExam.description && (
                <p className="text-gray-700 mb-4">{selectedExam.description}</p>
              )}
              {selectedExam.introText && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">{selectedExam.introText}</p>
                </div>
              )}
            </div>

            {/* Exam Info Card */}
            <ExamInfoCard exam={selectedExam} examReady={examReady} />

            {/* Preparation Checklist */}
            <ExamPreparationChecklist />

            {/* Terms and Conditions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sınav Şartları
              </h3>
              <div className="space-y-3 mb-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Sınav kurallarını okudum, anladım ve kabul ediyorum. Sınav
                    süresince kameramin açık kalacağını ve kayıt yapılacağını
                    onaylıyorum.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sınav Özeti
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Soru:</span>
                  <span className="font-semibold">
                    {examReady.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Toplam Puan:</span>
                  <span className="font-semibold">{examReady.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Süre:</span>
                  <span className="font-semibold">
                    {Math.floor(examReady.estimatedDuration / 60)} dakika
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seviye:</span>
                  <span className="font-semibold">
                    {selectedExam.level || "Belirtilmemiş"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleStartExam}
                disabled={!isReady || !agreedToTerms}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  isReady && agreedToTerms
                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Sınava Başla
              </button>

              <button
                onClick={handleMoreInfo}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Daha Fazla Bilgi
              </button>

              <button
                onClick={handleDemoQuestions}
                className="w-full py-2 px-4 border border-blue-300 rounded-lg font-medium text-blue-700 hover:bg-blue-50 transition-colors"
              >
                Demo Sorular
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Teknik Destek
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                Sorun yaşıyorsanız bizimle iletişime geçin:
              </p>
              <div className="text-sm text-yellow-700">
                <div>📞 +90 (212) 123 45 67</div>
                <div>📧 destek@example.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
