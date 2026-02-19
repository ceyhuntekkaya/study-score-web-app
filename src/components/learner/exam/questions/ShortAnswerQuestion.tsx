'use client';

import { useState } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

export interface ShortAnswerTemplateData {
  acceptableAnswers: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface ShortAnswerQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: ShortAnswerTemplateData;
  onAnswerChange?: (answerData: { answerText: string; characterCount: number }) => void;
  initialAnswer?: { answerText: string; characterCount: number } | null;
  questionId?: string;
}

const DEFAULT_PLACEHOLDER = 'Enter your answer here...';
const DEFAULT_MAX_CHARACTERS = 2000;

/**
 * ShortAnswerQuestion Component
 * Renders a short answer question with text input.
 * Template: acceptableAnswers (scoring), caseSensitive, exactMatch, optional scoringConfig.
 */
export default function ShortAnswerQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'short-answer',
  mode = 'APPLICATION',
  aiReady = false,
}: ShortAnswerQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [answerText, setAnswerText] = useState<string>(
    initialAnswer?.answerText || ''
  );

  const maxCharacters = DEFAULT_MAX_CHARACTERS;
  const placeholder = DEFAULT_PLACEHOLDER;
  const characterCount = answerText.length;
  const acceptableAnswers = templateData.acceptableAnswers ?? [];

  const handleInputChange = (value: string) => {
    if (isPreview) return;
    const trimmedValue = value.length > maxCharacters ? value.substring(0, maxCharacters) : value;
    setAnswerText(trimmedValue);

    const finalValue = trimmedValue.trim();
    if (onAnswerChange) {
      onAnswerChange({
        answerText: finalValue,
        characterCount: finalValue.length,
      });
    }
  };

  const isOverMax = () => characterCount >= maxCharacters;

  return (
    <div className="short-answer-question">

<QuestionBody questionText={questionText} />
      <div className="answer-input mb--20" style={isPreview ? { pointerEvents: 'none' } : undefined}>
        <textarea
          id={`short-answer-${questionId}`}
          value={answerText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={isPreview ? '' : placeholder}
          readOnly={isPreview}
          rows={4}
          style={{
            width: '100%',
            padding: '15px',
            border: `2px solid ${answerText.length > 0 && !isOverMax() ? '#4d79ff' : isOverMax() ? '#ff4444' : '#e0e0e0'}`,
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: 'inherit',
            backgroundColor: answerText.length > 0 ? '#f9f9ff' : '#ffffff',
            outline: 'none',
            transition: 'all 0.2s ease',
            resize: 'vertical',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#4d79ff';
            e.target.style.boxShadow = '0 0 0 3px rgba(77, 121, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      <div className="character-counter mb--20">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            backgroundColor: isOverMax() ? '#fff0f0' : answerText.length > 0 ? '#f0f4ff' : '#f9f9f9',
            borderRadius: '6px',
            fontSize: '14px',
            color: isOverMax() ? '#ff4444' : answerText.length > 0 ? '#4d79ff' : '#666',
          }}
        >
          <div>
            <i className="feather-edit me-2"></i>
            <span>{characterCount} / {maxCharacters} characters</span>
          </div>
          {isOverMax() && (
            <span style={{ color: '#ff4444', fontWeight: '600' }}>
              <i className="feather-alert-circle me-1"></i>
              Maximum reached
            </span>
          )}
        </div>
      </div>

      {answerText.length > 0 && !isOverMax() && (
        <div
          className="success-message mb--20"
          style={{
            padding: '12px 15px',
            backgroundColor: '#d4edda',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#155724',
            border: '1px solid #c3e6cb',
          }}
        >
          <i className="feather-check-circle me-2"></i>
          Answer entered ({characterCount} character{characterCount !== 1 ? 's' : ''})
        </div>
      )}

      {!isPreview && (
        <div
          className="info-note"
          style={{
            padding: '10px',
            backgroundColor: '#e7f3ff',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0066cc',
          }}
        >
          <i className="feather-info me-2"></i>
          <strong>Note:</strong> Leading and trailing spaces are trimmed when saving.
        </div>
      )}

      {isPreview && acceptableAnswers.length > 0 && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Kabul edilen cevaplar:</strong> {acceptableAnswers.join(', ')}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          Kabul edilen cevaplar: {acceptableAnswers.length ? acceptableAnswers.join(', ') : '—'}. {templateData.caseSensitive ? 'Büyük/küçük harf duyarlı.' : ''} {templateData.exactMatch ? 'Tam eşleşme.' : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
