// ==========================================
// Alternatif: Layout ile kullanım örneği
// ==========================================

// components/exam/ExamLayout.tsx
"use client";

import { useExamFlow } from "@/hooks/exam/use-exam-flow";
import { ProgressSteps } from "@/app/(protected)/learner/exam/componenet/pre-start/ProgressSteps";

interface ExamLayoutProps {
  examId: string;
  children: React.ReactNode;
  showProgress?: boolean;
}

export function ExamLayout({
  examId,
  children,
  showProgress = true,
}: ExamLayoutProps) {
  const { steps, flowState, goToStep } = useExamFlow(examId);

  return (
    <div className=" bg-gray-50">
      {/* Progress Header */}
      {showProgress && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <ProgressSteps
              steps={steps}
              currentStepId={flowState.currentStep}
              onStepClick={goToStep}
              orientation="horizontal"
              size="small"
              showLabels={true}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
