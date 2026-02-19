'use client';

import { useState, useRef, useEffect } from 'react';
import type { BaseQuestionProps } from './types';
import QuestionBody from './QuestionBody';
import QuestionAIChatButton from './QuestionAIChatButton';
import QuestionSettingsSummary from './QuestionSettingsSummary';

interface AudioResponseTemplateData {
  prompt?: string;
  maxRecordingDuration?: number;
  minRecordingDuration?: number;
  gradingType: 'MANUAL' | 'AI' | 'HYBRID';
  /** Backend: criteria is string (evaluation criteria text) */
  criteria?: string;
  allowRetake?: boolean;
  maxRetakes?: number;
  scoringConfig?: {
    strategy: string;
    allowPartialCredit: boolean;
    penaltyPerWrong: number;
    roundScore: boolean;
    decimalPlaces: number;
  };
}

interface AudioResponseQuestionProps extends BaseQuestionProps {
  questionText: string;
  templateData: AudioResponseTemplateData;
  onAnswerChange?: (answerData: {
    audioUrl: string;
    durationSeconds: number;
    mimeType: string;
    fileSize: number;
    transcription?: string;
  }) => void;
  initialAnswer?: {
    audioUrl: string;
    durationSeconds: number;
    mimeType: string;
    fileSize: number;
    transcription?: string;
  } | null;
  questionId?: string;
}

/**
 * AudioResponseQuestion Component
 * Renders an audio response question with recording capability
 */
export default function AudioResponseQuestion({
  questionText,
  templateData,
  onAnswerChange,
  initialAnswer,
  questionId = 'audio-response',
  mode = 'APPLICATION',
  aiReady = false,
}: AudioResponseQuestionProps) {
  const isPreview = mode === 'PREVIEW';
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(initialAnswer?.audioUrl || null);
  const [duration, setDuration] = useState<number>(0);
  const [retakeCount, setRetakeCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    prompt,
    maxRecordingDuration = 120,
    minRecordingDuration = 30,
    allowRetake = true,
    maxRetakes = 3,
  } = templateData;

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setAudioUrl(url);
        setDuration(duration);

        // Notify parent
        if (onAnswerChange) {
          onAnswerChange({
            audioUrl: url, // In production, upload to server and get real URL
            durationSeconds: duration,
            mimeType: audioBlob.type,
            fileSize: audioBlob.size,
          });
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration timer
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const newDuration = prev + 1;
          // Auto-stop at max duration
          if (newDuration >= maxRecordingDuration) {
            stopRecording();
            return maxRecordingDuration;
          }
          return newDuration;
        });
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Unable to access microphone. Please check your permissions.');
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
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setRecordedAudio(null);
    setAudioUrl(null);
    setDuration(0);
    setRetakeCount((prev) => prev + 1);
    setError(null);
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
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  const canRetake = allowRetake && (!maxRetakes || retakeCount < maxRetakes);
  const isDurationValid = duration >= minRecordingDuration;
  const isDurationWarning = duration >= maxRecordingDuration * 0.9;

  return (
    <div className="audio-response-question">

<QuestionBody questionText={questionText} />
      {isPreview && (
        <>
          <div className="mb--20 p-3 rounded small" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', color: '#6c757d' }}>
            Önizleme modu – kayıt yapılamaz.
          </div>
          <QuestionSettingsSummary>
            Süre: {minRecordingDuration}s–{maxRecordingDuration}s. Değerlendirme: {templateData.gradingType}. {allowRetake && maxRetakes ? `Yeniden deneme: ${maxRetakes}.` : ''}
          </QuestionSettingsSummary>
          {aiReady && <QuestionAIChatButton questionId={questionId} />}
        </>
      )}

      {!isPreview && (
      <>
      {/* Recording Instructions */}
      <div className="recording-instructions mb--20" style={{
        padding: '12px 15px',
        backgroundColor: '#f0f4ff',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#4d79ff',
      }}>
        <i className="feather-mic me-2"></i>
        Record your answer. Duration: {minRecordingDuration}s - {maxRecordingDuration}s
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
        {!isRecording && !audioUrl && (
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
              <i className="feather-mic"></i>
              Start Recording
            </button>
          </div>
        )}

        {isRecording && (
          <div className="recording-active">
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

        {/* Recorded Audio Player */}
        {audioUrl && !isRecording && (
          <div className="recorded-audio">
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
                  Recorded Audio
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#4d79ff', fontFamily: 'monospace' }}>
                  {formatTime(duration)}
                </div>
                {!isDurationValid && (
                  <div style={{ fontSize: '12px', color: '#ff4444', marginTop: '5px' }}>
                    ⚠ Minimum duration ({minRecordingDuration}s) not met
                  </div>
                )}
              </div>

              <audio
                controls
                src={audioUrl}
                style={{ width: '100%', marginBottom: '15px' }}
              />

              {/* Retake Button */}
              {canRetake && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleRetake}
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
