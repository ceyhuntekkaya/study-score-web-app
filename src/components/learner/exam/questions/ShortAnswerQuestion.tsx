'use client';

import { useState, useEffect } from 'react';

interface AcceptableAnswer {
  answer: string;
  scorePercentage: number;
  caseSensitive: boolean;
  exactMatch: boolean;
}

interface ShortAnswerTemplateData {
  options: {
    acceptableAnswers: AcceptableAnswer[];
    placeholder?: string;
  };
  maxCharacters?: number;
  minCharacters?: number;
  trimWhitespace?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface ShortAnswerQuestionProps {
  questionText: string;
  templateData: ShortAnswerTemplateData;
  onAnswerChange?: (answerData: { answerText: string; characterCount: number }) => void;
  initialAnswer?: { answerText: string; characterCount: number } | null;
  questionId?: string;
}

/**
 * ShortAnswerQuestion Component
 * Renders a short answer question with text input
 */
export default function ShortAnswerQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'short-answer',
}: ShortAnswerQuestionProps) {
  const [answerText, setAnswerText] = useState<string>(
    initialAnswer?.answerText || ''
  );

  const {
    placeholder = 'Enter your answer here...',
    maxCharacters = 500,
    minCharacters = 0,
    trimWhitespace = true,
  } = templateData;

  const characterCount = answerText.length;

  // Handle input change
  const handleInputChange = (value: string) => {
    // Enforce max characters
    const trimmedValue = value.length > maxCharacters ? value.substring(0, maxCharacters) : value;
    setAnswerText(trimmedValue);

    const finalValue = trimWhitespace ? trimmedValue.trim() : trimmedValue;
    if (onAnswerChange) {
      onAnswerChange({
        answerText: finalValue,
        characterCount: finalValue.length,
      });
    }
  };

  // Validation
  const isValid = () => {
    const text = trimWhitespace ? answerText.trim() : answerText;
    return text.length >= minCharacters && text.length <= maxCharacters;
  };

  const isUnderMin = () => {
    const text = trimWhitespace ? answerText.trim() : answerText;
    return text.length > 0 && text.length < minCharacters;
  };

  const isOverMax = () => {
    return characterCount >= maxCharacters;
  };

  return (
    <div className="short-answer-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* Text Input */}
      <div className="answer-input mb--20">
        <textarea
          id={`short-answer-${questionId}`}
          value={answerText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{
            width: '100%',
            padding: '15px',
            border: `2px solid ${isValid() && answerText.length > 0 ? '#4d79ff' : isUnderMin() || isOverMax() ? '#ff4444' : '#e0e0e0'}`,
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

      {/* Character Counter */}
      <div className="character-counter mb--20">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 15px',
            backgroundColor: isOverMax() ? '#fff0f0' : isValid() && answerText.length > 0 ? '#f0f4ff' : '#f9f9f9',
            borderRadius: '6px',
            fontSize: '14px',
            color: isOverMax() ? '#ff4444' : isValid() && answerText.length > 0 ? '#4d79ff' : '#666',
          }}
        >
          <div>
            <i className="feather-edit me-2"></i>
            <span>
              {characterCount} / {maxCharacters} characters
              {minCharacters > 0 && (
                <span style={{ marginLeft: '10px', color: '#999' }}>
                  (Minimum: {minCharacters})
                </span>
              )}
            </span>
          </div>
          {isOverMax() && (
            <span style={{ color: '#ff4444', fontWeight: '600' }}>
              <i className="feather-alert-circle me-1"></i>
              Maximum reached
            </span>
          )}
        </div>
      </div>

      {/* Validation Messages */}
      {isUnderMin() && (
        <div
          className="validation-message mb--20"
          style={{
            padding: '12px 15px',
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#856404',
            border: '1px solid #ffc107',
          }}
        >
          <i className="feather-alert-circle me-2"></i>
          Please enter at least {minCharacters} character{minCharacters > 1 ? 's' : ''}.
          (Current: {trimWhitespace ? answerText.trim().length : answerText.length})
        </div>
      )}

      {isValid() && answerText.length > 0 && (
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
          Answer is valid ({characterCount} character{characterCount !== 1 ? 's' : ''})
        </div>
      )}

      {/* Info Note */}
      {trimWhitespace && (
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
          <strong>Note:</strong> Leading and trailing spaces will be automatically trimmed.
        </div>
      )}
    </div>
  );
}
