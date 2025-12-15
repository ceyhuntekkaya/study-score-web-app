'use client';

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

interface Question {
  questionId: string;
  questionType: string;
  questionText: string;
  templateData: any;
  userAnswer?: any;
}

interface QuestionRendererProps {
  question: Question;
  onAnswerChange?: (answerData: any) => void;
  questionId?: string; // Unique identifier for this question
}

/**
 * QuestionRenderer Component
 * Routes to appropriate question component based on question type
 */
export default function QuestionRenderer({
  question,
  onAnswerChange,
  questionId,
}: QuestionRendererProps) {
  const { questionType, questionText, templateData, userAnswer } = question;
  const uniqueQuestionId = questionId || question.questionId || question.id || 'question';

  // Parse templateData if it's a string
  const parsedTemplateData = typeof templateData === 'string' 
    ? JSON.parse(templateData) 
    : templateData;

  // Parse userAnswer if it's a string
  const parsedUserAnswer = typeof userAnswer === 'string' 
    ? JSON.parse(userAnswer) 
    : userAnswer;

  switch (questionType) {
    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoiceQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'TRUE_FALSE':
      return (
        <TrueFalseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'MULTIPLE_RESPONSE':
      return (
        <MultipleResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'SHORT_ANSWER':
      return (
        <ShortAnswerQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'FILL_IN_THE_BLANKS':
      return (
        <FillInTheBlanksQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'MATCHING':
      return (
        <MatchingQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'ORDERING':
      return (
        <OrderingQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'ESSAY':
      return (
        <EssayQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'DRAG_AND_DROP':
      return (
        <DragAndDropQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'HOT_SPOT':
      return (
        <HotSpotQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'AUDIO_RESPONSE':
      return (
        <AudioResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'VIDEO_RESPONSE':
      return (
        <VideoResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    case 'IMAGE_RESPONSE':
      return (
        <ImageResponseQuestion
          questionText={questionText}
          templateData={parsedTemplateData}
          onAnswerChange={onAnswerChange}
          initialAnswer={parsedUserAnswer}
          questionId={uniqueQuestionId}
        />
      );

    default:
      return (
        <div className="question-error">
          <p style={{ color: '#ff4444' }}>
            Unknown question type: {questionType}
          </p>
        </div>
      );
  }
}
