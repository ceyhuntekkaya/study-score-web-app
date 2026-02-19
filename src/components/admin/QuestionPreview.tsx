"use client";

import { useMemo } from "react";
import { useTranslation } from "@/i18n";
import type { QuestionHeaderRequest } from "@/generated/api/openAPIDefinition.schemas";
import { getFilePreviewUrl } from "@/lib/fileUtils";
import QuestionRenderer from "@/components/learner/exam/questions/QuestionRenderer";

const FILE_MEDIA = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "PDF", "OTHER"];

function contentToHeaderContent(mediaType: string | undefined, content: string | undefined): string | undefined {
  if (!content) return content;
  if (content.startsWith("http") || content.startsWith("//") || content.startsWith("data:")) return content;
  if (mediaType && FILE_MEDIA.includes(mediaType)) {
    return getFilePreviewUrl(content);
  }
  return content;
}

interface QuestionPreviewProps {
  headers: QuestionHeaderRequest[];
  questionType: string;
  templateData: unknown;
}

/**
 * Öğrencinin göreceği şekilde soru önizlemesi: headers + tip bazlı soru gövdesi.
 */
export default function QuestionPreview({
  headers,
  questionType,
  templateData,
}: QuestionPreviewProps) {
  const sortedHeaders = useMemo(() => {
    return [...headers].sort(
      (a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0)
    );
  }, [headers]);

  const questionText = useMemo(() => {
    const textParts = sortedHeaders
      .filter((h) => h.mediaType === "TEXT" && h.content)
      .map((h) => h.content);
    return textParts.join("<br/>") || "";
  }, [sortedHeaders]);

  const question = useMemo(
    () => ({
      questionType,
      questionText,
      templateData:
        typeof templateData === "object" && templateData !== null
          ? templateData
          : {},
      userAnswer: undefined,
    }),
    [questionType, questionText, templateData]
  );

  const { t } = useTranslation();

  return (
    <div className="question-preview h-100 d-flex flex-column">
      <div className="mb-3 pb-2 border-bottom">
        <h6 className="text-muted mb-0">
          <i className="feather-eye me-1"></i>
          {t("admin.exam.preview")}
        </h6>
      </div>
      <div className="flex-grow-1 overflow-auto">
        <div className="template-preview">
          {questionType ? (
            <QuestionRenderer
              question={question}
              questionId="preview"
            />
          ) : (
            <p className="text-muted small">{t("admin.exam.selectQuestionTypeAndTemplate")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
