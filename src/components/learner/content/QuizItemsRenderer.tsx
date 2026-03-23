"use client";

import { useMemo } from "react";
import { useTranslation } from "@/i18n";
import { getFilePreviewUrl } from "@/lib/fileUtils";
import HeaderRenderer from "@/components/learner/exam/HeaderRenderer";
import QuestionRenderer from "@/components/learner/exam/questions/QuestionRenderer";
import type { CourseLessonPartQuizItemDetailDTO } from "@/generated/api/openAPIDefinition.schemas";
import { useAuth } from "@/contexts/AuthContext";
import {
  useQuestionResponsesForMaterial,
  useSaveQuestionResponse,
  CONTEXT_TYPE,
} from "@/services/api/questionResponseService";

/**
 * Normalize questionGroup.questions from material API.
 * Backend returns questions array (orderNumber sorted); support array or { content: array }.
 */
function normalizeGroupQuestions(
  data: unknown,
): Array<Record<string, unknown>> {
  if (Array.isArray(data)) return data as Array<Record<string, unknown>>;
  if (data && typeof data === "object" && "content" in data) {
    const content = (data as { content?: unknown[] }).content;
    return Array.isArray(content)
      ? (content as Array<Record<string, unknown>>)
      : [];
  }
  return [];
}

const FILE_MEDIA = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT", "PDF", "OTHER"];

const HEADER_MEDIA_TYPES = [
  "TEXT",
  "IMAGE",
  "VIDEO",
  "AUDIO",
  "DOCUMENT",
  "PDF",
  "LINK",
  "OTHER",
] as const;
type HeaderMediaType = (typeof HEADER_MEDIA_TYPES)[number];

export interface NormalizedHeader {
  mediaType: HeaderMediaType;
  content?: string;
  orderNumber?: number;
}

/** API'den gelen headers'ı tek formata getirir. headers, questionHeaders, header_list, question_headers ve snake_case alanları dener. */
function normalizeHeaders(record: Record<string, unknown>): NormalizedHeader[] {
  const raw =
    (record.headers as NormalizedHeader[] | undefined) ??
    (record.questionHeaders as NormalizedHeader[] | undefined) ??
    (record.header_list as NormalizedHeader[] | undefined) ??
    (record.question_headers as NormalizedHeader[] | undefined) ??
    [];
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw
    .map((h: unknown) => {
      const item =
        h && typeof h === "object" ? (h as Record<string, unknown>) : {};
      const mediaTypeRaw =
        (item.mediaType as string) ?? (item.media_type as string) ?? "TEXT";
      const mediaType = HEADER_MEDIA_TYPES.includes(
        mediaTypeRaw as HeaderMediaType,
      )
        ? (mediaTypeRaw as HeaderMediaType)
        : "TEXT";
      const content = (item.content as string) ?? (item.text as string) ?? "";
      const orderNumber =
        (item.orderNumber as number) ?? (item.order_number as number) ?? 0;
      return { mediaType, content, orderNumber };
    })
    .filter((x) => x.content != null && x.content !== "");
}

function contentToHeaderContent(
  mediaType: string | undefined,
  content: string | undefined,
): string | undefined {
  if (!content) return content;
  if (
    content.startsWith("http") ||
    content.startsWith("//") ||
    content.startsWith("data:")
  )
    return content;
  if (mediaType && FILE_MEDIA.includes(mediaType)) {
    return getFilePreviewUrl(content);
  }
  return content;
}

/** Headers-section'da gösterilecek header'lar: TEXT hariç (soru metni QuestionBody'de tek yerde gösterilir, çift yazı önlenir). */
function getNonTextHeaders(headers: NormalizedHeader[]): NormalizedHeader[] {
  return headers.filter((h) => h.mediaType !== "TEXT");
}

/** Soru metnini sadece TEXT tipi header'lardan üretir. Diğer tipler QuestionBody'de değil, headers-section'da gösterilir. */
function getQuestionTextFromHeaders(
  headers: NormalizedHeader[] | undefined,
): string {
  if (!headers?.length) return "";
  const sorted = [...headers].sort(
    (a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0),
  );
  const textParts = sorted
    .filter((h) => h.mediaType === "TEXT" && h.content)
    .map((h) => h.content!);
  return textParts.join("<br/>") || "";
}

