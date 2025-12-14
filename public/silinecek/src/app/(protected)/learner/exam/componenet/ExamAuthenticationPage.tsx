"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExams } from "@/hooks/exam/use-exam";
import { ExamAccessCodeForm } from "./ExamAccessCodeForm";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { AlertNotification } from "@/app/(protected)/learner/exam/componenet/AlertNotification";
import { ExamLoginForm } from "@/app/(protected)/learner/exam/componenet/ExamLogin";

type AuthStep = "login" | "access-code" | "completed";

interface AuthState {
  isAuthenticated: boolean;
  hasValidAccessCode: boolean;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface ExamAuthenticationPageProps {
  examId?: string;
}

export function ExamAuthenticationPage({
  examId: propExamId,
}: ExamAuthenticationPageProps) {
  const params = useParams();
  const router = useRouter();
  const examId = propExamId || (params?.examId as string);

  const {
    selectedExam,
    getExamById,
    loading: examLoading,
    error: examError,
  } = useExams();

  const [currentStep, setCurrentStep] = useState<AuthStep>("login");
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    hasValidAccessCode: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load exam data
  useEffect(() => {
    if (examId && !selectedExam) {
      getExamById(examId);
    }
  }, [examId, selectedExam, getExamById]);

  // Check if user is already authenticated (from session/localStorage)
  useEffect(() => {
    const checkExistingAuth = () => {
      // Check if user is already logged in
      const authData = localStorage.getItem("examAuth");
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.examId === examId && parsed.expiresAt > Date.now()) {
            setAuthState({
              isAuthenticated: true,
              hasValidAccessCode: parsed.hasValidAccessCode || false,
              userId: parsed.userId,
              userEmail: parsed.userEmail,
              userName: parsed.userName,
            });

            if (parsed.hasValidAccessCode) {
              setCurrentStep("completed");
            } else {
              setCurrentStep("access-code");
            }
          } else {
            // Clear expired auth
            localStorage.removeItem("examAuth");
          }
        } catch (error) {
          if (error instanceof Error) {
            localStorage.removeItem("examAuth");
          } else {
            localStorage.removeItem("examAuth");
          }
        }
      }
    };

    checkExistingAuth();
  }, [examId]);

  const handleLoginSuccess = (userData: {
    userId: string;
    email: string;
    name: string;
  }) => {
    setAuthState((prev) => ({
      ...prev,
      isAuthenticated: true,
      userId: userData.userId,
      userEmail: userData.email,
      userName: userData.name,
    }));

    // Save auth state to localStorage
    const authData = {
      examId,
      userId: userData.userId,
      userEmail: userData.email,
      userName: userData.name,
      hasValidAccessCode: false,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    };
    localStorage.setItem("examAuth", JSON.stringify(authData));

    setCurrentStep("access-code");
    setError(null);
  };

  const handleAccessCodeSuccess = (accessCode: string) => {
    setAuthState((prev) => ({
      ...prev,
      hasValidAccessCode: true,
    }));

    // Update auth state in localStorage
    const authData = JSON.parse(localStorage.getItem("examAuth") || "{}");
    authData.hasValidAccessCode = true;
    authData.accessCode = accessCode;
    localStorage.setItem("examAuth", JSON.stringify(authData));

    setCurrentStep("completed");
    setError(null);

    // Small delay then redirect to next step
    setTimeout(() => {
      router.push(`/exam/${examId}/info`);
    }, 1500);
  };

  const handleRetryLogin = () => {
    setCurrentStep("login");
    setAuthState({
      isAuthenticated: false,
      hasValidAccessCode: false,
    });
    localStorage.removeItem("examAuth");
    setError(null);
  };

  const handleGoBack = () => {
    if (currentStep === "access-code") {
      setCurrentStep("login");
    } else {
      router.push(`/exam/${examId}/start`);
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "login":
        return 50;
      case "access-code":
        return 75;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  if (examLoading) {
    return <LoadingSpinner />;
  }

  if (examError || !selectedExam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <AlertNotification
            type="error"
            title="Sınav Bulunamadı"
            message="Belirtilen sınav bulunamadı veya erişim izniniz yok."
          />
          <button
            onClick={() => router.push("/exams")}
            className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sınav Listesine Dön
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Kimlik Doğrulama
                </h1>
                <p className="text-sm text-gray-600">{selectedExam.name}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">İlerleme</span>
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getStepProgress()}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {getStepProgress()}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Steps Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${
                  currentStep === "login"
                    ? "text-blue-600"
                    : authState.isAuthenticated
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === "login"
                      ? "bg-blue-100"
                      : authState.isAuthenticated
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {authState.isAuthenticated ? "✓" : "1"}
                </div>
                <span className="ml-2 text-sm font-medium">Giriş</span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-4 ${
                  authState.isAuthenticated ? "bg-green-300" : "bg-gray-300"
                }`}
              ></div>

              <div
                className={`flex items-center ${
                  currentStep === "access-code"
                    ? "text-blue-600"
                    : authState.hasValidAccessCode
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === "access-code"
                      ? "bg-blue-100"
                      : authState.hasValidAccessCode
                      ? "bg-green-100"
                      : "bg-gray-100"
                  }`}
                >
                  {authState.hasValidAccessCode ? "✓" : "2"}
                </div>
                <span className="ml-2 text-sm font-medium">Erişim Kodu</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <AlertNotification
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Content based on current step */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {currentStep === "login" && (
              <ExamLoginForm
                examId={examId}
                onSuccess={handleLoginSuccess}
                onError={setError}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {currentStep === "access-code" && (
              <ExamAccessCodeForm
                examId={examId}
                userId={authState.userId!}
                onSuccess={handleAccessCodeSuccess}
                onError={setError}
                onRetryLogin={handleRetryLogin}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {currentStep === "completed" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Kimlik Doğrulama Tamamlandı
                </h3>
                <p className="text-gray-600 mb-4">
                  Başarıyla giriş yaptınız. Sınav bilgilendirme sayfasına
                  yönlendiriliyorsunuz...
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                  <span className="text-sm text-gray-600">
                    Yönlendiriliyor...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Yardıma mı İhtiyacınız Var?
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Giriş bilgilerinizi kontrol edin</p>
              <p>• Erişim kodunuzun doğru olduğundan emin olun</p>
              <p>• Sorun devam ederse teknik destek ile iletişime geçin</p>
            </div>
            <div className="mt-3 text-sm text-blue-700">
              <div>📞 +90 (212) 123 45 67</div>
              <div>📧 destek@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
