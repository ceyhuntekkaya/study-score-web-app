'use client';

import { useState, useRef, useEffect } from 'react';
import { getMediaServeUrl } from '@/lib/fileUtils';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface HotSpot {
  id: string;
  shape: 'RECTANGLE' | 'CIRCLE' | 'POLYGON';
  coordinates: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: Array<[number, number]>;
  };
  isCorrect: boolean;
  label?: string;
  scorePercentage?: number;
}

interface HotSpotTemplateData {
  imageUrl: string;
  options: {
    hotSpots: HotSpot[];
    selectionType?: 'CLICK' | 'AREA';
  };
  maxSelections?: number;
  allowMultipleSpots?: boolean;
  showFeedback?: boolean;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface HotSpotQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: HotSpotTemplateData;
  onAnswerChange?: (answerData: { selectedSpotIds: string[]; clickCoordinates: Array<{ x: number; y: number }> }) => void;
  initialAnswer?: { selectedSpotIds: string[]; clickCoordinates: Array<{ x: number; y: number }> } | null;
  questionId?: string;
}

/**
 * HotSpotQuestion Component
 * Renders a hot spot question with clickable areas on an image
 */
export default function HotSpotQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'hotspot',
  mode = 'APPLICATION',
  aiReady = false,
}: HotSpotQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [selectedSpotIds, setSelectedSpotIds] = useState<string[]>(
    initialAnswer?.selectedSpotIds || []
  );
  const [clickCoordinates, setClickCoordinates] = useState<Array<{ x: number; y: number }>>(
    initialAnswer?.clickCoordinates || []
  );
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state when saved answer arrives (e.g. after API load on material quiz page)
  useEffect(() => {
    if (initialAnswer != null) {
      if (Array.isArray(initialAnswer.selectedSpotIds)) setSelectedSpotIds(initialAnswer.selectedSpotIds);
      if (Array.isArray(initialAnswer.clickCoordinates)) setClickCoordinates(initialAnswer.clickCoordinates);
    }
  }, [initialAnswer]);

  const safeData = templateData ?? {};
  const {
    imageUrl = '',
    options: optionsData,
    maxSelections,
    allowMultipleSpots = true,
  } = safeData;
  const { hotSpots = [], selectionType = 'CLICK' } = optionsData ?? {};
  const correctSpots = hotSpots.filter((s) => s.isCorrect);

  // Handle image load to get dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      });
    }
  };

  // Check if point is inside a shape
  const isPointInShape = (
    x: number,
    y: number,
    spot: HotSpot,
    scaleX: number,
    scaleY: number
  ): boolean => {
    const coords = spot.coordinates;

    switch (spot.shape) {
      case 'RECTANGLE':
        if (coords.x === undefined || coords.y === undefined || coords.width === undefined || coords.height === undefined) {
          return false;
        }
        const rectX = coords.x * scaleX;
        const rectY = coords.y * scaleY;
        const rectWidth = coords.width * scaleX;
        const rectHeight = coords.height * scaleY;
        return x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight;

      case 'CIRCLE':
        if (coords.x === undefined || coords.y === undefined || coords.radius === undefined) {
          return false;
        }
        const circleX = coords.x * scaleX;
        const circleY = coords.y * scaleY;
        const circleRadius = coords.radius * scaleX;
        const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));
        return distance <= circleRadius;

      case 'POLYGON':
        if (!coords.points || coords.points.length < 3) {
          return false;
        }
        // Ray casting algorithm for polygon
        let inside = false;
        for (let i = 0, j = coords.points.length - 1; i < coords.points.length; j = i++) {
          const xi = coords.points[i][0] * scaleX;
          const yi = coords.points[i][1] * scaleY;
          const xj = coords.points[j][0] * scaleX;
          const yj = coords.points[j][1] * scaleY;
          const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
        }
        return inside;

      default:
        return false;
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPreview || !imageRef.current || !containerRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate scale factors (in case image is scaled)
    const scaleX = rect.width / (imageRef.current.naturalWidth || rect.width);
    const scaleY = rect.height / (imageRef.current.naturalHeight || rect.height);

    // Find which hotspot was clicked
    let clickedSpot: HotSpot | null = null;
    for (const spot of hotSpots) {
      if (isPointInShape(x, y, spot, scaleX, scaleY)) {
        clickedSpot = spot;
        break;
      }
    }

    if (clickedSpot) {
      const newSelectedIds = [...selectedSpotIds];
      const newCoordinates = [...clickCoordinates];

      if (newSelectedIds.includes(clickedSpot.id)) {
        // Deselect
        const index = newSelectedIds.indexOf(clickedSpot.id);
        newSelectedIds.splice(index, 1);
        newCoordinates.splice(index, 1);
      } else {
        // Select
        if (!allowMultipleSpots) {
          newSelectedIds.length = 0;
          newCoordinates.length = 0;
        }
        if (!maxSelections || newSelectedIds.length < maxSelections) {
          newSelectedIds.push(clickedSpot.id);
          newCoordinates.push({ x, y });
        }
      }

      setSelectedSpotIds(newSelectedIds);
      setClickCoordinates(newCoordinates);

      if (onAnswerChange) {
        onAnswerChange({
          selectedSpotIds: newSelectedIds,
          clickCoordinates: newCoordinates,
        });
      }
    }
  };

  // Render hotspot overlay
  const renderHotSpotOverlay = () => {
    if (!imageSize || !imageRef.current) return null;

    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / (imageRef.current.naturalWidth || rect.width);
    const scaleY = rect.height / (imageRef.current.naturalHeight || rect.height);

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {hotSpots.map((spot) => {
          const isSelected = selectedSpotIds.includes(spot.id);
          const coords = spot.coordinates;

          let style: React.CSSProperties = {
            position: 'absolute',
            border: `2px solid ${isSelected ? '#4d79ff' : spot.isCorrect ? '#28a745' : '#ffc107'}`,
            backgroundColor: isSelected
              ? 'rgba(77, 121, 255, 0.3)'
              : spot.isCorrect
              ? 'rgba(40, 167, 69, 0.2)'
              : 'rgba(255, 193, 7, 0.2)',
            pointerEvents: 'none',
            borderRadius: spot.shape === 'CIRCLE' ? '50%' : '4px',
          };

          switch (spot.shape) {
            case 'RECTANGLE':
              if (coords.x !== undefined && coords.y !== undefined && coords.width !== undefined && coords.height !== undefined) {
                style.left = `${coords.x * scaleX}px`;
                style.top = `${coords.y * scaleY}px`;
                style.width = `${coords.width * scaleX}px`;
                style.height = `${coords.height * scaleY}px`;
              }
              break;

            case 'CIRCLE':
              if (coords.x !== undefined && coords.y !== undefined && coords.radius !== undefined) {
                style.left = `${(coords.x - coords.radius) * scaleX}px`;
                style.top = `${(coords.y - coords.radius) * scaleY}px`;
                style.width = `${coords.radius * 2 * scaleX}px`;
                style.height = `${coords.radius * 2 * scaleY}px`;
              }
              break;

            case 'POLYGON':
              // Polygon için clipPath kullanılabilir ama basit görselleştirme için skip
              return null;
          }

          return (
            <div
              key={spot.id}
              style={style}
              title={spot.label || spot.id}
            />
          );
        })}

        {/* Click markers */}
        {clickCoordinates.map((coord, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#4d79ff',
              border: '2px solid #ffffff',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="hotspot-question">

<QuestionBody questionText={questionText} />
      {!isPreview && (
        <div className="hotspot-instructions mb--20" style={{
          padding: '12px 15px',
          backgroundColor: '#f0f4ff',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#4d79ff',
        }}>
          <i className="feather-mouse-pointer me-2"></i>
          Click on the image to select areas.
          {maxSelections && ` Maximum ${maxSelections} selection${maxSelections > 1 ? 's' : ''} allowed.`}
        </div>
      )}

      {/* Image Container */}
      <div
        ref={containerRef}
        className="image-container mb--20"
        style={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          maxWidth: '100%',
          cursor: isPreview ? 'default' : 'crosshair',
          pointerEvents: isPreview ? 'none' : undefined,
        }}
        onClick={handleImageClick}
      >
        {imageUrl ? (
          <img
            ref={imageRef}
            src={getMediaServeUrl(imageUrl)}
            alt="Hot spot image"
            onLoad={handleImageLoad}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            onError={() => {
              if (imageUrl) console.error('Image load error:', imageUrl);
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              minHeight: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              backgroundColor: '#f0f0f0',
              color: '#888',
              fontSize: '14px',
            }}
          >
            No image
          </div>
        )}
        {renderHotSpotOverlay()}
      </div>

      {!isPreview && (
        <div className="selection-status mb--20" style={{
          padding: '12px 15px',
          backgroundColor: '#f0f4ff',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#4d79ff',
        }}>
          <i className="feather-target me-2"></i>
          Selected: {selectedSpotIds.length}
          {maxSelections && ` / ${maxSelections} maximum`}
          {selectedSpotIds.length > 0 && (
            <span style={{ marginLeft: '10px', fontSize: '12px' }}>
              ({selectedSpotIds.join(', ')})
            </span>
          )}
        </div>
      )}

      {isPreview && correctSpots.length > 0 && (
        <div className="mt-3 p-3 rounded small" style={{ backgroundColor: '#f0fdf4', border: '1px solid #22c55e', color: '#166534' }}>
          <strong>Doğru bölgeler:</strong> {correctSpots.map((s) => s.label || s.id).join(', ')}
        </div>
      )}
      {isPreview && (
        <QuestionSettingsSummary>
          {hotSpots.length} bölge. {allowMultipleSpots ? 'Çoklu seçim.' : 'Tek seçim.'} {maxSelections ? `En fazla ${maxSelections} seçim.` : ''}
        </QuestionSettingsSummary>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}

      {/* Hotspot Legend (sadece uygulama modunda) */}
      {!isPreview && hotSpots.length > 0 && (
        <div className="hotspot-legend" style={{
          padding: '15px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          fontSize: '12px',
        }}>
          <div style={{ fontWeight: '600', marginBottom: '10px', color: '#333' }}>
            Available Areas:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {hotSpots.map((spot) => {
              const isSelected = selectedSpotIds.includes(spot.id);
              return (
                <div
                  key={spot.id}
                  style={{
                    padding: '5px 10px',
                    border: `1px solid ${isSelected ? '#4d79ff' : '#e0e0e0'}`,
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#f0f4ff' : '#ffffff',
                    fontSize: '11px',
                    color: isSelected ? '#4d79ff' : '#666',
                  }}
                >
                  {spot.label || spot.id} {isSelected && '✓'}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
