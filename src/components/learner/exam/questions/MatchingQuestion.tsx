'use client';

import { useState, useEffect } from 'react';

interface Pair {
  leftText: string;
  rightText: string;
}

interface MatchingTemplateData {
  options: {
    pairs: Pair[];
  };
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface MatchingQuestionProps {
  questionText: string;
  templateData: MatchingTemplateData;
  onAnswerChange?: (answerData: { matches: Record<string, string> }) => void;
  initialAnswer?: { matches: Record<string, string> } | null;
  questionId?: string;
}

/**
 * MatchingQuestion Component
 * Renders a matching question with left and right columns
 */
export default function MatchingQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'matching',
}: MatchingQuestionProps) {
  const [matches, setMatches] = useState<Record<string, string>>(
    initialAnswer?.matches || {}
  );

  const pairs: Pair[] = templateData.options?.pairs ?? [];
  const matchingType = 'ONE_TO_ONE';

  // Build left/right items from pairs with generated ids (index-based)
  const leftItems = pairs.map((pair, index) => ({
    id: `left-${index}`,
    text: pair.leftText,
    mediaUrl: undefined as string | undefined,
  }));

  const rightItems = pairs.map((pair, index) => ({
    id: `right-${index}`,
    text: pair.rightText,
    mediaUrl: undefined as string | undefined,
  }));

  const [shuffledLeftItems, setShuffledLeftItems] = useState(leftItems);
  const [shuffledRightItems, setShuffledRightItems] = useState(rightItems);

  useEffect(() => {
    setShuffledLeftItems(leftItems);
    setShuffledRightItems(rightItems);
  }, [templateData.options?.pairs]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle match selection
  const handleMatchChange = (leftId: string, rightId: string) => {
    const newMatches = { ...matches };
    
    if (rightId === '') {
      // Remove match
      delete newMatches[leftId];
    } else {
      // Add/update match
      // If ONE_TO_ONE, remove any existing match for this rightId
      if (matchingType === 'ONE_TO_ONE') {
        Object.keys(newMatches).forEach((key) => {
          if (newMatches[key] === rightId) {
            delete newMatches[key];
          }
        });
      }
      newMatches[leftId] = rightId;
    }

    setMatches(newMatches);
    if (onAnswerChange) {
      onAnswerChange({ matches: newMatches });
    }
  };

  // Get matched right item for a left item
  const getMatchedRightId = (leftId: string): string => {
    return matches[leftId] || '';
  };

  // Check if a right item is already matched
  const isRightItemMatched = (rightId: string): boolean => {
    return Object.values(matches).includes(rightId);
  };

  return (
    <div className="matching-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* Matching Instructions */}
      <div className="matching-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-link me-2"></i>
        Match each item on the left with the corresponding item on the right.
        {matchingType === 'ONE_TO_ONE' && ' Each item can only be used once.'}
      </div>

      {/* Matching Table */}
      <div className="matching-table">
        <div className="row g-3">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="left-column">
              <h6 className="mb--20" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                <i className="feather-list me-2"></i>
                Items
              </h6>
              {shuffledLeftItems.map((leftItem, index) => {
                const matchedRightId = getMatchedRightId(leftItem.id);
                const isMatched = !!matchedRightId;

                return (
                  <div
                    key={leftItem.id}
                    className="matching-item mb--15"
                    style={{
                      padding: '15px',
                      border: `2px solid ${isMatched ? '#4d79ff' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      backgroundColor: isMatched ? '#f0f4ff' : '#ffffff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="item-content" style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '5px', color: '#333' }}>
                          {leftItem.text}
                        </div>
                        {leftItem.mediaUrl && (
                          <div className="item-media mt-2">
                            <img
                              src={leftItem.mediaUrl.startsWith('http') ? leftItem.mediaUrl : `/assets/${leftItem.mediaUrl}`}
                              alt={leftItem.text}
                              style={{
                                maxWidth: '100%',
                                maxHeight: '100px',
                                borderRadius: '6px',
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="item-arrow" style={{ margin: '0 15px', fontSize: '20px', color: '#4d79ff' }}>
                        →
                      </div>
                      <div className="item-select" style={{ minWidth: '200px' }}>
                        <select
                          id={`match-${questionId}-${leftItem.id}`}
                          value={matchedRightId}
                          onChange={(e) => handleMatchChange(leftItem.id, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: `2px solid ${isMatched ? '#4d79ff' : '#e0e0e0'}`,
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: isMatched ? '#f0f4ff' : '#ffffff',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="">-- Select --</option>
                          {shuffledRightItems.map((rightItem) => {
                            // In ONE_TO_ONE mode, disable already matched items (except current match)
                            const isDisabled = matchingType === 'ONE_TO_ONE' && 
                                              isRightItemMatched(rightItem.id) && 
                                              matchedRightId !== rightItem.id;

                            return (
                              <option
                                key={rightItem.id}
                                value={rightItem.id}
                                disabled={isDisabled}
                              >
                                {rightItem.text}
                                {isDisabled ? ' (already matched)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Available Options */}
          <div className="col-md-6">
            <div className="right-column">
              <h6 className="mb--20" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
                <i className="feather-check-square me-2"></i>
                Options
              </h6>
              {shuffledRightItems.map((rightItem) => {
                const isMatched = isRightItemMatched(rightItem.id);
                const matchedLeftId = Object.keys(matches).find((key) => matches[key] === rightItem.id);

                return (
                  <div
                    key={rightItem.id}
                    className="matching-option mb--15"
                    style={{
                      padding: '15px',
                      border: `2px solid ${isMatched ? '#4d79ff' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      backgroundColor: isMatched ? '#f0f4ff' : '#ffffff',
                      opacity: isMatched ? 0.8 : 1,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div className="option-content">
                      <div style={{ fontWeight: '500', color: '#333' }}>
                        {rightItem.text}
                        {isMatched && (
                          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#4d79ff' }}>
                            <i className="feather-check me-1"></i>
                            Matched
                          </span>
                        )}
                      </div>
                      {rightItem.mediaUrl && (
                        <div className="option-media mt-2">
                          <img
                            src={rightItem.mediaUrl.startsWith('http') ? rightItem.mediaUrl : `/assets/${rightItem.mediaUrl}`}
                            alt={rightItem.text}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100px',
                              borderRadius: '6px',
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Match Status */}
      <div className="match-status mt--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-link-2 me-2"></i>
        Matched: {Object.keys(matches).length} of {shuffledLeftItems.length} items
      </div>
    </div>
  );
}
