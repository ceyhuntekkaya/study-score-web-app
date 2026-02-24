'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { getTtsUrl } from '@/config';
import speakersData from '@/config/speakers.json';
import { Select } from '@/components/ui/Select';

interface TtsServiceProps {
  text: string;
  language?: string;
  autoPlay?: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
  onError?: (error: string) => void;
  className?: string;
  showControls?: boolean;
  showButton?: boolean;
  buttonText?: string;
  showSpeakerSelect?: boolean;
  showSpeedSelect?: boolean;
  showEmotionSelect?: boolean;
  defaultSpeaker?: string;
  defaultSpeed?: number;
  defaultEmotion?: string;
}

export interface TtsServiceRef {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
}

// Speed options
const SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x (Very Slow)' },
  { value: 0.75, label: '0.75x (Slow)' },
  { value: 1.0, label: '1.0x (Normal)' },
  { value: 1.25, label: '1.25x (Fast)' },
  { value: 1.5, label: '1.5x (Very Fast)' },
  { value: 2.0, label: '2.0x (Maximum)' },
];

// Emotion options (if model supports - VITS may not support all)
const EMOTION_OPTIONS = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'happy', label: 'Happy' },
  { value: 'sad', label: 'Sad' },
  { value: 'angry', label: 'Angry' },
  { value: 'surprised', label: 'Surprised' },
];

/**
 * TTS Service Component
 * Converts text to speech using the TTS service and plays the audio
 */
