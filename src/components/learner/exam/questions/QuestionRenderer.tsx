'use client';

import { useState, type ReactNode } from 'react';
import type { Question as ApiQuestion } from '@/generated/api/openAPIDefinition.schemas';
import type { QuestionDisplayMode } from './types';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import MultipleResponseQuestion from './MultipleResponseQuestion';
import FillInTheBlanksQuestion from './FillInTheBlanksQuestion';
import TrueFalseQuestion from './TrueFalseQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import MatchingQuestion from './MatchingQuestion';
import OrderingQuestion from './OrderingQuestion';
import DragAndDropQuestion from './DragAndDropQuestion';
import HotSpotQuestion from './HotSpotQuestion';
import ImageResponseQuestion from './ImageResponseQuestion';
import AudioResponseQuestion from './AudioResponseQuestion';
import VideoResponseQuestion from './VideoResponseQuestion';
import EssayQuestion from './EssayQuestion';
import AIChat from '@/components/learner/content/AIChat';

/** Soru renderer için: ORVAL Question tabanlı + ekran alanları (questionText, userAnswer, mode, aiReady). */
type Question = Pick<ApiQuestion, 'id'> & {
  /** Soru tipi; API'de QuestionQuestionType, farklı kaynaklarda string gelebilir. */
  questionType: string;
  questionId?: string;
  /** Soru metni; API'de fullText olarak da gelebilir. */
  questionText: string;
  /** API'de string (JSON); önizleme/formda object de gelebilir. */
  templateData?: unknown;
  /** Öğrenci cevabı – daha önce cevaplandıysa buradan geçirilir */
  userAnswer?: unknown;
  /** APPLICATION (varsayılan) veya PREVIEW */
  mode?: QuestionDisplayMode;
  /** true ise soru altında AI Chat butonu gösterilir. Varsayılan: false */
  aiReady?: boolean;
};

interface QuestionRendererProps {
  question: Question;
  onAnswerChange?: (answerData: any) => void;
  /** Sadece ESSAY tipi için: öğrenci "Kaydet"e bastığında çağrılır (backend’e kayıt için). */
  onSaveAnswer?: (answerData: any) => void | Promise<void>;
  questionId?: string; // Unique identifier for this question
  /** true ise sorunun altında AIChat gösterilir (öğrenme amaçlı). Varsayılan: false. */
  showAIChat?: boolean;
  /** AIChat için opsiyonel props (showAIChat true iken kullanılır). */
  aiChatMode?: 'learning' | 'analysis' | 'practice';
  aiChatCourseCategory?: string;
  aiChatLessonPartName?: string;
}

/**
 * QuestionRenderer Component
 * Routes to appropriate question component based on question type
 */
export default function QuestionRenderer({
  question,
  onAnswerChange,
  onSaveAnswer,
  questionId,
  showAIChat = true,
  aiChatMode = 'learning',
  aiChatCourseCategory,
  aiChatLessonPartName,
}: QuestionRendererProps) {
  const { questionType, questionText, templateData, userAnswer, mode = 'APPLICATION', aiReady = false } = question;
  const uniqueQuestionId = questionId || question.questionId || (question as any).id || 'question';
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const wrapWithAIChat = (content: ReactNode) => {
    if (!showAIChat) return content;
    return (
      <>
        {content}
        <div className="mt-4">
          {aiChatOpen && (
            <div className="mb-3">
              <AIChat
                activeText={questionText}
                mode={aiChatMode}
                courseCategory={aiChatCourseCategory}
                lessonPartName={aiChatLessonPartName}
              />
            </div>
          )}
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="rbt-btn btn-sm bg-primary-opacity"
              onClick={() => setAiChatOpen((prev) => !prev)}
              aria-expanded={aiChatOpen}
            >
              <span className="btn-text">{aiChatOpen ? 'Hide AI Chat' : 'Talk TO AI'}</span>
            </button>
          </div>
        </div>
      </>
    );
  };

  // Parse templateData if it's a string
  const parsedTemplateData = typeof templateData === 'string'
    ? JSON.parse(templateData)
    : templateData;

  // Parse userAnswer if it's a string
  const parsedUserAnswer = typeof userAnswer === 'string'
    ? JSON.parse(userAnswer)
    : userAnswer;

  // Backend often returns userAnswer as { answerData: { essayText, ... }, ... }; components expect the payload (answerData) as initialAnswer
  const normalizedInitialAnswer =
    parsedUserAnswer != null &&
    typeof parsedUserAnswer === 'object' &&
    'answerData' in parsedUserAnswer &&
    (parsedUserAnswer as { answerData?: unknown }).answerData != null
      ? (parsedUserAnswer as { answerData: unknown }).answerData
      : parsedUserAnswer;

  const commonProps = {
    mode,
    aiReady,
    questionId: uniqueQuestionId,
    onAnswerChange,
    initialAnswer: normalizedInitialAnswer,
  };

  switch (questionType) {
    case 'MULTIPLE_CHOICE':
      return wrapWithAIChat(
        <MultipleChoiceQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'TRUE_FALSE':
      return wrapWithAIChat(
        <TrueFalseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'MULTIPLE_RESPONSE':
      return wrapWithAIChat(
        <MultipleResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'SHORT_ANSWER':
      return wrapWithAIChat(
        <ShortAnswerQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'FILL_IN_THE_BLANKS':
      return wrapWithAIChat(
        <FillInTheBlanksQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'MATCHING':
      return wrapWithAIChat(
        <MatchingQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'ORDERING':
      return wrapWithAIChat(
        <OrderingQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'ESSAY':
      return wrapWithAIChat(
        <EssayQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
          onAnswerChange={undefined}
          onSave={onSaveAnswer}
        />
      );

    case 'DRAG_AND_DROP':
      return wrapWithAIChat(
        <DragAndDropQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'HOT_SPOT':
      return wrapWithAIChat(
        <HotSpotQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'AUDIO_RESPONSE':
      return wrapWithAIChat(
        <AudioResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'VIDEO_RESPONSE':
      return wrapWithAIChat(
        <VideoResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    case 'IMAGE_RESPONSE':
      return wrapWithAIChat(
        <ImageResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          {...commonProps}
        />
      );

    default:
      return wrapWithAIChat(
        <div className="question-error">
          <p style={{ color: '#ff4444' }}>
            Unknown question type: {questionType}
          </p>
        </div>
      );
  }
}
