'use client';

import { useState, useEffect } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'AUDIO' | 'VIDEO' | null;
}

interface MultipleChoiceTemplateData {
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

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: MultipleChoiceTemplateData;
  onAnswerChange?: (answerData: { selectedOptionId: string }) => void;
  initialAnswer?: { selectedOptionId: string } | null;
  questionId?: string;
}

/**
 * MultipleChoiceQuestion Component
 * Renders a multiple choice question with radio buttons
 */
export default function MultipleChoiceQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'multiple-choice',
  mode = 'APPLICATION',
  aiReady = false,
}: MultipleChoiceQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    initialAnswer?.selectedOptionId || null
  );
  const [choices, setChoices] = useState<Choice[]>([]);
  const correctChoice = choices.find((c) => c.isCorrect);

  // Initialize and shuffle choices if needed
  useEffect(() => {
    let processedChoices = [...(templateData.options?.choices || [])];
    
    // Shuffle if enabled
    if (templateData.shuffleChoices) {
      processedChoices = shuffleArray([...processedChoices]);
    }
    
    setChoices(processedChoices);
  }, [templateData]);

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle option selection (no-op in preview)
  const handleOptionSelect = (optionId: string) => {
    if (isPreview) return;
    setSelectedOptionId(optionId);
    if (onAnswerChange) {
      onAnswerChange({ selectedOptionId: optionId });
    }
  };

  // Render media for a choice
  const renderMedia = (choice: Choice) => {
    if (!choice.mediaUrl || !choice.mediaType) return null;

    switch (choice.mediaType) {
      case 'IMAGE':
        return (
          <div className="choice-media mb-2" style={{ textAlign: 'center' }}>
            <img
              src={choice.mediaUrl.startsWith('http') ? choice.mediaUrl : `/assets/${choice.mediaUrl}`}
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
              <source src={choice.mediaUrl} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        );

      case 'VIDEO':
        return (
          <div className="choice-media mb-2">
            <video controls style={{ width: '100%', maxHeight: '300px', borderRadius: '8px' }}>
              <source src={choice.mediaUrl} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="multiple-choice-question">
 
    
    <QuestionBody questionText={questionText} />
      {/* Choices */}
      <div className="choices-container">
        {choices.map((choice) => {
          const isSelected = selectedOptionId === choice.id;
          
          return (
            <div
              key={choice.id}
              className={`choice-item mb--15 ${
                isSelected ? 'selected' : ''
              }`}
              style={{
                padding: '15px',
                border: `2px solid ${isSelected ? '#4d79ff' : choice.isCorrect && isPreview ? '#22c55e' : '#e0e0e0'}`,
                borderRadius: '8px',
                backgroundColor: isSelected ? '#f0f4ff' : choice.isCorrect && isPreview ? '#f0fdf4' : '#ffffff',
                cursor: isPreview ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                pointerEvents: isPreview ? 'none' : undefined,
              }}
              onClick={() => handleOptionSelect(choice.id)}
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
                {/* Radio Button */}
                <div className="radio-wrapper" style={{ marginRight: '15px', marginTop: '2px' }}>
                  <input
                    type="radio"
                    name={`multiple-choice-${questionId}`}
                    id={`choice-${questionId}-${choice.id}`}
                    checked={isSelected}
                    onChange={() => handleOptionSelect(choice.id)}
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

      {/* Selection Info */}
      {selectedOptionId && !isPreview && (
        <div className="selection-info mt--20" style={{ padding: '10px', backgroundColor: '#f0f4ff', borderRadius: '6px', fontSize: '14px', color: '#4d79ff' }}>
          <i className="feather-check-circle me-2"></i>
          Option selected
        </div>
      )}

      {/* Önizleme: doğru cevap ve ayar özeti */}
      {isPreview && correctChoice && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Doğru cevap:</strong> {correctChoice.text}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          Tek doğru cevap. {templateData.shuffleChoices ? 'Seçenekler karıştırılır.' : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
    </div>
  );
}
