'use client';

import { useState, useEffect, useMemo } from 'react';

/** Item inside a drop zone (template: correct placement). */
interface DragAndDropItem {
  id: string;
  text: string;
}

interface DropZone {
  id: string;
  label: string;
  items: DragAndDropItem[];
}

interface DragAndDropTemplateData {
  options: {
    dropZones: DropZone[];
  };
  layout?: 'VERTICAL' | 'HORIZONTAL' | 'GRID' | 'CUSTOM';
  shuffleItems?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface DragAndDropQuestionProps {
  questionText: string;
  templateData: DragAndDropTemplateData;
  onAnswerChange?: (answerData: { placements: Record<string, string> }) => void;
  initialAnswer?: { placements: Record<string, string> } | null;
  questionId?: string;
}

/**
 * DragAndDropQuestion Component
 * Renders a drag and drop question with draggable items and drop zones
 */
export default function DragAndDropQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'drag-drop',
}: DragAndDropQuestionProps) {
  const [placements, setPlacements] = useState<Record<string, string>>(
    initialAnswer?.placements || {}
  );
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);

  const { dropZones = [] } = templateData.options || {};
  const { layout = 'VERTICAL', shuffleItems = false } = templateData;

  // All items from all zones (single flat list for the pool)
  const allItems = useMemo(
    () => dropZones.flatMap((z) => (z.items || []).map((it) => ({ ...it }))),
    [dropZones]
  );

  const itemsKey = allItems.map((i) => i.id).join(',');
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledItems, setShuffledItems] = useState<DragAndDropItem[]>(allItems);

  useEffect(() => {
    if (shuffleItems) {
      setShuffledItems(shuffleArray([...allItems]));
    } else {
      setShuffledItems([...allItems]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleItems, itemsKey]);

  // Get items in a zone (by current placement)
  const getItemsInZone = (zoneId: string): DragAndDropItem[] => {
    return shuffledItems.filter((item) => placements[item.id] === zoneId);
  };

  // Get unplaced items
  const getUnplacedItems = (): DragAndDropItem[] => {
    return shuffledItems.filter((item) => !placements[item.id]);
  };

  // Handle drag start
  const handleDragStart = (itemId: string) => {
    setDraggedItemId(itemId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    setDragOverZoneId(zoneId);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (!draggedItemId) {
      setDraggedItemId(null);
      setDragOverZoneId(null);
      return;
    }

    const newPlacements = { ...placements };
    newPlacements[draggedItemId] = zoneId;
    
    setPlacements(newPlacements);
    setDraggedItemId(null);
    setDragOverZoneId(null);

    if (onAnswerChange) {
      onAnswerChange({ placements: newPlacements });
    }
  };

  // Handle remove from zone
  const handleRemoveFromZone = (itemId: string) => {
    const newPlacements = { ...placements };
    delete newPlacements[itemId];
    
    setPlacements(newPlacements);

    if (onAnswerChange) {
      onAnswerChange({ placements: newPlacements });
    }
  };

  // Render draggable item
  const renderDraggableItem = (item: DragAndDropItem, isInZone: boolean = false) => {
    const isDragging = draggedItemId === item.id;
    const isPlaced = !!placements[item.id];

    return (
      <div
        key={item.id}
        draggable={!isInZone}
        onDragStart={() => !isInZone && handleDragStart(item.id)}
        className="draggable-item"
        style={{
          padding: '12px 15px',
          border: `2px solid ${isPlaced ? '#4d79ff' : '#e0e0e0'}`,
          borderRadius: '8px',
          backgroundColor: isPlaced ? '#f0f4ff' : '#ffffff',
          cursor: isInZone ? 'default' : 'move',
          transition: 'all 0.2s ease',
          opacity: isDragging ? 0.5 : 1,
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          {!isInZone && (
            <div style={{ fontSize: '18px', color: '#999' }}>
              <i className="feather-move"></i>
            </div>
          )}
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
            {item.text}
          </div>
        </div>
        {isInZone && (
          <button
            type="button"
            onClick={() => handleRemoveFromZone(item.id)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ff4444',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              color: '#ff4444',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Remove from zone"
          >
            <i className="feather-x"></i>
          </button>
        )}
      </div>
    );
  };

  // Render drop zone
  const renderDropZone = (zone: DropZone) => {
    const itemsInZone = getItemsInZone(zone.id);
    const isDragOver = dragOverZoneId === zone.id;

    return (
      <div
        key={zone.id}
        className="drop-zone mb--20"
        onDragOver={(e) => handleDragOver(e, zone.id)}
        onDrop={(e) => handleDrop(e, zone.id)}
        onDragLeave={() => setDragOverZoneId(null)}
        style={{
          padding: '20px',
          border: `3px dashed ${isDragOver ? '#4d79ff' : '#e0e0e0'}`,
          borderRadius: '12px',
          backgroundColor: isDragOver ? '#f0f4ff' : '#f9f9f9',
          minHeight: '150px',
          transition: 'all 0.2s ease',
        }}
      >
        <div className="zone-header mb--15" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h6 style={{ fontSize: '16px', fontWeight: '600', color: '#333', margin: 0 }}>
            {zone.label}
          </h6>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {itemsInZone.length} items
          </div>
        </div>

        <div className="zone-items">
          {itemsInZone.length > 0 ? (
            itemsInZone.map((item) => renderDraggableItem(item, true))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '30px',
              color: '#999',
              fontSize: '14px',
            }}>
              <i className="feather-inbox" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
              Drop items here
            </div>
          )}
        </div>
      </div>
    );
  };

  // Determine layout class
  const getLayoutClass = () => {
    switch (layout) {
      case 'HORIZONTAL':
        return 'row g-3';
      case 'GRID':
        return 'row g-3';
      default:
        return '';
    }
  };

  const unplacedItems = getUnplacedItems();

  return (
    <div className="drag-and-drop-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
      </div>

      {/* Instructions */}
      <div className="drag-drop-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-move me-2"></i>
        Drag items from the source area to the appropriate drop zones below.
      </div>

      {/* Source Area - Unplaced Items */}
      {unplacedItems.length > 0 && (
        <div className="source-area mb--30">
          <h6 className="mb--15" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
            <i className="feather-layers me-2"></i>
            Available Items
          </h6>
          <div
            style={{
              padding: '20px',
              border: '2px dashed #e0e0e0',
              borderRadius: '12px',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {unplacedItems.map((item) => renderDraggableItem(item, false))}
          </div>
        </div>
      )}

      {/* Drop Zones */}
      <div className="drop-zones">
        <h6 className="mb--15" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
          <i className="feather-target me-2"></i>
          Drop Zones
        </h6>
        <div className={getLayoutClass()}>
          {dropZones.map((zone) => (
            <div
              key={zone.id}
              className={layout === 'HORIZONTAL' || layout === 'GRID' ? 'col-md-6' : 'col-12'}
            >
              {renderDropZone(zone)}
            </div>
          ))}
        </div>
      </div>

      {/* Placement Status */}
      <div className="placement-status mt--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-check-circle me-2"></i>
        Placed: {Object.keys(placements).length} of {allItems.length} items
      </div>
    </div>
  );
}
