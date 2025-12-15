'use client';

import { useState, useRef } from 'react';

interface Criterion {
  name: string;
  description: string;
  maxScore: number;
}

interface ImageResponseTemplateData {
  prompt?: string;
  maxFileSize?: number;
  allowedFormats?: string[];
  gradingType: 'MANUAL';
  criteria?: Criterion[];
  allowMultipleImages?: boolean;
  maxImages?: number;
  requiredResolution?: string | null;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface ImageResponseQuestionProps {
  questionText: string;
  templateData: ImageResponseTemplateData;
  onAnswerChange?: (answerData: {
    imageUrls: string[];
    metadata: Array<{
      url: string;
      mimeType: string;
      fileSize: number;
      resolution?: string;
    }>;
  }) => void;
  initialAnswer?: {
    imageUrls: string[];
    metadata: Array<{
      url: string;
      mimeType: string;
      fileSize: number;
      resolution?: string;
    }>;
  } | null;
  questionId?: string;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  metadata: {
    mimeType: string;
    fileSize: number;
    resolution?: string;
  };
}

/**
 * ImageResponseQuestion Component
 * Renders an image response question with file upload
 */
export default function ImageResponseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'image-response',
}: ImageResponseQuestionProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    prompt,
    maxFileSize = 5242880, // 5MB default
    allowedFormats = ['JPG', 'PNG', 'PDF'],
    allowMultipleImages = false,
    maxImages = 1,
  } = templateData;

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${(maxFileSize / 1024 / 1024).toFixed(2)}MB`,
      };
    }

    // Check file format
    const fileExtension = file.name.split('.').pop()?.toUpperCase();
    if (!fileExtension || !allowedFormats.includes(fileExtension)) {
      return {
        valid: false,
        error: `File format not allowed. Allowed formats: ${allowedFormats.join(', ')}`,
      };
    }

    return { valid: true };
  };

  // Get image resolution
  const getImageResolution = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve(`${img.width}x${img.height}`);
        };
        img.onerror = () => resolve('Unknown');
        img.src = url;
      } else {
        resolve('N/A');
      }
    });
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const newImages: UploadedImage[] = [];

    for (const file of filesArray) {
      // Check if we've reached max images
      if (uploadedImages.length + newImages.length >= maxImages) {
        alert(`Maximum ${maxImages} image${maxImages > 1 ? 's' : ''} allowed.`);
        break;
      }

      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }

      // Create preview
      const preview = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : '';

      // Get resolution for images
      const resolution = await getImageResolution(file);

      const imageId = `${Date.now()}-${Math.random()}`;
      newImages.push({
        id: imageId,
        file,
        preview,
        metadata: {
          mimeType: file.type,
          fileSize: file.size,
          resolution,
        },
      });
    }

    const updatedImages = [...uploadedImages, ...newImages];
    setUploadedImages(updatedImages);

    // Notify parent (in real app, upload to server first)
    if (onAnswerChange) {
      // For now, use object URLs. In production, upload to server and get real URLs
      onAnswerChange({
        imageUrls: updatedImages.map((img) => img.preview),
        metadata: updatedImages.map((img) => ({
          url: img.preview,
          ...img.metadata,
        })),
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Remove image
  const handleRemoveImage = (imageId: string) => {
    const updatedImages = uploadedImages.filter((img) => img.id !== imageId);
    
    // Revoke object URLs
    const removedImage = uploadedImages.find((img) => img.id === imageId);
    if (removedImage?.preview) {
      URL.revokeObjectURL(removedImage.preview);
    }

    setUploadedImages(updatedImages);

    if (onAnswerChange) {
      onAnswerChange({
        imageUrls: updatedImages.map((img) => img.preview),
        metadata: updatedImages.map((img) => ({
          url: img.preview,
          ...img.metadata,
        })),
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="image-response-question">
      {/* Question Text */}
      <div className="question-text mb--30">
        <h5 className="rbt-title-style-2 mb--20" style={{ fontSize: '18px', fontWeight: '600' }}>
          {questionText}
        </h5>
        {prompt && (
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            {prompt}
          </p>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="upload-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-upload me-2"></i>
        Upload {allowMultipleImages ? `up to ${maxImages} image${maxImages > 1 ? 's' : ''}` : 'an image'}.
        Allowed formats: {allowedFormats.join(', ')}. Max size: {(maxFileSize / 1024 / 1024).toFixed(2)}MB
      </div>

      {/* Upload Area */}
      <div
        className="upload-area mb--20"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '40px',
          border: `3px dashed ${isDragging ? '#4d79ff' : '#e0e0e0'}`,
          borderRadius: '12px',
          backgroundColor: isDragging ? '#f0f4ff' : '#fafafa',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFormats.map((f) => `.${f.toLowerCase()}`).join(',')}
          multiple={allowMultipleImages}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        <div>
          <i className="feather-upload" style={{ fontSize: '48px', color: '#4d79ff', marginBottom: '15px', display: 'block' }}></i>
          <p style={{ fontSize: '16px', fontWeight: '500', color: '#333', marginBottom: '5px' }}>
            Click to upload or drag and drop
          </p>
          <p style={{ fontSize: '12px', color: '#999' }}>
            {allowedFormats.join(', ')} up to {(maxFileSize / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="uploaded-images mb--20">
          <h6 className="mb--15" style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>
            <i className="feather-image me-2"></i>
            Uploaded Images ({uploadedImages.length} / {maxImages})
          </h6>
          <div className="row g-3">
            {uploadedImages.map((img) => (
              <div key={img.id} className="col-md-6 col-lg-4">
                <div
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#ffffff',
                    position: 'relative',
                  }}
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '2px solid #ff4444',
                      backgroundColor: '#ffffff',
                      color: '#ff4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                    }}
                    title="Remove image"
                  >
                    <i className="feather-x" style={{ fontSize: '14px' }}></i>
                  </button>

                  {/* Image Preview */}
                  {img.preview ? (
                    <img
                      src={img.preview}
                      alt="Uploaded"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'contain',
                        borderRadius: '6px',
                        marginBottom: '10px',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '200px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <i className="feather-file" style={{ fontSize: '48px', color: '#999' }}></i>
                    </div>
                  )}

                  {/* Image Metadata */}
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div><strong>File:</strong> {img.file.name}</div>
                    <div><strong>Size:</strong> {formatFileSize(img.metadata.fileSize)}</div>
                    {img.metadata.resolution && img.metadata.resolution !== 'N/A' && (
                      <div><strong>Resolution:</strong> {img.metadata.resolution}</div>
                    )}
                    <div><strong>Type:</strong> {img.metadata.mimeType}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Criteria (if available) */}
      {templateData.criteria && templateData.criteria.length > 0 && (
        <div className="grading-criteria mt--20" style={{
          padding: '15px',
          backgroundColor: '#fff9e6',
          borderRadius: '8px',
          border: '1px solid #ffc107',
        }}>
          <h6 style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: '10px' }}>
            <i className="feather-award me-2"></i>
            Grading Criteria
          </h6>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#856404' }}>
            {templateData.criteria.map((criterion, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <strong>{criterion.name}</strong> ({criterion.maxScore} points): {criterion.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
