'use client';

import { useState, useEffect, useRef } from 'react';
import type { BaseQuestionProps } from './types';
import { getMediaServeUrl } from '@/lib/fileUtils';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  scorePercentage?: number;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'AUDIO' | 'VIDEO' | null;
}

interface MultipleResponseTemplateData {
  options: {
    choices: Choice[];
  };

  shuffleChoices?: boolean;
  showFeedback?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface MultipleResponseQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: MultipleResponseTemplateData;
  onAnswerChange?: (answerData: { selectedOptionIds: string[] }) => void;
  initialAnswer?: { selectedOptionIds: string[] } | null;
  questionId?: string;
}

/**
 * MultipleResponseQuestion Component
 * Renders a multiple response question with checkboxes (select all that apply)
 */
export default function MultipleResponseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'multiple-response',
  mode = 'APPLICATION',
  aiReady = false,
}: MultipleResponseQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    initialAnswer?.selectedOptionIds || []
  );
  const [choices, setChoices] = useState<Choice[]>([]);
  const correctIds = choices.filter((c) => c.isCorrect).map((c) => c.id);
  const initializedForQuestionIdRef = useRef<string | null>(null);

  // Shuffle array function (stable reference)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize and shuffle choices only once per question (so order doesn't change after answering)
  useEffect(() => {
    if (initializedForQuestionIdRef.current === questionId) return;
    const rawChoices = templateData.options?.choices ?? [];
    if (rawChoices.length === 0) return;
    let processedChoices = [...rawChoices];
    if (templateData.shuffleChoices) {
      processedChoices = shuffleArray(processedChoices);
    }
    setChoices(processedChoices);
    initializedForQuestionIdRef.current = questionId;
  }, [questionId, templateData.options?.choices, templateData.shuffleChoices]);

  // Sync state when saved answer arrives (e.g. after API load on material quiz page)
  useEffect(() => {
    if (initialAnswer != null && Array.isArray(initialAnswer.selectedOptionIds)) {
      setSelectedOptionIds(initialAnswer.selectedOptionIds);
    }
  }, [initialAnswer]);

  // Handle option toggle (no-op in preview)
  const handleOptionToggle = (optionId: string) => {
    if (isPreview) return;
    setSelectedOptionIds((prev) => {
      const newSelection = prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId];
      if (onAnswerChange) {
        onAnswerChange({ selectedOptionIds: newSelection });
      }
      return newSelection;
    });
  };


  // Render media for a choice
  const renderMedia = (choice: Choice) => {
    if (!choice.mediaUrl || !choice.mediaType) return null;

    switch (choice.mediaType) {
      case 'IMAGE':
        return (
          <div className="choice-media mb-2" style={{ textAlign: 'center' }}>
            <img
              src={getMediaServeUrl(choice.mediaUrl)}
              alt={choice.text}
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onError={(e) => {
                console.error('Choice image load error:', choice.mediaUrl);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        );

      case 'AUDIO':
        return (
          <div className="choice-media mb-2">
            <audio controls style={{ width: '100%' }}>
              <source src={getMediaServeUrl(choice.mediaUrl)} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case 'VIDEO':
        return (
          <div className="choice-media mb-2">
            <video controls style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }}>
              <source src={getMediaServeUrl(choice.mediaUrl)} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="multiple-response-question">

<QuestionBody questionText={questionText} />
      {/* Selection counter (sadece uygulama modunda) */}
      {selectedOptionIds.length > 0 && !isPreview && (
        <div className="selection-counter mb--20" style={{ 
          padding: '10px 15px', 
          backgroundColor: '#f0f4ff', 
          borderRadius: '6px',
          fontSize: '14px',
          color: '#4d79ff',
          fontWeight: '500',
        }}>
          <i className="feather-check-square me-2"></i>
          Selected: {selectedOptionIds.length} option{selectedOptionIds.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Choices */}
      <div className="choices-container" style={isPreview ? { pointerEvents: 'none' } : undefined}>
        {choices.map((choice) => {
          const isSelected = selectedOptionIds.includes(choice.id);
          const isCorrectChoice = choice.isCorrect;
          
          return (
            <div
              key={choice.id}
              className={`choice-item mb--15 ${isSelected ? 'selected' : ''}`}
              style={{
                padding: '15px',
                border: `2px solid ${isSelected ? '#4d79ff' : isCorrectChoice && isPreview ? '#22c55e' : '#e0e0e0'}`,
                borderRadius: '8px',
                backgroundColor: isSelected ? '#f0f4ff' : isCorrectChoice && isPreview ? '#f0fdf4' : '#ffffff',
                cursor: isPreview ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => handleOptionToggle(choice.id)}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#4d79ff';
                  e.currentTarget.style.backgroundColor = '#f9f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
            >
              <div className="d-flex align-items-start">
                {/* Checkbox */}
                <div className="checkbox-wrapper" style={{ marginRight: '15px', marginTop: '2px' }}>
                  <input
                    type="checkbox"
                    id={`choice-${questionId}-${choice.id}`}
                    checked={isSelected}
                    onChange={() => handleOptionToggle(choice.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                {/* Choice Content */}
                <div className="choice-content" style={{ flex: 1 }}>
                  {/* Media */}
                  {renderMedia(choice)}
                  
                  {/* Text */}
                  <label
                    htmlFor={`choice-${questionId}-${choice.id}`}
                    style={{
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#333',
                      margin: 0,
                      display: 'block',
                    }}
                  >
                    {choice.text}
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isPreview && correctIds.length > 0 && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Doğru seçenekler:</strong> {choices.filter((c) => c.isCorrect).map((c) => c.text).join(', ')}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          Birden fazla doğru seçenek. {templateData.shuffleChoices ? 'Seçenekler karıştırılır.' : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
