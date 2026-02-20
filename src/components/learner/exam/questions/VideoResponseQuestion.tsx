'use client';

import { useState, useRef, useEffect } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';
import { uploadQuestionResponseVideo } from '@/services/api/questionResponseMediaUpload';

interface VideoResponseTemplateData {
  prompt?: string;
  maxRecordingDuration?: number;
  minRecordingDuration?: number;
  gradingType: 'MANUAL' | 'AI' | 'HYBRID';
  /** Backend: criteria is string (evaluation criteria text) */
  criteria?: string;
  allowRetake?: boolean;
  maxRetakes?: number;
  requiredQuality?: string;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface VideoResponseQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: VideoResponseTemplateData;
  onAnswerChange?: (answerData: {
    videoUrl: string;
    durationSeconds: number;
    mimeType: string;
    fileSize: number;
    resolution?: string;
    thumbnailUrl?: string;
  }) => void;
  initialAnswer?: {
    videoUrl: string;
    durationSeconds: number;
    mimeType: string;
    fileSize: number;
    resolution?: string;
    thumbnailUrl?: string;
  } | null;
  questionId?: string;
}

/**
 * VideoResponseQuestion Component
 * Renders a video response question with recording capability
 */
export default function VideoResponseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'video-response',
  mode = 'APPLICATION',
  aiReady = false,
}: VideoResponseQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(initialAnswer?.videoUrl || null);
  const [duration, setDuration] = useState<number>(0);
  const [retakeCount, setRetakeCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sync state when saved answer arrives (e.g. after API load on material quiz page)
  useEffect(() => {
    if (initialAnswer != null && initialAnswer.videoUrl) {
      setVideoUrl(initialAnswer.videoUrl);
    }
  }, [initialAnswer]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(0);

  const {
    prompt,
    maxRecordingDuration = 180,
    minRecordingDuration = 60,
    allowRetake = true,
    maxRetakes = 2,
    requiredQuality = '720p',
  } = templateData;

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get video constraints based on quality
  const getVideoConstraints = () => {
    switch (requiredQuality) {
      case '1080p':
        return { width: 1920, height: 1080 };
      case '720p':
        return { width: 1280, height: 720 };
      case '480p':
        return { width: 854, height: 480 };
      default:
        return { width: 1280, height: 720 };
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const videoConstraints = getVideoConstraints();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: true,
      });
      streamRef.current = stream;

      // Show preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
        setIsPreviewing(true);
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const blobUrl = URL.createObjectURL(videoBlob);
        const durationSeconds = durationRef.current;
        setRecordedVideo(videoBlob);
        setVideoUrl(blobUrl);
        setDuration(durationSeconds);

        let resolution = 'Unknown';
        if (videoPreviewRef.current) {
          const video = videoPreviewRef.current;
          resolution = `${video.videoWidth}x${video.videoHeight}`;
        }

        // Thumbnail as Blob for upload (before stopping stream)
        let thumbnailBlob: Blob | undefined;
        if (videoPreviewRef.current) {
          const canvas = document.createElement('canvas');
          const video = videoPreviewRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            thumbnailBlob = await new Promise<Blob | undefined>((resolve) => {
              canvas.toBlob((b) => resolve(b ?? undefined), 'image/jpeg', 0.85);
            });
          }
        }

        stream.getTracks().forEach((track) => track.stop());
        setIsPreviewing(false);

        if (!onAnswerChange) return;
        setIsUploading(true);
        setError(null);
        try {
          const { videoUrl: serveVideoUrl, thumbnailUrl: serveThumbUrl } =
            await uploadQuestionResponseVideo(videoBlob, thumbnailBlob);
          URL.revokeObjectURL(blobUrl);
          setVideoUrl(serveVideoUrl);
          onAnswerChange({
            videoUrl: serveVideoUrl,
            durationSeconds,
            mimeType: videoBlob.type,
            fileSize: videoBlob.size,
            resolution,
            thumbnailUrl: serveThumbUrl,
          });
        } catch (err) {
          console.error('Video upload failed:', err);
          setError('Upload failed. You can retake the recording.');
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      durationRef.current = 0;

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          durationRef.current = newDuration;
          if (newDuration >= maxRecordingDuration) {
            stopRecording();
            return maxRecordingDuration;
          }
          return newDuration;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing camera/microphone:', err);
      setError('Unable to access camera/microphone. Please check your permissions.');
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      // Resume duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          durationRef.current = newDuration;
          if (newDuration >= maxRecordingDuration) {
            stopRecording();
            return maxRecordingDuration;
          }
          return newDuration;
        });
      }, 1000);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // Retake recording
  const handleRetake = () => {
    if (!allowRetake || (maxRetakes && retakeCount >= maxRetakes)) {
      return;
    }

    // Clean up
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }

    setRecordedVideo(null);
    setVideoUrl(null);
    setDuration(0);
    setRetakeCount((prev) => prev + 1);
    setError(null);
    setIsPreviewing(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    };
  }, []);

  const canRetake = allowRetake && (!maxRetakes || retakeCount < maxRetakes);
  const isDurationValid = duration >= minRecordingDuration;
  const isDurationWarning = duration >= maxRecordingDuration * 0.9;

  return (
    <div className="video-response-question">

<QuestionBody questionText={questionText} />
      {isPreview && (
        <>
          <div className="mb--20 p-3 rounded small" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', color: '#6c757d' }}>
            Önizleme modu – video kaydı yapılamaz.
          </div>
          <QuestionSettingsSummary>
            Süre: {minRecordingDuration}s–{maxRecordingDuration}s. Değerlendirme: {templateData.gradingType}. {requiredQuality ? `Kalite: ${requiredQuality}.` : ''} {allowRetake && maxRetakes ? `Yeniden deneme: ${maxRetakes}.` : ''}
          </QuestionSettingsSummary>
          {aiReady && <QuestionAIChatButton questionId={questionId} />}
        </>
      )}

      {!isPreview && (
      <>
      <div className="recording-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-video me-2"></i>
        Record your video answer. Duration: {minRecordingDuration}s - {maxRecordingDuration}s
        {requiredQuality && (
          <span style={{ marginLeft: '10px' }}>
            (Quality: {requiredQuality})
          </span>
        )}
        {allowRetake && maxRetakes && (
          <span style={{ marginLeft: '10px' }}>
            (Retakes remaining: {maxRetakes - retakeCount})
          </span>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message mb--20" style={{
          padding: '12px 15px',
          backgroundColor: '#fff0f0',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#ff4444',
          border: '1px solid #ff4444',
        }}>
          <i className="feather-alert-circle me-2"></i>
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="recording-controls mb--20">
        {!isRecording && !videoUrl && (
          <div className="text-center">
            <button
              type="button"
              onClick={startRecording}
              style={{
                padding: '15px 40px',
                fontSize: '18px',
                backgroundColor: '#4d79ff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <i className="feather-video"></i>
              Start Recording
            </button>
          </div>
        )}

        {isRecording && (
          <div className="recording-active">
            {/* Video Preview */}
            <div className="video-preview mb--20" style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#000',
            }}>
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '400px',
                  display: 'block',
                }}
              />
              {isPaused && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                }}>
                  Recording Paused
                </div>
              )}
            </div>

            {/* Duration Display */}
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: isDurationWarning ? '#fff0f0' : '#f0f4ff',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: isDurationWarning ? '#ff4444' : '#4d79ff',
                  fontFamily: 'monospace',
                  marginBottom: '10px',
                }}
              >
                {formatTime(duration)}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {isPaused ? 'Recording Paused' : 'Recording...'}
                {isDurationWarning && (
                  <span style={{ color: '#ff4444', marginLeft: '10px' }}>
                    ⚠ Approaching time limit
                  </span>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="text-center" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {!isPaused ? (
                <button
                  type="button"
                  onClick={pauseRecording}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#ffc107',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="feather-pause"></i>
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resumeRecording}
                  style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="feather-play"></i>
                  Resume
                </button>
              )}

              <button
                type="button"
                onClick={stopRecording}
                style={{
                  padding: '12px 24px',
                  fontSize: '16px',
                  backgroundColor: '#ff4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="feather-square"></i>
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Recorded Video Player */}
        {videoUrl && !isRecording && (
          <div className="recorded-video">
            <div
              style={{
                padding: '20px',
                backgroundColor: '#f0f4ff',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            >
              <div style={{ marginBottom: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  Recorded Video
                </div>
                {isUploading && (
                  <div style={{ fontSize: '14px', color: '#4d79ff', marginBottom: '8px' }}>
                    <i className="feather-loader me-2"></i>
                    Uploading…
                  </div>
                )}
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d79ff', fontFamily: 'monospace' }}>
                  {formatTime(duration)}
                </div>
                {!isDurationValid && (
                  <div style={{ fontSize: '12px', color: '#ff4444', marginTop: '5px' }}>
                    ⚠ Minimum duration ({minRecordingDuration}s) not met
                  </div>
                )}
              </div>

              <video
                controls
                src={videoUrl}
                style={{
                  width: '100%',
                  maxHeight: '500px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  backgroundColor: '#000',
                }}
              />

              {/* Retake Button */}
              {canRetake && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRetake}
                    disabled={isUploading}
                    style={{
                      padding: '10px 20px',
                      fontSize: '14px',
                      backgroundColor: '#ffffff',
                      color: '#4d79ff',
                      border: '2px solid #4d79ff',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="feather-refresh-cw"></i>
                    Retake Recording
                  </button>
                </div>
              )}

              {!canRetake && (
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#999' }}>
                  No retakes remaining
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grading Criteria (backend: string) */}
      {templateData.criteria && String(templateData.criteria).trim() && (
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
          <p style={{ margin: 0, fontSize: '12px', color: '#856404', whiteSpace: 'pre-wrap' }}>
            {String(templateData.criteria)}
          </p>
        </div>
      )}

      {aiReady && <QuestionAIChatButton questionId={questionId} />}
      </>
      )}
    </div>
  );
}