const TtsService = forwardRef<TtsServiceRef, TtsServiceProps>(({
  text,
  language = 'eng',
  autoPlay = false,
  onPlayStart,
  onPlayEnd,
  onError,
  className = '',
  showControls = true,
  showButton = true,
  buttonText = 'Play Audio',
  showSpeakerSelect = true,
  showSpeedSelect = true,
  showEmotionSelect = true, // Enabled by default
  defaultSpeaker = 'p225',
  defaultSpeed = 1.0,
  defaultEmotion = 'neutral',
}, ref) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(defaultSpeaker);
  const [selectedSpeed, setSelectedSpeed] = useState(defaultSpeed);
  const [selectedEmotion, setSelectedEmotion] = useState(defaultEmotion);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousUrlRef = useRef<string | null>(null);

  // Fetch audio from TTS service
  const fetchAudio = async (textToConvert: string, shouldAutoPlay: boolean = false) => {
    if (!textToConvert.trim()) {
      if (onError) {
        onError('Text is empty');
      }
      return;
    }

    setIsLoading(true);
    try {
      const ttsUrl = getTtsUrl();
      
      // Determine endpoint based on language
      const endpoint = language === 'tr' ? '/synthesize' : '/eng';
      
      // Build request body
      const requestBody: any = {
        text: textToConvert,
        speed: selectedSpeed,
        split_sentences: true
      };

      // Add language-specific parameters
      if (language === 'eng') {
        requestBody.speaker = selectedSpeaker;
        if (showEmotionSelect && selectedEmotion !== 'neutral') {
          requestBody.emotion = selectedEmotion;
        }
      }
      
      // Make POST request with JSON body
      const response = await fetch(ttsUrl + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const statusText = response.statusText || 'Unknown error';
        const status = response.status || 0;
        throw new Error(`TTS service error: ${status} ${statusText}. Please check the TTS service endpoint.`);
      }

      // Get audio blob
      const audioBlob = await response.blob();
      const blobUrl = URL.createObjectURL(audioBlob);
      
      // Clean up previous URL
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
      
      previousUrlRef.current = blobUrl;
      setAudioUrl(blobUrl);
      
      // Auto-play if requested
      if (shouldAutoPlay && audioRef.current) {
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch((err) => {
              console.error('Error playing audio:', err);
              if (onError) {
                onError('Failed to play audio');
              }
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('TTS service error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert text to speech';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle speaker change
  const handleSpeakerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpeaker(event.target.value);
    clearCachedAudio();
  };

  // Handle speed change
  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpeed(parseFloat(event.target.value));
    clearCachedAudio();
  };

  // Handle emotion change
  const handleEmotionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEmotion(event.target.value);
    clearCachedAudio();
  };

  // Clear cached audio
  const clearCachedAudio = () => {
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    setAudioUrl(null);
  };

  // Handle button click - fetch and play
  const handleButtonClick = async () => {
    if (isLoading) return;
    
    if (audioUrl && audioRef.current) {
      // If audio already exists, play it
      audioRef.current.play().catch((err) => {
        console.error('Error playing audio:', err);
        if (onError) {
          onError('Failed to play audio');
        }
      });
    } else {
      // Fetch and play
      await fetchAudio(text, true);
    }
  };

  // Cleanup: clear URL
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
        previousUrlRef.current = null;
      }
    };
  }, []);

  // Audio event handlers
  const handlePlay = () => {
    setIsPlaying(true);
    if (onPlayStart) {
      onPlayStart();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlayEnd) {
      onPlayEnd();
    }
  };

  const handleError = () => {
    setIsPlaying(false);
    setIsLoading(false);
    if (onError) {
      onError('Failed to load or play audio');
    }
  };

  // Manual play function
  const play = async (): Promise<void> => {
    if (audioRef.current && audioUrl) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error('Error playing audio:', err);
        if (onError) {
          onError('Failed to play audio');
        }
        throw err;
      }
    } else if (text && !audioUrl && !isLoading) {
      await fetchAudio(text, true);
    }
  };

  // Expose functions via ref
  useImperativeHandle(ref, () => ({
    play,
    pause: () => {
      audioRef.current?.pause();
    },
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
    isPlaying,
    isLoading,
  }));

  if (!text) {
    return null;
  }

  // Calculate number of selects to show
  const selectCount = [
    showSpeakerSelect && language === 'eng',
    showSpeedSelect,
    showEmotionSelect && language === 'eng'
  ].filter(Boolean).length;

  return (
    <div className={`tts-service ${className}`}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'stretch', flexWrap: 'wrap' }}>
        {showButton && (
          <button
            onClick={handleButtonClick}
            disabled={isLoading || !text.trim()}
            style={{
              flex: selectCount > 0 ? '0 0 140px' : '1',
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: isLoading ? '#ccc' : '#0d6efd',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || !text.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Loading...' : buttonText}
          </button>
        )}
        
        {showSpeakerSelect && language === 'eng' && (
          <Select
            value={selectedSpeaker}
            onChange={handleSpeakerChange}
            disabled={isLoading}
            style={{
              flex: '1',
              minWidth: '200px',
            }}
          >
            <optgroup label="Recommended">
              {speakersData.recommended.map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label} {speaker.default ? '(Default)' : ''}
                </option>
              ))}
            </optgroup>
            
            <optgroup label="Female Voices">
              {speakersData.by_gender.female.slice(0, 10).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
            </optgroup>
            
            <optgroup label="Male Voices">
              {speakersData.by_gender.male.slice(0, 10).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
            </optgroup>
            
            <optgroup label="American Accent">
              {speakersData.by_accent.American.slice(0, 8).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
            </optgroup>
            
            <optgroup label="British Accent">
              {speakersData.by_accent.English.slice(0, 8).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
            </optgroup>
            
            <optgroup label="Other Accents">
              {speakersData.by_accent.Scottish.slice(0, 5).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
              {speakersData.by_accent.Irish.slice(0, 5).map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.label}
                </option>
              ))}
            </optgroup>
          </Select>
        )}

        {showSpeedSelect && (
          <Select
            value={selectedSpeed}
            onChange={handleSpeedChange}
            disabled={isLoading}
            style={{
              flex: selectCount > 2 ? '0 0 160px' : '0 0 150px',
            }}
          >
            {SPEED_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}

        {showEmotionSelect && language === 'eng' && (
          <Select
            value={selectedEmotion}
            onChange={handleEmotionChange}
            disabled={isLoading}
            style={{
              flex: '0 0 140px',
            }}
          >
            {EMOTION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </div>
      
      {isLoading && (
        <div className="tts-loading" style={{ padding: '8px', fontSize: '14px', color: '#666' }}>
          Loading audio...
        </div>
      )}
      
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          controls={showControls}
          autoPlay={true}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          style={{ display: 'none' }}
        >
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
});

TtsService.displayName = 'TtsService';

export default TtsService;