/** Kayıt ve yüklemede aynı soru kimliğini kullanmak için: API bazen id bazen questionId dönebilir. */
function getEffectiveQuestionId(
  q: Record<string, unknown>,
  index: number,
): string {
  return (q.id as string) ?? (q.questionId as string) ?? `q-${index}`;
}

/** Backend answerData bazen farklı anahtar kullanır (örn. selectedChoiceId); bileşenler selectedOptionId bekler. */
function normalizeSavedAnswerForComponent(
  questionType: string,
  answerData: unknown,
): unknown {
  if (answerData == null || typeof answerData !== "object") return answerData;
  const raw = answerData as Record<string, unknown>;
  switch (questionType) {
    case "MULTIPLE_CHOICE":
      return {
        selectedOptionId:
          raw.selectedOptionId ?? raw.selectedChoiceId ?? raw.choiceId ?? null,
      };
    case "TRUE_FALSE":
      return { answer: raw.answer ?? raw.value ?? null };
    case "SHORT_ANSWER": {
      const text = raw.answer ?? raw.text;
      const str = typeof text === "string" ? text : "";
      return { answerText: str, characterCount: str.length };
    }
    case "MULTIPLE_RESPONSE":
      return {
        selectedOptionIds:
          raw.selectedOptionIds ?? raw.selectedIds ?? raw.choiceIds ?? [],
      };
    case "FILL_IN_THE_BLANKS":
      return { answers: raw.blanks ?? raw.answers ?? {} };
    default:
      return answerData;
  }
}

/** Builds QuestionRenderer-compatible object from raw question data.
 * API may send question text as: headers (TEXT), questionText, question_text, name, or inside templateData.
 * userAnswer: optional saved response (answerData from question-responses API); normalized for component shape.
 */
function toQuestionForRenderer(
  q: Record<string, unknown>,
  userAnswer?: unknown,
): {
  questionType: string;
  questionText: string;
  fullText?: string;
  templateData: unknown;
  userAnswer?: unknown;
  id?: string;
} {
  const normalizedHeaders = normalizeHeaders(q);
  const fromHeaders = getQuestionTextFromHeaders(normalizedHeaders);
  const templateDataRaw = q.templateData;
  const templateData =
    typeof templateDataRaw === "string"
      ? (() => {
          try {
            return JSON.parse(templateDataRaw);
          } catch {
            return {};
          }
        })()
      : (templateDataRaw ?? {});
  const fromTemplate =
    templateData &&
    typeof templateData === "object" &&
    "questionText" in templateData
      ? String((templateData as Record<string, unknown>).questionText ?? "")
      : "";
  const questionText =
    fromHeaders ||
    (q.questionText as string) ||
    (q.question_text as string) ||
    (q.name as string) ||
    fromTemplate ||
    "";
  const questionType = (q.questionType as string) || "MULTIPLE_CHOICE";
  const rawAnswer = userAnswer ?? (q.userAnswer as unknown);
  const normalizedAnswer =
    rawAnswer != null
      ? normalizeSavedAnswerForComponent(questionType, rawAnswer)
      : undefined;
  return {
    questionType,
    questionText,
    fullText: (q.fullText as string) || undefined,
    templateData,
    userAnswer: normalizedAnswer,
    id: (q.id as string) ?? (q.questionId as string),
  };
}

