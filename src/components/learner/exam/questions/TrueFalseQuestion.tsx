'use client';

import { useState } from 'react';

interface TrueFalseTemplateData {
  options: {
    questionText?: string;
    correctAnswer: boolean;
    trueLabel?: string;
    falseLabel?: string;
  };
  showFeedback?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface TrueFalseQuestionProps {
  questionText: string;
  templateData: TrueFalseTemplateData;
  onAnswerChange?: (answerData: { answer: boolean }) => void;
  initialAnswer?: { answer: boolean } | null;
  questionId?: string;
}

/**
 * TrueFalseQuestion Component
 * Renders a true/false question with two options
 */
export default function TrueFalseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'true-false',
}: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(
    initialAnswer?.answer !== undefined ? initialAnswer.answer : null
  );

  const { correctAnswer, trueLabel = 'True', falseLabel = 'False' } = templateData.options || {};

  // Handle answer selection
  const handleAnswerSelect = (answer: boolean) => {
    setSelectedAnswer(answer);
    if (onAnswerChange) {
      onAnswerChange({ answer });
    }
  };

  return (
    <div className="true-false-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* True/False Options */}
      <div className="true-false-options">
        <div className="row g-3">
          {/* True Option */}
          <div className="col-md-6">
            <div
              className={`true-false-option ${
                selectedAnswer === true ? 'selected' : ''
              }`}
              style={{
                padding: '25px',
                border: `3px solid ${selectedAnswer === true ? '#4d79ff' : '#e0e0e0'}`,
                borderRadius: '12px',
                backgroundColor: selectedAnswer === true ? '#f0f4ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                position: 'relative',
              }}
              onClick={() => handleAnswerSelect(true)}
              onMouseOver={(e) => {
                if (selectedAnswer !== true) {
                  e.currentTarget.style.borderColor = '#4d79ff';
                  e.currentTarget.style.backgroundColor = '#f9f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (selectedAnswer !== true) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <input
                type="radio"
                name={`true-false-${questionId}`}
                id={`true-${questionId}`}
                checked={selectedAnswer === true}
                onChange={() => handleAnswerSelect(true)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                ✓
              </div>
              <label
                htmlFor={`true-${questionId}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: selectedAnswer === true ? '#4d79ff' : '#333',
                  margin: 0,
                  display: 'block',
                }}
              >
                {trueLabel}
              </label>
            </div>
          </div>

          {/* False Option */}
          <div className="col-md-6">
            <div
              className={`true-false-option ${
                selectedAnswer === false ? 'selected' : ''
              }`}
              style={{
                padding: '25px',
                border: `3px solid ${selectedAnswer === false ? '#ff4444' : '#e0e0e0'}`,
                borderRadius: '12px',
                backgroundColor: selectedAnswer === false ? '#fff0f0' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                position: 'relative',
              }}
              onClick={() => handleAnswerSelect(false)}
              onMouseOver={(e) => {
                if (selectedAnswer !== false) {
                  e.currentTarget.style.borderColor = '#ff4444';
                  e.currentTarget.style.backgroundColor = '#fff9f9';
                }
              }}
              onMouseOut={(e) => {
                if (selectedAnswer !== false) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <input
                type="radio"
                name={`true-false-${questionId}`}
                id={`false-${questionId}`}
                checked={selectedAnswer === false}
                onChange={() => handleAnswerSelect(false)}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                ✗
              </div>
              <label
                htmlFor={`false-${questionId}`}
                style={{
                  cursor: 'pointer',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: selectedAnswer === false ? '#ff4444' : '#333',
                  margin: 0,
                  display: 'block',
                }}
              >
                {falseLabel}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Info */}
      {selectedAnswer !== null && (
        <div className="selection-info mt--20" style={{ 
          padding: '12px', 
          backgroundColor: selectedAnswer === true ? '#f0f4ff' : '#fff0f0', 
          borderRadius: '6px', 
          fontSize: '14px', 
          color: selectedAnswer === true ? '#4d79ff' : '#ff4444',
          textAlign: 'center',
        }}>
          <i className={`feather-${selectedAnswer === true ? 'check' : 'x'}-circle me-2`}></i>
          You selected: <strong>{selectedAnswer === true ? trueLabel : falseLabel}</strong>
        </div>
      )}
    </div>
  );
}
