'use client';

import { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  className?: string;
  /** Minimum yükseklik (px). Varsayılan 72. */
  minHeight?: number;
}

/** Dalga çubukları için sabit yükseklik oranları (0.2–1 arası) */
const WAVE_BAR_HEIGHTS = [0.4, 0.7, 0.35, 0.9, 0.5, 0.65, 0.45, 0.8, 0.55, 0.6, 0.4, 0.75, 0.5, 0.7];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src, className = '', minHeight = 72 }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onDurationChange = () => setDuration(el.duration);
    const onEnded = () => setIsPlaying(false);
    const onLoadedMetadata = () => {
      setDuration(el.duration);
      setLoaded(true);
    };
    const onCanPlay = () => setLoaded(true);

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('durationchange', onDurationChange);
    el.addEventListener('ended', onEnded);
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('canplay', onCanPlay);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('durationchange', onDurationChange);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('canplay', onCanPlay);
    };
  }, [src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  return (
      <div
        className={`audio-player-esthetic ${className}`}
        style={{
          minHeight: `${minHeight}px`,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f8f9fc 0%, #eef1f8 100%)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <audio ref={audioRef} src={src} preload="metadata" />

        {/* Play/Pause */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Duraklat' : 'Oynat'}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            border: 'none',
            background: 'linear-gradient(145deg, #6366f1 0%, #4f46e5 100%)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
          }}
        >
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Waveform */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 4,
            height: 36,
          }}
        >
          {WAVE_BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className={`ap-wave-bar ${isPlaying ? 'ap-wave-bar--playing' : ''}`}
              style={{
                width: 4,
                height: 36,
                borderRadius: 2,
                background: isPlaying
                  ? 'linear-gradient(180deg, #6366f1 0%, #818cf8 100%)'
                  : 'linear-gradient(180deg, #c7d2fe 0%, #a5b4fc 100%)',
                transform: `scaleY(${isPlaying ? h : 0.35})`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* Progress + time */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: '100%',
              height: 6,
              accentColor: '#6366f1',
              cursor: 'pointer',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{loaded ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#64748b' }}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolume}
            style={{
              width: 72,
              height: 4,
              accentColor: '#6366f1',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
  );
}
