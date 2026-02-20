'use client';

import { useState, useEffect } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface EssayTemplateData {
  prompt?: string;
  minWords?: number;
  maxWords?: number;
  /** Backend: string (e.g. comma-separated); normalize to array for UI */
  requiredTopics?: string | string[];
  gradingType: 'MANUAL' | 'AI' | 'HYBRID';
  /** Backend: rubrik is string (evaluation criteria text) */
  rubrik?: string;
  requireOutline?: boolean;
  /** Backend: comma-separated string e.g. "HTML,MARKDOWN,PLAIN_TEXT" */
  allowedFormats?: string | Array<'PLAIN_TEXT' | 'HTML' | 'MARKDOWN'>;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface EssayQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: EssayTemplateData;
  onAnswerChange?: (answerData: {
    essayText: string;
    wordCount: number;
    format: 'PLAIN_TEXT' | 'HTML' | 'MARKDOWN';
    outline?: string;
  }) => void;
  /** Öğrenci "Kaydet" butonuna bastığında çağrılır; cevabı backend’e kaydetmek için kullanılabilir. */
  onSave?: (answerData: {
    essayText: string;
    wordCount: number;
    format: 'PLAIN_TEXT' | 'HTML' | 'MARKDOWN';
    outline?: string;
  }) => void;
  initialAnswer?: {
    essayText: string;
    wordCount: number;
    format: 'PLAIN_TEXT' | 'HTML' | 'MARKDOWN';
    outline?: string;
  } | null;
  questionId?: string;
}

/**
 * EssayQuestion Component
 * Renders an essay question with rich text editor
 */
