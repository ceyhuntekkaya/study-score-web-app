'use client';

import { useState, useEffect } from 'react';

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

interface MultipleChoiceQuestionProps {
  questionText: string;
  templateData: MultipleChoiceTemplateData;
  onAnswerChange?: (answerData: { selectedOptionId: string }) => void;
  initialAnswer?: { selectedOptionId: string } | null;
  questionId?: string; // Unique identifier for this question
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
}: MultipleChoiceQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    initialAnswer?.selectedOptionId || null
  );
  const [choices, setChoices] = useState<Choice[]>([]);

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

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
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
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

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
                border: `2px solid ${isSelected ? '#4d79ff' : '#e0e0e0'}`,
                borderRadius: '8px',
                backgroundColor: isSelected ? '#f0f4ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
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
      {selectedOptionId && (
        <div className="selection-info mt--20" style={{ padding: '10px', backgroundColor: '#f0f4ff', borderRadius: '6px', fontSize: '14px', color: '#4d79ff' }}>
          <i className="feather-check-circle me-2"></i>
          Option selected
        </div>
      )}
    </div>
  );
}
