'use client';

import { useState, useEffect } from 'react';

interface OrderingItem {
  id: string;
  text: string;
  correctPosition: number;
  mediaUrl?: string | null;
  mediaType?: 'IMAGE' | 'AUDIO' | 'VIDEO' | null;
  feedback?: string;
}

interface OrderingTemplateData {
  options: {
    items: OrderingItem[];
    orderingType?: 'SEQUENTIAL' | 'RANKING';
  };
  shuffleItems?: boolean;
  showFeedback?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface OrderingQuestionProps {
  questionText: string;
  templateData: OrderingTemplateData;
  onAnswerChange?: (answerData: { orderedItemIds: string[] }) => void;
  initialAnswer?: { orderedItemIds: string[] } | null;
  questionId?: string;
}

/**
 * OrderingQuestion Component
 * Renders an ordering question with draggable items
 */
export default function OrderingQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'ordering',
}: OrderingQuestionProps) {
  const [items, setItems] = useState<OrderingItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { items: originalItems = [], shuffleItems = false } = templateData.options || {};

  // Initialize items
  useEffect(() => {
    let processedItems = [...originalItems];
    
    if (initialAnswer?.orderedItemIds && initialAnswer.orderedItemIds.length > 0) {
      // Restore from answer
      processedItems = initialAnswer.orderedItemIds
        .map((id) => originalItems.find((item) => item.id === id))
        .filter((item): item is OrderingItem => item !== undefined);
      
      // Add any missing items
      originalItems.forEach((item) => {
        if (!processedItems.find((i) => i.id === item.id)) {
          processedItems.push(item);
        }
      });
    } else if (shuffleItems) {
      // Shuffle if enabled
      processedItems = shuffleArray([...processedItems]);
    }
    
    setItems(processedItems);
  }, [originalItems, shuffleItems, initialAnswer]);

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    
    // Remove from old position
    newItems.splice(draggedIndex, 1);
    
    // Insert at new position
    newItems.splice(dropIndex, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Notify parent
    if (onAnswerChange) {
      onAnswerChange({
        orderedItemIds: newItems.map((item) => item.id),
      });
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move item up
  const moveItemUp = (index: number) => {
    if (index === 0) return;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);

    if (onAnswerChange) {
      onAnswerChange({
        orderedItemIds: newItems.map((item) => item.id),
      });
    }
  };

  // Move item down
  const moveItemDown = (index: number) => {
    if (index === items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);

    if (onAnswerChange) {
      onAnswerChange({
        orderedItemIds: newItems.map((item) => item.id),
      });
    }
  };

  // Render media for an item
  const renderMedia = (item: OrderingItem) => {
    if (!item.mediaUrl || !item.mediaType) return null;

    switch (item.mediaType) {
      case 'IMAGE':
        return (
          <div className="item-media mb-2" style={{ textAlign: 'center' }}>
            <img
              src={item.mediaUrl.startsWith('http') ? item.mediaUrl : `/assets/${item.mediaUrl}`}
              alt={item.text}
              style={{
                maxWidth: '100%',
                maxHeight: '150px',
                borderRadius: '6px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ordering-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* Instructions */}
      <div className="ordering-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-move me-2"></i>
        Drag and drop items to arrange them in the correct order. You can also use the arrow buttons.
      </div>

      {/* Orderable Items */}
      <div className="ordering-items">
        {items.map((item, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className="ordering-item mb--15"
              style={{
                padding: '15px',
                border: `2px solid ${isDragOver ? '#4d79ff' : isDragging ? '#999' : '#e0e0e0'}`,
                borderRadius: '8px',
                backgroundColor: isDragOver ? '#f0f4ff' : isDragging ? '#f5f5f5' : '#ffffff',
                cursor: 'move',
                transition: 'all 0.2s ease',
                opacity: isDragging ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              {/* Drag Handle */}
              <div className="drag-handle" style={{ fontSize: '20px', color: '#999', cursor: 'grab' }}>
                <i className="feather-menu"></i>
              </div>

              {/* Position Number */}
              <div className="position-number" style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: '#4d79ff',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '16px',
                flexShrink: 0,
              }}>
                {index + 1}
              </div>

              {/* Item Content */}
              <div className="item-content" style={{ flex: 1 }}>
                {renderMedia(item)}
                <div style={{ fontSize: '16px', color: '#333', fontWeight: '500' }}>
                  {item.text}
                </div>
              </div>

              {/* Move Buttons */}
              <div className="move-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  style={{
                    padding: '5px 10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: index === 0 ? '#f5f5f5' : '#ffffff',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.5 : 1,
                  }}
                  title="Move up"
                >
                  <i className="feather-chevron-up" style={{ fontSize: '14px' }}></i>
                </button>
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === items.length - 1}
                  style={{
                    padding: '5px 10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: index === items.length - 1 ? '#f5f5f5' : '#ffffff',
                    cursor: index === items.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === items.length - 1 ? 0.5 : 1,
                  }}
                  title="Move down"
                >
                  <i className="feather-chevron-down" style={{ fontSize: '14px' }}></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status */}
      <div className="order-status mt--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-list me-2"></i>
        Items ordered: {items.length} total
      </div>
    </div>
  );
}
