"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/ui/button";
// Reference audio file from public directory
const listeningTrack = "/listening-track.mp3";

interface HeaderProps {
  initialTime?: number; // in seconds
  onSubmit?: () => void;
}

const Header = ({ initialTime = 32 * 60, onSubmit }: HeaderProps) => {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Load your MP3 file
    const audioElement = new Audio();
    // Use the imported MP3 file
    audioElement.src = listeningTrack; // Import edilen dosya
    audioElement.loop = true;

    // Add event listeners for audio state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audioElement.addEventListener("play", handlePlay);
    audioElement.addEventListener("pause", handlePause);
    audioElement.addEventListener("ended", handleEnded);

    setAudio(audioElement);

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("play", handlePlay);
        audioElement.removeEventListener("pause", handlePause);
        audioElement.removeEventListener("ended", handleEnded);
        audioElement.pause();
        audioElement.src = "";
      }
    };
  }, []);

  useEffect(() => {
    // Update audio volume when volume state changes
    if (audio) {
      audio.volume = volume / 100;
    }
  }, [audio, volume]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error("Audio play failed:", error);
        });
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  const handleSubmit = () => {
    // Call the original onSubmit if provided
    if (onSubmit) {
      onSubmit();
    }
    // Navigate to /exams/simulation
    router.push("/exams/simulation");
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left Icon */}
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        {/* Center - Countdown Timer */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-6 h-6">
            <svg
              className="w-4 h-4 text-teal-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6l4 2"
              />
            </svg>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-lg font-bold text-teal-500">
              {Math.floor(timeRemaining / 60)}
            </span>
            <span className="text-sm font-medium text-teal-500">:</span>
            <span className="text-lg font-bold text-teal-500">
              {String(timeRemaining % 60).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            minutes remaining
          </span>
        </div>

        {/* Right Side - Volume Control and Submit Button */}
        <div className="flex items-center space-x-4">
          {/* Expand/Collapse Toggle */}
          <button
            onClick={toggleExpand}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
            title={isExpanded ? "Collapse controls" : "Expand controls"}
          >
            <svg
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Collapsible Controls */}
          <div
            className={`flex items-center transition-all duration-300 overflow-hidden ${
              isExpanded
                ? "space-x-4 opacity-100 max-w-none"
                : "space-x-0 opacity-0 max-w-0"
            }`}
          >
            {/* Audio Controls */}
            <div className="flex items-center space-x-3 whitespace-nowrap">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title={isPlaying ? "Pause audio" : "Play audio"}
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isPlaying ? (
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>

              {/* Volume Control */}
              <svg
                className="w-4 h-4 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-teal-500 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${volume}%, #e5e7eb ${volume}%, #e5e7eb 100%)`,
                }}
              />
            </div>

            {/* Fullscreen Icon */}
            <button
              onClick={toggleFullscreen}
              className={`p-1.5 hover:bg-gray-100 rounded transition-colors ${
                isFullscreen ? "bg-teal-50 text-teal-600" : "text-gray-600"
              }`}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isFullscreen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                )}
              </svg>
            </button>

            {/* Notes Icon */}
            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          </div>

          {/* Submit Button - Always Visible */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
            rightIcon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            }
          >
            Submit
          </Button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Header;
