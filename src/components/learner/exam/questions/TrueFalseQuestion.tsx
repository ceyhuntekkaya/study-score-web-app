'use client';

import { useState } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

export type TrueFalseAnswerValue = 'true' | 'false' | 'notGiven';

interface TrueFalseTemplateData {
  questionText?: string;
  correctAnswer: TrueFalseAnswerValue;
  trueLabel?: string;
  falseLabel?: string;
  notGivenLabel?: string;
  showFeedback?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface TrueFalseQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: TrueFalseTemplateData;
  onAnswerChange?: (answerData: { answer: TrueFalseAnswerValue }) => void;
  initialAnswer?: { answer: TrueFalseAnswerValue } | null;
  questionId?: string;
}

/**
 * TrueFalseQuestion Component
 * Renders a true/false question with two options
 */
// Normalize templateData: support flat (new) and options (legacy) shape
function getOptions(templateData: TrueFalseTemplateData) {
  const opts = templateData as any;
  if (opts.options && typeof opts.options === 'object') {
    const o = opts.options;
    return {
      correctAnswer: (o.correctAnswer === false ? 'false' : o.correctAnswer === true ? 'true' : (o.correctAnswer || 'true')) as TrueFalseAnswerValue,
      trueLabel: o.trueLabel ?? 'True',
      falseLabel: o.falseLabel ?? 'False',
      notGivenLabel: o.notGivenLabel ?? 'Not Given',
    };
  }
  return {
    correctAnswer: (templateData.correctAnswer || 'true') as TrueFalseAnswerValue,
    trueLabel: templateData.trueLabel ?? 'True',
    falseLabel: templateData.falseLabel ?? 'False',
    notGivenLabel: templateData.notGivenLabel ?? 'Not Given',
  };
}