export default function EssayQuestion({
  questionText,
  templateData,
  onAnswerChange,
  onSave,
  initialAnswer,
  questionId = 'essay',
  mode = 'APPLICATION',
  aiReady = false,
}: EssayQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [essayText, setEssayText] = useState<string>(
    initialAnswer?.essayText || ''
  );
  const [outline, setOutline] = useState<string>(
    initialAnswer?.outline || ''
  );
  const [format, setFormat] = useState<'PLAIN_TEXT' | 'HTML' | 'MARKDOWN'>(
    initialAnswer?.format || 'PLAIN_TEXT'
  );
  const [saveFeedback, setSaveFeedback] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Sync state when saved answer arrives (e.g. after API load on material quiz page)
  useEffect(() => {
    if (initialAnswer != null) {
      if (initialAnswer.essayText != null) setEssayText(initialAnswer.essayText);
      if (initialAnswer.outline != null) setOutline(initialAnswer.outline);
      if (initialAnswer.format != null) setFormat(initialAnswer.format);
    }
  }, [initialAnswer]);

  const rawTopics = templateData.requiredTopics;
  const requiredTopics = Array.isArray(rawTopics)
    ? rawTopics
    : typeof rawTopics === "string"
      ? rawTopics.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
  type EssayFormat = 'PLAIN_TEXT' | 'HTML' | 'MARKDOWN';
  const VALID_FORMATS: EssayFormat[] = ['PLAIN_TEXT', 'HTML', 'MARKDOWN'];
  const rawFormats = templateData.allowedFormats;
  const allowedFormats: EssayFormat[] = Array.isArray(rawFormats)
    ? rawFormats.filter((f): f is EssayFormat => VALID_FORMATS.includes(f as EssayFormat))
    : typeof rawFormats === "string"
      ? rawFormats.split(",").map((s) => s.trim()).filter((f): f is EssayFormat => VALID_FORMATS.includes(f as EssayFormat))
      : ['PLAIN_TEXT'];
  const {
    prompt,
    minWords = 100,
    maxWords = 1000,
    requireOutline = false,
  } = templateData;

  // Count words
  const countWords = (text: string): number => {
    if (!text.trim()) return 0;
    // Remove HTML tags if format is HTML
    const cleanText = format === 'HTML' 
      ? text.replace(/<[^>]*>/g, ' ').trim()
      : text.trim();
    return cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const wordCount = countWords(essayText);
  const outlineWordCount = countWords(outline);

  /** Sadece local state güncellenir; yazarken onAnswerChange çağrılmaz (her tuşta istek gitmesin). */
  const handleTextChange = (value: string) => {
    if (isPreview) return;
    setEssayText(value);
  };

  const handleOutlineChange = (value: string) => {
    if (isPreview) return;
    setOutline(value);
  };

  const handleFormatChange = (newFormat: 'PLAIN_TEXT' | 'HTML' | 'MARKDOWN') => {
    if (isPreview) return;
    setFormat(newFormat);
  };

  // Validation
  const isValid = () => {
    return wordCount >= minWords && wordCount <= maxWords;
  };

  const getCurrentAnswerPayload = () => ({
    essayText,
    wordCount: countWords(essayText),
    format,
    outline: requireOutline ? outline : undefined,
  });

  /** Cevap sadece "Cevabı kaydet" butonuna tıklanınca backend’e gönderilir (onSave ile). Her yazım anında kayıt yapılmaz. */
  const handleSave = async () => {
    if (isPreview) return;
    const payload = getCurrentAnswerPayload();
    setSaveFeedback('saving');
    try {
      onAnswerChange?.(payload);
      if (onSave) await Promise.resolve(onSave(payload));
      setSaveFeedback('saved');
      setTimeout(() => setSaveFeedback('idle'), 2500);
    } catch {
      setSaveFeedback('error');
      setTimeout(() => setSaveFeedback('idle'), 3000);
    }
  };

  const canSave = wordCount > 0 && isValid();

  const isUnderMin = () => {
    return wordCount > 0 && wordCount < minWords;
  };

  const isOverMax = () => {
    return wordCount > maxWords;
  };

  // Check required topics (simple keyword check)
  const checkRequiredTopics = () => {
    if (requiredTopics.length === 0) return { allFound: true, missing: [] };
    
    const textLower = essayText.toLowerCase();
    const found = requiredTopics.filter((topic) => textLower.includes(topic.toLowerCase()));
    const missing = requiredTopics.filter((topic) => !textLower.includes(topic.toLowerCase()));
    
    return { allFound: missing.length === 0, missing, found };
  };

  const topicCheck = checkRequiredTopics();

  return (
    <div className="essay-question">

<QuestionBody questionText={questionText} />
      {/* Format Selector (sadece uygulama modunda) */}
      {!isPreview && allowedFormats.length > 1 && (
        <div className="format-selector mb--20" style={{
          padding: '12px 15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '6px',
        }}>
          <label style={{ fontSize: '14px', fontWeight: '500', marginRight: '10px', color: '#333' }}>
            Format:
          </label>
          {allowedFormats.map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => handleFormatChange(fmt)}
              style={{
                padding: '6px 12px',
                marginRight: '8px',
                border: `2px solid ${format === fmt ? '#4d79ff' : '#e0e0e0'}`,
                borderRadius: '6px',
                backgroundColor: format === fmt ? '#f0f4ff' : '#ffffff',
                color: format === fmt ? '#4d79ff' : '#666',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: format === fmt ? '600' : '400',
              }}
            >
              {fmt.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Outline Section (if required) */}
      {requireOutline && (
        <div className="outline-section mb--20" style={isPreview ? { pointerEvents: 'none' } : undefined}>
          <label style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '10px', display: 'block' }}>
            <i className="feather-list me-2"></i>
            Outline (Optional but recommended)
          </label>
          <textarea
            value={outline}
            onChange={(e) => handleOutlineChange(e.target.value)}
            placeholder={isPreview ? '' : 'Write your essay outline here...'}
            readOnly={isPreview}
            rows={4}
            style={{
              width: '100%',
              padding: '15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
          <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            {outlineWordCount} words
          </div>
        </div>
      )}

      {/* Essay Text Editor */}
      <div className="essay-editor mb--20" style={isPreview ? { pointerEvents: 'none' } : undefined}>
        <label style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '10px', display: 'block' }}>
          <i className="feather-edit me-2"></i>
          Your Essay
        </label>
        <textarea
          id={`essay-${questionId}`}
          value={essayText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={isPreview ? '' : 'Write your essay here...'}
          readOnly={isPreview}
          rows={15}
          style={{
            width: '100%',
            padding: '15px',
            border: `2px solid ${isValid() && wordCount > 0 ? '#4d79ff' : isUnderMin() || isOverMax() ? '#ff4444' : '#e0e0e0'}`,
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: format === 'PLAIN_TEXT' ? 'inherit' : 'monospace',
            backgroundColor: wordCount > 0 ? '#f9f9ff' : '#ffffff',
            outline: 'none',
            transition: 'all 0.2s ease',
            resize: 'vertical',
            lineHeight: '1.6',
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

      {/* Word Count & Validation (sadece uygulama modunda) */}
      {!isPreview && (
      <div className="word-count-section mb--20">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 15px',
            backgroundColor: isOverMax() ? '#fff0f0' : isValid() && wordCount > 0 ? '#f0f4ff' : '#f9f9f9',
            borderRadius: '6px',
            fontSize: '14px',
            color: isOverMax() ? '#ff4444' : isValid() && wordCount > 0 ? '#4d79ff' : '#666',
          }}
        >
          <div>
            <i className="feather-file-text me-2"></i>
            <strong>Word Count:</strong> {wordCount} / {minWords} - {maxWords} words
          </div>
          {isOverMax() && (
            <span style={{ color: '#ff4444', fontWeight: '600' }}>
              <i className="feather-alert-circle me-1"></i>
              Exceeds maximum
            </span>
          )}
        </div>
      </div>
      )}

      {/* Required Topics Check (sadece uygulama modunda) */}
      {!isPreview && requiredTopics.length > 0 && (
        <div className="required-topics mb--20" style={{
          padding: '12px 15px',
          backgroundColor: topicCheck.allFound ? '#d4edda' : '#fff3cd',
          borderRadius: '6px',
          fontSize: '14px',
          color: topicCheck.allFound ? '#155724' : '#856404',
          border: `1px solid ${topicCheck.allFound ? '#c3e6cb' : '#ffc107'}`,
        }}>
          <div style={{ fontWeight: '600', marginBottom: '5px' }}>
            <i className={`feather-${topicCheck.allFound ? 'check' : 'alert-circle'} me-2`}></i>
            Required Topics:
          </div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {requiredTopics.map((topic, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  margin: '3px',
                  borderRadius: '4px',
                  backgroundColor: topicCheck.found?.includes(topic) ? '#28a745' : '#ffc107',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '500',
                }}
              >
                {topic} {topicCheck.found?.includes(topic) ? '✓' : '✗'}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Validation Messages (sadece uygulama modunda) */}
      {!isPreview && isUnderMin() && (
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
          Please write at least {minWords} words. (Current: {wordCount} words)
        </div>
      )}

      {!isPreview && isOverMax() && (
        <div
          className="validation-message mb--20"
          style={{
            padding: '12px 15px',
            backgroundColor: '#fff0f0',
            borderRadius: '6px',
            fontSize: '14px',
            color: '#ff4444',
            border: '1px solid #ff4444',
          }}
        >
          <i className="feather-alert-circle me-2"></i>
          Your essay exceeds the maximum of {maxWords} words. Please reduce it to {maxWords} words or less.
        </div>
      )}

      {!isPreview && isValid() && wordCount > 0 && (
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
          Essay is valid ({wordCount} words)
        </div>
      )}

      {/* Kaydet butonu – tıklanınca handleSave → onSave(payload) → parent (örn. take page) POST /api/question-responses çağrısını yapar */}
      {!isPreview && (
        <div className="essay-save-actions mb--20">
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave || saveFeedback === 'saving'}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: canSave && saveFeedback !== 'saving' ? '#4d79ff' : '#e0e0e0',
              color: canSave && saveFeedback !== 'saving' ? '#fff' : '#999',
              fontWeight: '600',
              fontSize: '14px',
              cursor: canSave && saveFeedback !== 'saving' ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {saveFeedback === 'saving' && (
              <>
                <i className="feather-loader" style={{ animation: 'spin 0.8s linear infinite' }}></i>
                Kaydediliyor…
              </>
            )}
            {saveFeedback === 'saved' && (
              <>
                <i className="feather-check"></i>
                Cevap kaydedildi
              </>
            )}
            {saveFeedback === 'error' && (
              <>
                <i className="feather-alert-circle"></i>
                Kaydedilemedi, tekrar deneyin
              </>
            )}
            {saveFeedback === 'idle' && (
              <>
                <i className="feather-save"></i>
                Cevabı kaydet
              </>
            )}
          </button>
          {!canSave && wordCount === 0 && (
            <span style={{ marginLeft: '12px', fontSize: '13px', color: '#666' }}>
              Cevap yazıp kelime sınırına uyduğunuzda kaydedebilirsiniz.
            </span>
          )}
          {!canSave && wordCount > 0 && !isValid() && (
            <span style={{ marginLeft: '12px', fontSize: '13px', color: '#856404' }}>
              Kelime sayısı {minWords}–{maxWords} aralığında olmalıdır.
            </span>
          )}
        </div>
      )}

      {/* Grading Rubrik (sadece uygulama modunda - öğrenci görebilir) */}
      {!isPreview && templateData.rubrik && String(templateData.rubrik).trim() && (
        <div className="grading-rubric mt--20" style={{
          padding: '15px',
          backgroundColor: '#fff9e6',
          borderRadius: '8px',
          border: '1px solid #ffc107',
        }}>
          <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: '10px' }}>
            <i className="feather-award me-2"></i>
            Grading Rubric
          </h6>
          <p style={{ margin: 0, fontSize: '12px', color: '#856404', whiteSpace: 'pre-wrap' }}>
            {String(templateData.rubrik)}
          </p>
        </div>
      )}

      {isPreview && (
        <QuestionSettingsSummary>
          Kelime: {minWords}–{maxWords}. Değerlendirme: {templateData.gradingType}. {requireOutline ? 'Özet zorunlu.' : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
