'use client';

import { useState, useRef, useEffect } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface AcceptableAnswer {
  answer: string;
  scorePercentage: number;
  caseSensitive: boolean;
  exactMatch: boolean;
}

interface Blank {
  blankId: string;
  acceptableAnswers: AcceptableAnswer[];
}

interface FillInTheBlanksTemplateData {
  textWithBlanks: string;
  options: {
    blanks: Blank[];
  };
  trimWhitespace?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface FillInTheBlanksQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: FillInTheBlanksTemplateData;
  onAnswerChange?: (answerData: { answers: Record<string, string> }) => void;
  initialAnswer?: { answers: Record<string, string> } | null;
  questionId?: string;
}

/**
 * FillInTheBlanksQuestion Component
 * Renders a fill-in-the-blanks question with inline input fields
 */
export default function FillInTheBlanksQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'fill-blanks',
  mode = 'APPLICATION',
  aiReady = false,
}: FillInTheBlanksQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [answers, setAnswers] = useState<Record<string, string>>(
    initialAnswer?.answers || {}
  );
  const latestAnswersRef = useRef(answers);
  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  const { textWithBlanks = '', options, trimWhitespace = true } = templateData ?? {};
  const blanks = options?.blanks || [];

  // Parse textWithBlanks and extract blank positions
  const parseText = () => {
    const text = typeof textWithBlanks === 'string' ? textWithBlanks : '';
    if (!text) return [];

    /* Support [BLANK_1] and legacy {{BLANK_1}} */
    const blankPattern = /\[([A-Z0-9_]+)\]|\{\{([A-Z0-9_]+)\}\}/g;
    const parts: Array<{ type: 'text' | 'blank'; content: string; blankId?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = blankPattern.exec(text)) !== null) {
      // Add text before blank
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }

      // Add blank (match[1] for [ID], match[2] for {{ID}})
      parts.push({
        type: 'blank',
        content: match[0],
        blankId: match[1] || match[2],
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex),
      });
    }

    return parts;
  };

  const textParts = parseText();

  // Handle input change: sadece local state güncellenir (her tuşta API'ye gitmesin)
  const handleInputChange = (blankId: string, value: string) => {
    if (isPreview) return;
    const trimmedValue = trimWhitespace ? value.trim() : value;
    setAnswers((prev) => {
      const next = { ...prev, [blankId]: trimmedValue };
      latestAnswersRef.current = next;
      return next;
    });
  };

  // Input'tan çıkıldığında cevabı parent'a/API'ye gönder (en güncel state için ref kullan)
  const handleBlankBlur = () => {
    if (isPreview || !onAnswerChange) return;
    onAnswerChange({ answers: latestAnswersRef.current });
  };

  // Get blank configuration
  const getBlankConfig = (blankId: string): Blank | undefined => {
    return blanks.find((blank) => blank.blankId === blankId);
  };

  // Check if blank is filled
  const isBlankFilled = (blankId: string): boolean => {
    return !!answers[blankId] && answers[blankId].length > 0;
  };

  return (
    <div className="fill-in-the-blanks-question">

<QuestionBody questionText={questionText} />
      {/* Text with Blanks */}
      <div className="text-with-blanks mb--30">
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            lineHeight: '1.8',
            fontSize: '16px',
          }}
        >
          {textParts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <span key={`text-${index}`} style={{ color: '#333' }}>
                  {part.content}
                </span>
              );
            } else {
              // Blank input
              const blankId = part.blankId!;
              const blankConfig = getBlankConfig(blankId);
              const value = answers[blankId] || '';
              const filled = isBlankFilled(blankId);

              return (
                <span key={`blank-${index}`} style={{ display: 'inline-block', margin: '0 2px' }}>
                  <input
                    type="text"
                    id={`blank-${questionId}-${blankId}`}
                    value={value}
                    onChange={(e) => handleInputChange(blankId, e.target.value)}
                    placeholder=""
                    readOnly={isPreview}
                    style={{
                      minWidth: '100px',
                      padding: '2px 6px 4px',
                      border: 'none',
                      borderBottom: `2px solid ${filled ? '#4d79ff' : '#999'}`,
                      borderRadius: 0,
                      fontSize: '16px',
                      lineHeight: '1.8',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottomColor = '#4d79ff';
                      e.target.style.borderBottomWidth = '2px';
                    }}
                    onBlur={(e) => {
                      handleBlankBlur();
                    }}
                  />
                </span>
              );
            }
          })}
        </div>
      </div>

      {/* Blanks Status (sadece uygulama modunda) */}
      {!isPreview && (
        <div className="blanks-status mb--20">
          <div style={{ 
            padding: '12px 15px', 
            backgroundColor: '#f0f4ff', 
            borderRadius: '6px',
            fontSize: '14px',
            color: '#4d79ff',
          }}>
            <i className="feather-edit me-2"></i>
            Filled: {Object.keys(answers).filter((id) => isBlankFilled(id)).length} of {blanks.length} blanks
          </div>
        </div>
      )}

      {/* Blanks Info (sadece uygulama modunda) */}
      {!isPreview && blanks.length > 0 && (
        <div className="blanks-info" style={{ 
          padding: '10px', 
          backgroundColor: '#fff9e6', 
          borderRadius: '6px',
          fontSize: '12px',
          color: '#856404',
          marginTop: '10px',
        }}>
          <i className="feather-info me-2"></i>
          <strong>Note:</strong> Fill in all {blanks.length} blank{blanks.length > 1 ? 's' : ''} marked with [BLANK_ID]
        </div>
      )}

      {isPreview && blanks.length > 0 && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Doğru cevaplar (özet):</strong> {blanks.map((b) => `${b.blankId}: ${(b.acceptableAnswers?.[0]?.answer ?? '—')}`).join('; ')}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          {blanks.length} boşluk. {trimWhitespace ? 'Baştaki/sondaki boşluklar kırpılır.' : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