export default function TrueFalseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'true-false',
  mode = 'APPLICATION',
  aiReady = false,
}: TrueFalseQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [selectedAnswer, setSelectedAnswer] = useState<TrueFalseAnswerValue | null>(
    initialAnswer?.answer !== undefined ? initialAnswer.answer : null
  );

  const { correctAnswer, trueLabel, falseLabel, notGivenLabel } = getOptions(templateData);

  const handleAnswerSelect = (answer: TrueFalseAnswerValue) => {
    if (isPreview) return;
    setSelectedAnswer(answer);
    if (onAnswerChange) {
      onAnswerChange({ answer });
    }
  };

  const getLabel = (value: TrueFalseAnswerValue) => {
    if (value === 'true') return trueLabel;
    if (value === 'false') return falseLabel;
    return notGivenLabel;
  };

  return (
    <div className="true-false-question">

 <QuestionBody questionText={questionText} />
      {/* True / False / Not Given Options */}
      <div className="true-false-options">
        <div className="row g-3">
          {/* True Option */}
          <div className="col-md-4">
            <div
              className={`true-false-option ${selectedAnswer === 'true' ? 'selected' : ''}`}
              style={{
                padding: '25px',
                border: `3px solid ${selectedAnswer === 'true' ? '#4d79ff' : correctAnswer === 'true' && isPreview ? '#22c55e' : '#e0e0e0'}`,
                borderRadius: '12px',
                backgroundColor: selectedAnswer === 'true' ? '#f0f4ff' : correctAnswer === 'true' && isPreview ? '#f0fdf4' : '#ffffff',
                cursor: isPreview ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                position: 'relative',
                pointerEvents: isPreview ? 'none' : undefined,
              }}
              onClick={() => handleAnswerSelect('true')}
              onMouseOver={(e) => {
                if (selectedAnswer !== 'true') {
                  e.currentTarget.style.borderColor = '#4d79ff';
                  e.currentTarget.style.backgroundColor = '#f9f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedAnswer !== 'true') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <input
                type="radio"
                name={`true-false-${questionId}`}
                id={`true-${questionId}`}
                checked={selectedAnswer === 'true'}
                onChange={() => handleAnswerSelect('true')}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✓</div>
              <label htmlFor={`true-${questionId}`} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: '600', color: selectedAnswer === 'true' ? '#4d79ff' : '#333', margin: 0, display: 'block' }}>
                {trueLabel}
              </label>
            </div>
          </div>

          {/* False Option */}
          <div className="col-md-4">
            <div
              className={`true-false-option ${selectedAnswer === 'false' ? 'selected' : ''}`}
              style={{
                padding: '25px',
                border: `3px solid ${selectedAnswer === 'false' ? '#ff4444' : correctAnswer === 'false' && isPreview ? '#22c55e' : '#e0e0e0'}`,
                borderRadius: '12px',
                backgroundColor: selectedAnswer === 'false' ? '#fff0f0' : correctAnswer === 'false' && isPreview ? '#f0fdf4' : '#ffffff',
                cursor: isPreview ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                position: 'relative',
                pointerEvents: isPreview ? 'none' : undefined,
              }}
              onClick={() => handleAnswerSelect('false')}
              onMouseOver={(e) => {
                if (selectedAnswer !== 'false') {
                  e.currentTarget.style.borderColor = '#ff4444';
                  e.currentTarget.style.backgroundColor = '#fff9f9';
                }
              }}
              onMouseOut={(e) => {
                if (selectedAnswer !== 'false') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <input
                type="radio"
                name={`true-false-${questionId}`}
                id={`false-${questionId}`}
                checked={selectedAnswer === 'false'}
                onChange={() => handleAnswerSelect('false')}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>✗</div>
              <label htmlFor={`false-${questionId}`} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: '600', color: selectedAnswer === 'false' ? '#ff4444' : '#333', margin: 0, display: 'block' }}>
                {falseLabel}
              </label>
            </div>
          </div>

          {/* Not Given Option */}
          <div className="col-md-4">
            <div
              className={`true-false-option ${selectedAnswer === 'notGiven' ? 'selected' : ''}`}
              style={{
                padding: '25px',
                border: `3px solid ${selectedAnswer === 'notGiven' ? '#6b7280' : correctAnswer === 'notGiven' && isPreview ? '#22c55e' : '#e0e0e0'}`,
                borderRadius: '12px',
                backgroundColor: selectedAnswer === 'notGiven' ? '#f3f4f6' : correctAnswer === 'notGiven' && isPreview ? '#f0fdf4' : '#ffffff',
                cursor: isPreview ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                position: 'relative',
                pointerEvents: isPreview ? 'none' : undefined,
              }}
              onClick={() => handleAnswerSelect('notGiven')}
              onMouseOver={(e) => {
                if (selectedAnswer !== 'notGiven') {
                  e.currentTarget.style.borderColor = '#6b7280';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseOut={(e) => {
                if (selectedAnswer !== 'notGiven') {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <input
                type="radio"
                name={`true-false-${questionId}`}
                id={`notGiven-${questionId}`}
                checked={selectedAnswer === 'notGiven'}
                onChange={() => handleAnswerSelect('notGiven')}
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
              />
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>—</div>
              <label htmlFor={`notGiven-${questionId}`} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: '600', color: selectedAnswer === 'notGiven' ? '#6b7280' : '#333', margin: 0, display: 'block' }}>
                {notGivenLabel}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Info (sadece uygulama modunda) */}
      {selectedAnswer !== null && !isPreview && (
        <div
          className="selection-info mt--20"
          style={{
            padding: '12px',
            backgroundColor: selectedAnswer === 'true' ? '#f0f4ff' : selectedAnswer === 'false' ? '#fff0f0' : '#f3f4f6',
            borderRadius: '6px',
            fontSize: '14px',
            color: selectedAnswer === 'true' ? '#4d79ff' : selectedAnswer === 'false' ? '#ff4444' : '#6b7280',
            textAlign: 'center',
          }}
        >
          You selected: <strong>{getLabel(selectedAnswer)}</strong>
        </div>
      )}

      {isPreview && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Doğru cevap:</strong> {getLabel(correctAnswer)}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          Doğru cevap: {getLabel(correctAnswer)}.
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
