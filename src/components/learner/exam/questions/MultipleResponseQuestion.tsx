'use client';

import { useState, useEffect } from 'react';

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
  minSelections?: number;
  maxSelections?: number;
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

interface MultipleResponseQuestionProps {
  questionText: string;
  templateData: MultipleResponseTemplateData;
  onAnswerChange?: (answerData: { selectedOptionIds: string[] }) => void;
  initialAnswer?: { selectedOptionIds: string[] } | null;
  questionId?: string; // Unique identifier for this question
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
}: MultipleResponseQuestionProps) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(
    initialAnswer?.selectedOptionIds || []
  );
  const [choices, setChoices] = useState<Choice[]>([]);

  const minSelections = templateData.minSelections || 1;
  const maxSelections = templateData.maxSelections || choices.length;

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

  // Handle option toggle
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptionIds((prev) => {
      let newSelection: string[];
      
      if (prev.includes(optionId)) {
        // Deselect
        newSelection = prev.filter((id) => id !== optionId);
      } else {
        // Select (check max limit)
        if (prev.length >= maxSelections) {
          // Already at max, don't add
          return prev;
        }
        newSelection = [...prev, optionId];
      }
      
      // Notify parent
      if (onAnswerChange) {
        onAnswerChange({ selectedOptionIds: newSelection });
      }
      
      return newSelection;
    });
  };

  // Check if selection meets requirements
  const isValidSelection = () => {
    return selectedOptionIds.length >= minSelections && selectedOptionIds.length <= maxSelections;
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
    <div className="multiple-response-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* Selection Counter */}
      <div className="selection-counter mb--20" style={{ 
        padding: '10px 15px', 
        backgroundColor: '#f0f4ff', 
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
        fontWeight: '500',
      }}>
        <i className="feather-check-square me-2"></i>
        Selected: {selectedOptionIds.length} of {minSelections} to {maxSelections} required
        {!isValidSelection() && selectedOptionIds.length > 0 && (
          <span style={{ color: '#ff6b6b', marginLeft: '10px' }}>
            {selectedOptionIds.length < minSelections 
              ? `(Minimum ${minSelections} required)`
              : `(Maximum ${maxSelections} allowed)`
            }
          </span>
        )}
      </div>

      {/* Choices */}
      <div className="choices-container">
        {choices.map((choice) => {
          const isSelected = selectedOptionIds.includes(choice.id);
          const isDisabled = !isSelected && selectedOptionIds.length >= maxSelections;
          
          return (
            <div
              key={choice.id}
              className={`choice-item mb--15 ${
                isSelected ? 'selected' : ''
              } ${isDisabled ? 'disabled' : ''}`}
              style={{
                padding: '15px',
                border: `2px solid ${isSelected ? '#4d79ff' : isDisabled ? '#ccc' : '#e0e0e0'}`,
                borderRadius: '8px',
                backgroundColor: isSelected ? '#f0f4ff' : isDisabled ? '#f5f5f5' : '#ffffff',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isDisabled ? 0.6 : 1,
              }}
              onClick={() => !isDisabled && handleOptionToggle(choice.id)}
              onMouseOver={(e) => {
                if (!isSelected && !isDisabled) {
                  e.currentTarget.style.borderColor = '#4d79ff';
                  e.currentTarget.style.backgroundColor = '#f9f9ff';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected && !isDisabled) {
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
                    disabled={isDisabled}
                    onChange={() => handleOptionToggle(choice.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
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
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      color: isDisabled ? '#999' : '#333',
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

      {/* Validation Message */}
      {selectedOptionIds.length > 0 && !isValidSelection() && (
        <div className="validation-message mt--20" style={{ 
          padding: '12px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '6px', 
          fontSize: '14px', 
          color: '#856404',
          border: '1px solid #ffc107',
        }}>
          <i className="feather-alert-circle me-2"></i>
          {selectedOptionIds.length < minSelections 
            ? `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}.`
            : `You can select a maximum of ${maxSelections} option${maxSelections > 1 ? 's' : ''}.`
          }
        </div>
      )}

      {/* Success Message */}
      {isValidSelection() && selectedOptionIds.length > 0 && (
        <div className="success-message mt--20" style={{ 
          padding: '12px', 
          backgroundColor: '#d4edda', 
          borderRadius: '6px', 
          fontSize: '14px', 
          color: '#155724',
          border: '1px solid #c3e6cb',
        }}>
          <i className="feather-check-circle me-2"></i>
          Selection valid ({selectedOptionIds.length} option{selectedOptionIds.length > 1 ? 's' : ''} selected)
        </div>
      )}
    </div>
  );
}