/** Single question item - renders one question */
function SingleQuestionItem({
  question,
  index,
  total,
  showTotal = true,
  savedUserAnswer,
  onAnswerChange,
  onSaveAnswer,
  showAIChat = false,
}: {
  question: Record<string, unknown>;
  index: number;
  total: number;
  showTotal?: boolean;
  savedUserAnswer?: unknown;
  onAnswerChange?: (questionId: string, answerData: unknown) => void;
  onSaveAnswer?: (
    questionId: string,
    answerData: unknown,
  ) => void | Promise<void>;
  showAIChat?: boolean;
}) {
  const { t } = useTranslation();
  const forRenderer = useMemo(
    () => toQuestionForRenderer(question, savedUserAnswer),
    [question, savedUserAnswer],
  );
  const qId = getEffectiveQuestionId(question, index);
  const headers = useMemo(() => normalizeHeaders(question), [question]);
  const sortedHeaders = useMemo(
    () =>
      [...headers].sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0)),
    [headers],
  );
  /** Soru metni (TEXT) QuestionBody'de gösterildiği için headers-section'da sadece medya (resim, video, ses vb.) gösterilir; çift yazı önlenir. */
  const headersForSection = useMemo(
    () => getNonTextHeaders(sortedHeaders),
    [sortedHeaders],
  );

  return (
    <div className="question-item ss-question-card">
      <div className="ss-question-header">
        <span className="ss-question-number">
          {t("admin.exam.question")} {index + 1}
          {showTotal && total > 1 ? ` / ${total}` : ""}
        </span>
        {(question.maximumScore as number) != null && (
          <span className="ss-question-badge">
            {String(question.maximumScore)} {t("admin.exam.points") ?? "puan"}
          </span>
        )}
      </div>
      {headersForSection.length > 0 && (
        <div className="headers-section mb-3 mt-2" data-headers>
          {headersForSection.map((h, i) => (
            <HeaderRenderer
              key={`header-${i}-${h.mediaType}`}
              header={{
                mediaType: h.mediaType,
                content: contentToHeaderContent(h.mediaType, h.content),
              }}
            />
          ))}
        </div>
      )}
      <QuestionRenderer
        question={forRenderer}
        questionId={qId}
        onAnswerChange={(answerData) => onAnswerChange?.(qId, answerData)}
        onSaveAnswer={
          forRenderer.questionType === "ESSAY"
            ? (answerData) => onSaveAnswer?.(qId, answerData)
            : undefined
        }
        showAIChat={showAIChat}
      />
    </div>
  );
}

/**
 * Question group item – renders group headers + questions.
 * Material/course-part-material GET now returns questionGroup.questions (no extra request).
 */
function QuestionGroupItem({
  groupData,
  questions,
  responseByQuestionId,
  onAnswerChange,
  onSaveAnswer,
  showAIChat = false,
}: {
  groupData: Record<string, unknown>;
  questions: Array<Record<string, unknown>>;
  responseByQuestionId: Map<string, unknown>;
  onAnswerChange?: (questionId: string, answerData: unknown) => void;
  onSaveAnswer?: (
    questionId: string,
    answerData: unknown,
  ) => void | Promise<void>;
  showAIChat?: boolean;
}) {
  const { t } = useTranslation();
  const groupName =
    (groupData.name as string) || (groupData.code as string) || "—";
  const groupCode = (groupData.code as string) || "";
  const headers = useMemo(() => normalizeHeaders(groupData), [groupData]);
  const sortedHeaders = useMemo(
    () =>
      [...headers].sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0)),
    [headers],
  );

  return (
    <div className="question-group-item ss-question-group-card">
      <div className="ss-group-header">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <h6 className="mb-0 ss-group-title">{groupName}</h6>
          {groupCode && <span className="ss-question-badge">{groupCode}</span>}
        </div>
      </div>

      {sortedHeaders.length > 0 && (
        <div className="headers-section mb-3" data-headers>
          <h6 className="ss-section-label">
            <i className="feather-layers me-2"></i>
            {t("admin.exam.materials") ?? "Materyaller"}
          </h6>
          {sortedHeaders.map((h, i) => (
            <HeaderRenderer
              key={`group-header-${i}-${h.mediaType}`}
              header={{
                mediaType: h.mediaType,
                content: contentToHeaderContent(h.mediaType, h.content),
              }}
            />
          ))}
        </div>
      )}

      <div className="questions-preview">
        <h6 className="ss-section-label">
          <i className="feather-list me-2"></i>
          {t("admin.exam.questions")} ({questions.length})
        </h6>
        {questions.length === 0 ? (
          <p className="text-muted mb-0 py-3">{t("admin.exam.noQuestions")}</p>
        ) : (
          questions.map((q, questionIndex) => (
            <SingleQuestionItem
              key={getEffectiveQuestionId(q, questionIndex)}
              question={q}
              index={questionIndex}
              total={questions.length}
              savedUserAnswer={responseByQuestionId.get(
                getEffectiveQuestionId(q, questionIndex),
              )}
              onAnswerChange={onAnswerChange}
              onSaveAnswer={onSaveAnswer}
              showAIChat={showAIChat}
            />
          ))
        )}
      </div>
    </div>
  );
}

export interface QuizItemsRendererProps {
  quizItems: CourseLessonPartQuizItemDetailDTO[];
  /** Ders materyali ID – cevap kaydı için (COURSE_LESSON_PART_MATERIAL context). */
  courseLessonPartMaterialId?: string;
  /** true ise her sorunun altında AIChat gösterilir (öğrenme amaçlı). Varsayılan: false. */
  showAIChat?: boolean;
}

/** response.answerData veya userAnswer objesini soru bileşenine veririz */
function getUserAnswerFromResponse(res: { answerData?: unknown }) {
  return res?.answerData ?? null;
}

/**
 * Renders quiz items for a material. Each item is either a single question or a question group.
 * Uses shared QuestionRenderer. When courseLessonPartMaterialId and user are present,
 * loads/saves answers via POST/GET /api/question-responses (COURSE_LESSON_PART_MATERIAL).
 */
export default function QuizItemsRenderer({
  quizItems,
  courseLessonPartMaterialId,
  showAIChat = false,
}: QuizItemsRendererProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const { data: responsesData } = useQuestionResponsesForMaterial(
    courseLessonPartMaterialId,
    userId,
    { enabled: !!courseLessonPartMaterialId && !!userId },
  );
  const responsesList = useMemo(() => {
    if (Array.isArray(responsesData)) return responsesData;
    if (
      responsesData &&
      typeof responsesData === "object" &&
      "content" in responsesData
    ) {
      const c = (responsesData as { content?: unknown }).content;
      return Array.isArray(c) ? c : [];
    }
    return [];
  }, [responsesData]);

  const saveResponse = useSaveQuestionResponse({
    invalidateMaterialId: courseLessonPartMaterialId,
    invalidateUserId: userId,
  });

  const responseByQuestionId = useMemo(() => {
    const map = new Map<string, unknown>();
    for (const r of responsesList) {
      const item = r as { questionId?: string; answerData?: unknown };
      if (item.questionId)
        map.set(item.questionId, getUserAnswerFromResponse(item));
    }
    return map;
  }, [responsesList]);

  const handleAnswerChange = (questionId: string, answerData: unknown) => {
    if (!userId || !courseLessonPartMaterialId) return;
    saveResponse.mutate({
      userId,
      questionId,
      contextType: CONTEXT_TYPE.COURSE_LESSON_PART_MATERIAL,
      courseLessonPartMaterialId,
      answerData: (answerData as Record<string, unknown>) ?? null,
    });
  };

  const handleSaveAnswer = (questionId: string, answerData: unknown): void => {
    if (!userId || !courseLessonPartMaterialId) return;
    void saveResponse.mutateAsync({
      userId,
      questionId,
      contextType: CONTEXT_TYPE.COURSE_LESSON_PART_MATERIAL,
      courseLessonPartMaterialId,
      answerData: (answerData as Record<string, unknown>) ?? null,
    });
  };

  const sortedItems = useMemo(
    () =>
      [...(quizItems || [])].sort(
        (a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0),
      ),
    [quizItems],
  );

  if (!sortedItems.length) {
    return (
      <div className="quiz-items-empty text-muted py-4">
        {t("admin.exam.noQuestions")}
      </div>
    );
  }

  return (
    <div className="material-item material-quiz">
      <div className="quiz-items-container">
        {sortedItems.map((item, idx) => {
          const key = item.id ?? `quiz-item-${idx}`;
          if (item.questionGroup) {
            const g = item.questionGroup as unknown as Record<string, unknown>;
            const questions = normalizeGroupQuestions(g.questions);
            return (
              <QuestionGroupItem
                key={key}
                groupData={g}
                questions={questions}
                responseByQuestionId={responseByQuestionId}
                onAnswerChange={handleAnswerChange}
                onSaveAnswer={handleSaveAnswer}
                showAIChat={showAIChat}
              />
            );
          }
          if (item.question) {
            const q = item.question as unknown as Record<string, unknown>;
            return (
              <SingleQuestionItem
                key={key}
                question={q}
                index={idx}
                total={1}
                showTotal={false}
                savedUserAnswer={responseByQuestionId.get(
                  getEffectiveQuestionId(q, idx),
                )}
                onAnswerChange={handleAnswerChange}
                onSaveAnswer={handleSaveAnswer}
                showAIChat={showAIChat}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
